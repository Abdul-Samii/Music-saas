import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { spawn } from 'child_process';
import axios from 'axios';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const W = 720;
const H = 1280;
const FPS = 24;
const FRAME_BYTES = W * H * 4; // RGBA bytes per frame

type WordTs = { word: string; start: number; end: number };
type LyricStyle = 'word-by-word' | 'spotlight' | 'echo' | 'pop' | 'glow' | 'tiktok';

export interface RenderVideoParams {
  audioUrl: string;
  videoClipUrl: string;
  trimStart: number;
  trimEnd: number;
  lines: string[];
  timestamps: (number | null)[];
  endTimestamps: (number | null)[];
  wordTimestamps: WordTs[][];
  config: {
    lyricStyle: LyricStyle;
    fontFamily: string;
    fontSize: 'sm' | 'md' | 'lg';
    textColor: string;
    highlightColor: string;
    textPosition: 'top' | 'center' | 'bottom';
    overlayOpacity: number;
    creativeName?: string;
  };
  authHeader?: Record<string, string>;
}

const FONT_FAMILIES = [
  { family: 'Varela Round',   weights: [400] },
  { family: 'Montserrat',     weights: [700, 800, 900] },
  { family: 'Bebas Neue',     weights: [400] },
  { family: 'Pacifico',       weights: [400] },
  { family: 'Orbitron',       weights: [700, 800] },
  { family: 'Dancing Script', weights: [700] },
  { family: 'Space Grotesk',  weights: [700, 800] },
  { family: 'Nunito',         weights: [300, 400, 700, 800] },
  { family: 'Quicksand',      weights: [300, 400, 700] },
];

@Injectable()
export class RenderVideoService implements OnModuleInit {
  private readonly logger = new Logger(RenderVideoService.name);
  private readonly fontsDir = path.join(process.cwd(), 'uploads', 'fonts');

  async onModuleInit() {
    fs.mkdirSync(this.fontsDir, { recursive: true });
    // Load fonts in the background so startup isn't blocked
    this.loadFonts().catch((e) => this.logger.warn(`Font load error: ${e.message}`));
  }

  private async loadFonts() {
    let registerFont: (p: string, opts: { family: string; weight?: string }) => void;
    try {
      const canvas = await import('canvas');
      registerFont = canvas.registerFont;
    } catch {
      this.logger.warn('node-canvas not installed — backend rendering unavailable');
      return;
    }

    for (const { family, weights } of FONT_FAMILIES) {
      for (const weight of weights) {
        const safeName = family.replace(/ /g, '-');
        const filePath = path.join(this.fontsDir, `${safeName}-${weight}.ttf`);
        if (!fs.existsSync(filePath)) {
          try { await this.downloadFont(family, weight, filePath); }
          catch (e) { this.logger.warn(`Font download skipped: ${family} ${weight} — ${e.message}`); }
        }
        if (fs.existsSync(filePath)) {
          try { registerFont(filePath, { family, weight: weight.toString() }); }
          catch (e) { this.logger.warn(`Font register failed: ${family} ${weight} — ${e.message}`); }
        }
      }
    }
    this.logger.log('Fonts ready');
  }

  private async downloadFont(family: string, weight: number, filePath: string) {
    // IE6 user-agent makes Google Fonts return TTF instead of WOFF2 (node-canvas needs TTF)
    const q = `family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
    const css = await axios.get<string>(`https://fonts.googleapis.com/css2?${q}`, {
      headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)' },
    });
    const match = css.data.match(/url\((['"]?)(https?:\/\/[^)'"]+\.ttf)\1\)/i);
    if (!match) throw new Error(`no TTF src in CSS for ${family} ${weight}`);
    const buf = await axios.get<ArrayBuffer>(match[2], { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, Buffer.from(buf.data));
    this.logger.log(`Font downloaded: ${family} ${weight}`);
  }

  // Returns the path to the rendered MP4 file — caller is responsible for cleanup
  async renderVideo(params: RenderVideoParams): Promise<string> {
    const { createCanvas } = await import('canvas');

    const {
      audioUrl, videoClipUrl, trimStart, trimEnd,
      lines, timestamps, endTimestamps, wordTimestamps,
      config, authHeader,
    } = params;
    const dur = trimEnd - trimStart;

    const tmpId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const tmpDir = path.join(process.cwd(), 'uploads', 'tmp', tmpId);
    fs.mkdirSync(tmpDir, { recursive: true });

    const videoPath = path.join(tmpDir, 'clip.mp4');
    const audioPath = path.join(tmpDir, 'audio');
    const outputPath = path.join(tmpDir, 'output.mp4');

    try {
      await Promise.all([
        this.fetchFile(videoClipUrl, videoPath, authHeader),
        this.fetchFile(audioUrl, audioPath, authHeader),
      ]);

      // ── Canvas setup ──────────────────────────────────────────────────────────
      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext('2d');
      const fsPx = config.fontSize === 'sm' ? 44 : config.fontSize === 'md' ? 56 : 72;
      const maxTextW = W - 80;

      // ── Pre-compute TikTok word chunks (same logic as frontend) ───────────────
      const allWords = lines.flatMap((l) => l.split(' ').filter(Boolean));
      const wordChunks: string[][] = [];
      let wci = 0;
      while (wci < allWords.length) {
        const chunk: string[] = [];
        let totalChars = 0;
        while (wci < allWords.length && chunk.length < 3) {
          const w = allWords[wci];
          if (chunk.length === 0) {
            chunk.push(w); totalChars += w.length; wci++;
            if (w.length > 10) break;
          } else {
            if (w.length > 10 || totalChars + w.length > 18) break;
            chunk.push(w); totalChars += w.length; wci++;
          }
        }
        if (chunk.length > 0) wordChunks.push(chunk);
      }

      const lineWordOffsets = lines.map((_, li2) =>
        lines.slice(0, li2).reduce((acc, l) => acc + l.split(' ').filter(Boolean).length, 0),
      );

      // Pre-compute TikTok layout metrics with the canvas context
      ctx.font = `700 52px 'Varela Round', sans-serif`;
      const tikPad = W * 0.10;
      const tikMaxW = W - tikPad * 2;
      const tkChunkWordWidths: number[][] = [];
      const tkChunkTotalW: number[] = [];
      const tkChunkGaps: number[] = [];
      const tkChunkStarts: number[] = [];
      const tkWordToChunk: number[] = [];
      let tkAcc = 0;
      for (let ci = 0; ci < wordChunks.length; ci++) {
        const chunk = wordChunks[ci];
        const widths = chunk.map((w) => ctx.measureText(w).width);
        const totalW = widths.reduce((a, b) => a + b, 0);
        tkChunkWordWidths.push(widths);
        tkChunkTotalW.push(totalW);
        tkChunkGaps.push(chunk.length > 1 ? (tikMaxW - totalW) / (chunk.length - 1) : 0);
        tkChunkStarts.push(tkAcc);
        for (let wi = 0; wi < chunk.length; wi++) tkWordToChunk.push(ci);
        tkAcc += chunk.length;
      }

      // ── Timing helpers (exact port from frontend drawLyrics) ──────────────────
      const lineAt = (t: number): number => {
        let active = -1;
        for (let i = 0; i < timestamps.length; i++) {
          const start = timestamps[i];
          if (start === null) continue;
          const lineWts = wordTimestamps?.[i];
          const effectiveStart = (lineWts?.length) ? lineWts[0].start : start;
          if (t >= effectiveStart) {
            const lastWordEnd = lineWts?.length ? lineWts[lineWts.length - 1].end : undefined;
            const end = endTimestamps[i] ?? lastWordEnd ?? timestamps[i + 1] ?? null;
            if (end === null || t < end) active = i;
          }
        }
        return active;
      };

      const interpolatedWordIdx = (li: number, t: number): number => {
        const lineStart = timestamps[li] ?? t;
        const nextStart = timestamps.slice(li + 1).find((ts) => ts !== null) ?? null;
        const lineEnd = endTimestamps[li] ?? nextStart ?? trimEnd;
        const words = lines[li]?.split(' ').filter(Boolean) ?? [];
        if (!words.length) return 0;
        return Math.min(
          Math.floor(((t - lineStart) / Math.max(0.01, lineEnd - lineStart)) * words.length),
          words.length - 1,
        );
      };

      const globalWordAt = (t: number): number => {
        const hasWordTs = wordTimestamps?.some((wts) => wts?.length);
        if (hasWordTs) {
          let best = -1;
          for (let li2 = 0; li2 < lines.length; li2++) {
            const wts = wordTimestamps?.[li2] ?? [];
            for (let wi = 0; wi < wts.length; wi++) {
              if (wts[wi]?.start <= t) best = lineWordOffsets[li2] + wi;
              else break;
            }
          }
          return best;
        }
        const li = lineAt(t);
        if (li < 0) return -1;
        return lineWordOffsets[li] + interpolatedWordIdx(li, t);
      };

      const wordAt = (li: number, t: number): number => {
        const wts = wordTimestamps?.[li] ?? [];
        if (wts.length) {
          let w = -1;
          for (let wi = 0; wi < wts.length; wi++) {
            if (wts[wi]?.start <= t) w = wi; else break;
          }
          return w;
        }
        return interpolatedWordIdx(li, t);
      };

      const wrapText = (text: string, mW: number): string[] => {
        const words = text.split(' ');
        const wrapped: string[] = [];
        let cur = '';
        for (const word of words) {
          const test = cur ? `${cur} ${word}` : word;
          if (ctx.measureText(test).width > mW && cur) { wrapped.push(cur); cur = word; }
          else cur = test;
        }
        if (cur) wrapped.push(cur);
        return wrapped;
      };

      // ── drawLyrics: exact port of the frontend canvas rendering ───────────────
      const drawLyrics = (t: number) => {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;

        if (config.lyricStyle === 'tiktok') {
          const gwi = globalWordAt(t);
          if (gwi < 0) return;
          const clampedGwi = Math.min(gwi, tkWordToChunk.length - 1);
          const currentChunk = tkWordToChunk[clampedGwi] ?? (wordChunks.length - 1);
          const page = Math.floor(currentChunk / 2);
          const pageStart = page * 2;
          const posInPage = currentChunk - pageStart;
          const visibleCount = posInPage + 1;
          ctx.font = `700 52px 'Varela Round', sans-serif`;
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 0;
          const lh = 108;
          const totalH = visibleCount * lh;
          const yStart = H / 2 - totalH / 2;
          for (let relIdx = 0; relIdx < visibleCount; relIdx++) {
            const absChunkIdx = pageStart + relIdx;
            if (absChunkIdx >= wordChunks.length) break;
            const chunk = wordChunks[absChunkIdx];
            const chunkGlobalStart = tkChunkStarts[absChunkIdx];
            const wordWidths = tkChunkWordWidths[absChunkIdx];
            const gap = tkChunkGaps[absChunkIdx];
            const y = yStart + relIdx * lh + lh / 2;
            let x = tikPad;
            for (let wi = 0; wi < chunk.length; wi++) {
              if (chunkGlobalStart + wi <= gwi) {
                ctx.textAlign = 'left';
                ctx.fillText(chunk[wi], x, y);
              }
              x += wordWidths[wi] + gap;
            }
            ctx.textAlign = 'center';
          }
          ctx.textAlign = 'center';
          return;
        }

        const li = lineAt(t);
        if (li < 0 || li >= lines.length) return;
        const line = lines[li] ?? '';
        const yBase = config.textPosition === 'top' ? H * 0.14 : config.textPosition === 'center' ? H * 0.5 : H * 0.80;

        if (config.lyricStyle === 'spotlight') {
          const gwi = globalWordAt(t);
          if (gwi < 0) { ctx.shadowBlur = 0; return; }
          const flat = lines.flatMap((l) => l.split(' ').filter(Boolean));
          const word = flat[Math.min(gwi, flat.length - 1)] ?? '';
          const isHighlighted = gwi % 3 === 0 || gwi % 7 === 4;
          const spotFsPx = Math.round(fsPx * 1.7);
          ctx.font = `900 ${spotFsPx}px ${config.fontFamily}`;
          ctx.fillStyle = isHighlighted ? config.highlightColor : config.textColor;
          ctx.shadowColor = isHighlighted ? config.highlightColor : 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = isHighlighted ? 28 : 14;
          ctx.fillText(word, W / 2, yBase);

        } else if (config.lyricStyle === 'word-by-word') {
          const words = line.split(' ').filter(Boolean);
          const activeWi = wordAt(li, t);
          if (activeWi < 0) return;
          ctx.font = `800 ${fsPx}px ${config.fontFamily}`;
          const rows: { word: string; wi: number }[][] = [];
          let row: { word: string; wi: number }[] = [];
          let rowW = 0;
          words.forEach((word, wi) => {
            const ww = ctx.measureText(word + ' ').width;
            if (rowW + ww > maxTextW && row.length) { rows.push(row); row = []; rowW = 0; }
            row.push({ word, wi }); rowW += ww;
          });
          if (row.length) rows.push(row);
          const lh = fsPx * 1.35;
          rows.forEach((r, ri) => {
            const rowTotalW = ctx.measureText(r.map((x) => x.word).join(' ')).width;
            let x = W / 2 - rowTotalW / 2;
            const y = yBase + (ri - rows.length / 2 + 0.5) * lh;
            r.forEach(({ word, wi }, rWi) => {
              const active = wi === activeWi;
              ctx.fillStyle = active ? config.highlightColor : config.textColor;
              ctx.shadowColor = active ? config.highlightColor : 'rgba(0,0,0,0.8)';
              ctx.shadowBlur = active ? 16 : 8;
              ctx.textAlign = 'left';
              const label = word + (rWi < r.length - 1 ? ' ' : '');
              ctx.fillText(label, x, y);
              x += ctx.measureText(label).width;
            });
            ctx.textAlign = 'center';
          });

        } else if (config.lyricStyle === 'echo') {
          ctx.font = `800 ${fsPx}px ${config.fontFamily}`;
          ctx.fillStyle = config.textColor;
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 10;
          const wrapped = wrapText(line, maxTextW);
          const lh = fsPx * 1.35;
          wrapped.forEach((l, i) => ctx.fillText(l, W / 2, yBase + (i - wrapped.length / 2 + 0.5) * lh));
          const lastRowY = yBase + ((wrapped.length - 1) - wrapped.length / 2 + 0.5) * lh;
          const pivotY = lastRowY + fsPx * 0.15;
          ctx.save();
          ctx.globalAlpha = 0.25;
          ctx.shadowBlur = 0;
          ctx.font = `800 ${Math.round(fsPx * 0.85)}px ${config.fontFamily}`;
          ctx.transform(1, 0, 0, -1, 0, 2 * pivotY);
          wrapped.forEach((l, i) => ctx.fillText(l, W / 2, yBase + (i - wrapped.length / 2 + 0.5) * lh));
          ctx.restore();

        } else if (config.lyricStyle === 'glow') {
          ctx.font = `800 ${fsPx}px ${config.fontFamily}`;
          ctx.fillStyle = config.textColor;
          ctx.shadowColor = config.textColor;
          ctx.shadowBlur = 22;
          const wrapped = wrapText(line, maxTextW);
          const lh = fsPx * 1.35;
          // Draw twice to intensify the glow — matches the CSS drop-shadow preview
          wrapped.forEach((l, i) => ctx.fillText(l, W / 2, yBase + (i - wrapped.length / 2 + 0.5) * lh));
          wrapped.forEach((l, i) => ctx.fillText(l, W / 2, yBase + (i - wrapped.length / 2 + 0.5) * lh));

        } else {
          // pop / default
          ctx.font = `800 ${fsPx}px ${config.fontFamily}`;
          ctx.fillStyle = config.textColor;
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 10;
          const wrapped = wrapText(line, maxTextW);
          const lh = fsPx * 1.35;
          wrapped.forEach((l, i) => ctx.fillText(l, W / 2, yBase + (i - wrapped.length / 2 + 0.5) * lh));
        }
        ctx.shadowBlur = 0;
      };

      // ── FFmpeg pipeline: decode → canvas render → encode ─────────────────────
      await this.runPipeline({ videoPath, audioPath, trimStart, dur, outputPath, canvas, ctx, drawLyrics, overlayOpacity: config.overlayOpacity });

      return outputPath;
    } catch (err) {
      fs.rm(tmpDir, { recursive: true }, () => {});
      throw err;
    }
  }

  private runPipeline(opts: {
    videoPath: string; audioPath: string; trimStart: number; dur: number;
    outputPath: string; canvas: any; ctx: any; drawLyrics: (t: number) => void; overlayOpacity: number;
  }): Promise<void> {
    const { videoPath, audioPath, trimStart, dur, outputPath, canvas, ctx, drawLyrics, overlayOpacity } = opts;

    return new Promise((resolve, reject) => {
      // Decode: loop background clip, scale+crop to 720x1280, emit raw RGBA
      const decode = spawn('ffmpeg', [
        '-stream_loop', '-1',
        '-i', videoPath,
        '-t', dur.toFixed(3),
        '-vf', 'fps=24,scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280',
        '-f', 'rawvideo', '-pix_fmt', 'rgba',
        'pipe:1',
      ]);

      // Encode: BGRA raw frames + trimmed audio → H.264/AAC MP4
      const encode = spawn('ffmpeg', [
        '-y',
        '-f', 'rawvideo', '-pix_fmt', 'bgra', '-s', `${W}x${H}`, '-r', '24',
        '-i', 'pipe:0',
        '-ss', trimStart.toFixed(3), '-i', audioPath,
        '-t', dur.toFixed(3),
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
        '-c:a', 'aac', '-b:a', '128k',
        '-movflags', '+faststart',
        outputPath,
      ]);

      let frameIndex = 0;
      let inputBuf = Buffer.alloc(0);
      let encodeLog = '';

      decode.stdout.on('data', (chunk: Buffer) => {
        inputBuf = Buffer.concat([inputBuf, chunk]);
        while (inputBuf.length >= FRAME_BYTES) {
          const frame = inputBuf.slice(0, FRAME_BYTES);
          inputBuf = inputBuf.slice(FRAME_BYTES);

          // Draw background video frame via ImageData (RGBA → canvas)
          const imgData = ctx.createImageData(W, H);
          imgData.data.set(frame);
          ctx.putImageData(imgData, 0, 0);

          // Dark overlay
          ctx.fillStyle = `rgba(0,0,0,${overlayOpacity})`;
          ctx.fillRect(0, 0, W, H);

          // Lyrics (identical drawing code to the browser)
          drawLyrics(trimStart + frameIndex / FPS);

          // Write BGRA output to encoder (node-canvas toBuffer('raw') = BGRA on little-endian)
          encode.stdin.write(canvas.toBuffer('raw'));
          frameIndex++;
        }
      });

      decode.stdout.on('end', () => encode.stdin.end());
      decode.stderr.on('data', () => {}); // suppress ffmpeg progress logs

      encode.stderr.on('data', (d: Buffer) => { encodeLog += d.toString(); });
      encode.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`FFmpeg encode exited ${code}: ${encodeLog.slice(-400)}`));
      });

      decode.on('error', reject);
      encode.on('error', reject);
    });
  }

  private async fetchFile(urlOrPath: string, dest: string, _headers?: Record<string, string>) {
    this.logger.debug(`fetchFile: ${urlOrPath} → ${dest}`);

    // Local path (e.g. /uploads/audio/...) — copy directly, no HTTP overhead
    if (!urlOrPath.startsWith('http')) {
      fs.copyFileSync(path.join(process.cwd(), urlOrPath), dest);
      return;
    }

    // S3 URL — use AWS SDK so credentials, signing, and region are handled automatically
    if (urlOrPath.includes('amazonaws.com')) {
      const u = new URL(urlOrPath);
      // Virtual-hosted-style: bucket.s3.region.amazonaws.com/key  OR  s3.region.amazonaws.com/bucket/key
      const key = decodeURIComponent(u.pathname.slice(1)); // strip leading /
      const bucket = process.env.S3_BUCKET_NAME ?? 'escaliumio';
      const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const body = obj.Body as NodeJS.ReadableStream;
      await pipeline(body, fs.createWriteStream(dest));
      return;
    }

    // Generic HTTP URL
    const resp = await axios.get<NodeJS.ReadableStream>(urlOrPath, { responseType: 'stream' });
    await pipeline(resp.data as unknown as NodeJS.ReadableStream, fs.createWriteStream(dest));
  }
}
