import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MetaAdsService } from './meta-ads.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface JwtUser {
  id: string;
}

@UseGuards(JwtAuthGuard)
@Controller('meta-ads')
export class MetaAdsController {
  constructor(
    private readonly metaAds: MetaAdsService,
    private readonly prisma: PrismaService,
  ) {}

  // GET /meta-ads/oauth-url?redirect_uri=...
  @Get('oauth-url')
  getOAuthUrl(@Query('redirect_uri') redirectUri: string) {
    return { url: this.metaAds.getOAuthUrl(redirectUri ?? '') };
  }

  // POST /meta-ads/exchange-token  { code, redirect_uri }
  @Post('exchange-token')
  async exchangeToken(
    @Body() body: { code: string; redirect_uri: string },
    @CurrentUser() user: JwtUser,
  ) {
    const accessToken = await this.metaAds.exchangeCodeForToken(
      body.code,
      body.redirect_uri,
    );

    const [accounts, businesses] = await Promise.all([
      this.metaAds.getAdAccounts(accessToken),
      this.metaAds.getBusinesses(accessToken),
    ]);

    // Store token — account selection happens in next step
    await this.metaAds.saveConnection(user.id, accessToken, '');

    return { accounts, businesses };
  }

  // POST /meta-ads/select-account  { adAccountId, businessId, createPixel }
  @Post('select-account')
  async selectAccount(
    @Body()
    body: { adAccountId: string; businessId?: string; createPixel?: boolean },
    @CurrentUser() user: JwtUser,
  ) {
    const rows = await this.prisma.$queryRaw<{ metaAccessToken: string }[]>`
      SELECT "metaAccessToken" FROM "User" WHERE id = ${user.id} LIMIT 1
    `;

    const token = rows[0]?.metaAccessToken;
    if (!token) throw new Error('Meta account not connected');

    let pixelId: string | undefined;
    if (body.createPixel) {
      try {
        pixelId = await this.metaAds.createPixel(token, body.adAccountId);
      } catch {
        // Pixel creation failed — continue without pixel, can be set up later
      }
    }

    await this.metaAds.saveConnection(
      user.id,
      token,
      body.adAccountId,
      pixelId,
      body.businessId,
    );

    return { success: true, adAccountId: body.adAccountId, pixelId };
  }

  // GET /meta-ads/pixels
  @Get('pixels')
  async getPixels(@CurrentUser() user: JwtUser) {
    const rows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null; metaAdAccountId: string | null }[]
    >`SELECT "metaAccessToken", "metaAdAccountId" FROM "User" WHERE id = ${user.id} LIMIT 1`;
    const { metaAccessToken, metaAdAccountId } = rows[0] ?? {};
    if (!metaAccessToken || !metaAdAccountId) return { pixels: [] };
    const pixels = await this.metaAds.getPixels(
      metaAccessToken,
      metaAdAccountId,
    );
    return { pixels };
  }

  // POST /meta-ads/launch-campaign
  @Post('launch-campaign')
  async launchCampaign(
    @Body()
    body: {
      campaignId: string;
      pixelId: string;
      audienceTier: string;
      placement: string;
      budget: number;
      startDate?: string;
      endDate?: string;
    },
    @CurrentUser() user: JwtUser,
  ) {
    const rows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null; metaAdAccountId: string | null }[]
    >`SELECT "metaAccessToken", "metaAdAccountId" FROM "User" WHERE id = ${user.id} LIMIT 1`;

    const { metaAccessToken, metaAdAccountId } = rows[0] ?? {};
    if (!metaAccessToken || !metaAdAccountId) {
      throw new Error('Meta account not connected');
    }

    const campaign = await this.prisma.campaign.findFirst({
      where: { id: body.campaignId, userId: user.id },
    });
    if (!campaign) throw new Error('Campaign not found');

    const { metaCampaignId, metaAdSetId } =
      await this.metaAds.createMetaCampaign(metaAccessToken, metaAdAccountId, {
        name: campaign.name,
        budget: body.budget,
        pixelId: body.pixelId,
        audienceTier: body.audienceTier,
        placement: body.placement,
        startDate: body.startDate,
        endDate: body.endDate,
      });

    await this.prisma.campaign.update({
      where: { id: body.campaignId },
      data: {
        metaCampaignId,
        metaAdSetId,
        pixelId: body.pixelId,
        audienceTier: body.audienceTier,
        placement: body.placement,
        budget: body.budget,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: 'ACTIVE',
      },
    });

    return { success: true, metaCampaignId, metaAdSetId };
  }

  // GET /meta-ads/status
  @Get('status')
  status(@CurrentUser() user: JwtUser) {
    return this.metaAds.getConnectionStatus(user.id);
  }

  // DELETE /meta-ads/disconnect
  @Delete('disconnect')
  async disconnect(@CurrentUser() user: JwtUser) {
    await this.metaAds.disconnect(user.id);
    return { success: true };
  }
}
