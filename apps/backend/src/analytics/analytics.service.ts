import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecordMetricDto } from './dto/record-metric.dto';

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
      totalSpend: Number(totalSpend.toFixed(2)),
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

    const metrics = campaign.metrics;
    const totalSpend = metrics.reduce((s, m) => s + m.spend, 0);
    const totalStreams = metrics.reduce(
      (s, m) => s + ((m.streamsAfter ?? 0) - (m.streamsBefore ?? 0)),
      0,
    );
    const totalImpressions = metrics.reduce((s, m) => s + m.impressions, 0);
    const totalClicks = metrics.reduce((s, m) => s + m.clicks, 0);
    const ctr =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const costPerStream = totalStreams > 0 ? totalSpend / totalStreams : 0;

    return {
      summary: {
        totalSpend: Number(totalSpend.toFixed(2)),
        totalStreams,
        totalImpressions,
        totalClicks,
        ctr: Number(ctr.toFixed(2)),
        costPerStream: Number(costPerStream.toFixed(4)),
      },
      daily: metrics,
    };
  }

  async recordMetric(campaignId: string, userId: string, dto: RecordMetricDto) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const streams = (dto.streamsAfter ?? 0) - (dto.streamsBefore ?? 0);
    const costPerStream = streams > 0 ? dto.spend / streams : null;

    return this.prisma.campaignMetric.create({
      data: {
        campaignId,
        date: new Date(dto.date),
        spend: dto.spend,
        impressions: dto.impressions,
        clicks: dto.clicks,
        streamsBefore: dto.streamsBefore ?? null,
        streamsAfter: dto.streamsAfter ?? null,
        costPerStream,
      },
    });
  }

  async topCampaigns(userId: string, limit = 5) {
    const campaigns = await this.prisma.campaign.findMany({
      where: { userId },
      include: { metrics: true },
    });

    return campaigns
      .map((c) => {
        const totalSpend = c.metrics.reduce((s, m) => s + m.spend, 0);
        const totalStreams = c.metrics.reduce(
          (s, m) => s + ((m.streamsAfter ?? 0) - (m.streamsBefore ?? 0)),
          0,
        );
        const cps = totalStreams > 0 ? totalSpend / totalStreams : 0;
        return {
          id: c.id,
          name: c.name,
          status: c.status,
          totalSpend: Number(totalSpend.toFixed(2)),
          totalStreams,
          costPerStream: Number(cps.toFixed(4)),
        };
      })
      .sort((a, b) => b.totalStreams - a.totalStreams)
      .slice(0, limit);
  }
}
