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
    data: Partial<Pick<User, 'name' | 'metaAdAccountId' | 'spotifyArtistId'>>,
  ): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }
}
