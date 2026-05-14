import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as path from 'path';
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

type SongInfo = { title: string; artist: string };

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async getVideoLibrary(): Promise<{ clips: VideoClip[] }> {
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
          const parts = key.replace(CLIPS_PREFIX, '').split('/');
          const style = parts.length > 1 ? parts[0] : 'General';
          const thumbKey = key.replace(/\.mp4$/i, '.jpg');
          return {
            id: `s3-${i}`,
            title: name
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            style,
            duration: 0,
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

  // ─── Song identification ────────────────────────────────────────────────────

  // Extracts a 20-second mono WAV sample using ffmpeg for ACRCloud fingerprinting.
  // ACRCloud requires < 1 MB — 20s at 8 kHz mono WAV is ~320 KB.
  private async extractAudioSample(filePath: string): Promise<Buffer> {
    const samplePath = path.join(os.tmpdir(), `acr-sample-${Date.now()}.wav`);
    try {
      await execFileAsync(
        'ffmpeg',
        [
          '-i',
          filePath,
          '-t',
          '20',
          '-ar',
          '8000',
          '-ac',
          '1',
          '-f',
          'wav',
          '-y',
          samplePath,
        ],
        { timeout: 30_000 },
      );
      const buf = fs.readFileSync(samplePath);
      return buf;
    } finally {
      fs.unlink(samplePath, () => {});
    }
  }

  private async identifySong(filePath: string): Promise<SongInfo | null> {
    const host = process.env.ACRCLOUD_HOST;
    const accessKey = process.env.ACRCLOUD_ACCESS_KEY;
    const secretKey = process.env.ACRCLOUD_SECRET_KEY;

    if (!host || !accessKey || !secretKey) {
      console.log('[identifySong] ACRCloud env vars not set — skipping');
      return null;
    }

    try {
      const sample = await this.extractAudioSample(filePath);

      const httpMethod = 'POST';
      const httpUri = '/v1/identify';
      const dataType = 'audio';
      const signatureVersion = '1';
      const timestamp = Math.floor(Date.now() / 1000).toString();

      const stringToSign = [
        httpMethod,
        httpUri,
        accessKey,
        dataType,
        signatureVersion,
        timestamp,
      ].join('\n');

      const signature = crypto
        .createHmac('sha1', secretKey)
        .update(Buffer.from(stringToSign, 'utf-8'))
        .digest('base64');

      const fd = new FormData();
      fd.append('sample', sample, {
        filename: 'sample.wav',
        contentType: 'audio/wav',
      });
      fd.append('sample_bytes', sample.length.toString());
      fd.append('access_key', accessKey);
      fd.append('data_type', dataType);
      fd.append('signature_version', signatureVersion);
      fd.append('signature', signature);
      fd.append('timestamp', timestamp);

      const { data } = await axios.post(`https://${host}/v1/identify`, fd, {
        headers: fd.getHeaders(),
        timeout: 15_000,
      });

      if (data?.status?.code === 0 && data?.metadata?.music?.[0]) {
        const music = data.metadata.music[0];
        const result: SongInfo = {
          title: music.title as string,
          artist: (music.artists?.[0]?.name as string) ?? '',
        };
        console.log(
          `[identifySong] Recognized: "${result.title}" by "${result.artist}"`,
        );
        return result;
      }

      console.log(`[identifySong] Not recognized (code=${data?.status?.code})`);
      return null;
    } catch (err) {
      console.error('[identifySong] Error:', err);
      return null;
    }
  }

  // ─── Musixmatch lyrics ──────────────────────────────────────────────────────

  private async fetchMusixmatchLyrics(
    title: string,
    artist: string,
  ): Promise<string | null> {
    const apiKey = process.env.MUSIXMATCH_API_KEY;
    if (!apiKey) {
      console.log(
        '[fetchMusixmatchLyrics] MUSIXMATCH_API_KEY not set — skipping',
      );
      return null;
    }

    try {
      const searchResp = await axios.get(
        'https://api.musixmatch.com/ws/1.1/track.search',
        {
          params: {
            q_track: title,
            q_artist: artist,
            apikey: apiKey,
            s_track_rating: 'desc',
            page_size: 1,
            f_has_lyrics: 1,
          },
          timeout: 10_000,
        },
      );

      const trackList = searchResp.data?.message?.body?.track_list as
        | { track: { track_id: number } }[]
        | undefined;
      const trackId = trackList?.[0]?.track?.track_id;

      if (!trackId) {
        console.log('[fetchMusixmatchLyrics] Track not found');
        return null;
      }

      const lyricsResp = await axios.get(
        'https://api.musixmatch.com/ws/1.1/track.lyrics.get',
        {
          params: { track_id: trackId, apikey: apiKey },
          timeout: 10_000,
        },
      );

      const lyricsBody = lyricsResp.data?.message?.body?.lyrics?.lyrics_body as
        | string
        | undefined;

      if (!lyricsBody) return null;

      // Strip the Musixmatch commercial-use footer and trailing metadata
      const clean = lyricsBody
        .replace(/\*+[^*\n]*\*+[^\n]*/g, '')
        .replace(/\(\d{10,}\)/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      console.log(
        `[fetchMusixmatchLyrics] Got lyrics (${clean.split('\n').length} lines)`,
      );
      return clean;
    } catch (err) {
      console.error('[fetchMusixmatchLyrics] Error:', err);
      return null;
    }
  }

  // ─── OpenAI transcription (gpt-4o-transcribe with whisper-1 fallback) ────────

  private async callOpenAITranscription(
    model: string,
    filePath: string,
    mimetype: string,
    language?: string,
  ): Promise<TranscriptionResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return { text: '', segments: [] };

    const ext = filePath.split('.').pop() ?? 'mp3';
    const fd = new FormData();
    fd.append('file', fs.createReadStream(filePath), {
      filename: `audio.${ext}`,
      contentType: mimetype,
    });
    fd.append('model', model);
    fd.append('response_format', 'verbose_json');
    fd.append('timestamp_granularities[]', 'word');
    fd.append('timestamp_granularities[]', 'segment');
    if (language) fd.append('language', language);

    const { data } = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      fd,
      {
        headers: { ...fd.getHeaders(), Authorization: `Bearer ${apiKey}` },
        maxBodyLength: 50 * 1024 * 1024,
        timeout: 120_000,
      },
    );

    type OpenAITranscribeResponse = {
      text: string;
      words?: WordTimestamp[];
      segments?: { text: string; start: number; end: number }[];
    };

    const r = data as OpenAITranscribeResponse;
    const allWords: WordTimestamp[] = r.words ?? [];

    console.log(
      `[${model}] segments=${r.segments?.length ?? 0} words=${allWords.length}`,
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

  private async transcribeWithGpt4o(
    filePath: string,
    mimetype: string,
    language?: string,
  ): Promise<TranscriptionResult> {
    try {
      console.log('[transcribeWithGpt4o] Trying gpt-4o-transcribe...');
      return await this.callOpenAITranscription(
        'gpt-4o-transcribe',
        filePath,
        mimetype,
        language,
      );
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown; status?: number } };
      console.warn(
        '[transcribeWithGpt4o] gpt-4o-transcribe failed — falling back to whisper-1.',
        'Status:',
        e?.response?.status,
        'Error:',
        JSON.stringify(e?.response?.data ?? err),
      );
      return this.callOpenAITranscription(
        'whisper-1',
        filePath,
        mimetype,
        language,
      );
    }
  }

  // ─── LCS-based lyrics alignment ────────────────────────────────────────────

  // Aligns the correct Musixmatch lyrics text against the word-level timestamps
  // produced by gpt-4o-transcribe. This separates "what the words are" from
  // "when they occur", giving accurate word-sync even when the AI transcription
  // has minor recognition errors.
  private alignLyricsToTranscription(
    lyricsText: string,
    transcription: TranscriptionResult,
  ): TranscriptionResult {
    const lines = lyricsText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // Flatten all word timestamps from the transcription
    const allTsWords: WordTimestamp[] = transcription.segments.flatMap(
      (s) => s.words,
    );

    if (allTsWords.length === 0) {
      // No timestamps available — return lyrics as a single segment with no timing
      return {
        text: lyricsText,
        segments: lines.map((text) => ({ text, start: 0, end: 0, words: [] })),
      };
    }

    const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Build flat word list from lyrics preserving line membership
    type LyricsWord = { original: string; normalized: string; line: number };
    const lyricsWords: LyricsWord[] = [];
    lines.forEach((line, lineIdx) => {
      line.split(/\s+/).forEach((word) => {
        const n = norm(word);
        if (n)
          lyricsWords.push({ original: word, normalized: n, line: lineIdx });
      });
    });

    const tsNorm = allTsWords.map((w) => norm(w.word));

    // LCS dynamic programming
    const m = lyricsWords.length;
    const n = allTsWords.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () =>
      new Array<number>(n + 1).fill(0),
    );

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (lyricsWords[i - 1].normalized === tsNorm[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to find the alignment
    type AlignedEntry = { lyricsIdx: number; tsIdx: number | null };
    const aligned: AlignedEntry[] = [];
    let i = m;
    let j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && lyricsWords[i - 1].normalized === tsNorm[j - 1]) {
        aligned.unshift({ lyricsIdx: i - 1, tsIdx: j - 1 });
        i--;
        j--;
      } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
        aligned.unshift({ lyricsIdx: i - 1, tsIdx: null });
        i--;
      } else {
        j--;
      }
    }

    // Assign timestamps — matched words get exact times, unmatched are interpolated
    type TimedWord = WordTimestamp & { line: number };
    const timed: TimedWord[] = aligned.map((a) => {
      const lw = lyricsWords[a.lyricsIdx];
      if (a.tsIdx !== null) {
        const tw = allTsWords[a.tsIdx];
        return {
          word: lw.original,
          start: tw.start,
          end: tw.end,
          line: lw.line,
        };
      }
      return { word: lw.original, start: -1, end: -1, line: lw.line };
    });

    // Interpolate timestamps for unmatched words between their nearest matched neighbours
    for (let k = 0; k < timed.length; k++) {
      if (timed[k].start !== -1) continue;

      let prev = -1;
      let next = -1;
      for (let p = k - 1; p >= 0; p--) {
        if (timed[p].start !== -1) {
          prev = p;
          break;
        }
      }
      for (let q = k + 1; q < timed.length; q++) {
        if (timed[q].start !== -1) {
          next = q;
          break;
        }
      }

      if (prev !== -1 && next !== -1) {
        const gapStart = timed[prev].end;
        const gapEnd = timed[next].start;
        const steps = next - prev;
        const stepSize = (gapEnd - gapStart) / steps;
        timed[k].start = gapStart + stepSize * (k - prev);
        timed[k].end = timed[k].start + stepSize;
      } else if (prev !== -1) {
        timed[k].start = timed[prev].end;
        timed[k].end = timed[k].start + 0.3;
      } else if (next !== -1) {
        timed[k].start = Math.max(0, timed[next].start - 0.3);
        timed[k].end = timed[next].start;
      } else {
        timed[k].start = 0;
        timed[k].end = 0.3;
      }
    }

    // Group back into per-line segments
    const lineWordsMap = new Map<number, WordTimestamp[]>();
    timed.forEach(({ word, start, end, line }) => {
      if (!lineWordsMap.has(line)) lineWordsMap.set(line, []);
      lineWordsMap.get(line)!.push({ word, start, end });
    });

    const segments = lines
      .map((lineText, lineIdx) => {
        const words = lineWordsMap.get(lineIdx) ?? [];
        return {
          text: lineText,
          start: words[0]?.start ?? 0,
          end: words[words.length - 1]?.end ?? 0,
          words,
        };
      })
      .filter((s) => s.words.length > 0);

    const matchedCount = aligned.filter((a) => a.tsIdx !== null).length;
    const matchPct = Math.round(
      (matchedCount / Math.max(lyricsWords.length, 1)) * 100,
    );
    console.log(
      `[alignLyrics] ${matchedCount}/${lyricsWords.length} words matched (${matchPct}%)`,
    );

    return { text: lyricsText, segments };
  }

  // ─── Public transcription entry point ───────────────────────────────────────

  // Full pipeline:
  //   1. Identify song via ACRCloud fingerprinting
  //   2. Fetch correct lyrics from Musixmatch
  //   3. Get word-level timestamps via gpt-4o-transcribe
  //   4. LCS-align Musixmatch text to timestamps → accurate word sync
  //
  // Falls back to raw gpt-4o-transcribe output when song is not recognised
  // or lyrics cannot be fetched.
  async transcribeAudio(
    filePath: string,
    mimetype: string,
    language?: string,
  ): Promise<TranscriptionResult> {
    try {
      // Steps 1 & 3 run in parallel — identification and transcription are independent
      const [songInfo, transcription] = await Promise.all([
        this.identifySong(filePath),
        this.transcribeWithGpt4o(filePath, mimetype, language),
      ]);

      if (songInfo) {
        const lyricsText = await this.fetchMusixmatchLyrics(
          songInfo.title,
          songInfo.artist,
        );

        if (lyricsText) {
          console.log(
            '[transcribeAudio] Using Musixmatch lyrics + forced alignment',
          );
          return this.alignLyricsToTranscription(lyricsText, transcription);
        }
      }

      console.log('[transcribeAudio] Using raw gpt-4o-transcribe output');
      return transcription;
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
