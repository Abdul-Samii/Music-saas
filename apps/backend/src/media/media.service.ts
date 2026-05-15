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
  constructor(private readonly prisma: PrismaService) {
    // Ensure upload directories exist on startup
    fs.mkdirSync('./uploads/audio', { recursive: true });
    fs.mkdirSync('./uploads/tmp', { recursive: true });
  }

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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return { text: '', segments: [] };

    // Groq Whisper limit is 25 MB
    const GROQ_MAX_BYTES = 25 * 1024 * 1024;
    const stat = fs.statSync(filePath);
    if (stat.size > GROQ_MAX_BYTES) {
      console.warn(
        `[transcribeAudio] file too large (${(stat.size / 1024 / 1024).toFixed(1)} MB > 25 MB limit), skipping`,
      );
      return { text: '', segments: [] };
    }

    // Use the real extension so Whisper picks the correct decoder.
    // Sending an MP3 named "audio.wav" causes complete parse failure.
    const extMap: Record<string, string> = {
      mp3: 'audio/mpeg',
      mp4: 'audio/mp4',
      m4a: 'audio/mp4',
      wav: 'audio/wav',
      webm: 'audio/webm',
      ogg: 'audio/ogg',
      flac: 'audio/flac',
      aac: 'audio/aac',
    };
    const ext = filePath.split('.').pop()?.toLowerCase() ?? 'mp3';
    const filename = `audio.${ext}`;
    const contentType = extMap[ext] ?? mimetype;

    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const fd = new FormData();
        fd.append('file', fs.createReadStream(filePath), {
          filename,
          contentType,
        });
        fd.append('model', 'whisper-large-v3');
        fd.append('response_format', 'verbose_json');
        fd.append('timestamp_granularities[]', 'word');
        fd.append('timestamp_granularities[]', 'segment');
        if (language) fd.append('language', language);

        type WhisperResponse = {
          text: string;
          words?: WordTimestamp[];
          segments?: { text: string; start: number; end: number }[];
        };
        const { data: r } = await axios.post<WhisperResponse>(
          'https://api.groq.com/openai/v1/audio/transcriptions',
          fd,
          {
            headers: { ...fd.getHeaders(), Authorization: `Bearer ${apiKey}` },
            maxBodyLength: Infinity,
            timeout: 120_000,
          },
        );
        const allWords: WordTimestamp[] = r.words ?? [];
        console.log(
          `[transcribeAudio] attempt=${attempt} segments=${r.segments?.length ?? 0} words=${allWords.length}`,
        );
        return {
          text: r.text ?? '',
          segments:
            r.segments?.map((s) => ({
              text: s.text,
              start: s.start,
              end: s.end,
              words: allWords.filter(
                (w) => w.start >= s.start && w.start < s.end,
              ),
            })) ?? [],
        };
      } catch (err: unknown) {
        type AxiosLike = {
          response?: { data?: unknown; status?: number };
          code?: string;
        };
        const e = err as AxiosLike;
        const status = e?.response?.status ?? 0;
        const isRetryable =
          e?.code === 'ECONNRESET' ||
          e?.code === 'ETIMEDOUT' ||
          e?.code === 'ECONNABORTED' ||
          status === 429 ||
          status >= 500;

        console.error(
          `[transcribeAudio] attempt=${attempt}/${MAX_RETRIES} status=${status}`,
          JSON.stringify(e?.response?.data ?? String(err)),
        );

        if (!isRetryable || attempt === MAX_RETRIES) {
          return { text: '', segments: [] };
        }
        // Exponential backoff: 1 s, 2 s, 4 s
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * 2 ** (attempt - 1)),
        );
      }
    }
    return { text: '', segments: [] };
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
