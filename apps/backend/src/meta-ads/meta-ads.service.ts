import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

const GRAPH = 'https://graph.facebook.com/v19.0';

@Injectable()
export class MetaAdsService {
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
      `https://www.facebook.com/v19.0/dialog/oauth` +
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
  async createPixel(
    accessToken: string,
    adAccountId: string,
  ): Promise<string> {
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
    const rows = await this.prisma.$queryRaw<{ metaAccessToken: string | null }[]>`
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
