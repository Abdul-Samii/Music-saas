import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Meta Ads integration — Week 3
 * Requires: META_APP_ID, META_APP_SECRET, user metaAccessToken
 */
@Injectable()
export class MetaAdsService {
  constructor(private readonly config: ConfigService) {}

  private get appId() {
    return this.config.get<string>('META_APP_ID');
  }

  // Returns the OAuth URL user visits to connect their Meta Ads account
  getOAuthUrl(redirectUri: string): string {
    const scopes = ['ads_management', 'ads_read', 'business_management'].join(
      ',',
    );
    return (
      `https://www.facebook.com/v18.0/dialog/oauth` +
      `?client_id=${this.appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scopes}` +
      `&response_type=code`
    );
  }

  // Placeholders — will call Meta Graph API in Week 3
  getAdAccounts() {
    return { message: 'Meta Ads integration coming in Week 3', accounts: [] };
  }

  getCampaignInsights() {
    return { message: 'Meta Ads integration coming in Week 3', insights: null };
  }

  createCampaign() {
    return { message: 'Meta Ads integration coming in Week 3', id: null };
  }
}
