import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MetaAdsService } from './meta-ads.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface JwtUser {
  id: string;
}

type MulterFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

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

  // GET /meta-ads/pages
  @Get('pages')
  async getPages(@CurrentUser() user: JwtUser) {
    const rows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null }[]
    >`SELECT "metaAccessToken" FROM "User" WHERE id = ${user.id} LIMIT 1`;
    const token = rows[0]?.metaAccessToken;
    if (!token) return { pages: [] };
    return this.metaAds.getPages(token);
  }

  // POST /meta-ads/upload-asset  (multipart — field name: "file")
  @Post('upload-asset')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
    }),
  )
  async uploadAsset(
    @UploadedFile() file: MulterFile,
    @CurrentUser() user: JwtUser,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const rows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null; metaAdAccountId: string | null }[]
    >`SELECT "metaAccessToken", "metaAdAccountId" FROM "User" WHERE id = ${user.id} LIMIT 1`;
    const { metaAccessToken, metaAdAccountId } = rows[0] ?? {};
    if (!metaAccessToken || !metaAdAccountId) {
      throw new BadRequestException('Meta account not connected');
    }

    const isVideo = file.mimetype.startsWith('video/');
    if (isVideo) {
      const videoId = await this.metaAds.uploadAdVideo(
        metaAccessToken,
        metaAdAccountId,
        file,
      );
      return { type: 'video', videoId };
    } else {
      const imageHash = await this.metaAds.uploadAdImage(
        metaAccessToken,
        metaAdAccountId,
        file,
      );
      return { type: 'image', imageHash };
    }
  }

  // POST /meta-ads/add-adset  { campaignId, audienceTier, budget }
  @Post('add-adset')
  async addAdSet(
    @Body() body: { campaignId: string; audienceTier: string; budget: number },
    @CurrentUser() user: JwtUser,
  ) {
    const rows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null; metaAdAccountId: string | null }[]
    >`SELECT "metaAccessToken", "metaAdAccountId" FROM "User" WHERE id = ${user.id} LIMIT 1`;
    const { metaAccessToken, metaAdAccountId } = rows[0] ?? {};
    if (!metaAccessToken || !metaAdAccountId)
      throw new BadRequestException('Meta account not connected');

    const campaign = await this.prisma.campaign.findFirst({
      where: { id: body.campaignId, userId: user.id },
    });
    if (!campaign || !campaign.metaCampaignId)
      throw new BadRequestException('Campaign not found or not launched');

    const { adSetId, adId } = await this.metaAds.addAdSetToCampaign(
      metaAccessToken,
      metaAdAccountId,
      {
        metaCampaignId: campaign.metaCampaignId,
        metaAdCreativeId: campaign.metaAdCreativeId!,
        name: campaign.name,
        audienceTier: body.audienceTier,
        placement: campaign.placement ?? 'pro',
        budget: body.budget,
      },
    );

    await this.prisma.$executeRaw`
      UPDATE "Campaign"
      SET "metaAdSetIds" = array_append("metaAdSetIds", ${adSetId}),
          "metaAdIds"    = array_append("metaAdIds", ${adId})
      WHERE id = ${body.campaignId}
    `;

    return { success: true, adSetId, adId };
  }

  // GET /meta-ads/live-campaigns
  @Get('live-campaigns')
  liveCampaigns(@CurrentUser() user: JwtUser) {
    return this.metaAds.getLiveCampaigns(user.id);
  }

  // POST /meta-ads/sync-statuses
  @Post('sync-statuses')
  @HttpCode(HttpStatus.OK)
  syncStatuses(@CurrentUser() user: JwtUser) {
    return this.metaAds.syncCampaignStatuses(user.id);
  }

  // POST /meta-ads/sync-insights  { campaignId }
  @Post('sync-insights')
  @HttpCode(HttpStatus.OK)
  async syncInsights(
    @Body('campaignId') campaignId: string,
    @CurrentUser() user: JwtUser,
  ) {
    if (!campaignId) throw new BadRequestException('campaignId required');
    return this.metaAds.syncInsights(user.id, campaignId);
  }

  // POST /meta-ads/launch-campaign
  @Post('launch-campaign')
  async launchCampaign(
    @Body()
    body: {
      campaignId: string;
      pixelId: string;
      audienceTiers: string[];
      tierBudgets: number[];
      placement: string;
      budget: number;
      startDate?: string;
      endDate?: string;
      // Ad creative
      pageId: string;
      instagramActorId?: string;
      videoId?: string;
      imageHash?: string;
      adTitle: string;
      adDescription?: string;
      landingPageUrl: string;
    },
    @CurrentUser() user: JwtUser,
  ) {
    const rows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null; metaAdAccountId: string | null }[]
    >`SELECT "metaAccessToken", "metaAdAccountId" FROM "User" WHERE id = ${user.id} LIMIT 1`;

    const { metaAccessToken, metaAdAccountId } = rows[0] ?? {};
    if (!metaAccessToken || !metaAdAccountId) {
      throw new BadRequestException('Meta account not connected');
    }

    const campaign = await this.prisma.campaign.findFirst({
      where: { id: body.campaignId, userId: user.id },
    });
    if (!campaign) throw new BadRequestException('Campaign not found');

    const tiers =
      Array.isArray(body.audienceTiers) && body.audienceTiers.length > 0
        ? body.audienceTiers
        : ['tier1'];

    const tierBudgets =
      Array.isArray(body.tierBudgets) &&
      body.tierBudgets.length === tiers.length
        ? body.tierBudgets
        : tiers.map(() => body.budget ?? 5);

    // 1. Create one Meta campaign + one ad set per tier
    const { metaCampaignId, metaAdSetIds } =
      await this.metaAds.createMetaCampaign(metaAccessToken, metaAdAccountId, {
        name: campaign.name,
        tierBudgets,
        pixelId: body.pixelId,
        audienceTiers: tiers,
        placement: body.placement,
        startDate: body.startDate,
        endDate: body.endDate,
      });

    // 2. Create one shared ad creative
    const metaAdCreativeId = await this.metaAds.createAdCreative(
      metaAccessToken,
      metaAdAccountId,
      {
        name: `${campaign.name} — Creative`,
        pageId: body.pageId,
        instagramActorId: body.instagramActorId,
        videoId: body.videoId,
        imageHash: body.imageHash,
        adTitle: body.adTitle,
        adDescription: body.adDescription,
        landingPageUrl: body.landingPageUrl,
      },
    );

    // 3. Create one ad per ad set
    const metaAdIds: string[] = [];
    for (const adSetId of metaAdSetIds) {
      const adId = await this.metaAds.createMetaAd(
        metaAccessToken,
        metaAdAccountId,
        {
          name: campaign.name,
          adSetId,
          creativeId: metaAdCreativeId,
        },
      );
      metaAdIds.push(adId);
    }

    // 4. Persist all IDs + mark active
    await this.prisma.campaign.update({
      where: { id: body.campaignId },
      data: {
        metaCampaignId,
        metaAdSetId: metaAdSetIds[0],
        metaAdId: metaAdIds[0],
        metaAdSetIds,
        metaAdIds,
        metaAdCreativeId,
        metaPageId: body.pageId,
        metaIgActorId: body.instagramActorId,
        pixelId: body.pixelId,
        audienceTier: tiers.join(','),
        placement: body.placement,
        budget: body.budget,
        adTitle: body.adTitle,
        adDescription: body.adDescription,
        landingPageUrl: body.landingPageUrl,
        adVideoUrl: body.videoId,
        adImageHash: body.imageHash,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: 'ACTIVE',
      },
    });

    return {
      success: true,
      metaCampaignId,
      metaAdSetIds,
      metaAdCreativeId,
      metaAdIds,
    };
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
