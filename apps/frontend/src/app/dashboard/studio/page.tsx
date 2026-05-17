"use client";
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, type CSSProperties } from "react";
import { getSession } from "next-auth/react";
import { creativeApi } from "@/lib/api";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";
const MAX_TRIM = 60;
const STEP_LABELS = ["Audio", "Lyrics", "Sync", "Style", "Render"] as const;

const TEXT_COLORS = [
  { label: "White",  hex: "#FFFFFF" },
  { label: "Yellow", hex: "#FACC15" },
  { label: "Cyan",   hex: "#22D3EE" },
  { label: "Pink",   hex: "#F472B6" },
  { label: "Green",  hex: "#4ADE80" },
];

interface VideoClip {
  id: string;
  title: string;
  style: string;
  duration: number;
  url: string;
  thumbnail: string;
}

type LyricStyle = "word-by-word" | "spotlight" | "echo" | "pop" | "glow" | "tiktok";

interface ClipConfig {
  creativeName: string;
  textColor: string;
  highlightColor: string;
  textPosition: "top" | "center" | "bottom";
  fontSize: "sm" | "md" | "lg";
  overlayOpacity: number;
  lyricStyle: LyricStyle;
  fontFamily: string;
}

const DEFAULT_CONFIG: ClipConfig = {
  creativeName: "",
  textColor: "#FFFFFF",
  highlightColor: "#FACC15",
  textPosition: "bottom",
  fontSize: "md",
  overlayOpacity: 0.4,
  lyricStyle: "word-by-word",
  fontFamily: "'Bebas Neue', sans-serif",
};

const LYRIC_STYLES: { id: LyricStyle; label: string; desc: string; icon: string }[] = [
  { id: "tiktok",       label: "TikTok Reveal", desc: "3 words per row, appear as sung",   icon: "🎵" },
  { id: "word-by-word", label: "Word by Word",  desc: "Sentence builds word by word",      icon: "✍️" },
  { id: "spotlight",    label: "Spotlight",     desc: "One big word at a time, highlighted", icon: "🔦" },
  { id: "echo",         label: "Echo",          desc: "Double-line ghost effect",           icon: "〰️" },
  { id: "pop",          label: "Pop",           desc: "Elastic scale pop",                  icon: "💥" },
  { id: "glow",         label: "Glow",          desc: "Blurs in with glow",                 icon: "🌟" },
];

const FONTS: { label: string; value: string; preview: string }[] = [
  { label: "Bebas Neue",     value: "'Bebas Neue', sans-serif",    preview: "BEBAS" },
  { label: "Montserrat",     value: "'Montserrat', sans-serif",    preview: "Montserrat" },
  { label: "Pacifico",       value: "'Pacifico', cursive",         preview: "Pacifico" },
  { label: "Orbitron",       value: "'Orbitron', sans-serif",      preview: "ORBIT" },
  { label: "Dancing Script", value: "'Dancing Script', cursive",   preview: "Dancing" },
  { label: "Space Grotesk",  value: "'Space Grotesk', sans-serif", preview: "Grotesk" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow",  hex: "#FACC15" },
  { label: "Cyan",    hex: "#22D3EE" },
  { label: "Pink",    hex: "#F472B6" },
  { label: "Orange",  hex: "#FB923C" },
  { label: "Lime",    hex: "#A3E635" },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}.${String(Math.floor((s % 1) * 10))}`;
}

function fmtShort(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

// ── Waveform canvas ────────────────────────────────────────────────────────────
function WaveformCanvas({
  audioBuffer,
  duration,
  trimStart,
  trimEnd,
  currentTime,
  onSeek,
  onTrimChange,
}: {
  audioBuffer: AudioBuffer;
  duration: number;
  trimStart: number;
  trimEnd: number;
  currentTime: number;
  onSeek: (t: number) => void;
  onTrimChange: (start: number, end: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<"start" | "end" | "seek" | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !audioBuffer) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = container.offsetWidth * dpr;
    const H = container.offsetHeight * dpr;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }

    ctx.clearRect(0, 0, W, H);

    const data = audioBuffer.getChannelData(0);
    const samplesPerPx = Math.ceil(data.length / W);

    for (let i = 0; i < W; i++) {
      let peak = 0;
      for (let j = 0; j < samplesPerPx; j++) {
        const v = Math.abs(data[i * samplesPerPx + j] || 0);
        if (v > peak) peak = v;
      }
      const barH = Math.max(2 * dpr, peak * H * 0.82);
      const timeAtX = (i / W) * duration;
      const inTrim = timeAtX >= trimStart && timeAtX <= trimEnd;
      ctx.fillStyle = inTrim
        ? `rgba(58,96,231,${0.45 + peak * 0.55})`
        : "rgba(58,96,231,0.12)";
      ctx.fillRect(i, (H - barH) / 2, 1, barH);
    }

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    const sx = (trimStart / duration) * W;
    const ex = (trimEnd / duration) * W;
    ctx.fillRect(0, 0, sx, H);
    ctx.fillRect(ex, 0, W - ex, H);

    const hw = 3 * dpr;
    ctx.fillStyle = BLUE;
    ctx.fillRect(sx - hw / 2, 0, hw, H);
    ctx.fillRect(ex - hw / 2, 0, hw, H);

    const knobR = 6 * dpr;
    ctx.beginPath();
    ctx.arc(sx, H / 2, knobR, 0, Math.PI * 2);
    ctx.fillStyle = BLUE;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex, H / 2, knobR, 0, Math.PI * 2);
    ctx.fill();

    const px = (currentTime / duration) * W;
    ctx.fillStyle = "#F43F5E";
    ctx.fillRect(px - dpr, 0, 2 * dpr, H);
    ctx.beginPath();
    ctx.moveTo(px - 4 * dpr, 0);
    ctx.lineTo(px + 4 * dpr, 0);
    ctx.lineTo(px, 6 * dpr);
    ctx.fillStyle = "#F43F5E";
    ctx.fill();
  }, [audioBuffer, duration, trimStart, trimEnd, currentTime]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    const ro = new ResizeObserver(() => draw());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [draw]);

  function clientToTime(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, Math.min((clientX - rect.left) / rect.width, 1)) * duration;
  }

  function startDrag(clientX: number, isTouch = false) {
    const t = clientToTime(clientX);
    // Larger grab threshold on touch so fingers can hit the handles
    const threshold = duration * (isTouch ? 0.06 : 0.025);
    const dStart = Math.abs(t - trimStart);
    const dEnd = Math.abs(t - trimEnd);
    if (dStart < threshold && dStart <= dEnd) {
      dragRef.current = "start";
    } else if (dEnd < threshold) {
      dragRef.current = "end";
    } else {
      dragRef.current = "seek";
      onSeek(Math.max(trimStart, Math.min(t, trimEnd)));
    }
  }

  function onMouseDown(e: React.MouseEvent) { startDrag(e.clientX, false); }

  function onTouchStart(e: React.TouchEvent) {
    e.preventDefault();
    if (e.touches.length > 0) startDrag(e.touches[0].clientX, true);
  }

  useEffect(() => {
    function handleMove(clientX: number) {
      if (!dragRef.current) return;
      const t = clientToTime(clientX);
      if (dragRef.current === "start") {
        onTrimChange(Math.max(0, Math.min(t, trimEnd - 1)), trimEnd);
      } else if (dragRef.current === "end") {
        onTrimChange(trimStart, Math.min(duration, Math.max(t, trimStart + 1), trimStart + MAX_TRIM));
      } else {
        onSeek(Math.max(trimStart, Math.min(t, trimEnd)));
      }
    }
    function onMove(e: MouseEvent) { handleMove(e.clientX); }
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    }
    function onUp() { dragRef.current = null; }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, trimStart, trimEnd, onSeek, onTrimChange]);

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ position: "relative", width: "100%", height: 96, cursor: "crosshair", userSelect: "none", touchAction: "none" }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

// ── Video card with hover preview ────────────────────────────────────────────
function VideoCard({ clip, selected, onSelect }: { clip: VideoClip; selected: boolean; onSelect: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [thumbReady, setThumbReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(clip.duration);

  function onEnter() {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  }
  function onLeave() {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0.5;
    }
  }

  return (
    <div onClick={onSelect} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ borderRadius: 14, overflow: "hidden", cursor: "pointer", background: "#fff",
        border: `2px solid ${selected ? BLUE : "#E2E6F0"}`,
        boxShadow: selected ? `0 0 0 3px rgba(58,96,231,0.15)` : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "border-color 0.15s, box-shadow 0.15s" }}>

      <div style={{ position: "relative", aspectRatio: "9/16", overflow: "hidden", background: "#111827" }}>
        {!thumbReady && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1e1b4b 0%, #111827 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
          </div>
        )}
        <video
          ref={videoRef}
          src={clip.url}
          muted playsInline loop preload="metadata"
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0.5;
              const d = videoRef.current.duration;
              if (d && isFinite(d)) setVideoDuration(d);
            }
          }}
          onSeeked={() => setThumbReady(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: thumbReady ? 1 : 0, transition: "opacity 0.3s" }}
        />
        {!hovered && thumbReady && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)" }} />
        )}
        {selected && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(58,96,231,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(58,96,231,0.5)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        )}
        {videoDuration > 0 && (
          <div style={{ position: "absolute", bottom: 6, right: 7, background: "rgba(0,0,0,0.65)", borderRadius: 5, padding: "0.15rem 0.45rem", fontSize: "0.67rem", fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>
            {fmtShort(videoDuration)}
          </div>
        )}
        {hovered && !selected && (
          <div style={{ position: "absolute", bottom: 6, left: 7, background: "rgba(58,96,231,0.85)", borderRadius: 5, padding: "0.15rem 0.5rem", fontSize: "0.65rem", fontWeight: 700, color: "#fff" }}>▶ Playing</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "0.625rem 0.75rem 0.75rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.825rem", color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.title}</p>
        <span style={{ fontSize: "0.67rem", fontWeight: 700, color: BLUE, background: "#EEF2FF", padding: "0.15rem 0.5rem", borderRadius: 4, marginTop: "0.3rem", display: "inline-block" }}>{clip.style}</span>
      </div>
    </div>
  );
}

// ── Static video thumbnail (seeks to 0.5s on load) ───────────────────────────
function VideoThumb({ src, style }: { src: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <video
      ref={ref}
      src={src}
      muted playsInline preload="metadata"
      onLoadedMetadata={() => { if (ref.current) ref.current.currentTime = 0.5; }}
      style={{ objectFit: "cover", ...style }}
    />
  );
}

// ── Interactive preview video with animated lyrics ────────────────────────────
type WordTs = { word: string; start: number; end: number };

function VideoPreview({ src, audioSrc, audioTrimStart, audioTrimEnd, overlayOpacity, textColor, highlightColor, textPosition, fontSize, lyricStyle, fontFamily, lines, timestamps, endTimestamps, wordTimestamps, staticPreview }: {
  src: string; audioSrc?: string; audioTrimStart?: number; audioTrimEnd?: number;
  overlayOpacity: number; textColor: string; highlightColor: string;
  textPosition: "top" | "center" | "bottom"; fontSize: "sm" | "md" | "lg";
  lyricStyle: LyricStyle; fontFamily: string; lines: string[];
  timestamps?: (number | null)[];
  endTimestamps?: (number | null)[];
  wordTimestamps?: WordTs[][];
  staticPreview?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(staticPreview ? 0 : -1);
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [activeGlobalWordIdx, setActiveGlobalWordIdx] = useState(staticPreview ? 0 : -1);
  const [animKey, setAnimKey] = useState(0);
  const [previewWidth, setPreviewWidth] = useState(280);
  const prevLineRef = useRef(-1);
  const prevWordRef = useRef(-1);

  const safeLines = useMemo(() => lines.length > 0 ? lines : ["Your lyric appears here"], [lines]);
  const allWords = useMemo(() => safeLines.flatMap((l) => l.split(" ").filter(Boolean)), [safeLines]);

  // Word offset per line (how many words come before each line globally)
  const wordOffsets = useMemo(() =>
    safeLines.map((_, li) =>
      safeLines.slice(0, li).reduce((acc, l) => acc + l.split(" ").filter(Boolean).length, 0)
    ),
  [safeLines]);

  // TikTok chunks: up to 3 words per row, but total chars ≤ 18 and no word >10 chars alone with others
  const wordChunks = useMemo(() => {
    const chunks: string[][] = [];
    let i = 0;
    while (i < allWords.length) {
      const chunk: string[] = [];
      let totalChars = 0;
      while (i < allWords.length && chunk.length < 3) {
        const w = allWords[i];
        if (chunk.length === 0) {
          chunk.push(w); totalChars += w.length; i++;
          if (w.length > 10) break; // very long word → solo
        } else {
          if (w.length > 10 || totalChars + w.length > 18) break;
          chunk.push(w); totalChars += w.length; i++;
        }
      }
      if (chunk.length > 0) chunks.push(chunk);
    }
    return chunks;
  }, [allWords]);

  // Resolved timestamps — fill any null gaps; fall back to deriving line times from word timestamps
  const safeTimes = useMemo((): number[] | null => {
    // Primary: explicit line-level timestamps
    if (timestamps && timestamps.length > 0) {
      const hasAnyReal = timestamps.some((t) => t !== null);
      if (hasAnyReal) {
        const filled = timestamps.map((t, i) => {
          if (t !== null) return t as number;
          for (let j = i - 1; j >= 0; j--) if (timestamps[j] !== null) return (timestamps[j] as number) + (i - j) * 2;
          return i * 2;
        });
        const hasRealTimes = filled.some((t) => t > 0.1);
        return hasRealTimes ? filled : null;
      }
    }
    // Fallback: derive line start times from first word of each line in wordTimestamps
    if (wordTimestamps && wordTimestamps.length > 0) {
      const derived = wordTimestamps.map((lineWts) => lineWts?.[0]?.start ?? null);
      const hasAnyReal = derived.some((t) => t !== null);
      if (hasAnyReal) {
        const filled = derived.map((t, i) => {
          if (t !== null) return t as number;
          for (let j = i - 1; j >= 0; j--) if (derived[j] !== null) return (derived[j] as number) + (i - j) * 2;
          return i * 2;
        });
        return filled.some((t) => t > 0.1) ? filled : null;
      }
    }
    return null;
  }, [timestamps, wordTimestamps]);

  // Stable refs so RAF callbacks always read latest data
  const safeTimesRef = useRef<number[] | null>(null);
  const endTimestampsRef = useRef<(number | null)[] | undefined>(undefined);
  const safeLinesRef = useRef<string[]>([]);
  const wordTsRef = useRef<WordTs[][] | undefined>(undefined);
  const wordOffsetsRef = useRef<number[]>([]);
  useLayoutEffect(() => {
    safeTimesRef.current = safeTimes;
    endTimestampsRef.current = endTimestamps;
    safeLinesRef.current = safeLines;
    wordTsRef.current = wordTimestamps;
    wordOffsetsRef.current = wordOffsets;
  });

  // Measure preview container width for proportional TikTok font sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setPreviewWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setPreviewWidth(el.getBoundingClientRect().width || 280);
    return () => ro.disconnect();
  }, []);

  // Audio element — loop within trim region
  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    const start = audioTrimStart ?? 0;
    const end = audioTrimEnd;
    audio.currentTime = start;

    function loopBack() {
      audio.currentTime = start;
      audio.play().catch(() => {});
      setActiveLineIndex(-1);
      setActiveGlobalWordIdx(-1);
      prevLineRef.current = -1;
      prevWordRef.current = 0;
    }

    audio.addEventListener("ended", loopBack);
    audio.addEventListener("timeupdate", () => {
      if (end && audio.currentTime >= end) loopBack();
    });
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioSrc, audioTrimStart, audioTrimEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().then(() => {
      setPlaying(true);
      audioRef.current?.play().catch(() => {});
    }).catch(() => {});
    return () => { v.pause(); audioRef.current?.pause(); };
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── RAF loop — drives line + word sync from audio.currentTime when timestamps exist ──
  useEffect(() => {
    if (!playing || !safeTimes) return;
    // Force the first tick to always apply the correct line, even if the fallback
    // timer left activeLineIndex at a stale value while safeTimes was null.
    prevLineRef.current = -999;
    let rafId: number;
    function tick() {
      const audio = audioRef.current;
      const times = safeTimesRef.current;
      const lns = safeLinesRef.current;
      if (!audio || !times || times.length === 0) { rafId = requestAnimationFrame(tick); return; }

      const t = audio.currentTime;
      const endTimes = endTimestampsRef.current;

      // Find the active line: start <= t < end (independent per line)
      let li = -1;
      for (let i = 0; i < times.length; i++) {
        if (t >= times[i]) {
          const end = endTimes?.[i];
          if (end === null || end === undefined || t < end) li = i;
        }
      }
      if (li >= 0) li = Math.min(li, lns.length - 1);

      if (li !== prevLineRef.current) {
        console.log(`[RAF] line ${prevLineRef.current === -999 ? "init" : prevLineRef.current} → ${li} at audio t=${t.toFixed(2)}s`);
        setActiveLineIndex(li);
        setActiveWordIdx(0);
        setAnimKey((k) => k + 1);
        prevLineRef.current = li;
        prevWordRef.current = 0;
      }

      // Global word index — used by tiktok style
      if (li >= 0) {
        const offsets = wordOffsetsRef.current;
        const globalWi = (offsets[li] ?? 0) + (prevWordRef.current >= 0 ? prevWordRef.current : 0);
        setActiveGlobalWordIdx(globalWi);
      }

      // Word advancement within the active line
      if (li >= 0 && (lyricStyle === "word-by-word" || lyricStyle === "spotlight" || lyricStyle === "tiktok")) {
        const lineWordTs = wordTsRef.current?.[li];
        let wi: number;
        if (lineWordTs && lineWordTs.length > 0) {
          // Exact timing from Whisper word timestamps
          wi = 0;
          for (let w = 0; w < lineWordTs.length; w++) {
            if (t >= lineWordTs[w].start) wi = w;
            else break;
          }
        } else {
          // Fallback: linear interpolation across segment duration
          const lineStart = times[li];
          const lineEnd = endTimestampsRef.current?.[li] ?? (lineStart + 5);
          const words = lns[li]?.split(" ").filter(Boolean) ?? [];
          wi = Math.min(
            Math.floor(((t - lineStart) / Math.max(0.1, lineEnd - lineStart)) * words.length),
            Math.max(0, words.length - 1)
          );
        }
        if (wi !== prevWordRef.current) {
          const wordText = wordTsRef.current?.[li]?.[wi]?.word ?? lns[li]?.split(" ")[wi];
          console.log(`[RAF] word ${prevWordRef.current} → ${wi} "${wordText}" at t=${t.toFixed(2)}s`);
          setActiveWordIdx(wi);
          prevWordRef.current = wi;
        }
      }

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, safeTimes, lyricStyle]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fallback timers — only when no Whisper timestamps (manual lyrics) ──
  useEffect(() => {
    if (lyricStyle !== "word-by-word" || !playing || safeTimes) return;
    console.warn("[Fallback word-by-word] running — safeTimes is null, activeLineIndex:", activeLineIndex);
    if (activeLineIndex < 0) {
      const t = setTimeout(() => { setActiveLineIndex(0); setActiveWordIdx(0); setAnimKey((k) => k + 1); }, 800);
      return () => clearTimeout(t);
    }
    const words = (safeLines[activeLineIndex] || "").split(" ").filter(Boolean);
    if (activeWordIdx < words.length - 1) {
      const t = setTimeout(() => { setActiveWordIdx((w) => w + 1); setAnimKey((k) => k + 1); }, 340);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setActiveLineIndex((l) => (l + 1) % safeLines.length);
      setActiveWordIdx(0); setAnimKey((k) => k + 1);
    }, 1600);
    return () => clearTimeout(t);
  }, [lyricStyle, activeLineIndex, activeWordIdx, safeLines, playing, safeTimes]);

  useEffect(() => {
    if (lyricStyle !== "spotlight" || !playing || safeTimes) return;
    console.warn("[Fallback spotlight] running — safeTimes is null");
    const t = setInterval(() => { setActiveWordIdx((w) => (w + 1) % allWords.length); setAnimKey((k) => k + 1); }, 650);
    return () => clearInterval(t);
  }, [lyricStyle, allWords.length, playing, safeTimes]);

  useEffect(() => {
    if (lyricStyle === "word-by-word" || lyricStyle === "spotlight" || lyricStyle === "tiktok" || !playing || safeTimes) return;
    console.warn("[Fallback other] running — safeTimes is null, lyricStyle:", lyricStyle);
    if (activeLineIndex < 0) {
      const t = setTimeout(() => { setActiveLineIndex(0); setAnimKey((k) => k + 1); }, 800);
      return () => clearTimeout(t);
    }
    const t = setInterval(() => { setActiveLineIndex((i) => (i + 1) % safeLines.length); setAnimKey((k) => k + 1); }, 2400);
    return () => clearInterval(t);
  }, [lyricStyle, safeLines.length, playing, safeTimes, activeLineIndex]);


  function toggle() {
    if (!ref.current) return;
    if (playing) {
      ref.current.pause();
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      ref.current.play().catch(() => {});
      audioRef.current?.play().catch(() => {});
      setPlaying(true);
    }
  }

  const fSize = fontSize === "sm" ? "0.9rem" : fontSize === "md" ? "1.15rem" : "1.4rem";
  const textStyle: React.CSSProperties = {
    color: textColor, fontWeight: 800, textAlign: "center", lineHeight: 1.35,
    fontSize: fSize, textShadow: "0 2px 14px rgba(0,0,0,0.95)", margin: 0,
    fontFamily, letterSpacing: "0.02em",
  };

  function renderLyric() {
    // ── TikTok Reveal style ──────────────────────────────────────────────────
    if (lyricStyle === "tiktok") {
      if (activeGlobalWordIdx < 0) return null;

      // Find which chunk the active word is in
      let currentChunk = 0;
      let counted = 0;
      for (let ci = 0; ci < wordChunks.length; ci++) {
        counted += wordChunks[ci].length;
        currentChunk = ci;
        if (counted > activeGlobalWordIdx) break;
      }

      // 2 rows per page
      const page = Math.floor(currentChunk / 2);
      const pageStart = page * 2;
      const posInPage = currentChunk - pageStart;
      const visibleChunks = wordChunks.slice(pageStart, pageStart + 2).slice(0, posInPage + 1);

      const pageFirstWordIdx = wordChunks
        .slice(0, pageStart)
        .reduce((acc, c) => acc + c.length, 0);

      // Scale font proportionally: canvas uses 52px at 720px width
      const CANVAS_W = 720;
      const tiktokFontPx = Math.max(10, Math.round(52 * previewWidth / CANVAS_W));
      // Line height: canvas uses lh=108 for 52px font; scale proportionally
      const tiktokRowGapPx = Math.max(4, Math.round((108 - 52) * previewWidth / CANVAS_W));

      return (
        <div key={page} style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: `${tiktokRowGapPx}px`, width: "80%", margin: "0 auto" }}>
          {visibleChunks.map((chunk, relIdx) => {
            const absChunkIdx = pageStart + relIdx;
            const chunkGlobalStart = pageFirstWordIdx +
              wordChunks.slice(pageStart, absChunkIdx).reduce((acc, c) => acc + c.length, 0);
            return (
              <div
                key={absChunkIdx}
                style={{
                  display: "flex",
                  justifyContent: chunk.length === 1 ? "flex-start" : "space-between",
                  width: "100%",
                }}
              >
                {chunk.map((word, wi) => {
                  const revealed = chunkGlobalStart + wi <= activeGlobalWordIdx;
                  return (
                    <span
                      key={wi}
                      style={{
                        fontFamily: "'Varela Round', sans-serif",
                        fontSize: `${tiktokFontPx}px`,
                        fontWeight: 700,
                        color: textColor,
                        letterSpacing: "0.02em",
                        opacity: revealed ? 1 : 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }

    if (activeLineIndex < 0) return null; // before first lyric — show nothing

    const curLine = safeLines[activeLineIndex] || "";
    const curWords = curLine.split(" ").filter(Boolean);

    if (lyricStyle === "word-by-word") {
      // Karaoke-style: full line visible, current word highlighted, upcoming words dimmed
      return (
        <p style={{ ...textStyle, lineHeight: 1.55 }}>
          {curWords.map((word, i) => {
            const isCurrent = i === activeWordIdx;
            const isFuture = i > activeWordIdx;
            return (
              <span
                key={`${activeLineIndex}-${i}`}
                style={{
                  color: isCurrent ? highlightColor : textColor,
                  opacity: isFuture ? 0.4 : 1,
                  fontWeight: isCurrent ? 900 : 700,
                  textShadow: isCurrent
                    ? `0 0 18px ${highlightColor}99, 0 2px 14px rgba(0,0,0,0.95)`
                    : textStyle.textShadow,
                  display: "inline",
                  transition: "color 0.06s, opacity 0.1s",
                }}
              >
                {word}{i < curWords.length - 1 ? " " : ""}
              </span>
            );
          })}
        </p>
      );
    }
    if (lyricStyle === "spotlight") {
      const globalWord = safeTimes
        ? allWords[Math.min(
            safeLines.slice(0, activeLineIndex).flatMap((l) => l.split(" ").filter(Boolean)).length + activeWordIdx,
            allWords.length - 1
          )]
        : allWords[activeWordIdx % allWords.length] || "";
      const wi = safeTimes
        ? safeLines.slice(0, activeLineIndex).flatMap((l) => l.split(" ").filter(Boolean)).length + activeWordIdx
        : activeWordIdx;
      const isHighlighted = wi % 3 === 0 || wi % 7 === 4;
      return (
        <p key={`spot-${wi}`} style={{ ...textStyle, fontSize: fontSize === "sm" ? "1.5rem" : fontSize === "md" ? "2rem" : "2.6rem",
          color: isHighlighted ? highlightColor : textColor,
          animation: "lyr-spotlight 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
          textShadow: isHighlighted ? `0 0 24px ${highlightColor}88, 0 2px 14px rgba(0,0,0,0.95)` : textStyle.textShadow,
        }}>
          {globalWord}
        </p>
      );
    }
    if (lyricStyle === "echo") {
      return (
        <div key={animKey} style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "lyr-echo-in 0.5s ease forwards" }}>
          <p style={{ ...textStyle, margin: 0 }}>{curLine}</p>
          <p style={{ ...textStyle, margin: "-0.35em 0 0 0", opacity: 0.28, filter: "blur(2.5px)", transform: "scaleY(-1) scaleX(0.97)", fontSize: `calc(${fSize} * 0.85)` }}>{curLine}</p>
        </div>
      );
    }
    if (lyricStyle === "glow") {
      return (
        <p key={animKey} style={{ ...textStyle, animation: "lyr-glow 0.6s ease forwards" }}>
          <span style={{ filter: "drop-shadow(0 0 10px currentColor)" }}>{curLine}</span>
        </p>
      );
    }
    return (
      <p key={animKey} style={{ ...textStyle, animation: "lyr-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards" }}>
        {curLine}
      </p>
    );
  }

  return (
    <div ref={containerRef} onClick={toggle} style={{ borderRadius: 14, overflow: "hidden", position: "relative", aspectRatio: "9/16", background: "#000", maxWidth: 300, margin: "0 auto", cursor: "pointer" }}>
      <video ref={ref} src={src} muted playsInline loop preload="metadata"
        onLoadedMetadata={() => { if (ref.current) ref.current.currentTime = 0.5; }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 - overlayOpacity }} />
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${overlayOpacity})` }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", padding: "1rem 1.25rem",
        alignItems: textPosition === "top" ? "flex-start" : textPosition === "center" ? "center" : "flex-end",
        justifyContent: "center", pointerEvents: "none" }}>
        {renderLyric()}
      </div>
      {!playing && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Lyric Timeline Editor ──────────────────────────────────────────────────────
const BLOCK_COLORS = [
  "#3A60E7","#10B981","#F59E0B","#EF4444","#8B5CF6",
  "#06B6D4","#EC4899","#14B8A6","#F97316","#6366F1",
];

const tlBtn: CSSProperties = {
  background: "#334155", border: "none", color: "#94A3B8",
  cursor: "pointer", borderRadius: 6, padding: "0.25rem 0.5rem",
  fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center",
};

function LyricTimeline({
  audioBuffer, trimStart, trimEnd, lines, timestamps, onTimestampsChange,
  endTimestamps, onEndTimestampsChange,
  currentTime, onSeek, isPlaying, onPlayPause, syncActive, onAddLine, onDeleteLine,
}: {
  audioBuffer: AudioBuffer;
  trimStart: number; trimEnd: number;
  lines: string[];
  timestamps: (number | null)[];
  onTimestampsChange: (ts: (number | null)[]) => void;
  endTimestamps: (number | null)[];
  onEndTimestampsChange: (ets: (number | null)[]) => void;
  currentTime: number;
  onSeek: (t: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  syncActive: boolean;
  onAddLine?: (atTime: number) => void;
  onDeleteLine?: (idx: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [scrollSec, setScrollSec] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [snap, setSnap] = useState(true);
  const [fineTuneValue, setFineTuneValue] = useState("");
  const [endTuneValue, setEndTuneValue] = useState("");
  const dragging = useRef<{ line: number; field: "start" | "end" | "body"; startX: number; origStart: number; origEnd: number } | null>(null);
  const waveCache = useRef<Float32Array | null>(null);

  const totalDur = trimEnd - trimStart;
  const visibleDur = totalDur / Math.max(1, zoom);
  const maxScroll = Math.max(0, totalDur - visibleDur);
  const clampedScroll = Math.min(scrollSec, maxScroll);
  const viewStart = trimStart + clampedScroll;
  const viewEnd = viewStart + visibleDur;

  useEffect(() => {
    setScrollSec((s) => Math.min(s, Math.max(0, totalDur - totalDur / zoom)));
  }, [zoom, totalDur]);

  // Build waveform peak cache
  useEffect(() => {
    if (!audioBuffer) return;
    const data = audioBuffer.getChannelData(0);
    const bins = 2000;
    const peaks = new Float32Array(bins);
    const step = Math.ceil(data.length / bins);
    for (let i = 0; i < bins; i++) {
      let peak = 0;
      for (let j = 0; j < step; j++) {
        const v = Math.abs(data[i * step + j] || 0);
        if (v > peak) peak = v;
      }
      peaks[i] = peak;
    }
    waveCache.current = peaks;
  }, [audioBuffer]);

  function getW() { return wrapRef.current?.clientWidth ?? 800; }
  function timeToX(t: number) { return ((t - viewStart) / visibleDur) * getW(); }
  function xToTime(x: number) { return viewStart + (x / getW()) * visibleDur; }

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = wrap.clientWidth;
    const H = 140;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const RULER_H = 26;
    const WAVE_H = H - RULER_H;

    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(0, 0, W, RULER_H);

    // Ruler ticks
    const pxPerSec = W / visibleDur;
    const tickIntervals = [0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 30];
    const tickInterval = tickIntervals.find((t) => t * pxPerSec >= 60) ?? 30;
    ctx.font = `10px monospace`;
    ctx.textAlign = "center";
    const firstTick = Math.ceil(viewStart / tickInterval) * tickInterval;
    for (let t = firstTick; t <= viewEnd + 0.001; t += tickInterval) {
      const x = ((t - viewStart) / visibleDur) * W;
      const isMajor = Math.abs(Math.round(t) - t) < 0.001 || tickInterval >= 1;
      ctx.fillStyle = isMajor ? "#94A3B8" : "#475569";
      ctx.fillRect(x, RULER_H - (isMajor ? 12 : 5), 1, isMajor ? 12 : 5);
      if (isMajor) {
        ctx.fillStyle = "#94A3B8";
        ctx.fillText(fmtShort(t), x, 12);
      }
    }

    // Waveform
    const peaks = waveCache.current;
    if (peaks) {
      const fullDur = audioBuffer.duration;
      for (let i = 0; i < W; i++) {
        const t = viewStart + (i / W) * visibleDur;
        const idx = Math.floor((t / fullDur) * peaks.length);
        const peak = peaks[Math.max(0, Math.min(idx, peaks.length - 1))] || 0;
        const barH = Math.max(2, peak * WAVE_H * 0.85);
        ctx.fillStyle = `rgba(58,96,231,${0.3 + peak * 0.7})`;
        ctx.fillRect(i, RULER_H + (WAVE_H - barH) / 2, 1, barH);
      }
    }

    // Region bars (each line's own start→end) + start markers
    for (let i = 0; i < timestamps.length; i++) {
      const ts = timestamps[i];
      if (ts === null) continue;
      const endTs = endTimestamps[i] ?? trimEnd;
      const x = ((ts - viewStart) / visibleDur) * W;
      const xEnd = ((endTs - viewStart) / visibleDur) * W;
      const color = BLOCK_COLORS[i % BLOCK_COLORS.length];
      ctx.fillStyle = color + "33";
      ctx.fillRect(x, H - 10, xEnd - x, 10);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x, RULER_H); ctx.lineTo(x, H); ctx.stroke();
    }

    // Playhead
    const px = ((currentTime - viewStart) / visibleDur) * W;
    ctx.strokeStyle = "#F43F5E";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    ctx.fillStyle = "#F43F5E";
    ctx.beginPath(); ctx.moveTo(px - 5, 0); ctx.lineTo(px + 5, 0); ctx.lineTo(px, 9); ctx.fill();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [audioBuffer, trimEnd, timestamps, endTimestamps, currentTime, viewStart, viewEnd, visibleDur]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    const ro = new ResizeObserver(() => draw());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [draw]);

  // Auto-scroll to keep playhead visible during playback
  useEffect(() => {
    if (!isPlaying) return;
    if (currentTime < viewStart || currentTime > viewEnd - visibleDur * 0.05) {
      setScrollSec((s) => {
        const ideal = currentTime - trimStart - visibleDur * 0.1;
        return Math.max(0, Math.min(ideal, maxScroll));
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, isPlaying]);

  // Canvas click → seek
  function onCanvasClick(e: React.MouseEvent) {
    if (dragging.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = xToTime(e.clientX - rect.left);
    onSeek(Math.max(trimStart, Math.min(t, trimEnd)));
  }

  // Canvas double-click → insert new line at that time
  function onCanvasDoubleClick(e: React.MouseEvent) {
    if (!onAddLine) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = xToTime(e.clientX - rect.left);
    onAddLine(Math.max(trimStart, Math.min(t, trimEnd)));
  }

  // Wheel: Ctrl = zoom, else scroll
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const frac = (e.clientX - rect.left) / rect.width;
      const mouseTime = viewStart + frac * visibleDur;
      const factor = e.deltaY < 0 ? 1.25 : 0.8;
      const newZoom = Math.max(1, Math.min(20, zoom * factor));
      const newVis = totalDur / newZoom;
      const newScroll = Math.max(0, Math.min(mouseTime - trimStart - frac * newVis, totalDur - newVis));
      setZoom(newZoom);
      setScrollSec(newScroll);
    } else {
      const delta = ((e.deltaY || e.deltaX) / getW()) * visibleDur;
      setScrollSec((s) => Math.max(0, Math.min(s + delta, maxScroll)));
    }
  }

  // Block drag (body) — moves start + end together (preserves duration)
  function onBlockMouseDown(e: React.MouseEvent, idx: number) {
    e.stopPropagation();
    e.preventDefault();
    setSelectedLine(idx);
    dragging.current = {
      line: idx, field: "body", startX: e.clientX,
      origStart: timestamps[idx] ?? currentTime,
      origEnd: endTimestamps[idx] ?? currentTime + 2,
    };
  }

  // Resize handle — left edge moves this line's start, right edge moves this line's end
  function onResizeMouseDown(e: React.MouseEvent, idx: number, edge: "left" | "right") {
    e.stopPropagation();
    e.preventDefault();
    setSelectedLine(idx);
    dragging.current = {
      line: idx, field: edge === "left" ? "start" : "end", startX: e.clientX,
      origStart: timestamps[idx] ?? currentTime,
      origEnd: endTimestamps[idx] ?? currentTime + 2,
    };
  }

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragging.current) return;
      const { line, field, startX, origStart, origEnd } = dragging.current;
      const dt = ((e.clientX - startX) / getW()) * visibleDur;
      const snap10 = (v: number) => snap ? Math.round(v * 10) / 10 : v;
      const clamp = (v: number) => Math.max(trimStart, Math.min(v, trimEnd));

      if (field === "body") {
        const newStart = clamp(snap10(origStart + dt));
        const newEnd = clamp(snap10(origEnd + dt));
        const nextTs = [...timestamps]; nextTs[line] = newStart; onTimestampsChange(nextTs);
        const nextEts = [...endTimestamps]; nextEts[line] = newEnd; onEndTimestampsChange(nextEts);
      } else if (field === "start") {
        const newStart = clamp(snap10(origStart + dt));
        const nextTs = [...timestamps]; nextTs[line] = Math.min(newStart, origEnd - 0.1); onTimestampsChange(nextTs);
      } else {
        const newEnd = clamp(snap10(origEnd + dt));
        const nextEts = [...endTimestamps]; nextEts[line] = Math.max(newEnd, origStart + 0.1); onEndTimestampsChange(nextEts);
      }
    }
    function onUp() { dragging.current = null; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamps, onTimestampsChange, endTimestamps, onEndTimestampsChange, visibleDur, snap, trimStart, trimEnd]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (syncActive) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.code === "Space") { e.preventDefault(); onPlayPause(); return; }

      if (selectedLine === null) return;
      const nudge = e.shiftKey ? 0.01 : 0.1;

      if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
        e.preventDefault();
        const ts = timestamps[selectedLine] ?? 0;
        const dir = e.code === "ArrowLeft" ? -1 : 1;
        const next = [...timestamps];
        let newTs = ts + dir * nudge;
        if (snap) newTs = Math.round(newTs * 100) / 100;
        next[selectedLine] = Math.max(trimStart, Math.min(newTs, trimEnd));
        onTimestampsChange(next);
        return;
      }
      if (e.code === "Enter") {
        e.preventDefault();
        const next = [...timestamps];
        next[selectedLine] = currentTime;
        onTimestampsChange(next);
        setFineTuneValue(currentTime.toFixed(2));
        return;
      }
      if (e.code === "Tab") {
        e.preventDefault();
        setSelectedLine((s) => {
          if (s === null) return 0;
          return e.shiftKey ? Math.max(0, s - 1) : Math.min(lines.length - 1, s + 1);
        });
        return;
      }
      if ((e.code === "Delete" || e.code === "Backspace") && onDeleteLine) {
        e.preventDefault();
        onDeleteLine(selectedLine);
        setSelectedLine((s) => s !== null ? Math.max(0, s - 1) : null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLine, timestamps, onTimestampsChange, onPlayPause, currentTime, trimStart, trimEnd, snap, lines.length, syncActive, onDeleteLine]);

  // Sync fine-tune inputs with selected line
  useEffect(() => {
    if (selectedLine === null) return;
    if (timestamps[selectedLine] !== null) setFineTuneValue((timestamps[selectedLine]!).toFixed(2));
    const endTs = endTimestamps[selectedLine] ?? trimEnd;
    setEndTuneValue(endTs.toFixed(2));
  }, [selectedLine, timestamps, endTimestamps, trimEnd]);

  function applyFineTune() {
    if (selectedLine === null) return;
    const val = parseFloat(fineTuneValue);
    if (isNaN(val)) return;
    const next = [...timestamps];
    next[selectedLine] = Math.max(trimStart, Math.min(val, trimEnd));
    onTimestampsChange(next);
  }

  function applyEndTune() {
    if (selectedLine === null) return;
    const val = parseFloat(endTuneValue);
    if (isNaN(val)) return;
    const start = timestamps[selectedLine] ?? trimStart;
    const clamped = Math.max(start + 0.1, Math.min(val, trimEnd));
    const next = [...endTimestamps];
    next[selectedLine] = clamped;
    onEndTimestampsChange(next);
  }

  // Block layer — spans from start to end timestamp for each line
  const W = getW();
  const blocks = lines.map((line, i) => {
    const ts = timestamps[i];
    if (ts === null) return null;
    const endTs = endTimestamps[i] ?? trimEnd;
    const x = ((ts - viewStart) / visibleDur) * W;
    const xEnd = ((endTs - viewStart) / visibleDur) * W;
    const blockW = Math.max(48, xEnd - x);
    if (xEnd < 0 || x > W + 10) return null;
    const color = BLOCK_COLORS[i % BLOCK_COLORS.length];
    const isSelected = i === selectedLine;
    return (
      <div key={i} style={{ position: "absolute", left: x, top: 24, width: blockW, zIndex: isSelected ? 10 : 5, userSelect: "none" }}>
        {/* Left-resize | drag-body | right-resize */}
        <div style={{ display: "flex", height: 28, borderRadius: 5, overflow: "hidden", boxShadow: isSelected ? `0 0 0 2px #fff, 0 0 0 4px ${color}` : "0 2px 6px rgba(0,0,0,0.5)", width: "100%" }}>
          {/* Left resize handle */}
          <div
            onMouseDown={(e) => onResizeMouseDown(e, i, "left")}
            title="Drag to adjust start time"
            style={{ width: 8, background: color + "cc", cursor: "ew-resize", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <div style={{ width: 2, height: 10, background: "rgba(255,255,255,0.7)", borderRadius: 1 }} />
          </div>
          {/* Drag body */}
          <div
            onMouseDown={(e) => onBlockMouseDown(e, i)}
            style={{ background: color, color: "#fff", fontSize: "0.63rem", fontWeight: 700, padding: "0 6px", cursor: "grab", display: "flex", alignItems: "center", gap: 3, overflow: "hidden", flex: 1, minWidth: 0 }}
          >
            <span style={{ fontFamily: "monospace", opacity: 0.75, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{line}</span>
          </div>
          {/* Right resize handle */}
          <div
            onMouseDown={(e) => onResizeMouseDown(e, i, "right")}
            title="Drag to adjust end time"
            style={{ width: 8, background: color + "cc", cursor: "ew-resize", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <div style={{ width: 2, height: 10, background: "rgba(255,255,255,0.7)", borderRadius: 1 }} />
          </div>
        </div>
      </div>
    );
  });


  return (
    <div style={{ background: "#0F172A", borderRadius: 16, overflow: "hidden", border: "1px solid #1E293B" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.875rem", background: "#1E293B", flexWrap: "wrap" }}>
        <button onClick={onPlayPause} style={{ ...tlBtn, width: 30, height: 30, borderRadius: "50%", background: BLUE, color: "#fff", padding: 0, flexShrink: 0 }}>
          {isPlaying
            ? <svg width="9" height="9" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg width="9" height="9" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
        </button>
        <span style={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 700, color: "#F43F5E", flexShrink: 0 }}>{fmt(currentTime)}</span>
        <div style={{ width: 1, height: 18, background: "#334155" }} />
        <span style={{ fontSize: "0.68rem", color: "#64748B" }}>Zoom</span>
        <button onClick={() => setZoom((z) => Math.max(1, z / 1.5))} style={tlBtn}>−</button>
        <input type="range" min={1} max={20} step={0.1} value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          style={{ width: 70, accentColor: BLUE }} />
        <button onClick={() => setZoom((z) => Math.min(20, z * 1.5))} style={tlBtn}>+</button>
        <span style={{ fontSize: "0.68rem", fontFamily: "monospace", color: "#94A3B8", minWidth: 30 }}>{zoom.toFixed(1)}x</span>
        <button onClick={() => { setZoom(1); setScrollSec(0); }} style={tlBtn} title="Fit all">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </button>
        <div style={{ width: 1, height: 18, background: "#334155" }} />
        <button
          onClick={() => setSnap((s) => !s)}
          style={{ ...tlBtn, background: snap ? BLUE : "#334155", color: snap ? "#fff" : "#94A3B8", fontSize: "0.68rem" }}
        >
          Snap {snap ? "0.1s ✓" : "Off"}
        </button>
        <div style={{ width: 1, height: 18, background: "#334155" }} />
        <span style={{ fontSize: "0.63rem", color: "#475569" }}>←/→ nudge · Shift+←/→ fine · Enter=set · Tab=next</span>
        {onAddLine && (
          <button
            onClick={() => onAddLine(currentTime)}
            title="Add new line at playhead"
            style={{ ...tlBtn, marginLeft: "auto", background: "#1E3A8A", color: "#93C5FD", fontSize: "0.68rem", fontWeight: 700, padding: "0.2rem 0.6rem", gap: "0.25rem", display: "flex", alignItems: "center" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add line
          </button>
        )}
        {selectedLine !== null && (
          <span style={{ marginLeft: onAddLine ? "0" : "auto", fontSize: "0.68rem", color: BLOCK_COLORS[selectedLine % BLOCK_COLORS.length], fontWeight: 700 }}>
            Line {selectedLine + 1} selected
          </span>
        )}
      </div>

      {/* Canvas + block layer */}
      <div
        ref={wrapRef}
        style={{ position: "relative", height: 165, overflow: "hidden", cursor: "crosshair" }}
        onWheel={onWheel}
        onClick={onCanvasClick}
        onDoubleClick={onCanvasDoubleClick}
      >
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        {blocks}
      </div>

      {/* Scrollbar */}
      {zoom > 1.05 && (
        <div style={{ height: 10, background: "#1E293B", padding: "3px 6px" }}>
          <div
            style={{ height: 4, background: "#334155", borderRadius: 99, position: "relative", cursor: "pointer" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setScrollSec(((e.clientX - rect.left) / rect.width) * maxScroll);
            }}
          >
            <div style={{
              position: "absolute", height: "100%",
              left: `${(clampedScroll / Math.max(totalDur, 0.01)) * 100}%`,
              width: `${(visibleDur / Math.max(totalDur, 0.01)) * 100}%`,
              background: BLUE, borderRadius: 99,
            }} />
          </div>
        </div>
      )}

      {/* Line fine-tune bar */}
      {selectedLine !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.875rem", background: "#1E293B", borderTop: "1px solid #0F172A", flexWrap: "wrap" }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: BLOCK_COLORS[selectedLine % BLOCK_COLORS.length], flexShrink: 0 }} />
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#E2E8F0", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Line {selectedLine + 1}: {lines[selectedLine]}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.68rem", color: "#64748B" }}>From</span>
            <input
              type="number" step="0.01" value={fineTuneValue}
              onChange={(e) => setFineTuneValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyFineTune(); }}
              onBlur={applyFineTune}
              style={{ width: 68, fontFamily: "monospace", fontSize: "0.78rem", background: "#0F172A", color: "#E2E8F0", border: "1px solid #334155", borderRadius: 6, padding: "0.2rem 0.4rem" }}
            />
            <span style={{ fontSize: "0.68rem", color: "#475569" }}>→</span>
            <span style={{ fontSize: "0.68rem", color: "#64748B" }}>To</span>
            <input
              type="number" step="0.01" value={endTuneValue}
              onChange={(e) => setEndTuneValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyEndTune(); }}
              onBlur={applyEndTune}
              style={{ width: 68, fontFamily: "monospace", fontSize: "0.78rem", background: "#0F172A", color: "#E2E8F0", border: "1px solid #334155", borderRadius: 6, padding: "0.2rem 0.4rem" }}
            />
            <span style={{ fontSize: "0.68rem", color: "#64748B" }}>s</span>
            <button
              onClick={() => { const next = [...timestamps]; next[selectedLine] = currentTime; onTimestampsChange(next); setFineTuneValue(currentTime.toFixed(2)); }}
              style={{ padding: "0.25rem 0.625rem", borderRadius: 6, border: "none", cursor: "pointer", background: BLUE, color: "#fff", fontSize: "0.68rem", fontWeight: 700 }}
            >
              Set Start
            </button>
            <button onClick={() => setSelectedLine((s) => s !== null ? Math.max(0, s - 1) : null)} disabled={selectedLine === 0} style={{ ...tlBtn, opacity: selectedLine === 0 ? 0.35 : 1 }}>↑</button>
            <button onClick={() => setSelectedLine((s) => s !== null ? Math.min(lines.length - 1, s + 1) : null)} disabled={selectedLine === lines.length - 1} style={{ ...tlBtn, opacity: selectedLine === lines.length - 1 ? 0.35 : 1 }}>↓</button>
            {onDeleteLine && (
              <button
                onClick={() => { onDeleteLine(selectedLine); setSelectedLine((s) => s !== null ? Math.max(0, s - 1) : null); }}
                title="Delete this line (Delete key)"
                style={{ ...tlBtn, background: "#FEE2E2", color: "#DC2626", border: "none", padding: "0.25rem 0.5rem" }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// ── Smart pagination page numbers ─────────────────────────────────────────────
function getPageNums(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const show = new Set<number>();
  [0, 1, total - 2, total - 1].forEach((p) => show.add(p));
  [current - 1, current, current + 1].filter((p) => p >= 0 && p < total).forEach((p) => show.add(p));
  const sorted = Array.from(show).sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }
  return result;
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function StudioPage() {
  // ── Step ──
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);

  // ── Phase 1: Audio ──
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [duration, setDuration] = useState(0);
  const [decoding, setDecoding] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<File | null>(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [speed, setSpeed] = useState<1 | 0.5 | 0.25>(1);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const startedAtRef = useRef(0);
  const pausedAtRef = useRef(0);
  const speedRef = useRef<number>(1);
  const animRef = useRef<number>(0);
  const trimEndRef = useRef(0);
  const currentTimeRef = useRef(0);
  trimEndRef.current = trimEnd;
  currentTimeRef.current = currentTime;

  // ── Phase 2: Lyrics ──
  const [lyricsText, setLyricsText] = useState("");
  const lines = useMemo(
    () => lyricsText.split("\n").filter((l) => l.trim() !== ""),
    [lyricsText]
  );

  // ── Phase 3: Sync ──
  const [timestamps, setTimestamps] = useState<(number | null)[]>([]);
  const [syncIndex, setSyncIndex] = useState(0);
  const [syncActive, setSyncActive] = useState(false);
  const syncLineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Phase 4: Style ──
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [clipsLoaded, setClipsLoaded] = useState(false);
  const [clipsLoading, setClipsLoading] = useState(false);
  const [styleFilter, setStyleFilter] = useState("All");
  const [clipPage, setClipPage] = useState(0);
  // ── Transcription ──
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionFailed, setTranscriptionFailed] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState("");
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState("");
  const [endTimestamps, setEndTimestamps] = useState<(number | null)[]>([]);
  const [autoTranscribed, setAutoTranscribed] = useState(false);
  const [whisperSnapshot, setWhisperSnapshot] = useState<{ lyricsText: string; timestamps: number[]; endTimestamps: number[] } | null>(null);
  const [wordTimestamps, setWordTimestamps] = useState<WordTs[][]>([]);

  const [selectedClips, setSelectedClips] = useState<VideoClip[]>([]);
  const [clipConfigs, setClipConfigs] = useState<Record<string, ClipConfig>>({});
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [baseCreativeName, setBaseCreativeName] = useState("");

  // ── Phase 5: Render ──
  const [rendering, setRendering] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [renderStage, setRenderStage] = useState<"uploading" | "saving" | "done">("uploading");
  const [renderError, setRenderError] = useState("");
  const [renderResults, setRenderResults] = useState<{ id: string; name: string; clipTitle: string; clipStyle: string; config: ClipConfig }[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // ── User video upload ──
  const [userVideoUploading, setUserVideoUploading] = useState(false);
  const [userVideoError, setUserVideoError] = useState("");
  const [userClips, setUserClips] = useState<VideoClip[]>([]);

  // ── Audio helpers ──
  function getCtx() {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }

  async function handleFile(file: File) {
    const allowed = /\.(mp3|mpeg|wav|flac|m4a|ogg|aac|mp4a)$/i;
    if (!allowed.test(file.name)) {
      setFileError("Please upload an MP3, WAV, FLAC, M4A, OGG or MPEG file.");
      return;
    }
    setFileError("");
    setDecoding(true);
    stopPlayback(true);
    audioFileRef.current = file;

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    const name = file.name.replace(/\.[^.]+$/, "");
    setFilename(name);
    setBaseCreativeName(name);

    try {
      const ctx = getCtx();
      const buf = await file.arrayBuffer();
      const decoded = await ctx.decodeAudioData(buf);
      setAudioBuffer(decoded);
      const dur = decoded.duration;
      setDuration(dur);
      const end = Math.min(dur, MAX_TRIM);
      setTrimStart(0);
      setTrimEnd(end);
      pausedAtRef.current = 0;
      setCurrentTime(0);
    } catch {
      setFileError("Could not decode audio. Try a different format.");
    } finally {
      setDecoding(false);
    }

    // Transcription happens when user clicks Next (after trim is set)
  }

  // Animate playhead
  useEffect(() => {
    if (!isPlaying) return;
    function tick() {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const elapsed = (ctx.currentTime - startedAtRef.current) * speedRef.current;
      const t = pausedAtRef.current + elapsed;
      setCurrentTime(Math.min(t, trimEndRef.current));
      if (t >= trimEndRef.current) {
        stopPlayback(false);
        pausedAtRef.current = trimEndRef.current;
        return;
      }
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  function startPlayback(fromTime?: number) {
    if (!audioBuffer) return;
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.playbackRate.value = speedRef.current;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    if (fadeIn) {
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + Math.min(1.5, (trimEnd - trimStart) * 0.2));
    }

    source.connect(gain);
    gain.connect(ctx.destination);
    gainRef.current = gain;

    const offset = fromTime !== undefined ? fromTime : pausedAtRef.current;
    const clampedOffset = Math.max(trimStart, Math.min(offset, trimEnd));
    const trimDur = (trimEnd - clampedOffset) / speedRef.current;

    startedAtRef.current = ctx.currentTime;
    pausedAtRef.current = clampedOffset;
    source.start(0, clampedOffset, trimDur);
    sourceRef.current = source;
    setIsPlaying(true);
  }

  function stopPlayback(reset: boolean) {
    cancelAnimationFrame(animRef.current);
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch {}
      sourceRef.current = null;
    }
    if (reset) {
      pausedAtRef.current = 0;
      setCurrentTime(0);
    }
    setIsPlaying(false);
  }

  function pause() {
    cancelAnimationFrame(animRef.current);
    const ctx = audioCtxRef.current;
    if (ctx && sourceRef.current) {
      const elapsed = (ctx.currentTime - startedAtRef.current) * speedRef.current;
      pausedAtRef.current = Math.min(pausedAtRef.current + elapsed, trimEnd);
      try { sourceRef.current.stop(); } catch {}
      sourceRef.current = null;
    }
    setIsPlaying(false);
  }

  function togglePlay() {
    if (isPlaying) { pause(); return; }
    if (pausedAtRef.current >= trimEnd) {
      pausedAtRef.current = trimStart;
      setCurrentTime(trimStart);
    }
    startPlayback();
  }

  const handleSeek = useCallback((t: number) => {
    pausedAtRef.current = t;
    setCurrentTime(t);
    if (isPlaying) {
      cancelAnimationFrame(animRef.current);
      if (sourceRef.current) { try { sourceRef.current.stop(); } catch {} sourceRef.current = null; }
      setIsPlaying(false);
      setTimeout(() => startPlayback(t), 10);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, trimStart, trimEnd, audioBuffer, volume, fadeIn]);

  const handleTrimChange = useCallback((start: number, end: number) => {
    setTrimStart(start);
    setTrimEnd(end);
    if (isPlaying) { pause(); }
    if (pausedAtRef.current < start) { pausedAtRef.current = start; setCurrentTime(start); }
    if (pausedAtRef.current > end) { pausedAtRef.current = end; setCurrentTime(end); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  function changeSpeed(s: 1 | 0.5 | 0.25) {
    speedRef.current = s;
    setSpeed(s);
    if (isPlaying && sourceRef.current) {
      sourceRef.current.playbackRate.value = s;
    }
  }

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current);
      if (sourceRef.current) try { sourceRef.current.stop(); } catch {}
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Spacebar line-sync handler ──
  useEffect(() => {
    if (step !== 2 || !syncActive) return;

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.code !== "Space") return;
      e.preventDefault();
      if (!isPlaying) return;

      const idx = syncIndex;
      if (idx >= lines.length) return;

      const t = currentTimeRef.current;
      setTimestamps((prev) => {
        const next = [...prev];
        next[idx] = t;
        return next;
      });
      setSyncIndex(idx + 1);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, syncActive, syncIndex, isPlaying, lines.length]);

  // Auto-scroll current sync line into view
  useEffect(() => {
    if (step === 2) {
      syncLineRefs.current[syncIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [syncIndex, step]);

  // ── Delete a lyric line by index ──
  function handleDeleteLine(idx: number) {
    if (lines.length <= 1) return;
    const newLines = lines.filter((_, i) => i !== idx);
    setLyricsText(newLines.join("\n"));
    setTimestamps((prev) => prev.filter((_, i) => i !== idx));
    setEndTimestamps((prev) => prev.filter((_, i) => i !== idx));
    setWordTimestamps((prev) => prev.filter((_, i) => i !== idx));
    setSyncIndex((prev) => Math.min(prev, newLines.length));
  }

  // ── Add new lyric line at a given time (from timeline double-click or Add button) ──
  function handleAddLine(atTime: number) {
    // Find sorted insertion index based on existing timestamps
    const pairs = timestamps
      .map((t, i) => ({ t, i }))
      .filter((p) => p.t !== null)
      .sort((a, b) => (a.t as number) - (b.t as number));
    const insertAfter = pairs.reduce((best, p) => ((p.t as number) <= atTime ? p.i : best), -1);
    const insertIdx = insertAfter + 1;

    const newLines = [...lines];
    newLines.splice(insertIdx, 0, "New line");
    setLyricsText(newLines.join("\n"));

    const newTs = [...timestamps];
    newTs.splice(insertIdx, 0, atTime);
    setTimestamps(newTs);

    setEndTimestamps((prev) => {
      const next = [...prev];
      next.splice(insertIdx, 0, atTime + 2);
      return next;
    });

    setWordTimestamps((prev) => {
      const next = [...prev];
      next.splice(insertIdx, 0, []);
      return next;
    });
  }

  // ── Fetch video library when entering Style step ──
  useEffect(() => {
    if (step !== 3 || clipsLoaded) return;
    setClipsLoading(true);
    (creativeApi.videoLibrary() as Promise<{ clips: VideoClip[] }>)
      .then((data) => { setClips(data.clips ?? []); setClipsLoaded(true); })
      .catch(() => {})
      .finally(() => setClipsLoading(false));
  }, [step, clipsLoaded]);

  // ── Toggle clip selection ──
  function toggleClip(clip: VideoClip) {
    setSelectedClips((prev) => {
      const exists = prev.find((c) => c.id === clip.id);
      if (exists) {
        const next = prev.filter((c) => c.id !== clip.id);
        setClipConfigs((cfg) => { const c = { ...cfg }; delete c[clip.id]; return c; });
        setActiveClipId((id) => (id === clip.id ? (next[0]?.id ?? null) : id));
        return next;
      } else {
        setClipConfigs((cfg) => ({
          ...cfg,
          [clip.id]: { ...DEFAULT_CONFIG, creativeName: baseCreativeName || clip.title },
        }));
        setActiveClipId(clip.id);
        return [...prev, clip];
      }
    });
  }

  // ── Active clip helpers ──
  const activeClip = selectedClips.find((c) => c.id === activeClipId) ?? selectedClips[0] ?? null;
  const activeConfig: ClipConfig = (activeClipId && clipConfigs[activeClipId]) ? clipConfigs[activeClipId] : DEFAULT_CONFIG;
  function updateActiveConfig(patch: Partial<ClipConfig>) {
    if (!activeClipId) return;
    setClipConfigs((prev) => ({ ...prev, [activeClipId]: { ...prev[activeClipId], ...patch } }));
  }

  // ── User video upload ──
  async function uploadUserVideoFile(file: File) {
    setUserVideoUploading(true);
    setUserVideoError("");
    try {
      const fd = new FormData();
      fd.append("video", file);
      const apiRoot = process.env.NEXT_PUBLIC_API_URL ?? "https://api.escalium.io/api/v1";
      const session = await getSession();
      const token = (session as { accessToken?: string } | null)?.accessToken;
      const resp = await fetch(`${apiRoot}/media/upload-user-video`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await resp.json() as { url?: string; duration?: number; filename?: string; message?: string };
      if (!resp.ok) throw new Error(data.message ?? "Upload failed");
      // data.url is a relative path like /uploads/user-videos/xxx.mp4 — make it absolute
      const apiOrigin = new URL(apiRoot).origin;
      const fullUrl = `${apiOrigin}${data.url}`;
      const newClip: VideoClip = {
        id: `user-${Date.now()}`,
        title: file.name.replace(/\.[^.]+$/, ""),
        style: "My Video",
        duration: data.duration ?? 0,
        url: fullUrl,
        thumbnail: fullUrl,
      };
      setUserClips((prev) => [...prev, newClip]);
      toggleClip(newClip);
    } catch (err) {
      setUserVideoError((err as Error).message ?? "Upload failed");
    } finally {
      setUserVideoUploading(false);
    }
  }

  // ── Canvas-based video download ──
  async function downloadVideoCanvas(result: { id: string; name: string; config: ClipConfig }, clipIndex: number) {
    if (downloadingId) return;
    setDownloadingId(result.id);

    const clipUrl = selectedClips[clipIndex]?.url ?? selectedClips[0]?.url;
    const cfg = result.config;
    const W = 720, H = 1280;
    const dur = trimEnd - trimStart;
    const fsPx = cfg.fontSize === "sm" ? 44 : cfg.fontSize === "md" ? 56 : 72;

    // Build tiktok word chunks: up to 3 words, total chars ≤ 18, no word >10 mixed
    const allWords = lines.flatMap((l) => l.split(" ").filter(Boolean));
    const wordChunksRender: string[][] = [];
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
      if (chunk.length > 0) wordChunksRender.push(chunk);
    }

    const lineWordOffsets = lines.map((_, li2) =>
      lines.slice(0, li2).reduce((acc, l) => acc + l.split(" ").filter(Boolean).length, 0)
    );

    function lineAt(t: number): number {
      for (let i = 0; i < timestamps.length; i++) {
        const start = timestamps[i];
        if (start !== null && t >= start) {
          const end = endTimestamps[i];
          if (end === null || end === undefined || t < end) return i;
        }
      }
      return -1;
    }

    function globalWordAt(t: number): number {
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

    function wordAt(li: number, t: number): number {
      const wts = wordTimestamps?.[li] ?? [];
      let w = 0;
      for (let wi = 0; wi < wts.length; wi++) {
        if (wts[wi]?.start <= t) w = wi; else break;
      }
      return w;
    }

    function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
      const words = text.split(" ");
      const wrapped: string[] = [];
      let cur = "";
      for (const word of words) {
        const test = cur ? `${cur} ${word}` : word;
        if (ctx.measureText(test).width > maxW && cur) { wrapped.push(cur); cur = word; }
        else cur = test;
      }
      if (cur) wrapped.push(cur);
      return wrapped;
    }

    function drawLyrics(ctx: CanvasRenderingContext2D, t: number) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 0;
      const maxTextW = W - 80;

      if (cfg.lyricStyle === "tiktok") {
        const gwi = globalWordAt(t);
        if (gwi < 0) return;
        let accumulated = 0;
        let currentChunk = 0;
        for (let ci = 0; ci < wordChunksRender.length; ci++) {
          accumulated += wordChunksRender[ci].length;
          if (accumulated > gwi) { currentChunk = ci; break; }
          currentChunk = ci;
        }
        const page = Math.floor(currentChunk / 2);
        const pageStart = page * 2;
        const posInPage = currentChunk - pageStart;
        const visibleChunks = wordChunksRender.slice(pageStart, pageStart + 2).slice(0, posInPage + 1);
        const pageFirstWordIdx = wordChunksRender.slice(0, pageStart).reduce((acc, c) => acc + c.length, 0);
        ctx.font = `700 52px 'Varela Round', sans-serif`;
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = 0;
        const lh = 108;
        const pad = W * 0.10;
        const maxW2 = W - pad * 2;
        const totalH = visibleChunks.length * lh;
        const yStart = H / 2 - totalH / 2;
        visibleChunks.forEach((chunk, idx) => {
          const absChunkIdx = pageStart + idx;
          const chunkGlobalStart = pageFirstWordIdx + wordChunksRender.slice(pageStart, absChunkIdx).reduce((acc, c) => acc + c.length, 0);
          const y = yStart + idx * lh + lh / 2;
          const wordWidths = chunk.map((w) => ctx.measureText(w).width);
          const totalWordW = wordWidths.reduce((a, b) => a + b, 0);
          const gap = chunk.length > 1 ? (maxW2 - totalWordW) / (chunk.length - 1) : 0;
          let x = pad;
          chunk.forEach((word, wi) => {
            if (chunkGlobalStart + wi <= gwi) { ctx.textAlign = "left"; ctx.fillText(word, x, y); }
            x += wordWidths[wi] + gap;
          });
          ctx.textAlign = "center";
        });
        ctx.textAlign = "center";
        return;
      }

      const li = lineAt(t);
      if (li < 0 || li >= lines.length) return;
      const line = lines[li] ?? "";
      const yBase = cfg.textPosition === "top" ? H * 0.14 : cfg.textPosition === "center" ? H * 0.5 : H * 0.80;

      if (cfg.lyricStyle === "spotlight") {
        ctx.font = `900 ${Math.round(fsPx * 1.3)}px ${cfg.fontFamily}`;
        ctx.fillStyle = cfg.highlightColor;
        ctx.shadowColor = cfg.highlightColor;
        ctx.shadowBlur = 24;
        const wrapped = wrapLines(ctx, line, maxTextW);
        const lh = Math.round(fsPx * 1.3) * 1.25;
        wrapped.forEach((l, i) => ctx.fillText(l, W / 2, yBase + (i - wrapped.length / 2 + 0.5) * lh));
      } else if (cfg.lyricStyle === "word-by-word") {
        const words = line.split(" ").filter(Boolean);
        const activeWi = wordAt(li, t);
        ctx.font = `800 ${fsPx}px ${cfg.fontFamily}`;
        const rows: { word: string; wi: number }[][] = [];
        let row: { word: string; wi: number }[] = [];
        let rowW = 0;
        words.forEach((word, wi) => {
          const ww = ctx.measureText(word + " ").width;
          if (rowW + ww > maxTextW && row.length) { rows.push(row); row = []; rowW = 0; }
          row.push({ word, wi }); rowW += ww;
        });
        if (row.length) rows.push(row);
        const lh = fsPx * 1.35;
        rows.forEach((r, ri) => {
          const rowText = r.map((x) => x.word).join(" ");
          const rowTotalW = ctx.measureText(rowText).width;
          let x = W / 2 - rowTotalW / 2;
          const y = yBase + (ri - rows.length / 2 + 0.5) * lh;
          r.forEach(({ word, wi }, rWi) => {
            const active = wi === activeWi;
            ctx.fillStyle = active ? cfg.highlightColor : cfg.textColor;
            ctx.shadowColor = active ? cfg.highlightColor : "rgba(0,0,0,0.8)";
            ctx.shadowBlur = active ? 16 : 8;
            ctx.textAlign = "left";
            const label = word + (rWi < r.length - 1 ? " " : "");
            ctx.fillText(label, x, y);
            x += ctx.measureText(label).width;
          });
          ctx.textAlign = "center";
        });
      } else {
        ctx.font = `800 ${fsPx}px ${cfg.fontFamily}`;
        ctx.fillStyle = cfg.textColor;
        ctx.shadowColor = "rgba(0,0,0,0.9)";
        ctx.shadowBlur = 10;
        const wrapped = wrapLines(ctx, line, maxTextW);
        const lh = fsPx * 1.35;
        wrapped.forEach((l, i) => ctx.fillText(l, W / 2, yBase + (i - wrapped.length / 2 + 0.5) * lh));
      }
      ctx.shadowBlur = 0;
    }

    const apiRoot = process.env.NEXT_PUBLIC_API_URL ?? "https://api.escalium.io/api/v1";
    const apiOrigin = new URL(apiRoot).origin;
    const fullAudioUrl = uploadedAudioUrl.startsWith("http") ? uploadedAudioUrl : `${apiOrigin}${uploadedAudioUrl}`;
    // S3 clips need the proxy (CORS); user-uploaded clips are already on the same server
    const proxiedClipUrl = clipUrl.includes("amazonaws.com")
      ? `${apiRoot}/media/proxy-clip?url=${encodeURIComponent(clipUrl)}`
      : clipUrl;

    const session = await getSession();
    const token = (session as { accessToken?: string } | null)?.accessToken;
    const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const cleanups: (() => void)[] = [];
    try {
      const [videoBlob, audioBlob] = await Promise.all([
        fetch(proxiedClipUrl, { headers: clipUrl.includes("amazonaws.com") ? authHeader : {} }).then((r) => r.blob()),
        fetch(fullAudioUrl, { headers: authHeader }).then((r) => r.blob()),
      ]);
      const videoObjUrl = URL.createObjectURL(videoBlob);
      const audioObjUrl = URL.createObjectURL(audioBlob);
      cleanups.push(() => URL.revokeObjectURL(videoObjUrl));
      cleanups.push(() => URL.revokeObjectURL(audioObjUrl));

      const videoEl = document.createElement("video");
      videoEl.src = videoObjUrl;
      videoEl.muted = true;
      videoEl.loop = true;
      await new Promise<void>((res, rej) => { videoEl.onloadeddata = () => res(); videoEl.onerror = rej; videoEl.load(); });

      const audioEl = document.createElement("audio");
      audioEl.src = audioObjUrl;
      await new Promise<void>((res, rej) => { audioEl.oncanplay = () => res(); audioEl.onerror = rej; audioEl.load(); });
      audioEl.currentTime = trimStart;

      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      const audioCtx = new AudioContext();
      const src = audioCtx.createMediaElementSource(audioEl);
      const dest = audioCtx.createMediaStreamDestination();
      src.connect(dest);
      cleanups.push(() => audioCtx.close());

      // VP8 encodes faster in-browser; 24fps sufficient for social video
      const mimeType = ["video/webm;codecs=vp8,opus", "video/webm;codecs=vp9,opus", "video/webm"]
        .find((t) => MediaRecorder.isTypeSupported(t)) ?? "video/webm";
      const chunks: Blob[] = [];
      const rec = new MediaRecorder(
        new MediaStream([...canvas.captureStream(24).getTracks(), ...dest.stream.getTracks()]),
        { mimeType, videoBitsPerSecond: 2_500_000 },
      );
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      rec.onstop = async () => {
        try {
          const webmBlob = new Blob(chunks, { type: "video/webm" });
          const fd = new FormData();
          fd.append("video", webmBlob, "video.webm");
          const resp = await fetch(`${apiRoot}/media/convert-mp4`, {
            method: "POST",
            headers: authHeader,
            body: fd,
          });
          if (!resp.ok) throw new Error(`convert-mp4 ${resp.status}`);
          const mp4Blob = await resp.blob();
          const url = URL.createObjectURL(mp4Blob);
          const a = document.createElement("a");
          a.href = url; a.download = `${result.name}.mp4`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (convErr) {
          console.error("[convert-mp4] falling back to webm:", convErr);
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `${result.name}.webm`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } finally {
          cleanups.forEach((fn) => fn());
          setDownloadingId(null);
        }
      };

      await document.fonts.ready;
      rec.start(100);
      await Promise.all([videoEl.play(), audioEl.play()]);
      const t0 = performance.now();

      function frame() {
        const elapsed = (performance.now() - t0) / 1000;
        if (elapsed >= dur) { rec.stop(); videoEl.pause(); audioEl.pause(); return; }
        ctx.drawImage(videoEl, 0, 0, W, H);
        ctx.fillStyle = `rgba(0,0,0,${cfg.overlayOpacity})`;
        ctx.fillRect(0, 0, W, H);
        drawLyrics(ctx, trimStart + elapsed);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

    } catch (err) {
      console.error("[Download]", err);
      cleanups.forEach((fn) => fn());
      setDownloadingId(null);
    }
  }


  // ── Batch render handler ──
  async function handleRender() {
    if (selectedClips.length === 0 || !audioFileRef.current) return;
    setRendering(true);
    setRenderError("");
    setUploadProgress(0);
    setRenderStage("uploading");
    try {
      let finalAudioUrl = uploadedAudioUrl;
      if (!finalAudioUrl) {
        const uploaded = await creativeApi.uploadAudio(audioFileRef.current, (p) => setUploadProgress(p)) as { audioUrl: string };
        finalAudioUrl = uploaded.audioUrl;
      } else {
        setUploadProgress(100);
      }
      setRenderStage("saving");
      const lyricsJson = lines.map((text, i) => ({ text, time: timestamps[i] ?? 0 }));
      const results: { id: string; name: string; clipTitle: string; clipStyle: string; config: ClipConfig }[] = [];
      for (const clip of selectedClips) {
        const cfg = clipConfigs[clip.id] ?? DEFAULT_CONFIG;
        const name = cfg.creativeName || baseCreativeName || clip.title || "Untitled";
        const result = await creativeApi.render({
          name,
          audioUrl: finalAudioUrl,
          audioTrimStart: trimStart,
          audioTrimEnd: trimEnd,
          videoClipUrl: clip.url,
          lyricsJson,
          clipId: clip.id,
          clipTitle: clip.title,
          style: { textColor: cfg.textColor, textPosition: cfg.textPosition, fontSize: cfg.fontSize, overlayOpacity: cfg.overlayOpacity },
        }) as { jobId: string; creative: { id: string; name: string } };
        results.push({ id: result.jobId, name: result.creative?.name ?? name, clipTitle: clip.title, clipStyle: clip.style, config: cfg });
      }
      setRenderResults(results);
      setRenderStage("done");
      setStep(4);
    } catch (err: unknown) {
      setRenderError((err as { message?: string })?.message ?? "Upload failed. Please try again.");
    } finally {
      setRendering(false);
    }
  }

  // ── Style step derived ──
  const CLIPS_PER_PAGE = 10;

  const styleOptions = useMemo(
    () => ["All", ...Array.from(new Set(clips.map((c) => c.style))).sort()],
    [clips]
  );
  const filteredClips = styleFilter === "All" ? clips : clips.filter((c) => c.style === styleFilter);
  const totalPages = Math.ceil(filteredClips.length / CLIPS_PER_PAGE);
  const pagedClips = filteredClips.slice(clipPage * CLIPS_PER_PAGE, (clipPage + 1) * CLIPS_PER_PAGE);

  // ── Derived ──
  const trimDuration = trimEnd - trimStart;
  const overLimit = trimDuration > MAX_TRIM + 0.01;
  const timedCount = timestamps.filter((t) => t !== null).length;
  const allSynced = lines.length > 0 && timedCount === lines.length;
  const [editingLineIdx, setEditingLineIdx] = useState<number | null>(null);
  const trimProgress = trimEnd > trimStart
    ? Math.max(0, Math.min((currentTime - trimStart) / (trimEnd - trimStart), 1))
    : 0;

  // ── Shared step indicator ──
  function StepIndicator() {
    return (
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
        {STEP_LABELS.map((s, i) => (
          <div key={s} style={{
            padding: "0.3rem 0.75rem", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700,
            background: i === step ? BLUE : "#F1F5F9",
            color: i === step ? "#fff" : i < step ? "#3A60E7" : "#94a3b8",
            border: `1px solid ${i === step ? BLUE : i < step ? "#BFD0FB" : "#E2E6F0"}`,
          }}>{s}</div>
        ))}
      </div>
    );
  }

  // ── Back/Next button styles ──
  const btnBack: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "0.5rem",
    background: "none", border: "1px solid #E2E6F0", borderRadius: 10,
    padding: "0.625rem 1.25rem", cursor: "pointer",
    fontSize: "0.825rem", fontWeight: 600, color: "#64748b",
  };
  const btnNext = (disabled: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: "0.5rem",
    padding: "0.875rem 2rem", borderRadius: 12, border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#E2E6F0" : `linear-gradient(135deg, ${BLUE}, #4C1AEA)`,
    color: disabled ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: "0.9rem",
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* ── Shared Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.02em" }}>Creative Studio</h1>
          <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "0.25rem" }}>
            {step === 0 && "Upload your track, trim it, and set effects"}
            {step === 1 && "Enter your song lyrics — one line per lyric line"}
            {step === 2 && "Sync each lyric line to the audio with SPACE"}
            {step === 3 && "Choose a background video and customise the look"}
            {step === 4 && "Your creative is saved"}
          </p>
        </div>
        <StepIndicator />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          STEP 0 — AUDIO
      ══════════════════════════════════════════════════════════════ */}
      {step === 0 && (
        <>
          {/* Upload zone */}
          {!audioBuffer && !decoding && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? BLUE : "#E2E6F0"}`,
                borderRadius: 20, padding: "4rem 2rem", textAlign: "center", cursor: "pointer",
                background: dragOver ? "#EEF2FF" : "#F8F9FC", transition: "all 0.15s",
              }}
            >
              <input ref={fileRef} type="file" accept=".mp3,.mpeg,.wav,.flac,.m4a,.ogg,.aac,audio/*" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
              <div style={{ width: 64, height: 64, borderRadius: 18, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <p style={{ fontWeight: 700, color: NAVY, fontSize: "1rem", marginBottom: "0.375rem" }}>Drop your track here</p>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>MP3, WAV, FLAC, M4A or OGG · max 50 MB</p>
              {fileError && <p style={{ color: "#F43F5E", fontSize: "0.8rem", marginTop: "0.75rem" }}>{fileError}</p>}
            </div>
          )}

          {/* Decoding */}
          {decoding && (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "3rem", textAlign: "center" }}>
              <div style={{ width: 40, height: 40, border: `3px solid ${BLUE}`, borderTop: "3px solid transparent", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontWeight: 600, color: NAVY }}>Decoding audio…</p>
            </div>
          )}

          {/* Audio editor */}
          {audioBuffer && !decoding && (
            <>
              {/* File bar */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E6F0", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: NAVY, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{filename}</p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b" }}>Total: {fmtShort(duration)}</p>
                </div>
                <button
                  onClick={() => { stopPlayback(true); setAudioBuffer(null); setAudioUrl(""); setFilename(""); audioFileRef.current = null; setUploadedAudioUrl(""); setAutoTranscribed(false); setTranscribing(false); }}
                  style={{ background: "none", border: "1px solid #E2E6F0", borderRadius: 8, padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}
                >
                  Change file
                </button>
                {transcribing && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.75rem", borderRadius: 8, background: "#EEF2FF", border: "1px solid #BFD0FB" }}>
                    <div style={{ width: 12, height: 12, border: `2px solid ${BLUE}`, borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: BLUE }}>Transcribing lyrics…</span>
                  </div>
                )}
                {autoTranscribed && !transcribing && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.75rem", borderRadius: 8, background: "#F0FDF4", border: "1px solid #86EFAC" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16A34A" }}>Lyrics auto-detected</span>
                  </div>
                )}
              </div>

              {/* Waveform card */}
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>Waveform</p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b" }}>Drag the blue handles to trim · click anywhere to seek</p>
                </div>

                <WaveformCanvas
                  audioBuffer={audioBuffer}
                  duration={duration}
                  trimStart={trimStart}
                  trimEnd={trimEnd}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                  onTrimChange={handleTrimChange}
                />

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, fontFamily: "monospace", marginTop: "-0.5rem" }}>
                  {Array.from({ length: 9 }, (_, i) => {
                    const t = (i / 8) * duration;
                    return <span key={i}>{fmtShort(t)}</span>;
                  })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  {[
                    { label: "Trim Start", value: fmt(trimStart) },
                    { label: "Trim End", value: fmt(trimEnd) },
                    { label: "Duration", value: fmt(trimDuration), highlight: overLimit },
                  ].map((item) => (
                    <div key={item.label} style={{ background: item.highlight ? "#FFF1F2" : "#F8F9FC", borderRadius: 10, padding: "0.75rem 1rem", border: `1px solid ${item.highlight ? "#FECDD3" : "#E2E6F0"}` }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: item.highlight ? "#BE123C" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>{item.label}</p>
                      <p style={{ fontSize: "1rem", fontWeight: 800, color: item.highlight ? "#BE123C" : NAVY, fontFamily: "monospace" }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                {overLimit && (
                  <p style={{ fontSize: "0.78rem", color: "#BE123C", fontWeight: 600 }}>
                    ⚠ Trim to 60 seconds or less to continue
                  </p>
                )}
              </div>

              {/* Playback controls */}
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "1.25rem 1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                <button
                  onClick={togglePlay}
                  style={{ width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(58,96,231,0.35)" }}
                >
                  {isPlaying ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  )}
                </button>

                <div style={{ fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 700, color: NAVY, minWidth: 90, flexShrink: 0 }}>
                  {fmt(currentTime)} / {fmt(trimEnd)}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: 120 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                  <input
                    type="range" min={0} max={1} step={0.01} value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: BLUE }}
                  />
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8", minWidth: 30, textAlign: "right" }}>{Math.round(volume * 100)}%</span>
                </div>

                <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                  {([1, 0.5, 0.25] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      style={{
                        padding: "0.35rem 0.625rem", borderRadius: 8, border: `1.5px solid ${speed === s ? BLUE : "#E2E6F0"}`,
                        background: speed === s ? "#EEF2FF" : "#F8F9FC", cursor: "pointer",
                        fontSize: "0.72rem", fontWeight: 700, color: speed === s ? BLUE : "#64748b",
                      }}
                    >
                      {s === 1 ? "1×" : s === 0.5 ? "½×" : "¼×"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Effects */}
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "1.25rem 1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY, alignSelf: "center", marginRight: "0.5rem" }}>Effects</p>
                {[
                  { label: "Fade In", value: fadeIn, set: setFadeIn, icon: "▶" },
                  { label: "Fade Out", value: fadeOut, set: setFadeOut, icon: "◀" },
                ].map(({ label, value, set, icon }) => (
                  <button
                    key={label}
                    onClick={() => set((v) => !v)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.5rem 1rem", borderRadius: 10,
                      border: `1.5px solid ${value ? BLUE : "#E2E6F0"}`,
                      background: value ? "#EEF2FF" : "#F8F9FC", cursor: "pointer",
                      fontSize: "0.8rem", fontWeight: 700, color: value ? BLUE : "#64748b",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "0.65rem" }}>{icon}</span>
                    {label}
                    {value && <div style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE }} />}
                  </button>
                ))}
              </div>

              {/* Language */}
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "1.25rem 1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>Song Language</p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.15rem" }}>Helps AI transcribe lyrics more accurately</p>
                </div>
                <select
                  value={audioLanguage}
                  onChange={(e) => setAudioLanguage(e.target.value)}
                  style={{
                    marginLeft: "auto", padding: "0.5rem 0.85rem", borderRadius: 10,
                    border: "1.5px solid #E2E6F0", background: "#F8F9FC",
                    fontSize: "0.83rem", fontWeight: 600, color: NAVY,
                    cursor: "pointer", outline: "none",
                  }}
                >
                  <option value="">Auto-detect</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="pt">Portuguese</option>
                  <option value="fr">French</option>
                  <option value="ar">Arabic</option>
                  <option value="hi">Hindi</option>
                  <option value="ko">Korean</option>
                  <option value="tr">Turkish</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="ja">Japanese</option>
                  <option value="ru">Russian</option>
                  <option value="nl">Dutch</option>
                  <option value="pl">Polish</option>
                  <option value="sv">Swedish</option>
                </select>
              </div>

              {/* Continue */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  disabled={overLimit}
                  onClick={() => {
                    if (overLimit) return;
                    stopPlayback(false);
                    pausedAtRef.current = trimStart;
                    setCurrentTime(trimStart);
                    setStep(1);
                    if (audioBuffer) {
                      setTranscribing(true);
                      setAutoTranscribed(false);
                      setTranscriptionFailed(false);
                      setUploadedAudioUrl("");
                      creativeApi.uploadAudio(audioFileRef.current!, () => {}, audioLanguage || undefined)
                        .then((res: { audioUrl: string; transcription?: { segments?: { text: string; start: number; end: number; words?: WordTs[] }[] } }) => {
                          setUploadedAudioUrl(res.audioUrl);
                          const segs = res.transcription?.segments;
                          console.log("[Whisper] trimStart:", trimStart, "trimEnd:", trimEnd);
                          console.log("[Whisper] raw segments:", segs);
                          if (segs && segs.length > 0) {
                            // Only keep segments that fall within the trimmed playback window
                            const inWindow = segs.filter((s) => s.start >= trimStart && s.start < trimEnd);
                            console.log("[Whisper] segments in trim window:", inWindow);
                            const relevant = inWindow.length > 0 ? inWindow : segs;
                            const newLines = relevant.map((s) => s.text.trim()).filter(Boolean);
                            console.log("[Whisper] final lines:", newLines);
                            console.log("[Whisper] final timestamps:", relevant.map((s) => s.start));
                            if (newLines.length > 0) {
                              const lyrTxt = newLines.join("\n");
                              const tss = relevant.map((s) => s.start);
                              const etss = relevant.map((s) => s.end);
                              setLyricsText(lyrTxt);
                              setTimestamps(tss);
                              setEndTimestamps(etss);
                              setWordTimestamps(relevant.map((s) => s.words ?? []));
                              setSyncIndex(newLines.length);
                              setAutoTranscribed(true);
                              setWhisperSnapshot({ lyricsText: lyrTxt, timestamps: tss, endTimestamps: etss });
                            } else {
                              setTranscriptionFailed(true);
                            }
                          } else {
                            setTranscriptionFailed(true);
                          }
                        })
                        .catch(() => { setTranscriptionFailed(true); })
                        .finally(() => setTranscribing(false));
                    }
                  }}
                  style={btnNext(overLimit)}
                >
                  Continue to Lyrics
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STEP 1 — LYRICS
      ══════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <>
          {/* Lyrics input card */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>Song Lyrics</p>
                <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.25rem" }}>
                  One lyric line per line · blank lines are ignored during sync
                </p>
              </div>
              {transcribing && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", borderRadius: 99, background: "#EEF2FF", border: "1px solid #BFD0FB", fontSize: "0.72rem", fontWeight: 700, color: BLUE }}>
                  <div style={{ width: 10, height: 10, border: `2px solid ${BLUE}`, borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Transcribing…
                </div>
              )}
            </div>

            <textarea
              value={lyricsText}
              onChange={(e) => setLyricsText(e.target.value)}
              placeholder={"Verse 1 line one\nVerse 1 line two\nVerse 1 line three\n\nChorus line one\nChorus line two\n\nVerse 2 line one\n..."}
              rows={18}
              style={{
                width: "100%", border: "1.5px solid #E2E6F0", borderRadius: 12,
                padding: "1rem", fontSize: "0.9rem", lineHeight: 2,
                fontFamily: "inherit", color: NAVY, resize: "vertical",
                outline: "none", background: "#F8F9FC", boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => { e.target.style.borderColor = BLUE; }}
              onBlur={(e) => { e.target.style.borderColor = "#E2E6F0"; }}
            />

            {/* Transcription failed notice */}
            {transcriptionFailed && !transcribing && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", padding: "0.875rem 1rem", borderRadius: 12, background: "#FFFBEB", border: "1.5px solid #FCD34D" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.8rem", color: "#92400E", margin: 0 }}>Couldn&apos;t detect lyrics automatically</p>
                  <p style={{ fontSize: "0.75rem", color: "#B45309", margin: 0, marginTop: "0.2rem" }}>
                    Whisper may not have picked up any audio or the result was unclear. Please type your lyrics manually in the box above.
                  </p>
                </div>
              </div>
            )}

            {/* Line count */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                padding: "0.3rem 0.75rem", borderRadius: 99, fontSize: "0.75rem", fontWeight: 700,
                background: lines.length > 0 ? "#EEF2FF" : "#F1F5F9",
                color: lines.length > 0 ? BLUE : "#94a3b8",
                border: `1px solid ${lines.length > 0 ? "#BFD0FB" : "#E2E6F0"}`,
              }}>
                {lines.length} line{lines.length !== 1 ? "s" : ""}
              </div>
              {lines.length === 0 && (
                <p style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Enter at least one lyric line to continue</p>
              )}
            </div>

            {/* Preview */}
            {lines.length > 0 && (
              <div style={{ background: "#F8F9FC", borderRadius: 12, border: "1px solid #E2E6F0", padding: "1rem", maxHeight: 160, overflowY: "auto" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Preview ({lines.length} lines)</p>
                {lines.map((line, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "0.625rem", padding: "0.2rem 0" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#CBD5E1", fontFamily: "monospace", minWidth: 22, textAlign: "right" }}>{i + 1}</span>
                    <span style={{ fontSize: "0.825rem", color: NAVY }}>{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button style={btnBack} onClick={() => setStep(0)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Audio
            </button>
            <button
              disabled={lines.length === 0}
              onClick={() => {
                if (lines.length === 0) return;
                if (!autoTranscribed) {
                  // Manual lyrics — reset for fresh spacebar sync
                  setTimestamps(Array(lines.length).fill(null));
                  setEndTimestamps(Array(lines.length).fill(null));
                  setSyncIndex(0);
                }
                // If Whisper already set timestamps, preserve them as-is
                setSyncActive(false);
                stopPlayback(false);
                pausedAtRef.current = trimStart;
                setCurrentTime(trimStart);
                setStep(2);
              }}
              style={btnNext(lines.length === 0)}
            >
              Continue to Sync
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STEP 2 — SYNC
      ══════════════════════════════════════════════════════════════ */}
      {step === 2 && audioBuffer && (
        <>
          {/* Compact playback bar */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E6F0", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {/* Restart */}
            <button
              onClick={() => { stopPlayback(false); pausedAtRef.current = trimStart; setCurrentTime(trimStart); }}
              title="Restart"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex", alignItems: "center" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 8px rgba(58,96,231,0.3)" }}
            >
              {isPlaying ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              )}
            </button>

            {/* Time */}
            <span style={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700, color: NAVY, flexShrink: 0 }}>
              {fmt(currentTime)} / {fmt(trimEnd)}
            </span>

            {/* Progress bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const t = trimStart + x * (trimEnd - trimStart);
                handleSeek(Math.max(trimStart, Math.min(t, trimEnd)));
              }}
              style={{ flex: 1, height: 6, background: "#E2E6F0", borderRadius: 99, cursor: "pointer", position: "relative", minWidth: 80 }}
            >
              <div style={{ height: "100%", width: `${trimProgress * 100}%`, background: BLUE, borderRadius: 99, transition: "width 0.05s linear" }} />
            </div>

            {/* Volume */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <input type="range" min={0} max={1} step={0.01} value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ width: 72, accentColor: BLUE }} />
            </div>
          </div>

          {/* Line sync card — contains keyboard hint + Timeline Editor */}
          <div style={{
            background: syncActive ? "#EEF2FF" : "#F8F9FC",
            borderRadius: 16,
            border: `1.5px solid ${syncActive ? BLUE : "#E2E6F0"}`,
            padding: "1rem 1.25rem",
            display: "flex", flexDirection: "column", gap: "0.75rem",
            transition: "all 0.2s",
          }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: syncActive ? BLUE : NAVY }}>
                  {syncActive
                    ? allSynced ? "All lines synced!" : "Sync mode active"
                    : syncIndex === 0 ? "Line Sync" : "Sync paused"}
                </p>
                <p style={{ fontSize: "0.78rem", color: syncActive ? "#4338CA" : "#64748b", marginTop: "0.2rem" }}>
                  {syncActive && !allSynced
                    ? `Press SPACE as each line begins · ${timedCount}/${lines.length} lines timed`
                    : allSynced
                    ? `${lines.length} lines synced successfully`
                    : "Press SPACE at the start of each lyric line as the audio plays"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                {syncActive ? (
                  <button
                    onClick={() => { setSyncActive(false); if (isPlaying) pause(); }}
                    style={{ padding: "0.5rem 1.125rem", borderRadius: 10, border: "none", cursor: "pointer", background: "#FEE2E2", color: "#DC2626", fontWeight: 700, fontSize: "0.8rem" }}
                  >
                    Stop Sync
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSyncActive(true);
                      if (!isPlaying) {
                        if (pausedAtRef.current >= trimEnd) {
                          pausedAtRef.current = trimStart;
                          setCurrentTime(trimStart);
                        }
                        startPlayback();
                      }
                    }}
                    style={{ padding: "0.5rem 1.125rem", borderRadius: 10, border: "none", cursor: "pointer", background: BLUE, color: "#fff", fontWeight: 700, fontSize: "0.8rem" }}
                  >
                    {syncIndex === 0 ? "Start Sync" : "Resume Sync"}
                  </button>
                )}
                {whisperSnapshot && (
                  <button
                    onClick={() => {
                      setLyricsText(whisperSnapshot.lyricsText);
                      setTimestamps(whisperSnapshot.timestamps);
                      setEndTimestamps(whisperSnapshot.endTimestamps);
                      setSyncIndex(whisperSnapshot.timestamps.length);
                      setSyncActive(false);
                      stopPlayback(false);
                      pausedAtRef.current = trimStart;
                      setCurrentTime(trimStart);
                    }}
                    title="Reset timestamps back to what Whisper originally detected"
                    style={{ padding: "0.5rem 1rem", borderRadius: 10, border: `1px solid ${syncActive ? "#C7D2FE" : "#E2E6F0"}`, cursor: "pointer", background: "transparent", color: "#6366F1", fontWeight: 600, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                      <path d="M3 3v5h5"/>
                    </svg>
                    Undo to Whisper
                  </button>
                )}
                <button
                  onClick={() => {
                    setTimestamps(Array(lines.length).fill(null));
                    setEndTimestamps(Array(lines.length).fill(null));
                    setSyncIndex(0);
                    setSyncActive(false);
                    stopPlayback(false);
                    pausedAtRef.current = trimStart;
                    setCurrentTime(trimStart);
                  }}
                  style={{ padding: "0.5rem 1rem", borderRadius: 10, border: `1px solid ${syncActive ? "#C7D2FE" : "#E2E6F0"}`, cursor: "pointer", background: "transparent", color: syncActive ? "#4338CA" : "#64748b", fontWeight: 600, fontSize: "0.8rem" }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Keyboard hint */}
            {syncActive && !allSynced && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem" }}>
                <div style={{ background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 8, padding: "0.25rem 0.75rem", fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700, color: "#4338CA", boxShadow: "0 2px 0 #A5B4FC" }}>
                  SPACE
                </div>
                <span style={{ fontSize: "0.78rem", color: "#4338CA", fontWeight: 600 }}>to timestamp the highlighted line</span>
              </div>
            )}

            {/* Timeline — always visible */}
            <div style={{ borderTop: `1px solid ${syncActive ? "#C7D2FE" : "#E2E6F0"}`, paddingTop: "0.75rem" }}>
              <LyricTimeline
                audioBuffer={audioBuffer}
                trimStart={trimStart}
                trimEnd={trimEnd}
                lines={lines}
                timestamps={timestamps}
                onTimestampsChange={setTimestamps}
                currentTime={currentTime}
                onSeek={handleSeek}
                isPlaying={isPlaying}
                onPlayPause={togglePlay}
                endTimestamps={endTimestamps}
                onEndTimestampsChange={setEndTimestamps}
                syncActive={syncActive}
                onAddLine={handleAddLine}
                onDeleteLine={handleDeleteLine}
              />
            </div>
          </div>

          {/* Lyrics sync list */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>
                Lyrics
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ height: 6, width: 6, borderRadius: "50%", background: timedCount === lines.length && lines.length > 0 ? "#22C55E" : BLUE }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>
                  {timedCount}/{lines.length} synced
                </span>
              </div>
            </div>

            <div style={{ maxHeight: 400, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem", paddingRight: "0.25rem" }}>
              {lines.map((line, i) => {
                const ts = timestamps[i];
                const isCurrent = i === syncIndex;
                const isDone = ts !== null;

                return (
                  <div
                    key={i}
                    ref={(el) => { syncLineRefs.current[i] = el; }}
                    onClick={() => { if (!syncActive) setSyncIndex(i); }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.875rem",
                      padding: "0.7rem 0.875rem", borderRadius: 12,
                      background: isCurrent ? "#EEF2FF" : isDone ? "#FAFBFC" : "transparent",
                      border: `1.5px solid ${isCurrent ? BLUE : isDone ? "#E8ECF2" : "transparent"}`,
                      cursor: syncActive ? "default" : "pointer",
                      transition: "all 0.1s",
                      opacity: isDone && !isCurrent ? 0.6 : 1,
                    }}
                  >
                    {/* Line number */}
                    <span style={{ fontFamily: "monospace", fontSize: "0.65rem", fontWeight: 700, color: "#CBD5E1", minWidth: 20, textAlign: "right", flexShrink: 0 }}>
                      {i + 1}
                    </span>

                    {/* Timestamp pill */}
                    <span style={{
                      fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700,
                      minWidth: 56, flexShrink: 0, textAlign: "center",
                      color: isDone ? BLUE : isCurrent ? "#94a3b8" : "#CBD5E1",
                      background: isDone ? "#EEF2FF" : isCurrent ? "#F1F5F9" : "#F8F9FC",
                      padding: "0.2rem 0.5rem", borderRadius: 6,
                      border: `1px solid ${isDone ? "#BFD0FB" : "#E2E6F0"}`,
                    }}>
                      {isDone ? fmt(ts!) : isCurrent && syncActive ? "···" : "—"}
                    </span>

                    {/* Current indicator dot */}
                    {isCurrent && (
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: BLUE, flexShrink: 0, boxShadow: `0 0 0 2px rgba(58,96,231,0.2)` }} />
                    )}

                    {/* Done checkmark */}
                    {isDone && !isCurrent && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}

                    {/* Lyric text — click to edit */}
                    {editingLineIdx === i ? (
                      <input
                        autoFocus
                        defaultValue={line}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={(e) => {
                          const val = e.target.value.trim();
                          if (val) {
                            const updated = [...lines];
                            updated[i] = val;
                            setLyricsText(updated.join("\n"));
                          }
                          setEditingLineIdx(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { (e.target as HTMLInputElement).blur(); }
                          if (e.key === "Escape") { setEditingLineIdx(null); }
                          e.stopPropagation();
                        }}
                        style={{ flex: 1, fontSize: "0.875rem", fontWeight: 700, color: NAVY, background: "#EEF2FF", border: "1.5px solid #BFD0FB", borderRadius: 6, padding: "0.15rem 0.4rem", outline: "none" }}
                      />
                    ) : (
                      <span
                        onClick={(e) => { e.stopPropagation(); if (!syncActive) setEditingLineIdx(i); }}
                        title={syncActive ? undefined : "Click to edit"}
                        style={{
                          fontSize: "0.875rem",
                          color: isDone ? "#64748b" : isCurrent ? NAVY : "#94a3b8",
                          fontWeight: isCurrent ? 700 : 400,
                          flex: 1,
                          cursor: syncActive ? "default" : "text",
                        }}
                      >
                        {line}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Finished sentinel */}
              {syncIndex >= lines.length && lines.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.7rem 0.875rem", borderRadius: 12, background: "#F0FDF4", border: "1.5px solid #86EFAC", marginTop: "0.25rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "#16A34A" }}>All {lines.length} lines synced</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              style={btnBack}
              onClick={() => { stopPlayback(true); setSyncActive(false); setStep(1); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Lyrics
            </button>
            <button
              disabled={!allSynced && !autoTranscribed}
              onClick={() => { if (allSynced || autoTranscribed) { stopPlayback(false); setSyncActive(false); setStep(3); } }}
              style={btnNext(!allSynced && !autoTranscribed)}
            >
              Continue to Style
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 3 — STYLE PICKER
      ════════════════════════════════════════════════════ */}
      {step === 3 && (
        <>
          {/* Loading */}
          {clipsLoading && (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "4rem", textAlign: "center" }}>
              <div style={{ width: 36, height: 36, border: `3px solid ${BLUE}`, borderTop: "3px solid transparent", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontWeight: 600, color: NAVY }}>Loading video library…</p>
            </div>
          )}

          {!clipsLoading && (
            <>
              {/* Upload your own video */}
              <div style={{ border: "1.5px dashed #CBD5E1", borderRadius: 14, padding: "0.875rem 1.125rem", background: "#FAFBFC" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>
                      Upload Your Video
                      <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", fontWeight: 500, color: "#94a3b8" }}>max 60 s · MP4 / MOV / WebM</span>
                    </p>
                  </div>
                  <label style={{
                    cursor: userVideoUploading ? "not-allowed" : "pointer",
                    padding: "0.4rem 1.1rem", borderRadius: 99, fontSize: "0.78rem", fontWeight: 700,
                    background: userVideoUploading ? "#94a3b8" : BLUE, color: "#fff",
                    display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0,
                    opacity: userVideoUploading ? 0.7 : 1, transition: "background 0.15s",
                  }}>
                    {userVideoUploading
                      ? <><span style={{ width: 12, height: 12, border: "2px solid #fff", borderTop: "2px solid transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Uploading…</>
                      : "+ Upload Video"
                    }
                    <input
                      type="file" accept="video/*" style={{ display: "none" }}
                      disabled={userVideoUploading}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadUserVideoFile(f); e.target.value = ""; }}
                    />
                  </label>
                </div>
                {userVideoError && (
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.78rem", color: "#EF4444", fontWeight: 600 }}>{userVideoError}</p>
                )}
                {userClips.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
                    {userClips.map((clip) => (
                      <VideoCard key={clip.id} clip={clip} selected={selectedClips.some((c) => c.id === clip.id)} onSelect={() => toggleClip(clip)} />
                    ))}
                  </div>
                )}
              </div>

              {/* Style filter tabs */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {styleOptions.map((style) => (
                  <button key={style} onClick={() => { setStyleFilter(style); setClipPage(0); }} style={{
                    padding: "0.4rem 1rem", borderRadius: 99, cursor: "pointer",
                    border: `1.5px solid ${styleFilter === style ? BLUE : "#E2E6F0"}`,
                    background: styleFilter === style ? BLUE : "#fff",
                    fontSize: "0.8rem", fontWeight: 700,
                    color: styleFilter === style ? "#fff" : "#64748b",
                    transition: "all 0.15s",
                  }}>
                    {style}
                    {style !== "All" && (
                      <span style={{ marginLeft: "0.375rem", fontSize: "0.68rem", opacity: 0.75 }}>
                        ({clips.filter((c) => c.style === style).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Video grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem" }}>
                {pagedClips.map((clip) => (
                  <VideoCard key={clip.id} clip={clip} selected={selectedClips.some((c) => c.id === clip.id)} onSelect={() => toggleClip(clip)} />
                ))}
                {filteredClips.length === 0 && (
                  <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
                    No clips found for this style
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => setClipPage((p) => Math.max(0, p - 1))}
                    disabled={clipPage === 0}
                    style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #E2E6F0", background: clipPage === 0 ? "#F8F9FC" : "#fff", cursor: clipPage === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: clipPage === 0 ? "#CBD5E1" : "#64748b" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>

                  {getPageNums(clipPage, totalPages).map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", color: "#94a3b8", letterSpacing: "0.05em" }}>…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setClipPage(p)}
                        style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${clipPage === p ? BLUE : "#E2E6F0"}`, background: clipPage === p ? BLUE : "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, color: clipPage === p ? "#fff" : "#64748b", transition: "all 0.15s", flexShrink: 0 }}
                      >
                        {p + 1}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setClipPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={clipPage === totalPages - 1}
                    style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #E2E6F0", background: clipPage === totalPages - 1 ? "#F8F9FC" : "#fff", cursor: clipPage === totalPages - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: clipPage === totalPages - 1 ? "#CBD5E1" : "#64748b" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>

                  <span style={{ fontSize: "0.78rem", color: "#94a3b8", marginLeft: "0.25rem" }}>
                    {clipPage * CLIPS_PER_PAGE + 1}–{Math.min((clipPage + 1) * CLIPS_PER_PAGE, filteredClips.length)} of {filteredClips.length}
                  </span>
                </div>
              )}

              {/* Customisation panel — slides in when clips selected */}
              {selectedClips.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 20, border: `1.5px solid ${BLUE}`, padding: "1.5rem", boxShadow: "0 4px 16px rgba(58,96,231,0.10)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                  {/* ── Tab bar: one tab per selected clip ── */}
                  <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                    {selectedClips.map((clip) => {
                      const isActive = clip.id === activeClipId;
                      return (
                        <button key={clip.id} onClick={() => setActiveClipId(clip.id)}
                          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.75rem 0.4rem 0.4rem", borderRadius: 10, border: `1.5px solid ${isActive ? BLUE : "#E2E6F0"}`, background: isActive ? "#EEF2FF" : "#F8F9FC", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}>
                          <VideoThumb src={clip.url} style={{ width: 20, height: 36, borderRadius: 5, flexShrink: 0 }} />
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: isActive ? BLUE : "#64748b", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.title}</span>
                          <span onClick={(e) => { e.stopPropagation(); toggleClip(clip); }}
                            style={{ marginLeft: "0.25rem", color: "#CBD5E1", fontSize: "0.85rem", lineHeight: 1, cursor: "pointer" }}>×</span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ height: 1, background: "#F1F5F9" }} />

                  {/* ── Per-clip settings (keyed so state resets on tab switch) ── */}
                  {activeClip && (
                    <div key={activeClipId} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                      {/* Creative name */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Creative Name</label>
                        <input value={activeConfig.creativeName} onChange={(e) => updateActiveConfig({ creativeName: e.target.value })} placeholder="Name this creative…"
                          style={{ border: "1.5px solid #E2E6F0", borderRadius: 10, padding: "0.625rem 0.875rem", fontSize: "0.875rem", color: NAVY, outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
                          onFocus={(e) => { e.target.style.borderColor = BLUE; }} onBlur={(e) => { e.target.style.borderColor = "#E2E6F0"; }} />
                      </div>

                      {/* Two-col: Lyric Color + Text Position */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                          <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Lyric Color</label>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {TEXT_COLORS.map((c) => (
                              <button key={c.hex} onClick={() => updateActiveConfig({ textColor: c.hex })} title={c.label}
                                style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${activeConfig.textColor === c.hex ? BLUE : "#E2E6F0"}`, background: c.hex, cursor: "pointer", flexShrink: 0, boxShadow: activeConfig.textColor === c.hex ? `0 0 0 2px rgba(58,96,231,0.2)` : "none", transition: "all 0.15s" }} />
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                          <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Text Position</label>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {(["top", "center", "bottom"] as const).map((pos) => (
                              <button key={pos} onClick={() => updateActiveConfig({ textPosition: pos })} style={{
                                flex: 1, padding: "0.4rem 0.25rem", borderRadius: 8,
                                border: `1.5px solid ${activeConfig.textPosition === pos ? BLUE : "#E2E6F0"}`,
                                background: activeConfig.textPosition === pos ? "#EEF2FF" : "#F8F9FC", cursor: "pointer",
                                fontSize: "0.72rem", fontWeight: 700, color: activeConfig.textPosition === pos ? BLUE : "#64748b",
                                transition: "all 0.15s", textTransform: "capitalize",
                              }}>{pos === "top" ? "↑ Top" : pos === "center" ? "↕ Mid" : "↓ Bot"}</button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Two-col: Font Size + Overlay */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                          <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Font Size</label>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {([["sm", "S"], ["md", "M"], ["lg", "L"]] as const).map(([val, label]) => (
                              <button key={val} onClick={() => updateActiveConfig({ fontSize: val })} style={{
                                flex: 1, padding: "0.4rem", borderRadius: 8,
                                border: `1.5px solid ${activeConfig.fontSize === val ? BLUE : "#E2E6F0"}`,
                                background: activeConfig.fontSize === val ? "#EEF2FF" : "#F8F9FC", cursor: "pointer",
                                fontSize: "0.8rem", fontWeight: 800, color: activeConfig.fontSize === val ? BLUE : "#64748b",
                                transition: "all 0.15s",
                              }}>{label}</button>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Overlay</label>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: NAVY }}>{Math.round(activeConfig.overlayOpacity * 100)}%</span>
                          </div>
                          <input type="range" min={0} max={0.8} step={0.05} value={activeConfig.overlayOpacity}
                            onChange={(e) => updateActiveConfig({ overlayOpacity: parseFloat(e.target.value) })}
                            style={{ accentColor: BLUE, width: "100%", marginTop: "0.25rem" }} />
                        </div>
                      </div>

                      {/* Lyric Animation Style */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Lyric Animation</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem" }}>
                          {LYRIC_STYLES.map((s) => (
                            <button key={s.id} onClick={() => updateActiveConfig({ lyricStyle: s.id })}
                              title={s.desc}
                              style={{ padding: "0.5rem 0.25rem", borderRadius: 10, border: `1.5px solid ${activeConfig.lyricStyle === s.id ? BLUE : "#E2E6F0"}`, background: activeConfig.lyricStyle === s.id ? "#EEF2FF" : "#F8F9FC", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", transition: "all 0.15s" }}>
                              <span style={{ fontSize: "1.1rem" }}>{s.icon}</span>
                              <span style={{ fontSize: "0.6rem", fontWeight: 700, color: activeConfig.lyricStyle === s.id ? BLUE : "#64748b", textAlign: "center", lineHeight: 1.2 }}>{s.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Family */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Font Style</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                          {FONTS.map((f) => (
                            <button key={f.value} onClick={() => updateActiveConfig({ fontFamily: f.value })}
                              style={{ padding: "0.5rem 0.25rem", borderRadius: 10, border: `1.5px solid ${activeConfig.fontFamily === f.value ? BLUE : "#E2E6F0"}`, background: activeConfig.fontFamily === f.value ? "#EEF2FF" : "#F8F9FC", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", transition: "all 0.15s" }}>
                              <span style={{ fontFamily: f.value, fontSize: "0.85rem", fontWeight: 700, color: activeConfig.fontFamily === f.value ? BLUE : NAVY, lineHeight: 1 }}>{f.preview}</span>
                              <span style={{ fontSize: "0.58rem", fontWeight: 600, color: "#94a3b8" }}>{f.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Highlight Color (for Spotlight style) */}
                      {activeConfig.lyricStyle === "spotlight" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                          <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Accent Color</label>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {HIGHLIGHT_COLORS.map((c) => (
                              <button key={c.hex} onClick={() => updateActiveConfig({ highlightColor: c.hex })} title={c.label}
                                style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${activeConfig.highlightColor === c.hex ? BLUE : "#E2E6F0"}`, background: c.hex, cursor: "pointer", flexShrink: 0, boxShadow: activeConfig.highlightColor === c.hex ? `0 0 0 2px rgba(58,96,231,0.2)` : "none", transition: "all 0.15s" }} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Preview */}
                      <div>
                        <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.5rem" }}>Preview — click to play</label>
                        <VideoPreview
                          src={activeClip.url}
                          audioSrc={audioUrl || undefined}
                          audioTrimStart={trimStart}
                          audioTrimEnd={trimEnd}
                          overlayOpacity={activeConfig.overlayOpacity}
                          textColor={activeConfig.textColor}
                          highlightColor={activeConfig.highlightColor}
                          textPosition={activeConfig.textPosition}
                          fontSize={activeConfig.fontSize}
                          lyricStyle={activeConfig.lyricStyle}
                          fontFamily={activeConfig.fontFamily}
                          lines={lines.length > 0 ? lines : ["Your lyric line appears here"]}
                          timestamps={timestamps}
                          endTimestamps={endTimestamps}
                          wordTimestamps={wordTimestamps}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Render error */}
              {renderError && (
                <div style={{ background: "#FFF1F2", border: "1.5px solid #FECDD3", borderRadius: 12, padding: "1rem 1.25rem", fontSize: "0.825rem", fontWeight: 600, color: "#BE123C" }}>
                  {renderError}
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button style={btnBack} onClick={() => setStep(2)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Back to Sync
                </button>
                <button
                  disabled={selectedClips.length === 0 || rendering}
                  onClick={handleRender}
                  style={{ ...btnNext(selectedClips.length === 0 || rendering), minWidth: 180, justifyContent: "center" }}
                >
                  {rendering ? (
                    <>
                      <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      {renderStage === "uploading" ? `Uploading ${uploadProgress}%…` : `Saving ${renderResults.length + 1}/${selectedClips.length}…`}
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                      {selectedClips.length === 0 ? "Select a video first" : selectedClips.length === 1 ? "Render Creative" : `Render ${selectedClips.length} Creatives`}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════
          STEP 4 — RENDER COMPLETE
      ════════════════════════════════════════════════════ */}
      {step === 4 && renderResults.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", paddingTop: "0.5rem" }}>
          <div style={{ background: "#fff", borderRadius: 24, border: "1.5px solid #86EFAC", padding: "2.5rem 2rem", textAlign: "center", maxWidth: 560, width: "100%", boxShadow: "0 4px 24px rgba(34,197,94,0.10)" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg,#22C55E,#16A34A)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
              {renderResults.length === 1 ? "Creative Saved!" : `${renderResults.length} Creatives Saved!`}
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1.5rem" }}>
              {renderResults.length === 1
                ? <><strong style={{ color: NAVY }}>{renderResults[0].name}</strong> has been saved to your library.</>
                : <>{renderResults.length} ads with the same audio &amp; lyrics, different video backgrounds.</>}
            </p>

            {/* Summary pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "1.75rem" }}>
              {[
                { label: `${fmtShort(trimEnd - trimStart)} audio` },
                { label: `${lines.length} lyric lines` },
                { label: `${renderResults.length} creative${renderResults.length > 1 ? "s" : ""}` },
              ].map((item) => (
                <div key={item.label} style={{ padding: "0.3rem 0.75rem", borderRadius: 99, background: "#F1F5F9", border: "1px solid #E2E6F0", fontSize: "0.78rem", fontWeight: 600, color: "#475569" }}>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Per-creative cards */}
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(renderResults.length, 3)}, 1fr)`, gap: "0.75rem", marginBottom: "1.75rem" }}>
              {renderResults.map((r, i) => {
                const cfg = r.config;
                const firstLine = lines[0] ?? "";
                const firstWords = firstLine.split(" ").filter(Boolean);
                const fSize = cfg.fontSize === "sm" ? "0.65rem" : cfg.fontSize === "md" ? "0.78rem" : "0.9rem";
                const align = cfg.textPosition === "top" ? "flex-start" : cfg.textPosition === "center" ? "center" : "flex-end";

                let lyricEl: React.ReactNode;
                if (cfg.lyricStyle === "tiktok") {
                  // Show first 1-2 words in TikTok style
                  const chunk = firstWords.slice(0, firstWords[0]?.length > 8 ? 1 : 2);
                  lyricEl = (
                    <div style={{ display: "flex", justifyContent: "space-between", width: "80%", fontFamily: "'Varela Round', sans-serif", fontSize: fSize, fontWeight: 700, color: cfg.textColor }}>
                      {chunk.map((w, wi) => <span key={wi}>{w}</span>)}
                    </div>
                  );
                } else if (cfg.lyricStyle === "spotlight") {
                  lyricEl = <p style={{ fontFamily: cfg.fontFamily, fontSize: fSize, fontWeight: 900, color: cfg.highlightColor, textAlign: "center", textShadow: `0 0 12px ${cfg.highlightColor}`, margin: 0 }}>{firstLine}</p>;
                } else if (cfg.lyricStyle === "word-by-word") {
                  lyricEl = (
                    <p style={{ fontFamily: cfg.fontFamily, fontSize: fSize, fontWeight: 800, color: cfg.textColor, textAlign: "center", margin: 0 }}>
                      {firstWords.map((w, wi) => (
                        <span key={wi} style={{ color: wi === 0 ? cfg.highlightColor : cfg.textColor, opacity: wi === 0 ? 1 : 0.45 }}>{w} </span>
                      ))}
                    </p>
                  );
                } else {
                  lyricEl = <p style={{ fontFamily: cfg.fontFamily, fontSize: fSize, fontWeight: 800, color: cfg.textColor, textAlign: "center", textShadow: "0 1px 4px rgba(0,0,0,0.8)", margin: 0, lineHeight: 1.3 }}>{firstLine}</p>;
                }

                return (
                  <div key={r.id} style={{ borderRadius: 12, overflow: "hidden", position: "relative", aspectRatio: "9/16", background: "#111827" }}>
                    <VideoThumb src={selectedClips[i]?.url ?? selectedClips[0].url} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1 - cfg.overlayOpacity }} />
                    <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${cfg.overlayOpacity})` }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", padding: "0.75rem", alignItems: align, justifyContent: "center" }}>
                      {lyricEl}
                    </div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.5rem 0.625rem", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                      <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{r.name}</p>
                      <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{r.clipStyle}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Download buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
              {renderResults.map((r, i) => {
                const isThis = downloadingId === r.id;
                const label = renderResults.length === 1 ? "Download Video" : `Download #${i + 1}`;
                return (
                  <button
                    key={r.id}
                    disabled={!!downloadingId}
                    onClick={() => downloadVideoCanvas(r, i)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.4rem",
                      padding: "0.6rem 1.1rem", borderRadius: 10,
                      border: `1.5px solid ${BLUE}`, background: isThis ? "#C7D7FB" : "#EEF2FF",
                      color: BLUE, fontWeight: 700, fontSize: "0.8rem",
                      cursor: downloadingId ? "not-allowed" : "pointer", opacity: downloadingId && !isThis ? 0.5 : 1,
                    }}
                  >
                    {isThis ? (
                      <>
                        <svg style={{ animation: "spin 1s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        Rendering…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        {label}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                onClick={() => {
                  setStep(0);
                  setAudioBuffer(null); setAudioUrl(""); setFilename(""); audioFileRef.current = null;
                  setLyricsText(""); setTimestamps([]); setSyncIndex(0); setSyncActive(false);
                  setSelectedClips([]); setClipConfigs({}); setActiveClipId(null); setBaseCreativeName(""); setRenderResults([]); setRenderError("");
                  setUploadedAudioUrl(""); setAutoTranscribed(false); setTranscribing(false);
                  setClipsLoaded(false);
                }}
                style={{ padding: "0.75rem 1.5rem", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", fontWeight: 700, fontSize: "0.875rem" }}
              >
                Create Another
              </button>
              <button onClick={() => setStep(3)}
                style={{ padding: "0.75rem 1.5rem", borderRadius: 12, border: "1px solid #E2E6F0", cursor: "pointer", background: "#fff", color: "#64748b", fontWeight: 600, fontSize: "0.875rem" }}>
                Edit Style
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800;900&family=Pacifico&family=Orbitron:wght@700;800&family=Dancing+Script:wght@700&family=Space+Grotesk:wght@700;800&family=Nunito:wght@300;400&family=Quicksand:wght@300;400&family=Varela+Round&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes lyr-word {
          0%   { opacity: 0; transform: translateY(10px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lyr-spotlight {
          0%   { opacity: 0; transform: scale(0.6); }
          60%  { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes lyr-echo-in {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lyr-pop {
          0%   { opacity: 0; transform: scale(0.55); }
          65%  { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes lyr-glow {
          0%   { opacity: 0; filter: blur(12px) brightness(2.5); transform: scale(0.9); }
          100% { opacity: 1; filter: blur(0px) brightness(1); transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
