import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

const GRAPH = 'https://graph.facebook.com/v25.0';

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

@Injectable()
export class LandingPagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    data: {
      artistSlug: string;
      songSlug: string;
      title: string;
      description?: string;
      thumbnailUrl: string;
      spotifyUrl?: string;
      pixelId?: string;
    },
  ) {
    // Resolve slug collisions
    let songSlug = data.songSlug;
    let counter = 1;
    while (
      await this.prisma.landingPage.findFirst({
        where: { artistSlug: data.artistSlug, songSlug },
      })
    ) {
      songSlug = `${data.songSlug}-${counter++}`;
    }

    return this.prisma.landingPage.create({
      data: { ...data, songSlug, userId },
    });
  }

  async findBySlug(artistSlug: string, songSlug: string) {
    return this.prisma.landingPage.findFirst({
      where: { artistSlug, songSlug },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.landingPage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async trackView(id: string) {
    await this.prisma.$executeRaw`UPDATE "LandingPage" SET views = views + 1 WHERE id = ${id}`;
  }

  async trackClick(id: string) {
    await this.prisma.$executeRaw`UPDATE "LandingPage" SET clicks = clicks + 1 WHERE id = ${id}`;
  }

  async getAnalytics(userId: string, id: string) {
    return this.prisma.landingPage.findFirst({
      where: { id, userId },
      select: { id: true, title: true, views: true, clicks: true, createdAt: true },
    });
  }

  async getMetaAnalytics(userId: string, pageId: string) {
    const page = await this.prisma.landingPage.findFirst({
      where: { id: pageId, userId },
      select: { id: true, title: true, artistSlug: true, songSlug: true },
    });
    console.log('[MetaAnalytics] page:', page);
    if (!page) return null;

    const rows = await this.prisma.$queryRaw<
      { metaAccessToken: string | null; metaAdAccountId: string | null }[]
    >`SELECT "metaAccessToken", "metaAdAccountId" FROM "User" WHERE id = ${userId} LIMIT 1`;

    const { metaAccessToken } = rows[0] ?? {};
    console.log('[MetaAnalytics] metaAccessToken present:', !!metaAccessToken);
    if (!metaAccessToken) return { error: 'Meta not connected', title: page.title };

    const slugPattern = `${page.artistSlug}/${page.songSlug}`;
    console.log('[MetaAnalytics] searching campaigns with slug:', slugPattern);

    const campaigns = await this.prisma.campaign.findMany({
      where: { userId, landingPageUrl: { contains: slugPattern } },
      select: { name: true, metaCampaignId: true },
    });
    console.log('[MetaAnalytics] campaigns found:', campaigns);

    const metaCampaigns = campaigns.filter((c) => c.metaCampaignId);
    console.log('[MetaAnalytics] campaigns with metaCampaignId:', metaCampaigns.length);
    if (metaCampaigns.length === 0) {
      return { title: page.title, campaigns: 0, impressions: 0, linkClicks: 0, landingPageViews: 0, reach: 0, spend: 0 };
    }

    let impressions = 0, linkClicks = 0, landingPageViews = 0, reach = 0, spend = 0;

    for (const campaign of metaCampaigns) {
      try {
        console.log('[MetaAnalytics] fetching insights for campaign:', campaign.name, campaign.metaCampaignId);
        const { data: res } = await axios.get(`${GRAPH}/${campaign.metaCampaignId}/insights`, {
          params: {
            fields: 'impressions,clicks,spend,reach,actions',
            date_preset: 'lifetime',
            access_token: metaAccessToken,
          },
        });
        console.log('[MetaAnalytics] raw response:', JSON.stringify(res));
        const d = (res.data as { impressions?: string; clicks?: string; spend?: string; reach?: string; actions?: { action_type: string; value: string }[] }[])?.[0];
        if (!d) { console.log('[MetaAnalytics] no data row for campaign:', campaign.name); continue; }
        impressions += parseInt(d.impressions ?? '0');
        linkClicks += parseInt(d.clicks ?? '0');
        spend += parseFloat(d.spend ?? '0');
        reach += parseInt(d.reach ?? '0');
        const lpv = d.actions?.find((a) => a.action_type === 'landing_page_view');
        landingPageViews += parseInt(lpv?.value ?? '0');
      } catch (err) {
        const e = err as { message?: string; response?: { data?: unknown } };
        console.error('[MetaAnalytics] error fetching campaign:', campaign.name, e?.message, JSON.stringify(e?.response?.data));
      }
    }

    return {
      title: page.title,
      campaigns: metaCampaigns.length,
      impressions,
      linkClicks,
      landingPageViews,
      reach,
      spend: Math.round(spend * 100) / 100,
    };
  }
}
