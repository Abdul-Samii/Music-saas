import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MetaAdsService } from './meta-ads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('meta-ads')
export class MetaAdsController {
  constructor(private readonly metaAds: MetaAdsService) {}

  // Returns the Facebook OAuth URL for connecting an ad account
  @Get('oauth-url')
  getOAuthUrl(@Query('redirect_uri') redirectUri: string) {
    return { url: this.metaAds.getOAuthUrl(redirectUri ?? '') };
  }

  // Placeholder status endpoint
  @Get('status')
  status() {
    return {
      connected: false,
      message: 'Meta Ads integration available in Week 3',
      endpoints: [
        'GET  /meta-ads/oauth-url   — get Facebook OAuth URL',
        'GET  /meta-ads/accounts    — list ad accounts (Week 3)',
        'GET  /meta-ads/insights    — campaign insights (Week 3)',
        'POST /meta-ads/campaigns   — create campaign (Week 3)',
      ],
    };
  }
}
