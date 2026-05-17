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
    fs.mkdirSync('./uploads/audio', { recursive: true });
    fs.mkdirSync('./uploads/tmp', { recursive: true });
    fs.mkdirSync('./uploads/user-videos', { recursive: true });
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

  private isWhisperHallucination(text: string): boolean {
    const t = text.trim();
    if (!t) return true;
    // Whisper emits these when it hears music but no decodable speech
    const patterns = [
      /^[\s\p{Emoji_Presentation}\p{Extended_Pictographic}♪♫🎵🎶]+$/u,
      /^\[?music\s*(playing)?\]?$/i,
      /^\[?background\s*music\]?$/i,
      /^\[?instrumental\]?$/i,
      /^\[?no\s*speech\]?$/i,
      /^\[?silence\]?$/i,
      /^\[?applause\]?$/i,
    ];
    return patterns.some((p) => p.test(t));
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
        const text = r.text ?? '';
        console.log(
          `[transcribeAudio] attempt=${attempt} segments=${r.segments?.length ?? 0} words=${allWords.length} text="${text.slice(0, 80)}"`,
        );

        if (this.isWhisperHallucination(text)) {
          console.warn(
            `[transcribeAudio] hallucination detected, returning empty`,
          );
          return { text: '', segments: [] };
        }

        return {
          text,
          segments:
            r.segments
              ?.filter((s) => !this.isWhisperHallucination(s.text))
              .map((s) => ({
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
        'ultrafast',
        '-crf',
        '23',
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-movflags',
        '+faststart',
        '-y',
        outputPath,
      ],
      { timeout: 5 * 60 * 1000 },
    );
    return outputPath;
  }

  private async downloadToTemp(url: string, ext: string): Promise<string> {
    const tmpPath = `./uploads/tmp/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const response = await axios.get<NodeJS.ReadableStream>(url, {
      responseType: 'stream',
      timeout: 120_000,
    });
    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(tmpPath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    return tmpPath;
  }

  async getVideoDurationSec(filePath: string): Promise<number> {
    try {
      const { stdout } = await execFileAsync('ffprobe', [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        filePath,
      ]);
      return parseFloat(stdout.trim()) || 0;
    } catch {
      return 0;
    }
  }

  private escapeDrawtext(text: string): string {
    return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/%/g, '%%');
  }

  async renderVideoServer(params: {
    videoClipUrl: string;
    audioPath: string;
    trimStart: number;
    trimEnd: number;
    lyrics: { text: string; time: number }[];
    textColor: string;
    overlayOpacity: number;
    textPosition: 'top' | 'center' | 'bottom';
    fontSize: 'sm' | 'md' | 'lg';
  }): Promise<string> {
    const {
      videoClipUrl,
      audioPath,
      trimStart,
      trimEnd,
      lyrics,
      textColor,
      overlayOpacity,
      textPosition,
      fontSize,
    } = params;
    const duration = trimEnd - trimStart;
    const outputPath = `./uploads/tmp/${Date.now()}-render.mp4`;

    // Resolve video: local uploads use path directly, S3 URLs are downloaded
    let videoPath: string;
    let tempVideo = false;
    if (videoClipUrl.startsWith('/uploads/')) {
      videoPath = '.' + videoClipUrl;
    } else {
      const rawExt = (
        videoClipUrl.split('?')[0].split('.').pop() ?? 'mp4'
      ).toLowerCase();
      const ext = ['mp4', 'webm', 'mov', 'avi'].includes(rawExt)
        ? rawExt
        : 'mp4';
      videoPath = await this.downloadToTemp(videoClipUrl, ext);
      tempVideo = true;
    }

    try {
      const fsPx = fontSize === 'sm' ? 44 : fontSize === 'md' ? 56 : 72;
      const yFrac =
        textPosition === 'top'
          ? '0.15'
          : textPosition === 'center'
            ? '0.50'
            : '0.82';

      const drawtexts: string[] = [];
      for (let i = 0; i < lyrics.length; i++) {
        const line = lyrics[i];
        if (line.time == null) continue;
        const vStart = Math.max(0, line.time - trimStart);
        const nextTime = lyrics[i + 1]?.time;
        const vEnd =
          nextTime != null ? Math.max(0, nextTime - trimStart) : duration;
        if (vStart >= duration) continue;
        const escaped = this.escapeDrawtext(line.text.trim());
        if (!escaped) continue;
        const enableStart = vStart.toFixed(3);
        const enableEnd = Math.min(vEnd, duration).toFixed(3);
        drawtexts.push(
          `drawtext=text='${escaped}'` +
            `:fontsize=${fsPx}` +
            `:fontcolor=${textColor}` +
            `:x=(w-text_w)/2` +
            `:y=h*${yFrac}-text_h/2` +
            `:shadowx=2:shadowy=2:shadowcolor=black@0.8` +
            `:enable='(t>=${enableStart})*(t<=${enableEnd})'`,
        );
      }

      const filterParts: string[] = [
        'scale=720:1280:force_original_aspect_ratio=decrease',
        'pad=720:1280:(ow-iw)/2:(oh-ih)/2:black',
        `drawbox=x=0:y=0:w=iw:h=ih:color=black@${overlayOpacity.toFixed(2)}:t=fill`,
        ...drawtexts,
      ];

      await execFileAsync(
        'ffmpeg',
        [
          '-stream_loop',
          '-1',
          '-i',
          videoPath,
          '-ss',
          String(trimStart),
          '-t',
          String(duration),
          '-i',
          audioPath,
          '-vf',
          filterParts.join(','),
          '-map',
          '0:v',
          '-map',
          '1:a',
          '-shortest',
          '-c:v',
          'libx264',
          '-preset',
          'ultrafast',
          '-crf',
          '23',
          '-c:a',
          'aac',
          '-b:a',
          '128k',
          '-movflags',
          '+faststart',
          '-y',
          outputPath,
        ],
        { timeout: 10 * 60 * 1000 },
      );

      return outputPath;
    } finally {
      if (tempVideo) fs.unlink(videoPath, () => {});
    }
  }
}
