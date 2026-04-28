import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { LandingPagesService, toSlug } from './landing-pages.service';
import { PrismaService } from '../prisma/prisma.service';

interface JwtUser {
  id: string;
}

@Controller('landing-pages')
export class LandingPagesController {
  constructor(
    private readonly service: LandingPagesService,
    private readonly prisma: PrismaService,
  ) {}

  // POST /landing-pages/thumbnail  — upload artwork, returns { url }
  @Post('thumbnail')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/thumbnails',
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
          cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/'))
          return cb(new BadRequestException('Images only'), false);
        cb(null, true);
      },
    }),
  )
  async uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const apiUrl =
      process.env.API_URL ?? 'https://api.escalium.io';
    return { url: `${apiUrl}/uploads/thumbnails/${file.filename}` };
  }

  // POST /landing-pages  — create landing page record
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body()
    body: {
      title: string;
      songSlug: string;
      thumbnailUrl: string;
      spotifyUrl?: string;
      pixelId?: string;
    },
    @CurrentUser() user: JwtUser,
  ) {
    const rows = await this.prisma.$queryRaw<
      { artistName: string | null; name: string | null }[]
    >`SELECT "artistName", "name" FROM "User" WHERE id = ${user.id} LIMIT 1`;

    const raw = rows[0]?.artistName ?? rows[0]?.name ?? 'artist';
    const artistSlug = toSlug(raw);
    const songSlug = toSlug(body.songSlug);

    const page = await this.service.create(user.id, {
      artistSlug,
      songSlug,
      title: body.title,
      thumbnailUrl: body.thumbnailUrl,
      spotifyUrl: body.spotifyUrl,
      pixelId: body.pixelId,
    });

    const appUrl =
      process.env.APP_URL ?? 'https://escalium.io';
    return {
      ...page,
      url: `${appUrl}/p/${page.artistSlug}/${page.songSlug}`,
    };
  }

  // GET /landing-pages/my  — list user's pages
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async myPages(@CurrentUser() user: JwtUser) {
    const pages = await this.service.findByUser(user.id);
    const appUrl = process.env.APP_URL ?? 'https://escalium.io';
    return pages.map((p) => ({
      ...p,
      url: `${appUrl}/p/${p.artistSlug}/${p.songSlug}`,
    }));
  }

  // GET /landing-pages/:artist/:song  — fetch page data (public, for the Next.js route handler)
  @Get(':artist/:song')
  async getPage(
    @Param('artist') artist: string,
    @Param('song') song: string,
  ) {
    return this.service.findBySlug(artist, song);
  }
}
