"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";
const MAX_TRIM = 60;
const STEP_LABELS = ["Audio", "Lyrics", "Sync", "Style", "Render"] as const;

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

  // ── Audio helpers ──
  function getCtx() {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }

  async function handleFile(file: File) {
    const allowed = /\.(mp3|wav|flac|m4a|ogg|aac)$/i;
    if (!allowed.test(file.name)) {
      setFileError("Please upload an MP3, WAV, FLAC, M4A or OGG file.");
      return;
    }
    setFileError("");
    setDecoding(true);
    stopPlayback(true);

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setFilename(file.name.replace(/\.[^.]+$/, ""));

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
              <input ref={fileRef} type="file" accept=".mp3,.wav,.flac,.m4a,.ogg,.aac,audio/*" style={{ display: "none" }}
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
                  onClick={() => { stopPlayback(true); setAudioBuffer(null); setAudioUrl(""); setFilename(""); }}
                  style={{ background: "none", border: "1px solid #E2E6F0", borderRadius: 8, padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}
                >
                  Change file
                </button>
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
                  onClick={() => { if (!overLimit) { stopPlayback(false); pausedAtRef.current = trimStart; setCurrentTime(trimStart); setStep(1); } }}
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
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>Song Lyrics</p>
              <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.25rem" }}>
                One lyric line per line · blank lines are ignored during sync
              </p>
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

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
