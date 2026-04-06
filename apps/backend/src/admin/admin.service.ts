import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsers, monthlyUsers, earlyAccessTotal, growthRaw] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: { createdAt: { gte: thirtyDaysAgo } },
        }),
        this.prisma.earlyAccess.count(),
        // Users per day for last 30 days
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
      payingUsers: 0, // no payments yet
      earlyAccessTotal,
      growth,
    };
  }

  async getUsers() {
    const [users, earlyAccess] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          plan: true,
          metaAdAccountId: true,
          spotifyArtistId: true,
        },
      }),
      this.prisma.earlyAccess.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    // Merge: full users take priority, early access fills in the rest
    const userEmails = new Set(users.map((u) => u.email));
    const earlyAccessOnly = earlyAccess
      .filter((ea) => !userEmails.has(ea.email))
      .map((ea) => ({
        id: ea.id,
        name: ea.name,
        email: ea.email,
        phone: null,
        createdAt: ea.createdAt,
        metaAdAccountId: null,
        spotifyArtistId: null,
        type: 'early_access' as const,
      }));

    const fullUsers = users.map((u) => ({
      ...u,
      phone: null,
      plan: (u as unknown as Record<string, string>).plan ?? 'free',
      type: 'user' as const,
    }));

    return [...fullUsers, ...earlyAccessOnly].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async getEarlyAccess() {
    return this.prisma.earlyAccess.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        source: true,
        activated: true,
        createdAt: true,
      },
    });
  }
}
