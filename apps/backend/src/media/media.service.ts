import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { PrismaService } from '../prisma/prisma.service';

export const VIDEO_LIBRARY = [
  {
    id: 'v1',
    title: 'Neon City Pulse',
    style: 'Abstract',
    duration: 11,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
  },
  {
    id: 'v2',
    title: 'Motion Escape',
    style: 'Abstract',
    duration: 15,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80',
  },
  {
    id: 'v3',
    title: 'Dynamic Ride',
    style: 'Cinematic',
    duration: 15,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80',
  },
  {
    id: 'v4',
    title: 'Deep Emotion',
    style: 'Cinematic',
    duration: 15,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80',
  },
  {
    id: 'v5',
    title: 'Epic Journey',
    style: 'Nature',
    duration: 60,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1458966480358-a0ac42de0a7a?w=400&q=80',
  },
  {
    id: 'v6',
    title: 'Street Night',
    style: 'Urban',
    duration: 30,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
  },
  {
    id: 'v7',
    title: 'Retro Vibes',
    style: 'Retro',
    duration: 60,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80',
  },
  {
    id: 'v8',
    title: 'Road to Glory',
    style: 'Action',
    duration: 60,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
  },
];

type TranscriptionResult = {
  text: string;
  segments: { text: string; start: number; end: number }[];
};

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  getVideoLibrary() {
    return { clips: VIDEO_LIBRARY };
  }

  async transcribeAudio(
    filePath: string,
    mimetype: string,
  ): Promise<TranscriptionResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return { text: '', segments: [] };

    try {
      const fd = new FormData();
      fd.append('file', fs.createReadStream(filePath), {
        filename: 'audio.mp3',
        contentType: mimetype,
      });
      fd.append('model', 'whisper-1');
      fd.append('response_format', 'verbose_json');

      const { data } = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        fd,
        {
          headers: { ...fd.getHeaders(), Authorization: `Bearer ${apiKey}` },
          maxBodyLength: 50 * 1024 * 1024,
        },
      );

      type WhisperResponse = {
        text: string;
        segments?: { text: string; start: number; end: number }[];
      };
      const r = data as WhisperResponse;
      return {
        text: r.text ?? '',
        segments: r.segments?.map((s) => ({ text: s.text, start: s.start, end: s.end })) ?? [],
      };
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error('[transcribeAudio]', JSON.stringify(e?.response?.data ?? err));
      return { text: '', segments: [] };
    }
  }

  async createCreative(
    userId: string,
    payload: {
      name: string;
      audioUrl: string;
      videoClipUrl: string;
      lyricsJson: unknown;
    },
  ) {
    return this.prisma.adCreative.create({
      data: {
        userId,
        name: payload.name,
        audioUrl: payload.audioUrl,
        videoClipUrl: payload.videoClipUrl,
        lyricsJson: payload.lyricsJson as never,
        status: 'READY',
      },
    });
  }

  async listCreatives(userId: string) {
    return this.prisma.adCreative.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCreative(id: string, userId: string) {
    return this.prisma.adCreative.findFirst({ where: { id, userId } });
  }
}
