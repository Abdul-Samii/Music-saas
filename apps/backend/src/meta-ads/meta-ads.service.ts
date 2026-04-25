import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import FormData from 'form-data';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

const GRAPH = 'https://graph.facebook.com/v25.0';

@Injectable()
export class MetaAdsService {
  private readonly logger = new Logger(MetaAdsService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  private get appId() {
    return this.config.get<string>('META_APP_ID') ?? '';
  }

  private get appSecret() {
    return this.config.get<string>('META_APP_SECRET') ?? '';
  }

  // ── Step 1a: OAuth URL ──────────────────────────────────────────────────────
  getOAuthUrl(redirectUri: string): string {
    const scopes = [
      'ads_management',
      'ads_read',
      'business_management',
      'pages_read_engagement',
    ].join(',');

    return (
      `https://www.facebook.com/v25.0/dialog/oauth` +
      `?client_id=${this.appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scopes}` +
      `&response_type=code`
    );
  }

  // ── Step 1b: Exchange code → short token → long-lived token ────────────────
  async exchangeCodeForToken(
    code: string,
    redirectUri: string,
  ): Promise<string> {
    try {
      // Short-lived token
      const { data: shortData } = await axios.get(
        `${GRAPH}/oauth/access_token`,
        {
          params: {
            client_id: this.appId,
            client_secret: this.appSecret,
            redirect_uri: redirectUri,
            code,
          },
        },
      );

      // Exchange for long-lived token (60 days)
      const { data: longData } = await axios.get(
        `${GRAPH}/oauth/access_token`,
        {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: this.appId,
            client_secret: this.appSecret,
            fb_exchange_token: shortData.access_token,
          },
        },
      );

      return longData.access_token as string;
    } catch (err: unknown) {
      const msg =
        (
          err as {
            response?: { data?: { error?: { message?: string } } };
          }
        )?.response?.data?.error?.message ?? 'Token exchange failed';
      throw new BadRequestException(msg);
    }
  }

  // ── Step 1c: Fetch user's ad accounts ──────────────────────────────────────
  async getAdAccounts(
    accessToken: string,
  ): Promise<{ id: string; name: string; currency: string; status: number }[]> {
    try {
      const { data } = await axios.get(`${GRAPH}/me/adaccounts`, {
        params: {
          fields: 'id,name,currency,account_status',
          access_token: accessToken,
        },
      });
      return (
        data.data?.map(
          (a: {
            id: string;
            name: string;
            currency: string;
            account_status: number;
          }) => ({
            id: a.id,
            name: a.name,
            currency: a.currency,
            status: a.account_status,
          }),
        ) ?? []
      );
    } catch {
      throw new BadRequestException('Failed to fetch ad accounts');
    }
  }

  // ── Step 1d: Get business accounts ─────────────────────────────────────────
  async getBusinesses(
    accessToken: string,
  ): Promise<{ id: string; name: string }[]> {
    try {
      const { data } = await axios.get(`${GRAPH}/me/businesses`, {
        params: {
          fields: 'id,name',
          access_token: accessToken,
        },
      });
      return data.data ?? [];
    } catch {
      return [];
    }
  }

  // ── Step 1e: Create pixel ───────────────────────────────────────────────────
  async createPixel(accessToken: string, adAccountId: string): Promise<string> {
    try {
      const accountId = adAccountId.replace('act_', '');
      const { data } = await axios.post(
        `${GRAPH}/act_${accountId}/adspixels`,
        null,
        {
          params: {
            name: 'Escalium Pixel',
            access_token: accessToken,
          },
        },
      );
      return data.id as string;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error(
        '[createPixel] Facebook error:',
        JSON.stringify(e?.response?.data ?? err),
      );
      throw new InternalServerErrorException('Failed to create pixel');
    }
  }

  // ── Step 1f: Save connection to DB ─────────────────────────────────────────
  async saveConnection(
    userId: string,
    accessToken: string,
    adAccountId: string,
    pixelId?: string,
    businessId?: string,
  ): Promise<void> {
    await this.users.updateMetaConnection(userId, {
      metaAccessToken: accessToken,
      metaAdAccountId: adAccountId,
      metaPixelId: pixelId,
      metaBusinessId: businessId,
    });
  }

  // ── Fetch pixels from ad account ───────────────────────────────────────────
  async getPixels(
    accessToken: string,
    adAccountId: string,
  ): Promise<{ id: string; name: string }[]> {
    try {
      const accountId = adAccountId.replace('act_', '');
      const { data } = await axios.get(`${GRAPH}/act_${accountId}/adspixels`, {
        params: { fields: 'id,name', access_token: accessToken },
      });
      return (data.data ?? []).map((p: { id: string; name: string }) => ({
        id: p.id,
        name: p.name,
      }));
    } catch {
      return [];
    }
  }

  // ── Create campaign + adset on Meta ────────────────────────────────────────
  async createMetaCampaign(
    accessToken: string,
    adAccountId: string,
    payload: {
      name: string;
      tierBudgets: number[];
      pixelId: string;
      audienceTiers: string[];
      placement: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{ metaCampaignId: string; metaAdSetIds: string[] }> {
    const accountId = adAccountId.replace('act_', '');

    // 1. Create one campaign
    const { data: camp } = await axios.post(
      `${GRAPH}/act_${accountId}/campaigns`,
      null,
      {
        params: {
          name: payload.name,
          objective: 'OUTCOME_TRAFFIC',
          status: 'ACTIVE',
          special_ad_categories: '[]',
          is_adset_budget_sharing_enabled: 'false',
          access_token: accessToken,
        },
      },
    );
    const metaCampaignId = camp.id as string;

    // 2. Create one ad set per audience tier
    const metaAdSetIds: string[] = [];
    for (let i = 0; i < payload.audienceTiers.length; i++) {
      const tier = payload.audienceTiers[i];
      const tierBudget = payload.tierBudgets[i] ?? 5;
      const targeting = this.buildTargeting(tier, payload.placement);

      const adSetParams: Record<string, unknown> = {
        name: `${payload.name} — ${tier}`,
        campaign_id: metaCampaignId,
        daily_budget: Math.round(tierBudget * 100),
        billing_event: 'IMPRESSIONS',
        optimization_goal: 'LINK_CLICKS',
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
        status: 'ACTIVE',
        targeting: JSON.stringify(targeting),
        access_token: accessToken,
      };

      const targetingCountries = (
        targeting.geo_locations as { countries: string[] }
      ).countries;
      if (targetingCountries.includes('SG')) {
        adSetParams['regional_regulated_categories'] = JSON.stringify([
          'SINGAPORE_UNIVERSAL',
        ]);
      }

      if (payload.startDate) adSetParams['start_time'] = payload.startDate;
      if (payload.endDate) {
        const start = new Date(payload.startDate ?? Date.now());
        const end = new Date(payload.endDate);
        if (end > start) adSetParams['end_time'] = payload.endDate;
      }

      let adSet: { id: string };
      try {
        const res = await axios.post(`${GRAPH}/act_${accountId}/adsets`, null, {
          params: adSetParams,
        });
        adSet = res.data as { id: string };
      } catch (err) {
        if (err instanceof AxiosError) {
          this.logger.error(
            `Meta adset error (tier: ${tier})`,
            JSON.stringify(err.response?.data),
          );
        }
        throw err;
      }

      metaAdSetIds.push(adSet.id);
    }

    return { metaCampaignId, metaAdSetIds };
  }

  private buildTargeting(audienceTier: string, placement: string) {
    const tierCountries: Record<string, string[]> = {
      tier1: ['AU', 'AT', 'BE', 'DK', 'FI', 'FR', 'DE', 'IE', 'IT', 'NL', 'NZ', 'NO', 'ES', 'SE', 'CH', 'GB', 'US'],
      tier2: ['BR', 'BG', 'CL', 'CO', 'CR', 'CZ', 'GR', 'HU', 'IL', 'LB', 'LT', 'MX', 'PA', 'PY', 'PL', 'PT', 'RO'],
      tier3: ['DZ', 'AR', 'AZ', 'BD', 'BY', 'DO', 'IQ', 'JO', 'KE', 'NG', 'OM', 'PK', 'PE', 'LK', 'UA'],
      top: ['AN', 'AT', 'AU', 'AX', 'BE', 'CA', 'CH', 'CY', 'DE', 'DK', 'EE', 'ES', 'FI', 'GB', 'HK', 'IE', 'IL', 'IS', 'IT', 'JP', 'KR', 'LU', 'NL', 'NO', 'NZ', 'SE', 'SG', 'UM', 'US', 'VI'],
      bottom: ['AR', 'BO', 'BR', 'CL', 'CO', 'CR', 'DO', 'EC', 'GQ', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PY', 'SV', 'UY'],
    };

    const countries = tierCountries[audienceTier] ?? tierCountries['tier1'];

    // Placement templates
    const publisher_platforms =
      placement === 'pro_plus' ? ['instagram'] : ['instagram', 'facebook'];

    const instagram_positions = ['story', 'reels'];
    const facebook_positions = placement === 'pro_plus' ? [] : ['story'];

    return {
      age_min: 18,
      geo_locations: { countries },
      publisher_platforms,
      instagram_positions,
      ...(facebook_positions.length > 0 && { facebook_positions }),
      targeting_automation: { advantage_audience: 1 },
    };
  }

  // ── Fetch Facebook Pages + linked Instagram accounts ───────────────────────
  async getPages(accessToken: string): Promise<{
    pages: {
      id: string;
      name: string;
      instagramAccounts: { id: string; username: string }[];
    }[];
  }> {
    try {
      const { data } = await axios.get(`${GRAPH}/me/accounts`, {
        params: {
          fields: 'id,name,instagram_business_account{id,username}',
          access_token: accessToken,
        },
      });
      type RawPage = {
        id: string;
        name: string;
        instagram_business_account?: { id: string; username?: string };
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const pages = ((data.data ?? []) as RawPage[]).map((p) => ({
        id: p.id,
        name: p.name,
        instagramAccounts: p.instagram_business_account
          ? [
              {
                id: p.instagram_business_account.id,
                username: p.instagram_business_account.username ?? '',
              },
            ]
          : [],
      }));
      return { pages };
    } catch {
      return { pages: [] };
    }
  }

  // ── Upload video to Meta ad account ────────────────────────────────────────
  async uploadAdVideo(
    accessToken: string,
    adAccountId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
  ): Promise<string> {
    const accountId = adAccountId.replace('act_', '');
    const fd = new FormData();
    fd.append('access_token', accessToken);
    fd.append('source', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    try {
      const { data } = await axios.post(
        `https://graph-video.facebook.com/v25.0/act_${accountId}/advideos`,
        fd,
        { headers: fd.getHeaders() },
      );
      return (data as { id: string }).id;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error(
        '[uploadAdVideo] error:',
        JSON.stringify(e?.response?.data ?? err),
      );
      throw new InternalServerErrorException('Failed to upload video to Meta');
    }
  }

  // ── Upload image to Meta ad account ────────────────────────────────────────
  async uploadAdImage(
    accessToken: string,
    adAccountId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
  ): Promise<string> {
    const accountId = adAccountId.replace('act_', '');
    const fd = new FormData();
    fd.append('access_token', accessToken);
    fd.append(file.originalname, file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    try {
      const { data } = await axios.post(
        `${GRAPH}/act_${accountId}/adimages`,
        fd,
        { headers: fd.getHeaders() },
      );
      // Response: { images: { [filename]: { hash, url, ... } } }
      const images = (data as { images: Record<string, { hash: string }> })
        .images;
      const firstKey = Object.keys(images)[0];
      return images[firstKey].hash;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error(
        '[uploadAdImage] error:',
        JSON.stringify(e?.response?.data ?? err),
      );
      throw new InternalServerErrorException('Failed to upload image to Meta');
    }
  }

  // ── Create ad creative ─────────────────────────────────────────────────────
  async createAdCreative(
    accessToken: string,
    adAccountId: string,
    payload: {
      name: string;
      pageId: string;
      instagramActorId?: string;
      videoId?: string;
      imageHash?: string;
      adTitle: string;
      adDescription?: string;
      landingPageUrl: string;
    },
  ): Promise<string> {
    const accountId = adAccountId.replace('act_', '');

    const callToAction = {
      type: 'LISTEN_NOW',
      value: { link: payload.landingPageUrl },
    };

    const mediaSpec = payload.videoId
      ? {
          video_data: {
            video_id: payload.videoId,
            title: payload.adTitle,
            message: payload.adDescription ?? '',
            call_to_action: callToAction,
          },
        }
      : {
          link_data: {
            image_hash: payload.imageHash,
            link: payload.landingPageUrl,
            name: payload.adTitle,
            message: payload.adDescription ?? '',
            call_to_action: callToAction,
          },
        };

    const objectStorySpec: Record<string, unknown> = {
      page_id: payload.pageId,
      ...mediaSpec,
    };
    if (payload.instagramActorId) {
      objectStorySpec['instagram_actor_id'] = payload.instagramActorId;
    }

    const postCreative = async (spec: Record<string, unknown>) => {
      const { data } = await axios.post(
        `${GRAPH}/act_${accountId}/adcreatives`,
        null,
        {
          params: {
            name: payload.name,
            object_story_spec: JSON.stringify(spec),
            multi_advertiser_ads_enabled: 0,
            access_token: accessToken,
          },
        },
      );
      return (data as { id: string }).id;
    };

    try {
      return await postCreative(objectStorySpec);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      const msg = e?.response?.data?.error?.message ?? '';
      // If the IG actor ID is invalid, retry without it
      if (msg.includes('instagram_actor_id') && objectStorySpec['instagram_actor_id']) {
        this.logger.warn('instagram_actor_id rejected, retrying without it');
        const specWithoutIg = { ...objectStorySpec };
        delete specWithoutIg['instagram_actor_id'];
        try {
          return await postCreative(specWithoutIg);
        } catch (err2: unknown) {
          const e2 = err2 as { response?: { data?: unknown } };
          console.error('[createAdCreative] error (retry):', JSON.stringify(e2?.response?.data ?? err2));
          throw new InternalServerErrorException('Failed to create ad creative');
        }
      }
      console.error('[createAdCreative] error:', JSON.stringify(e?.response?.data ?? err));
      throw new InternalServerErrorException('Failed to create ad creative');
    }
  }

  // ── Create ad ──────────────────────────────────────────────────────────────
  async createMetaAd(
    accessToken: string,
    adAccountId: string,
    payload: { name: string; adSetId: string; creativeId: string },
  ): Promise<string> {
    const accountId = adAccountId.replace('act_', '');
    try {
      const res = await axios.post(`${GRAPH}/act_${accountId}/ads`, null, {
        params: {
          name: payload.name,
          adset_id: payload.adSetId,
          creative: JSON.stringify({ creative_id: payload.creativeId }),
          status: 'ACTIVE',
          access_token: accessToken,
        },
      });
      return (res.data as { id: string }).id;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error(
        '[createMetaAd] error:',
        JSON.stringify(e?.response?.data ?? err),
      );
      throw new InternalServerErrorException('Failed to create ad');
    }
  }

  // ── Sync Meta Insights → CampaignMetric rows ─────────────────────────────
  async syncInsights(
    userId: string,
    campaignId: string,
  ): Promise<{ synced: number }> {
    const userRows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null }[]
    >`SELECT "metaAccessToken" FROM "User" WHERE id = ${userId} LIMIT 1`;
    const token = userRows[0]?.metaAccessToken;
    if (!token) return { synced: 0 };

    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
      select: { metaAdSetId: true },
    });
    if (!campaign?.metaAdSetId) return { synced: 0 };

    let rawRows: {
      spend: string;
      impressions: string;
      clicks: string;
      date_start: string;
    }[] = [];
    try {
      const { data } = await axios.get(
        `${GRAPH}/${campaign.metaAdSetId}/insights`,
        {
          params: {
            fields: 'spend,impressions,clicks',
            date_preset: 'last_30d',
            time_increment: '1',
            access_token: token,
          },
        },
      );
      rawRows = (data as { data: typeof rawRows }).data ?? [];
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error(
        '[syncInsights] Meta API error:',
        JSON.stringify(e?.response?.data ?? err),
      );
      return { synced: 0 };
    }

    let synced = 0;
    for (const row of rawRows) {
      const date = new Date(row.date_start);
      const spend = parseFloat(row.spend) || 0;
      const impressions = parseInt(row.impressions) || 0;
      const clicks = parseInt(row.clicks) || 0;

      const existing = await this.prisma.campaignMetric.findFirst({
        where: { campaignId, date },
      });
      if (existing) {
        await this.prisma.campaignMetric.update({
          where: { id: existing.id },
          data: { spend, impressions, clicks },
        });
      } else {
        await this.prisma.campaignMetric.create({
          data: { campaignId, date, spend, impressions, clicks },
        });
      }
      synced++;
    }
    return { synced };
  }

  // ── Pause / Resume campaign on Meta ────────────────────────────────────────
  async pauseOnMeta(userId: string, campaignId: string): Promise<void> {
    await this.setMetaCampaignStatus(userId, campaignId, 'PAUSED');
  }

  async resumeOnMeta(userId: string, campaignId: string): Promise<void> {
    await this.setMetaCampaignStatus(userId, campaignId, 'ACTIVE');
  }

  private async setMetaCampaignStatus(
    userId: string,
    campaignId: string,
    status: 'ACTIVE' | 'PAUSED',
  ): Promise<void> {
    const userRows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null }[]
    >`SELECT "metaAccessToken" FROM "User" WHERE id = ${userId} LIMIT 1`;
    const token = userRows[0]?.metaAccessToken;
    if (!token) return;

    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
      select: { metaCampaignId: true },
    });
    const metaId = campaign?.metaCampaignId;
    if (!metaId) return;

    try {
      await axios.post(`${GRAPH}/${metaId}`, null, {
        params: { status, access_token: token },
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error(
        `[setMetaCampaignStatus] error (${status}):`,
        JSON.stringify(e?.response?.data ?? err),
      );
    }
  }

  // ── Status ──────────────────────────────────────────────────────────────────
  async getConnectionStatus(userId: string): Promise<{
    connected: boolean;
    adAccountId: string | null;
    pixelId: string | null;
    hasBusinessId: boolean;
  }> {
    const rows = await this.prisma.$queryRaw<
      {
        metaAccessToken: string | null;
        metaAdAccountId: string | null;
        metaPixelId: string | null;
        metaBusinessId: string | null;
      }[]
    >`
      SELECT "metaAccessToken", "metaAdAccountId", "metaPixelId", "metaBusinessId"
      FROM "User" WHERE id = ${userId} LIMIT 1
    `;

    const u = rows[0];
    return {
      connected: !!u?.metaAccessToken,
      adAccountId: u?.metaAdAccountId ?? null,
      pixelId: u?.metaPixelId ?? null,
      hasBusinessId: !!u?.metaBusinessId,
    };
  }

  // ── Disconnect ──────────────────────────────────────────────────────────────
  async disconnect(userId: string): Promise<void> {
    // Get token before clearing so we can revoke it from Facebook
    const rows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null }[]
    >`
      SELECT "metaAccessToken" FROM "User" WHERE id = ${userId} LIMIT 1
    `;
    const accessToken = rows[0]?.metaAccessToken;

    // Revoke token from Facebook
    if (accessToken) {
      try {
        await axios.delete(`${GRAPH}/me/permissions`, {
          params: { access_token: accessToken },
        });
      } catch {
        // If revocation fails, still clear from DB
      }
    }

    // Clear from DB
    await this.prisma.$executeRaw`
      UPDATE "User"
      SET "metaAccessToken" = NULL,
          "metaAdAccountId" = NULL,
          "metaPixelId"     = NULL,
          "metaBusinessId"  = NULL
      WHERE id = ${userId}
    `;
  }
}
