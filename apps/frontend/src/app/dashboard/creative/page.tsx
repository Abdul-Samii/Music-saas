"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { creativeApi } from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Segment { text: string; start: number; end: number; }
interface VideoClip {
  id: string; title: string; style: string;
  duration: number; url: string; thumbnail: string;
}
interface Creative {
  id: string; name: string; audioUrl: string;
  videoClipUrl: string; lyricsJson: unknown; status: string; createdAt: string;
}

type Step = 0 | 1 | 2;
const STEP_LABELS = ["Upload Track", "Pick Visual", "Generate"];

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtDur(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function StepHeader({ step }: { step: Step }) {
  return (
    <div style={{ display: "flex", gap: "0", marginBottom: "2rem" }}>
      {STEP_LABELS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={label} style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700,
                background: done ? "#12B76A" : active ? "var(--primary)" : "var(--bg-elevated)",
                color: done || active ? "#fff" : "var(--text-muted)",
                border: `2px solid ${done ? "#12B76A" : active ? "var(--primary)" : "var(--border)"}`,
                transition: "all 0.2s",
              }}>
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : i + 1}
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: active ? "var(--primary)" : done ? "#12B76A" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: "0 0.5rem", marginBottom: "1.25rem", background: done ? "#12B76A" : "var(--border)", transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Upload + Transcribe ────────────────────────────────────────────────
function UploadStep({
  onDone,
}: {
  onDone: (audioUrl: string, filename: string, lyrics: string, segments: Segment[]) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [segments, setSegments] = useState<Segment[]>([]);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file) return;
    const allowed = ["audio/mpeg", "audio/wav", "audio/flac", "audio/mp4", "audio/x-m4a"];
    if (!allowed.includes(file.type) && !file.name.match(/\.(mp3|wav|flac|m4a)$/i)) {
      setError("Please upload an MP3, WAV, FLAC or M4A file.");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(0);
    try {
      const result = await creativeApi.uploadAudio(file, setProgress) as {
        audioUrl: string; filename: string;
        transcription: { text: string; segments: Segment[] };
      };
      setAudioUrl(result.audioUrl);
      setFilename(result.filename);
      setLyrics(result.transcription.text || "");
      setSegments(result.transcription.segments || []);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Drop zone */}
      {!audioUrl && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "var(--primary)" : "var(--border)"}`,
            borderRadius: 16, padding: "3rem 2rem", textAlign: "center", cursor: "pointer",
            background: dragging ? "var(--primary-light)" : "var(--bg-elevated)",
            transition: "all 0.15s",
          }}
        >
          <input ref={fileRef} type="file" accept=".mp3,.wav,.flac,.m4a,audio/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.375rem" }}>Drop your track here</p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>MP3, WAV, FLAC or M4A · max 50 MB</p>
        </div>
      )}

      {/* Uploading state */}
      {uploading && (
        <div style={{ background: "var(--bg-elevated)", borderRadius: 12, padding: "1.25rem", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.625rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>Uploading &amp; transcribing…</span>
            <span style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--primary), #4C1AEA)", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            {progress === 100 ? "Transcribing with AI…" : "Uploading…"}
          </p>
        </div>
      )}

      {/* Uploaded — show audio info + lyrics */}
      {audioUrl && !uploading && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", background: "rgba(18,183,106,0.08)", borderRadius: 12, border: "1px solid rgba(18,183,106,0.25)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#12B76A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.875rem" }}>{filename}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Uploaded successfully</p>
            </div>
            <button onClick={() => { setAudioUrl(""); setFilename(""); setLyrics(""); setSegments([]); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.8rem" }}>
              Change
            </button>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Lyrics
                {segments.length > 0 && (
                  <span style={{ marginLeft: "0.5rem", fontSize: "0.72rem", color: "#12B76A", fontWeight: 600 }}>✓ AI transcribed</span>
                )}
              </label>
              {segments.length === 0 && (
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Enter manually — no OPENAI_API_KEY set</span>
              )}
            </div>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Paste or type your lyrics here…"
              rows={8}
              style={{
                width: "100%", padding: "0.875rem 1rem", borderRadius: 10,
                border: "1.5px solid var(--border)", background: "var(--bg-elevated)",
                color: "var(--text-primary)", fontSize: "0.875rem", lineHeight: 1.7,
                resize: "vertical", fontFamily: "inherit", outline: "none",
              }}
            />
          </div>
        </>
      )}

      {error && <p style={{ color: "#F43F5E", fontSize: "0.8125rem" }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn btn-primary"
          disabled={!audioUrl || uploading}
          onClick={() => onDone(audioUrl, filename, lyrics, segments)}
        >
          Next: Pick a Visual →
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Video Library ──────────────────────────────────────────────────────
function VideoStep({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: (clip: VideoClip) => void;
}) {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<VideoClip | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [styleFilter, setStyleFilter] = useState("All");

  useEffect(() => {
    creativeApi.videoLibrary()
      .then((d) => setClips((d as { clips: VideoClip[] }).clips))
      .catch(() => setClips([]))
      .finally(() => setLoading(false));
  }, []);

  const styles = ["All", ...Array.from(new Set(clips.map((c) => c.style)))];
  const visible = styleFilter === "All" ? clips : clips.filter((c) => c.style === styleFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Style filter */}
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
        {styles.map((s) => (
          <button
            key={s}
            onClick={() => setStyleFilter(s)}
            style={{
              padding: "0.35rem 0.875rem", borderRadius: 99, border: "1.5px solid",
              cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, transition: "all 0.15s",
              borderColor: styleFilter === s ? "var(--primary)" : "var(--border)",
              background: styleFilter === s ? "var(--primary-light)" : "var(--bg-elevated)",
              color: styleFilter === s ? "var(--primary)" : "var(--text-muted)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Clip grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem" }}>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} style={{ aspectRatio: "16/9", borderRadius: 12, background: "var(--bg-elevated)", animation: "pulse 1.4s ease-in-out infinite" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem" }}>
          {visible.map((clip) => {
            const isSelected = selected?.id === clip.id;
            const isHovered = hoveredId === clip.id;
            return (
              <div
                key={clip.id}
                onClick={() => setSelected(clip)}
                onMouseEnter={() => setHoveredId(clip.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer",
                  border: `2px solid ${isSelected ? "var(--primary)" : "transparent"}`,
                  boxShadow: isSelected ? "0 0 0 3px var(--primary-light)" : "none",
                  transition: "all 0.15s", aspectRatio: "16/9",
                }}
              >
                {isHovered ? (
                  <video
                    src={clip.url} autoPlay muted loop playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={clip.thumbnail} alt={clip.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
                <div style={{
                  position: "absolute", inset: 0, background: isSelected ? "rgba(58,96,231,0.15)" : "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                  transition: "all 0.15s",
                }}>
                  {isSelected && (
                    <div style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.5rem 0.625rem" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff", marginBottom: "0.125rem" }}>{clip.title}</p>
                  <div style={{ display: "flex", gap: "0.375rem" }}>
                    <span style={{ fontSize: "0.65rem", background: "rgba(255,255,255,0.2)", color: "#fff", padding: "0.1rem 0.375rem", borderRadius: 99 }}>{clip.style}</span>
                    <span style={{ fontSize: "0.65rem", background: "rgba(0,0,0,0.4)", color: "#fff", padding: "0.1rem 0.375rem", borderRadius: 99 }}>{fmtDur(clip.duration)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: "var(--primary-light)", borderRadius: 10, border: "1px solid var(--border-focus)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>
          <span style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 600 }}>
            Selected: {selected.title} ({selected.style} · {fmtDur(selected.duration)})
          </span>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button
          className="btn btn-primary"
          disabled={!selected}
          onClick={() => selected && onDone(selected)}
        >
          Next: Generate →
        </button>
      </div>
    </div>
  );
}

// ── Step 3: Generate ────────────────────────────────────────────────────────────
function GenerateStep({
  audioUrl,
  filename,
  lyrics,
  segments,
  clip,
  onBack,
  onFinish,
}: {
  audioUrl: string;
  filename: string;
  lyrics: string;
  segments: Segment[];
  clip: VideoClip;
  onBack: () => void;
  onFinish: (creative: Creative) => void;
}) {
  const [name, setName] = useState(filename.replace(/\.[^.]+$/, "") || "My Creative");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setGenerating(true);
    setError("");
    try {
      const result = await creativeApi.render({
        name,
        audioUrl,
        videoClipUrl: clip.url,
        lyricsJson: { text: lyrics, segments },
      }) as { jobId: string; status: string; creative: Creative };
      onFinish(result.creative);
    } catch {
      setError("Generation failed. Please try again.");
      setGenerating(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ padding: "1rem 1.25rem", background: "var(--bg-elevated)", borderRadius: 12, border: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Audio Track</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{filename}</p>
          </div>
          {lyrics && <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>{lyrics.slice(0, 60)}{lyrics.length > 60 ? "…" : ""}</p>}
        </div>

        <div style={{ padding: "1rem 1.25rem", background: "var(--bg-elevated)", borderRadius: 12, border: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Visual Clip</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={clip.thumbnail} alt={clip.title} style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{clip.title}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{clip.style} · {fmtDur(clip.duration)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Creative name */}
      <div>
        <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "0.5rem" }}>Creative Name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Creative"
          maxLength={80}
        />
      </div>

      {/* Lyrics preview */}
      {lyrics && (
        <div style={{ padding: "1rem", background: "var(--bg-elevated)", borderRadius: 12, border: "1px solid var(--border)", maxHeight: 140, overflowY: "auto" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Lyrics Preview</p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{lyrics}</p>
        </div>
      )}

      {error && <p style={{ color: "#F43F5E", fontSize: "0.8125rem" }}>{error}</p>}

      {generating && (
        <div style={{ textAlign: "center", padding: "1.5rem", background: "var(--primary-light)", borderRadius: 12, border: "1px solid var(--border-focus)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--primary)", borderTop: "3px solid transparent", margin: "0 auto 0.875rem", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontWeight: 600, color: "var(--primary)" }}>Saving creative…</p>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button className="btn btn-secondary" onClick={onBack} disabled={generating}>← Back</button>
        <button className="btn btn-primary" onClick={generate} disabled={generating || !name.trim()}>
          {generating ? "Saving…" : "Generate Creative ✦"}
        </button>
      </div>
    </div>
  );
}

// ── Done state ─────────────────────────────────────────────────────────────────
function DoneCard({ creative, onNew }: { creative: Creative; onNew: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "2.5rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(18,183,106,0.12)", border: "2px solid #12B76A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.375rem" }}>{creative.name}</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Creative saved successfully. You can now use it in a campaign.</p>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/dashboard/campaigns/new" className="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Launch a Campaign
        </Link>
        <button className="btn btn-secondary" onClick={onNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Creative
        </button>
      </div>
    </div>
  );
}

// ── My Creatives list ──────────────────────────────────────────────────────────
function MyCreatives() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    creativeApi.myCreatives()
      .then((d) => setCreatives(Array.isArray(d) ? d : []))
      .catch(() => setCreatives([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {[1,2].map(i => <div key={i} style={{ height: 52, borderRadius: 10, background: "var(--bg-elevated)", animation: "pulse 1.4s ease-in-out infinite" }} />)}
    </div>
  );

  if (creatives.length === 0) return (
    <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem", padding: "1.5rem 0" }}>No creatives yet. Create your first one above.</p>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {creatives.map((c) => (
        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1rem", background: "var(--bg-elevated)", borderRadius: 10, border: "1px solid var(--border)" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{c.name || "Untitled"}</p>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              {" · "}
              <span style={{ color: "#12B76A", fontWeight: 600 }}>{c.status}</span>
            </p>
          </div>
          <Link href="/dashboard/campaigns/new" style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Use in campaign →
          </Link>
        </div>
      ))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CreativePage() {
  const [step, setStep] = useState<Step>(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [segments, setSegments] = useState<Segment[]>([]);
  const [clip, setClip] = useState<VideoClip | null>(null);
  const [done, setDone] = useState<Creative | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function reset() {
    setStep(0); setAudioUrl(""); setFilename(""); setLyrics(""); setSegments([]);
    setClip(null); setDone(null); setRefreshKey((k) => k + 1);
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* Header */}
      <div className="dash-topbar">
        <div>
          <h1 className="dash-title">Creative Studio</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Upload your track, pick a visual, and generate a ready-to-launch ad creative
          </p>
        </div>
        <span style={{
          fontSize: "0.72rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: 99,
          background: "rgba(18,183,106,0.1)", color: "#12B76A",
          border: "1px solid rgba(18,183,106,0.25)", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Live
        </span>
      </div>

      {/* Wizard card */}
      <div className="card" style={{ padding: "2rem" }}>
        {!done ? (
          <>
            <StepHeader step={step} />
            {step === 0 && (
              <UploadStep
                onDone={(url, fn, lyr, segs) => {
                  setAudioUrl(url); setFilename(fn); setLyrics(lyr); setSegments(segs);
                  setStep(1);
                }}
              />
            )}
            {step === 1 && (
              <VideoStep
                onBack={() => setStep(0)}
                onDone={(c) => { setClip(c); setStep(2); }}
              />
            )}
            {step === 2 && clip && (
              <GenerateStep
                audioUrl={audioUrl}
                filename={filename}
                lyrics={lyrics}
                segments={segments}
                clip={clip}
                onBack={() => setStep(1)}
                onFinish={(creative) => setDone(creative)}
              />
            )}
          </>
        ) : (
          <DoneCard creative={done} onNew={reset} />
        )}
      </div>

      {/* My Creatives */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem" }}>My Creatives</h2>
        <MyCreatives key={refreshKey} />
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
