import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
}
