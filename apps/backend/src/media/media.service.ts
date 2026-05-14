import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { PrismaService } from '../prisma/prisma.service';

const execFileAsync = promisify(execFile);

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const BUCKET = process.env.S3_BUCKET_NAME ?? 'escaliumio';
const CLIPS_PREFIX = process.env.S3_CLIPS_PREFIX ?? 'Creative Studio - Clips/';

type VideoClip = {
  id: string;
  title: string;
  style: string;
  duration: number;
  url: string;
  thumbnail: string;
};

type WordTimestamp = { word: string; start: number; end: number };

type TranscriptionResult = {
  text: string;
  segments: {
    text: string;
    start: number;
    end: number;
    words: WordTimestamp[];
  }[];
};

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async getVideoLibrary(): Promise<{ clips: VideoClip[] }> {
    // Try manifest.json first (fastest, allows custom metadata)
    try {
      const obj = await s3.send(
        new GetObjectCommand({
          Bucket: BUCKET,
          Key: `${CLIPS_PREFIX}manifest.json`,
        }),
      );
      const body = await obj.Body?.transformToString();
      if (body) {
        const clips = JSON.parse(body) as VideoClip[];
        return { clips };
      }
    } catch {
      // manifest not found — fall through to auto-discovery
    }

    // Auto-discover: list .mp4 files and build clip objects from S3 keys
    try {
      const list = await s3.send(
        new ListObjectsV2Command({
          Bucket: BUCKET,
          Prefix: CLIPS_PREFIX,
        }),
      );

      const baseUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION ?? 'eu-north-1'}.amazonaws.com`;

      const clips: VideoClip[] = (list.Contents ?? [])
        .filter((obj) => obj.Key?.toLowerCase().endsWith('.mp4'))
        .map((obj, i) => {
          const key = obj.Key!;
          const filename = key.split('/').pop()!;
          const name = filename.replace(/\.mp4$/i, '');
          // Derive style from sub-folder name if present, else 'General'
          const parts = key.replace(CLIPS_PREFIX, '').split('/');
          const style = parts.length > 1 ? parts[0] : 'General';
          // Look for matching thumbnail: same name with .jpg/.png
          const thumbKey = key.replace(/\.mp4$/i, '.jpg');
          return {
            id: `s3-${i}`,
            title: name
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            style,
            duration: 0, // duration not available without ffprobe; set in manifest.json for accuracy
            url: `${baseUrl}/${encodeURIComponent(key).replace(/%2F/g, '/')}`,
            thumbnail: `${baseUrl}/${encodeURIComponent(thumbKey).replace(/%2F/g, '/')}`,
          };
        });

      return { clips };
    } catch (err) {
      console.error('[VideoLibrary] S3 error:', err);
      return { clips: [] };
    }
  }

  async transcribeAudio(
    filePath: string,
    mimetype: string,
    language?: string,
  ): Promise<TranscriptionResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return { text: '', segments: [] };

    try {
      const fd = new FormData();
      fd.append('file', fs.createReadStream(filePath), {
        filename: 'audio.wav',
        contentType: mimetype,
      });
      fd.append('model', 'whisper-1');
      fd.append('response_format', 'verbose_json');
      fd.append('timestamp_granularities[]', 'word');
      fd.append('timestamp_granularities[]', 'segment');
      // Providing the language upfront skips auto-detection and improves accuracy
      if (language) fd.append('language', language);

      const { data } = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        fd,
        {
          headers: { ...fd.getHeaders(), Authorization: `Bearer ${apiKey}` },
          maxBodyLength: 50 * 1024 * 1024,
        },
      );

      // Whisper returns word timestamps as a flat top-level array, NOT nested inside segments.
      type WhisperResponse = {
        text: string;
        words?: WordTimestamp[];
        segments?: { text: string; start: number; end: number }[];
      };
      const r = data as WhisperResponse;
      const allWords: WordTimestamp[] = r.words ?? [];
      console.log(
        `[transcribeAudio] segments=${r.segments?.length ?? 0} words=${allWords.length}`,
      );
      r.segments?.forEach((s, i) => {
        const segWords = allWords.filter(
          (w) => w.start >= s.start && w.start < s.end,
        );
        console.log(
          `  seg[${i}] start=${s.start.toFixed(2)} end=${s.end.toFixed(2)} words=${segWords.length} text="${s.text.trim()}"`,
        );
      });
      return {
        text: r.text ?? '',
        segments:
          r.segments?.map((s) => ({
            text: s.text,
            start: s.start,
            end: s.end,
            // Associate top-level word timestamps to this segment by time range
            words: allWords.filter(
              (w) => w.start >= s.start && w.start < s.end,
            ),
          })) ?? [],
      };
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error(
        '[transcribeAudio]',
        JSON.stringify(e?.response?.data ?? err),
      );
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

  async convertWebmToMp4(inputPath: string): Promise<string> {
    const outputPath = inputPath.replace(/\.[^.]+$/, '.mp4');
    await execFileAsync(
      'ffmpeg',
      [
        '-i',
        inputPath,
        '-c:v',
        'libx264',
        '-preset',
        'fast',
        '-c:a',
        'aac',
        '-movflags',
        '+faststart',
        '-y',
        outputPath,
      ],
      { timeout: 5 * 60 * 1000 },
    );
    return outputPath;
  }
}
