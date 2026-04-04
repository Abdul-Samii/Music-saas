import {
  Controller,
  Post,
  Get,
  Body,
  Redirect,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { EarlyAccessService } from './early-access.service';
import { EarlyAccessDto } from './dto/early-access.dto';

@Controller('early-access')
export class EarlyAccessController {
  constructor(private readonly earlyAccessService: EarlyAccessService) {}

  @Post()
  register(@Body() dto: EarlyAccessDto) {
    return this.earlyAccessService.register(dto);
  }

  @Get('google')
  @Redirect()
  googleAuth() {
    const clientId = process.env.GOOGLE_CLIENT_ID ?? '';
    const redirectUri = `${process.env.BACKEND_PUBLIC_URL ?? 'https://api.escalium.io'}/api/v1/early-access/google/callback`;
    const scope = 'openid email profile';
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}`;
    return { url };
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'https://escalium.io';

    try {
      const redirectUri = `${process.env.BACKEND_PUBLIC_URL ?? 'https://api.escalium.io'}/api/v1/early-access/google/callback`;

      // Exchange code for token
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID ?? '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = (await tokenRes.json()) as {
        access_token?: string;
        error?: string;
      };
      if (!tokenData.access_token) throw new Error('No access token');

      // Get user info
      const userRes = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
      );
      const user = (await userRes.json()) as {
        id: string;
        email: string;
        name?: string;
      };

      await this.earlyAccessService.registerGoogle(
        user.id,
        user.email,
        user.name,
      );

      res.redirect(`${frontendUrl}/thankyou`);
    } catch {
      res.redirect(`${frontendUrl}/landing?early_access=error`);
    }
  }
}
