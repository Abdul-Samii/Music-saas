import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
