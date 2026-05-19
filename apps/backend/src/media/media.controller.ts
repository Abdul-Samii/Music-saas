import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import type { Request, Response } from 'express';
import { MediaService } from './media.service';
import { RenderVideoService } from './render-video.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface JwtUser {
  id: string;
}

type MulterDiskFile = {
  path: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
};

function audioStorage() {
  return diskStorage({
    destination: './uploads/audio',
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = file.originalname.split('.').pop() ?? 'mp3';
      cb(null, `${unique}.${ext}`);
    },
  });
}

@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(
    private readonly media: MediaService,
    private readonly renderVideo: RenderVideoService,
  ) {}

  // POST /media/upload-audio  (field: "audio")
  @Post('upload-audio')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: audioStorage(),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadAudio(
    @UploadedFile() file: MulterDiskFile,
    @CurrentUser() _user: JwtUser,
    @Body('language') language?: string,
  ) {
    if (!file) throw new BadRequestException('No audio file uploaded');
    const audioUrl = `/uploads/audio/${file.filename}`;
    const transcription = await this.media.transcribeAudio(file.path, file.mimetype, language);
    return { audioUrl, filename: file.originalname, transcription };
  }

  // GET /media/video-library
  @Get('video-library')
  async getVideoLibrary() {
    return this.media.getVideoLibrary();
  }

  // POST /media/render  { name, audioUrl, videoClipUrl, lyricsJson }
  @Post('render')
  async render(
    @Body()
    body: {
      name: string;
      audioUrl: string;
      videoClipUrl: string;
      lyricsJson: unknown;
    },
    @CurrentUser() user: JwtUser,
  ) {
    if (!body.audioUrl || !body.videoClipUrl) {
      throw new BadRequestException('audioUrl and videoClipUrl are required');
    }
    const creative = await this.media.createCreative(user.id, {
      name: body.name || 'Untitled Creative',
      audioUrl: body.audioUrl,
      videoClipUrl: body.videoClipUrl,
      lyricsJson: body.lyricsJson,
    });
    return { jobId: creative.id, status: 'ready', creative };
  }

  // GET /media/job/:jobId
  @Get('job/:jobId')
  async getJob(
    @Param('jobId') jobId: string,
    @CurrentUser() user: JwtUser,
  ) {
    const creative = await this.media.getCreative(jobId, user.id);
    if (!creative) throw new NotFoundException('Job not found');
    return { jobId, status: creative.status.toLowerCase(), creative };
  }

  // GET /media/my-creatives
  @Get('my-creatives')
  async myCreatives(@CurrentUser() user: JwtUser) {
    return this.media.listCreatives(user.id);
  }

  // POST /media/render-video — server-side render using node-canvas + FFmpeg, returns MP4
  @Post('render-video')
  async renderVideoEndpoint(
    @Body() body: {
      audioUrl: string;
      videoClipUrl: string;
      trimStart: number;
      trimEnd: number;
      lines: string[];
      timestamps: (number | null)[];
      endTimestamps: (number | null)[];
      wordTimestamps: { word: string; start: number; end: number }[][];
      config: {
        lyricStyle: string;
        fontFamily: string;
        fontSize: 'sm' | 'md' | 'lg';
        textColor: string;
        highlightColor: string;
        textPosition: 'top' | 'center' | 'bottom';
        overlayOpacity: number;
        creativeName?: string;
      };
    },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!body.audioUrl || !body.videoClipUrl) {
      res.status(400).json({ error: 'audioUrl and videoClipUrl are required' });
      return;
    }
    const authHeader = req.headers.authorization
      ? { Authorization: req.headers.authorization }
      : undefined;
    let outputPath: string | null = null;
    try {
      outputPath = await this.renderVideo.renderVideo({ ...body, authHeader } as any);
      const name = `${body.config?.creativeName || 'video'}.mp4`;
      res.download(outputPath, name, () => {
        if (outputPath) fs.rm(path.dirname(outputPath), { recursive: true }, () => {});
      });
    } catch (err) {
      if (outputPath) fs.rm(path.dirname(outputPath), { recursive: true }, () => {});
      res.status(500).json({ error: 'Render failed', detail: (err as Error).message });
    }
  }

  // POST /media/convert-mp4  — accepts a webm blob, returns mp4
  @Post('convert-mp4')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/tmp',
        filename: (_req, _file, cb) => cb(null, `${Date.now()}.webm`),
      }),
      limits: { fileSize: 500 * 1024 * 1024 },
    }),
  )
  async convertToMp4(@UploadedFile() file: MulterDiskFile, @Res() res: Response) {
    if (!file) throw new BadRequestException('No video file');
    let mp4Path: string | null = null;
    try {
      mp4Path = await this.media.convertWebmToMp4(file.path);
      res.download(mp4Path, 'video.mp4', () => {
        fs.unlink(file.path, () => {});
        if (mp4Path) fs.unlink(mp4Path, () => {});
      });
    } catch {
      fs.unlink(file.path, () => {});
      res.status(500).json({ error: 'Conversion failed' });
    }
  }

  // POST /media/upload-user-video  — validates ≤ 60 s, stores, returns URL
  @Post('upload-user-video')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/user-videos',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = file.originalname.split('.').pop() ?? 'mp4';
          cb(null, `${unique}.${ext}`);
        },
      }),
      limits: { fileSize: 500 * 1024 * 1024 },
    }),
  )
  async uploadUserVideo(@UploadedFile() file: MulterDiskFile) {
    if (!file) throw new BadRequestException('No video file');
    let duration: number;
    try {
      duration = await this.media.getVideoDurationSec(file.path);
    } catch {
      fs.unlink(file.path, () => {});
      throw new BadRequestException('Could not read video file');
    }
    if (duration > 61) {
      fs.unlink(file.path, () => {});
      throw new BadRequestException(
        `Video is ${Math.ceil(duration)}s — maximum is 60 seconds`,
      );
    }
    return {
      url: `/uploads/user-videos/${file.filename}`,
      duration,
      filename: file.originalname,
    };
  }

  // GET /media/proxy-clip?url=<encoded-s3-url>  — proxies S3 video to avoid browser CORS
  @Get('proxy-clip')
  async proxyClip(@Query('url') url: string, @Res() res: Response) {
    if (!url || !url.includes('amazonaws.com')) {
      res.status(400).json({ error: 'Invalid URL' });
      return;
    }
    try {
      const upstream = await axios.get(decodeURIComponent(url), { responseType: 'stream' });
      res.setHeader('Content-Type', upstream.headers['content-type'] ?? 'video/mp4');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      (upstream.data as NodeJS.ReadableStream).pipe(res);
    } catch {
      res.status(502).json({ error: 'Failed to fetch clip' });
    }
  }
}
