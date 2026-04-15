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
  sub: string;
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
    await this.metaAds.saveConnection(user.sub, accessToken, '');

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
      SELECT "metaAccessToken" FROM "User" WHERE id = ${user.sub} LIMIT 1
    `;

    const token = rows[0]?.metaAccessToken;
    if (!token) throw new Error('Meta account not connected');

    let pixelId: string | undefined;
    if (body.createPixel) {
      pixelId = await this.metaAds.createPixel(token, body.adAccountId);
    }

    await this.metaAds.saveConnection(
      user.sub,
      token,
      body.adAccountId,
      pixelId,
      body.businessId,
    );

    return { success: true, adAccountId: body.adAccountId, pixelId };
  }

  // GET /meta-ads/status
  @Get('status')
  status(@CurrentUser() user: JwtUser) {
    return this.metaAds.getConnectionStatus(user.sub);
  }

  // DELETE /meta-ads/disconnect
  @Delete('disconnect')
  async disconnect(@CurrentUser() user: JwtUser) {
    await this.metaAds.disconnect(user.sub);
    return { success: true };
  }
}
