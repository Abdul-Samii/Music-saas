import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(userId: string) {
    const campaigns = await this.prisma.campaign.findMany({
      where: { userId },
      include: { metrics: true },
    });

    const totalSpend = campaigns.reduce(
      (sum, c) => sum + c.metrics.reduce((s, m) => s + m.spend, 0),
      0,
    );
    const totalStreams = campaigns.reduce(
      (sum, c) =>
        sum +
        c.metrics.reduce(
          (s, m) => s + ((m.streamsAfter ?? 0) - (m.streamsBefore ?? 0)),
          0,
        ),
      0,
    );
    const activeCampaigns = campaigns.filter(
      (c) => c.status === 'ACTIVE',
    ).length;
    const costPerStream = totalStreams > 0 ? totalSpend / totalStreams : 0;

    return {
      totalSpend,
      totalStreams,
      activeCampaigns,
      totalCampaigns: campaigns.length,
      costPerStream: Number(costPerStream.toFixed(4)),
    };
  }

  async campaignMetrics(campaignId: string, userId: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
      include: { metrics: { orderBy: { date: 'asc' } } },
    });
    if (!campaign) return null;
    return campaign.metrics;
  }
}
