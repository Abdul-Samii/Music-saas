"use client";
import { useEffect, useRef, useState } from "react";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";
const MAX_DURATION = 60;

interface Props {
  file: File;
  onConfirm: (processed: File) => void;
  onCancel: () => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

async function renderVideo(
  src: string,
  startTime: number,
  endTime: number,
  onProgress: (p: number) => void,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadedmetadata", () => {
      const vW = video.videoWidth || 1080;
      const vH = video.videoHeight || 1920;

      // Fit video inside 9:16 with black bars (letterbox/pillarbox)
      const scale = Math.min(720 / vW, 1280 / vH);
      const dw = Math.round(vW * scale);
      const dh = Math.round(vH * scale);
      const dx = Math.round((720 - dw) / 2);
      const dy = Math.round((1280 - dh) / 2);

      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 1280;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 720, 1280);

      const mimeType = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find(
        (m) => MediaRecorder.isTypeSupported(m),
      ) ?? "video/webm";
      const blobType = mimeType.split(";")[0];

      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5_000_000 });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => resolve(new Blob(chunks, { type: blobType }));
      recorder.onerror = (e) => reject(e);

      const dur = endTime - startTime;
      let rafId: number;

      const draw = () => {
        if (video.currentTime >= endTime || video.ended) {
          video.pause();
          cancelAnimationFrame(rafId);
          recorder.stop();
          onProgress(100);
          return;
        }
        onProgress(Math.min(((video.currentTime - startTime) / dur) * 100, 99));
        ctx.fillRect(0, 0, 720, 1280);
        ctx.drawImage(video, 0, 0, vW, vH, dx, dy, dw, dh);
        rafId = requestAnimationFrame(draw);
      };

      video.currentTime = startTime;
      video.addEventListener("seeked", () => {
        recorder.start(100);
        video.play().then(() => { rafId = requestAnimationFrame(draw); }).catch(reject);
      }, { once: true });
    }, { once: true });

    video.addEventListener("error", () => reject(new Error("Video load failed")), { once: true });
    video.load();
  });
}

export default function VideoEditor({ file, onConfirm, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // useState (not useRef) so the video element re-renders with the object URL
  const [src, setSrc] = useState("");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(MAX_DURATION);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onMeta() {
    const v = videoRef.current!;
    const dur = v.duration;
    setDuration(dur);
    setEndTime(Math.min(dur, MAX_DURATION));
    // Seek to first frame so preview isn't black
    v.currentTime = 0.01;
    v.addEventListener("seeked", () => setVideoReady(true), { once: true });
  }

  function seekVideo(t: number) {
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = t; }
  }

  const selectedDur = endTime - startTime;
  const overLimit = selectedDur > MAX_DURATION;

  async function handleProcess() {
    setProcessing(true);
    setProgress(0);
    try {
      const blob = await renderVideo(src, startTime, endTime, setProgress);
      const name = file.name.replace(/\.[^.]+$/, "") + "_trimmed.webm";
      onConfirm(new File([blob], name, { type: blob.type }));
    } catch (e) {
      console.error("Video processing failed:", e);
      setProcessing(false);
    }
  }

  const disabled = processing || overLimit || duration === 0;

  return (
    <>
      <style>{`
        .ve-thumb { -webkit-appearance: none; appearance: none; background: transparent; width: 100%; height: 24px; position: absolute; pointer-events: none; outline: none; margin: 0; top: 0; left: 0; }
        .ve-thumb::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 2.5px solid ${BLUE}; cursor: grab; pointer-events: all; box-shadow: 0 1px 6px rgba(0,0,0,0.2); margin-top: -9px; }
        .ve-thumb::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 2.5px solid ${BLUE}; cursor: grab; pointer-events: all; box-shadow: 0 1px 6px rgba(0,0,0,0.2); border-style: solid; }
        .ve-thumb::-webkit-slider-runnable-track { height: 4px; background: transparent; }
        .ve-thumb::-moz-range-track { height: 4px; background: transparent; }
        @keyframes ve-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ position: "fixed", inset: 0, background: "rgba(11,17,32,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "1.75rem", width: "100%", maxWidth: 500, maxHeight: "95vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Header */}
          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: NAVY, margin: 0 }}>Trim &amp; Format Video</h2>
            <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0.25rem 0 0" }}>
              Preview shows 9:16 crop · max 60 seconds · audio will be muted
            </p>
          </div>

          {/* 9:16 preview */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 155, height: 275, borderRadius: 14, overflow: "hidden", background: "#000", boxShadow: "0 6px 24px rgba(0,0,0,0.35)" }}>
              <video
                ref={videoRef}
                src={src}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                muted playsInline preload="metadata"
                onLoadedMetadata={onMeta}
              />
              {!videoReady && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" style={{ animation: "ve-spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>
              )}
              <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.04em" }}>
                9:16
              </div>
            </div>
          </div>

          {/* Duration info */}
          {duration > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.625rem 0.875rem", background: "#F8F9FC", borderRadius: 10, fontSize: "0.8rem" }}>
              <span style={{ color: "#64748b" }}>Total: <b style={{ color: NAVY }}>{fmt(duration)}</b></span>
              <span style={{ color: "#64748b" }}>
                Selected: <b style={{ color: overLimit ? "#ef4444" : BLUE }}>{fmt(selectedDur)}</b>
                {overLimit && <span style={{ color: "#ef4444", fontSize: "0.72rem" }}> · exceeds 1 min</span>}
              </span>
            </div>
          )}

          {/* Trim slider */}
          {duration > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Select clip range
              </label>

              <div style={{ position: "relative", height: 24, display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", left: 0, right: 0, height: 4, background: "#E2E6F0", borderRadius: 2, pointerEvents: "none" }} />
                <div style={{
                  position: "absolute",
                  left: `${(startTime / duration) * 100}%`,
                  width: `${((endTime - startTime) / duration) * 100}%`,
                  height: 4, borderRadius: 2,
                  background: overLimit ? "#ef4444" : BLUE,
                  pointerEvents: "none",
                  transition: "background 0.15s",
                }} />
                <input
                  type="range" className="ve-thumb"
                  min={0} max={duration} step={0.1} value={startTime}
                  style={{ zIndex: startTime > duration * 0.85 ? 5 : 3 }}
                  onChange={(e) => {
                    const v = Math.min(Number(e.target.value), endTime - 0.5);
                    setStartTime(v);
                    seekVideo(v);
                  }}
                />
                <input
                  type="range" className="ve-thumb"
                  min={0} max={duration} step={0.1} value={endTime}
                  style={{ zIndex: endTime < duration * 0.15 ? 5 : 3 }}
                  onChange={(e) => {
                    const v = Math.max(Number(e.target.value), startTime + 0.5);
                    setEndTime(v);
                    seekVideo(v);
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                <div>
                  <div style={{ color: "#94a3b8", fontSize: "0.68rem", marginBottom: 2 }}>Start</div>
                  <div style={{ fontWeight: 700, color: NAVY, fontVariantNumeric: "tabular-nums" }}>{fmt(startTime)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#94a3b8", fontSize: "0.68rem", marginBottom: 2 }}>End</div>
                  <div style={{ fontWeight: 700, color: NAVY, fontVariantNumeric: "tabular-nums" }}>{fmt(endTime)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Processing progress */}
          {processing && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                <span style={{ color: "#64748b" }}>Processing video…</span>
                <span style={{ fontWeight: 700, color: NAVY }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 6, background: "#E2E6F0", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${BLUE}, #4C1AEA)`, borderRadius: 3, transition: "width 0.3s" }} />
              </div>
              <p style={{ fontSize: "0.72rem", color: "#94a3b8", margin: 0 }}>
                Cropping to 9:16 and trimming in real-time — please keep this tab open.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={onCancel}
              disabled={processing}
              style={{ flex: 1, padding: "0.75rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontWeight: 600, fontSize: "0.875rem", color: "#64748b", background: "#fff", cursor: processing ? "not-allowed" : "pointer", opacity: processing ? 0.5 : 1 }}
            >
              Cancel
            </button>
            <button
              onClick={handleProcess}
              disabled={disabled}
              style={{
                flex: 2, padding: "0.75rem", border: "none", borderRadius: 10,
                fontWeight: 700, fontSize: "0.875rem",
                background: disabled ? "#E2E6F0" : `linear-gradient(135deg, ${BLUE}, #4C1AEA)`,
                color: disabled ? "#94a3b8" : "#fff",
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {processing ? "Processing…" : "Use this clip →"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
