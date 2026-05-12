"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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

type LyricStyle = "word-by-word" | "spotlight" | "echo" | "pop" | "glow";

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
  { id: "word-by-word", label: "Word by Word", desc: "Sentence builds word by word",     icon: "✍️" },
  { id: "spotlight",    label: "Spotlight",    desc: "One big word at a time, highlighted", icon: "🔦" },
  { id: "echo",         label: "Echo",         desc: "Double-line ghost effect",          icon: "〰️" },
  { id: "pop",          label: "Pop",          desc: "Elastic scale pop",                  icon: "💥" },
  { id: "glow",         label: "Glow",         desc: "Blurs in with glow",                icon: "🌟" },
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

  function getPosTime(e: React.MouseEvent | MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const x = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    return x * duration;
  }

  function onMouseDown(e: React.MouseEvent) {
    const t = getPosTime(e);
    const threshold = duration * 0.025;
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

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragRef.current) return;
      const t = getPosTime(e);
      if (dragRef.current === "start") {
        const ns = Math.max(0, Math.min(t, trimEnd - 1));
        onTrimChange(ns, trimEnd);
      } else if (dragRef.current === "end") {
        const ne = Math.min(duration, Math.max(t, trimStart + 1), trimStart + MAX_TRIM);
        onTrimChange(trimStart, ne);
      } else {
        onSeek(Math.max(trimStart, Math.min(t, trimEnd)));
      }
    }
    function onUp() { dragRef.current = null; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, trimStart, trimEnd, onSeek, onTrimChange]);

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      style={{ position: "relative", width: "100%", height: 96, cursor: "crosshair", userSelect: "none" }}
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
function VideoPreview({ src, audioSrc, audioTrimStart, audioTrimEnd, overlayOpacity, textColor, highlightColor, textPosition, fontSize, lyricStyle, fontFamily, lines, timestamps }: {
  src: string; audioSrc?: string; audioTrimStart?: number; audioTrimEnd?: number;
  overlayOpacity: number; textColor: string; highlightColor: string;
  textPosition: "top" | "center" | "bottom"; fontSize: "sm" | "md" | "lg";
  lyricStyle: LyricStyle; fontFamily: string; lines: string[];
  timestamps?: (number | null)[];
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  // Fallback timer state (used only when no timestamps)
  const [timerLine, setTimerLine] = useState(0);
  const [timerWord, setTimerWord] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const prevLineRef = useRef(-1);

  const safeLines = useMemo(() => lines.length > 0 ? lines : ["Your lyric appears here"], [lines]);

  // Resolve timestamps — fill null gaps with linear interpolation
  const safeTimes = useMemo((): number[] | null => {
    if (!timestamps || timestamps.length === 0) return null;
    return timestamps.map((t, i) => {
      if (t !== null) return t;
      for (let j = i - 1; j >= 0; j--) if (timestamps[j] !== null) return (timestamps[j] as number) + (i - j) * 2;
      return i * 2;
    });
  }, [timestamps]);

  const hasSync = !!(safeTimes && safeTimes.length > 0);

  // Audio element — track currentTime for lyric sync, loop within trim region
  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    const start = audioTrimStart ?? 0;
    const end = audioTrimEnd;
    audio.currentTime = start;
    function onTimeUpdate() {
      setAudioTime(Math.max(0, audio.currentTime - start));
      if (end && audio.currentTime >= end) { audio.currentTime = start; setAudioTime(0); audio.play().catch(() => {}); }
    }
    audio.addEventListener("timeupdate", onTimeUpdate);
    audioRef.current = audio;
    return () => { audio.removeEventListener("timeupdate", onTimeUpdate); audio.pause(); audioRef.current = null; };
  }, [audioSrc, audioTrimStart, audioTrimEnd]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().then(() => { setPlaying(true); audioRef.current?.play().catch(() => {}); }).catch(() => {});
    return () => { v.pause(); audioRef.current?.pause(); };
  }, [src]);

  // ── Active line from audio time ──
  const activeLineIndex = useMemo(() => {
    if (!hasSync) return timerLine;
    let idx = 0;
    for (let i = 0; i < safeTimes!.length; i++) { if (audioTime >= safeTimes![i]) idx = i; else break; }
    return Math.min(idx, safeLines.length - 1);
  }, [audioTime, safeTimes, timerLine, hasSync, safeLines.length]);

  // Fire animation when line changes
  useEffect(() => {
    if (activeLineIndex !== prevLineRef.current) {
      setAnimKey((k) => k + 1);
      if (!hasSync) setTimerWord(0);
      prevLineRef.current = activeLineIndex;
    }
  }, [activeLineIndex, hasSync]);

  // ── Fallback timers — only active when no timestamps ──
  useEffect(() => {
    if (lyricStyle !== "word-by-word" || !playing || hasSync) return;
    const words = (safeLines[timerLine] || "").split(" ").filter(Boolean);
    if (timerWord < words.length - 1) {
      const t = setTimeout(() => { setTimerWord((w) => w + 1); setAnimKey((k) => k + 1); }, 340);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setTimerLine((l) => (l + 1) % safeLines.length); setTimerWord(0); setAnimKey((k) => k + 1); }, 1600);
    return () => clearTimeout(t);
  }, [lyricStyle, timerLine, timerWord, safeLines, playing, hasSync]);

  const allWords = useMemo(() => safeLines.flatMap((l) => l.split(" ").filter(Boolean)), [safeLines]);

  useEffect(() => {
    if (lyricStyle !== "spotlight" || !playing || hasSync) return;
    const t = setInterval(() => { setTimerWord((w) => (w + 1) % allWords.length); setAnimKey((k) => k + 1); }, 650);
    return () => clearInterval(t);
  }, [lyricStyle, allWords.length, playing, hasSync]);

  useEffect(() => {
    if (lyricStyle === "word-by-word" || lyricStyle === "spotlight" || !playing || hasSync) return;
    const t = setInterval(() => { setTimerLine((i) => (i + 1) % safeLines.length); setAnimKey((k) => k + 1); }, 2400);
    return () => clearInterval(t);
  }, [lyricStyle, safeLines.length, playing, hasSync]);

  // ── Time-driven word index (word-by-word) ──
  const activeWordIndex = useMemo(() => {
    if (!hasSync) return timerWord;
    const lineStart = safeTimes![activeLineIndex] ?? 0;
    const lineEnd = safeTimes![activeLineIndex + 1] ?? (lineStart + 5);
    const words = (safeLines[activeLineIndex] || "").split(" ").filter(Boolean);
    if (!words.length) return 0;
    const elapsed = Math.max(0, audioTime - lineStart);
    return Math.min(Math.floor((elapsed / Math.max(0.1, lineEnd - lineStart)) * words.length), words.length - 1);
  }, [audioTime, safeTimes, activeLineIndex, safeLines, timerWord, hasSync]);

  // ── Time-driven spotlight word ──
  const activeSpotlightWord = useMemo(() => {
    if (!hasSync) return timerWord;
    let globalIdx = 0;
    for (let li = 0; li < safeLines.length; li++) {
      const lineStart = safeTimes![li] ?? 0;
      const lineEnd = safeTimes![li + 1] ?? (lineStart + 5);
      const words = safeLines[li].split(" ").filter(Boolean);
      if (audioTime >= lineStart && (li === safeLines.length - 1 || audioTime < (safeTimes![li + 1] ?? Infinity))) {
        const elapsed = Math.max(0, audioTime - lineStart);
        const wIdx = Math.min(Math.floor((elapsed / Math.max(0.1, lineEnd - lineStart)) * words.length), words.length - 1);
        return globalIdx + wIdx;
      }
      globalIdx += words.length;
    }
    return 0;
  }, [audioTime, safeTimes, safeLines, timerWord, hasSync]);

  function toggle() {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); audioRef.current?.pause(); setPlaying(false); }
    else { ref.current.play().catch(() => {}); audioRef.current?.play().catch(() => {}); setPlaying(true); }
  }

  const fSize = fontSize === "sm" ? "0.9rem" : fontSize === "md" ? "1.15rem" : "1.4rem";
  const textStyle: React.CSSProperties = {
    color: textColor, fontWeight: 800, textAlign: "center", lineHeight: 1.35,
    fontSize: fSize, textShadow: "0 2px 14px rgba(0,0,0,0.95)", margin: 0,
    fontFamily, letterSpacing: "0.02em",
  };

  function renderLyric() {
    if (lyricStyle === "word-by-word") {
      const words = (safeLines[activeLineIndex] || "").split(" ").filter(Boolean);
      const revealed = words.slice(0, activeWordIndex + 1);
      return (
        <p style={textStyle}>
          {revealed.slice(0, -1).join(" ")}
          {revealed.length > 1 ? " " : ""}
          <span key={`${activeLineIndex}-${activeWordIndex}`} style={{ display: "inline", animation: "lyr-word 0.28s ease forwards" }}>
            {revealed[revealed.length - 1]}
          </span>
        </p>
      );
    }
    if (lyricStyle === "spotlight") {
      const word = allWords[activeSpotlightWord % allWords.length] || "";
      const isHighlighted = activeSpotlightWord % 3 === 0 || activeSpotlightWord % 7 === 4;
      return (
        <p key={`spot-${activeSpotlightWord}`} style={{ ...textStyle, fontSize: fontSize === "sm" ? "1.5rem" : fontSize === "md" ? "2rem" : "2.6rem",
          color: isHighlighted ? highlightColor : textColor,
          animation: "lyr-spotlight 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
          textShadow: isHighlighted ? `0 0 24px ${highlightColor}88, 0 2px 14px rgba(0,0,0,0.95)` : textStyle.textShadow,
        }}>
          {word}
        </p>
      );
    }
    if (lyricStyle === "echo") {
      const line = safeLines[activeLineIndex] || "";
      return (
        <div key={animKey} style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "lyr-echo-in 0.5s ease forwards" }}>
          <p style={{ ...textStyle, margin: 0 }}>{line}</p>
          <p style={{ ...textStyle, margin: "-0.35em 0 0 0", opacity: 0.28, filter: "blur(2.5px)", transform: "scaleY(-1) scaleX(0.97)", fontSize: `calc(${fSize} * 0.85)` }}>{line}</p>
        </div>
      );
    }
    if (lyricStyle === "glow") {
      return (
        <p key={animKey} style={{ ...textStyle, animation: "lyr-glow 0.6s ease forwards" }}>
          <span style={{ filter: "drop-shadow(0 0 10px currentColor)" }}>{safeLines[activeLineIndex]}</span>
        </p>
      );
    }
    return (
      <p key={animKey} style={{ ...textStyle, animation: "lyr-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards" }}>
        {safeLines[activeLineIndex]}
      </p>
    );
  }

  return (
    <div onClick={toggle} style={{ borderRadius: 14, overflow: "hidden", position: "relative", aspectRatio: "9/16", background: "#000", maxWidth: 300, margin: "0 auto", cursor: "pointer" }}>
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
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState("");
  const [autoTranscribed, setAutoTranscribed] = useState(false);

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

  // ── Audio helpers ──
  function getCtx() {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }

  function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length * numChannels * 2;
    const arrayBuf = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuf);
    const write = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
    const u16 = (o: number, v: number) => view.setUint16(o, v, true);
    const u32 = (o: number, v: number) => view.setUint32(o, v, true);
    write(0, "RIFF"); u32(4, 36 + length); write(8, "WAVE");
    write(12, "fmt "); u32(16, 16); u16(20, 1); u16(22, numChannels);
    u32(24, sampleRate); u32(28, sampleRate * numChannels * 2); u16(32, numChannels * 2); u16(34, 16);
    write(36, "data"); u32(40, length);
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        offset += 2;
      }
    }
    return new Blob([arrayBuf], { type: "audio/wav" });
  }

  function extractTrimmedAudioFile(buffer: AudioBuffer, start: number, end: number): File {
    const sampleRate = buffer.sampleRate;
    const startSample = Math.floor(start * sampleRate);
    const endSample = Math.floor(end * sampleRate);
    const frameCount = endSample - startSample;
    const trimmed = new OfflineAudioContext(buffer.numberOfChannels, frameCount, sampleRate).createBuffer(
      buffer.numberOfChannels, frameCount, sampleRate
    );
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      trimmed.getChannelData(ch).set(buffer.getChannelData(ch).subarray(startSample, endSample));
    }
    return new File([audioBufferToWav(trimmed)], "trimmed.wav", { type: "audio/wav" });
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

  // ── Spacebar sync handler ──
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
  const overLimit = trimDuration > MAX_TRIM;
  const timedCount = timestamps.filter((t) => t !== null).length;
  const allSynced = lines.length > 0 && timedCount === lines.length;
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
                      setUploadedAudioUrl("");
                      const trimmedFile = extractTrimmedAudioFile(audioBuffer, trimStart, trimEnd);
                      creativeApi.uploadAudio(trimmedFile, () => {})
                        .then((res: { audioUrl: string; transcription?: { segments?: { text: string; start: number; end: number }[] } }) => {
                          setUploadedAudioUrl(res.audioUrl);
                          const segs = res.transcription?.segments;
                          if (segs && segs.length > 0) {
                            const newLines = segs.map((s) => s.text.trim()).filter(Boolean);
                            setLyricsText(newLines.join("\n"));
                            setTimestamps(segs.map((s) => s.start));
                            setSyncIndex(newLines.length);
                            setAutoTranscribed(true);
                          }
                        })
                        .catch(() => {})
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
                  {autoTranscribed ? "AI-transcribed · edit freely" : "One lyric line per line · blank lines are ignored during sync"}
                </p>
              </div>
              {transcribing && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", borderRadius: 99, background: "#EEF2FF", border: "1px solid #BFD0FB", fontSize: "0.72rem", fontWeight: 700, color: BLUE }}>
                  <div style={{ width: 10, height: 10, border: `2px solid ${BLUE}`, borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Transcribing…
                </div>
              )}
              {autoTranscribed && !transcribing && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", borderRadius: 99, background: "#F0FDF4", border: "1px solid #86EFAC", fontSize: "0.72rem", fontWeight: 700, color: "#16A34A" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  AI Transcribed
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
                setTimestamps(Array(lines.length).fill(null));
                setSyncIndex(0);
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

          {/* Sync control banner */}
          <div style={{
            background: syncActive ? "#EEF2FF" : "#F8F9FC",
            borderRadius: 16,
            border: `1.5px solid ${syncActive ? BLUE : "#E2E6F0"}`,
            padding: "1.25rem 1.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap",
            transition: "all 0.2s",
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9rem", color: syncActive ? BLUE : NAVY }}>
                {syncActive
                  ? allSynced ? "All lines synced!" : "Sync mode active"
                  : syncIndex === 0 ? "Ready to sync" : "Sync paused"}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.25rem" }}>
                {syncActive && !allSynced
                  ? `Press SPACE as each line begins · ${timedCount}/${lines.length} lines timed`
                  : allSynced
                  ? `${lines.length} lines synced successfully`
                  : "Click Start Sync, then press SPACE at the start of each lyric line as the audio plays"}
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
              <button
                onClick={() => {
                  setTimestamps(Array(lines.length).fill(null));
                  setSyncIndex(0);
                  setSyncActive(false);
                  stopPlayback(false);
                  pausedAtRef.current = trimStart;
                  setCurrentTime(trimStart);
                }}
                style={{ padding: "0.5rem 1rem", borderRadius: 10, border: "1px solid #E2E6F0", cursor: "pointer", background: "#fff", color: "#64748b", fontWeight: 600, fontSize: "0.8rem" }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* AI auto-synced notice */}
          {autoTranscribed && allSynced && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.875rem 1.25rem", borderRadius: 12, background: "#F0FDF4", border: "1.5px solid #86EFAC" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.825rem", color: "#16A34A" }}>Auto-synced by Whisper AI</p>
                <p style={{ fontSize: "0.75rem", color: "#4ADE80" }}>All {lines.length} lines have timestamps from transcription · you can still adjust manually</p>
              </div>
            </div>
          )}

          {/* Keyboard hint */}
          {syncActive && !allSynced && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem" }}>
              <div style={{ background: "#F1F5F9", border: "1px solid #E2E6F0", borderRadius: 8, padding: "0.25rem 0.75rem", fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700, color: "#475569", boxShadow: "0 2px 0 #CBD5E1" }}>
                SPACE
              </div>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>to timestamp the highlighted line</span>
            </div>
          )}

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

                    {/* Lyric text */}
                    <span style={{
                      fontSize: "0.875rem",
                      color: isDone ? "#64748b" : isCurrent ? NAVY : "#94a3b8",
                      fontWeight: isCurrent ? 700 : 400,
                      flex: 1,
                    }}>
                      {line}
                    </span>
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
              disabled={!allSynced}
              onClick={() => { if (allSynced) { stopPlayback(false); setStep(3); } }}
              style={btnNext(!allSynced)}
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem" }}>
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
              {renderResults.map((r, i) => (
                <div key={r.id} style={{ borderRadius: 12, overflow: "hidden", position: "relative", aspectRatio: "9/16", background: "#111827" }}>
                  <VideoThumb src={selectedClips[i]?.url ?? selectedClips[0].url} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1 - r.config.overlayOpacity }} />
                  <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${r.config.overlayOpacity})` }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", padding: "0.75rem",
                    alignItems: r.config.textPosition === "top" ? "flex-start" : r.config.textPosition === "center" ? "center" : "flex-end",
                    justifyContent: "center" }}>
                    <p style={{ color: r.config.textColor, fontWeight: 800, textAlign: "center", lineHeight: 1.3,
                      fontSize: r.config.fontSize === "sm" ? "0.65rem" : r.config.fontSize === "md" ? "0.78rem" : "0.9rem",
                      textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                      {lines[0] ?? ""}
                    </p>
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.5rem 0.625rem", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                    <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.clipTitle}</p>
                    <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{r.clipStyle}</span>
                  </div>
                </div>
              ))}
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800;900&family=Pacifico&family=Orbitron:wght@700;800&family=Dancing+Script:wght@700&family=Space+Grotesk:wght@700;800&display=swap');
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
