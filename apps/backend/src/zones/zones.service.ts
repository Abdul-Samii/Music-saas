import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZonesService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.zone.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(userId: string, name: string, countries: string[]) {
    return this.prisma.zone.create({ data: { userId, name, countries } });
  }

  delete(userId: string, id: string) {
    return this.prisma.zone.deleteMany({ where: { id, userId } });
  }
}
