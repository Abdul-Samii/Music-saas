import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string | null;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.$queryRaw<UserRow[]>`
      INSERT INTO "User" (id, email, name, "artistName", phone, "passwordHash", "verificationToken", "emailVerified", "createdAt")
      VALUES (
        gen_random_uuid(),
        ${dto.email},
        ${dto.name ?? null},
        ${dto.artistName ?? null},
        ${dto.phone ?? null},
        ${passwordHash},
        ${verificationToken},
        false,
        NOW()
      )
      RETURNING id, email, name, "passwordHash"
    `;

    const created = user[0];

    await this.email.sendVerificationEmail(
      created.email,
      created.name ?? '',
      verificationToken,
    );

    return { user: { id: created.id, email: created.email, name: created.name }, token: this.sign(created.id) };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid =
      user.passwordHash &&
      (await bcrypt.compare(dto.password, user.passwordHash));
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = user;
    return { user: safe, token: this.sign(user.id) };
  }

  async verifyEmail(token: string) {
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "User" WHERE "verificationToken" = ${token} LIMIT 1
    `;
    if (!rows.length) throw new BadRequestException('Invalid or expired verification link');

    await this.prisma.$executeRaw`
      UPDATE "User" SET "emailVerified" = true, "verificationToken" = NULL WHERE id = ${rows[0].id}
    `;

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return { message: 'If that email exists, a reset link has been sent' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.$executeRaw`
      UPDATE "User" SET "resetToken" = ${resetToken}, "resetTokenExpiry" = ${resetTokenExpiry} WHERE id = ${user.id}
    `;

    await this.email.sendPasswordResetEmail(user.email, user.name ?? '', resetToken);

    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, password: string) {
    if (!token || !password) throw new BadRequestException('Token and password are required');
    if (password.length < 8) throw new BadRequestException('Password must be at least 8 characters');

    const rows = await this.prisma.$queryRaw<UserRow[]>`
      SELECT id FROM "User"
      WHERE "resetToken" = ${token} AND "resetTokenExpiry" > NOW()
      LIMIT 1
    `;
    if (!rows.length) throw new NotFoundException('Invalid or expired reset link');

    const passwordHash = await bcrypt.hash(password, 10);
    await this.prisma.$executeRaw`
      UPDATE "User" SET "passwordHash" = ${passwordHash}, "resetToken" = NULL, "resetTokenExpiry" = NULL
      WHERE id = ${rows[0].id}
    `;

    return { message: 'Password reset successfully' };
  }

  private sign(userId: string) {
    return this.jwt.sign({ sub: userId });
  }
}
