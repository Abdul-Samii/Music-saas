import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateById(
    id: string,
    data: Partial<Pick<User, 'name' | 'metaAdAccountId' | 'metaAccessToken' | 'spotifyArtistId'>>,
  ): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateMetaConnection(
    id: string,
    fields: {
      metaAccessToken?: string;
      metaAdAccountId?: string;
      metaPixelId?: string;
      metaBusinessId?: string;
    },
  ): Promise<void> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (fields.metaAccessToken !== undefined) {
      sets.push(`"metaAccessToken" = $${idx++}`);
      values.push(fields.metaAccessToken);
    }
    if (fields.metaAdAccountId !== undefined) {
      sets.push(`"metaAdAccountId" = $${idx++}`);
      values.push(fields.metaAdAccountId);
    }
    if (fields.metaPixelId !== undefined) {
      sets.push(`"metaPixelId" = $${idx++}`);
      values.push(fields.metaPixelId);
    }
    if (fields.metaBusinessId !== undefined) {
      sets.push(`"metaBusinessId" = $${idx++}`);
      values.push(fields.metaBusinessId);
    }

    if (!sets.length) return;

    values.push(id);
    await this.prisma.$executeRawUnsafe(
      `UPDATE "User" SET ${sets.join(', ')} WHERE id = $${idx}`,
      ...values,
    );
  }
}
