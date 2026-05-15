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

  private async getChannelCount(filePath: string): Promise<number> {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v',
      'error',
      '-select_streams',
      'a:0',
      '-show_entries',
      'stream=channels',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      filePath,
    ]);
    return parseInt(stdout.trim(), 10) || 1;
  }

  // Prepares audio for Whisper: isolates vocals from stereo files via center
  // channel extraction, then applies frequency filtering and normalization.
  // Mono files skip center extraction (no side channels to subtract) and go
  // straight to filtering — avoids near-silence that causes Whisper hallucinations.
  private async extractVocals(filePath: string): Promise<string> {
    const outPath = filePath.replace(/\.[^.]+$/, '.vocals.mp3');
    const channels = await this.getChannelCount(filePath);
    const isStereo = channels >= 2;

    const filters = [
      ...(isStereo
        ? ['pan=mono|c0=0.5*c0+0.5*c1']
        : ['aformat=channel_layouts=mono']),
      'highpass=f=150',
      'lowpass=f=8000',
      'dynaudnorm',
    ];

    await execFileAsync(
      'ffmpeg',
      ['-i', filePath, '-af', filters.join(','), '-ar', '16000', '-y', outPath],
      { timeout: 60_000 },
    );
    console.log(
      `[extractVocals] ${isStereo ? 'stereo→center' : 'mono'} → ${outPath}`,
    );
    return outPath;
  }

  private isHallucination(text: string, wordCount: number): boolean {
    const hallucinations = [
      'music playing',
      'thank you',
      'subtitles by',
      'transcribed by',
    ];
    const normalized = text.toLowerCase();
    return wordCount <= 8 && hallucinations.some((h) => normalized.includes(h));
  }

  private async callGroq(
    audioPath: string,
    language?: string,
  ): Promise<TranscriptionResult> {
    const apiKey = process.env.GROQ_API_KEY!;
    const fd = new FormData();
    fd.append('file', fs.createReadStream(audioPath), {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg',
    });
    fd.append('model', 'whisper-large-v3');
    fd.append('response_format', 'verbose_json');
    fd.append('timestamp_granularities[]', 'word');
    fd.append('timestamp_granularities[]', 'segment');
    if (language) fd.append('language', language);

    const { data } = await axios.post(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      fd,
      {
        headers: { ...fd.getHeaders(), Authorization: `Bearer ${apiKey}` },
        maxBodyLength: 50 * 1024 * 1024,
      },
    );

    type WhisperResponse = {
      text: string;
      words?: WordTimestamp[];
      segments?: { text: string; start: number; end: number }[];
    };
    const r = data as WhisperResponse;
    const allWords: WordTimestamp[] = r.words ?? [];
    console.log(
      `[groq] segments=${r.segments?.length ?? 0} words=${allWords.length}`,
    );
    return {
      text: r.text ?? '',
      segments:
        r.segments?.map((s) => ({
          text: s.text,
          start: s.start,
          end: s.end,
          words: allWords.filter((w) => w.start >= s.start && w.start < s.end),
        })) ?? [],
    };
  }

  async transcribeAudio(
    filePath: string,
    _mimetype: string,
    language?: string,
  ): Promise<TranscriptionResult> {
    if (!process.env.GROQ_API_KEY) return { text: '', segments: [] };

    let vocalsPath: string | null = null;
    try {
      vocalsPath = await this.extractVocals(filePath);
      const result = await this.callGroq(vocalsPath, language);

      const wordCount = result.segments.reduce((n, s) => n + s.words.length, 0);
      if (this.isHallucination(result.text, wordCount)) {
        console.warn(
          '[transcribeAudio] Hallucination detected — retrying with raw audio',
        );
        return await this.callGroq(filePath, language);
      }

      return result;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error(
        '[transcribeAudio]',
        JSON.stringify(e?.response?.data ?? err),
      );
      return { text: '', segments: [] };
    } finally {
      if (vocalsPath) fs.unlink(vocalsPath, () => {});
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
