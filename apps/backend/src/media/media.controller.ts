import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
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
import type { Response } from 'express';
import { MediaService } from './media.service';
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
  constructor(private readonly media: MediaService) {}

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

    console.log(`[uploadAudio] received file=${file.originalname} size=${file.size} path=${file.path}`);

    let vocalsPath: string;
    try {
      console.log('[uploadAudio] starting vocal separation...');
      vocalsPath = await this.media.separateVocals(file.path);
      console.log(`[uploadAudio] separation done, vocals at ${vocalsPath}`);
    } catch (err) {
      console.error('[uploadAudio] demucs failed:', err);
      throw new BadRequestException('Vocal separation failed. Check that demucs is installed on the server.');
    }

    const transcription = await this.media.transcribeAudio(vocalsPath, 'audio/mpeg', language);
    console.log(`[uploadAudio] transcription done, text length=${transcription.text.length}`);

    fs.rm(path.dirname(vocalsPath), { recursive: true, force: true }, () => {});

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
