import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.campaign.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { adCreatives: true, metrics: true } } },
    });
  }

  async findOne(id: string, userId: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: { metrics: { orderBy: { date: 'asc' } }, adCreatives: true },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.userId !== userId) throw new ForbiddenException();
    return campaign;
  }

  async create(userId: string, dto: CreateCampaignDto) {
    return this.prisma.campaign.create({
      data: {
        userId,
        name: dto.name,
        budget: dto.budget,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        pixelId: dto.pixelId,
        audienceTier: dto.audienceTier,
        placement: dto.placement,
        landingPageUrl: dto.landingPageUrl,
        adTitle: dto.adTitle,
        adDescription: dto.adDescription,
        adVideoUrl: dto.adVideoUrl,
        adImageHash: dto.adImageHash,
        metaPageId: dto.metaPageId,
        metaIgActorId: dto.metaIgActorId,
        status: CampaignStatus.DRAFT,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateCampaignDto) {
    await this.findOne(id, userId);
    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.budget && { budget: dto.budget }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async updateStatus(id: string, userId: string, status: CampaignStatus) {
    await this.findOne(id, userId);
    return this.prisma.campaign.update({ where: { id }, data: { status } });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.prisma.campaign.delete({ where: { id } });
    return { success: true };
  }
}
