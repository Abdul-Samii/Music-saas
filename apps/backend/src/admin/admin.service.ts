import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsers, monthlyUsers, payingUsers, growthRaw] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.$queryRaw<{ count: bigint }[]>`
          SELECT COUNT(*) as count FROM "User" WHERE plan != 'free'
        `.then((r) => Number(r[0]?.count ?? 0)),
        this.prisma.$queryRaw<{ day: Date; count: bigint }[]>`
          SELECT DATE("createdAt") as day, COUNT(*) as count
          FROM "User"
          WHERE "createdAt" >= ${thirtyDaysAgo}
          GROUP BY DATE("createdAt")
          ORDER BY day ASC
        `,
      ]);

    const growth = growthRaw.map((r) => ({
      day: r.day.toISOString().slice(0, 10),
      count: Number(r.count),
    }));

    return {
      totalUsers,
      monthlyUsers,
      payingUsers,
      growth,
    };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        metaAdAccountId: true,
        spotifyArtistId: true,
      },
    });
  }
}
