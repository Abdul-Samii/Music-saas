import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EarlyAccessDto } from './dto/early-access.dto';

@Injectable()
export class EarlyAccessService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: EarlyAccessDto) {
    const existing = await this.prisma.earlyAccess.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      return { success: true, message: 'Already on the list!' };
    }

    await this.prisma.earlyAccess.create({
      data: {
        email: dto.email,
        source: dto.source ?? 'email',
      },
    });

    return { success: true, message: 'You are on the list!' };
  }

  async registerGoogle(googleId: string, email: string, name?: string) {
    const existing = await this.prisma.earlyAccess.findUnique({
      where: { email },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.earlyAccess.create({
      data: { email, name, googleId, source: 'google' },
    });
  }

  async findAll() {
    return this.prisma.earlyAccess.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
