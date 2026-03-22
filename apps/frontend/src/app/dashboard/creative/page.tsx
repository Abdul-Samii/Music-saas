"use client";

const STEPS = [
  {
    step: "01",
    label: "Upload Your Track",
    desc: "Drop in your MP3 or WAV file. Whisper AI will transcribe your lyrics automatically — no manual input needed.",
    color: "#3A60E7",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
  {
    step: "02",
    label: "Pick a Visual Style",
    desc: "Choose from a library of animated backgrounds — abstract, nature, concert footage — and pick a lyric font.",
    color: "#4C1AEA",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
  },
  {
    step: "03",
    label: "Export & Launch",
    desc: "Render your lyric video in 1080p via FFmpeg. Download it or push it directly into your Meta Ads campaign.",
    color: "#1DB954",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

const FEATURES = [
  { label: "AI Transcription",    desc: "Whisper AI syncs lyrics to timestamps",  icon: "✦" },
  { label: "Animated Lyrics",     desc: "Word-by-word or line karaoke style",      icon: "✦" },
  { label: "1080p Export",        desc: "Broadcast-quality MP4 in seconds",        icon: "✦" },
  { label: "Direct to Meta Ads",  desc: "Push your creative straight to a campaign", icon: "✦" },
];

export default function CreativePage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Creative Studio</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            AI-powered lyric video creator — coming in Weeks 4–6
          </p>
        </div>
        <span style={{
          fontSize: "0.72rem", fontWeight: 700, padding: "0.35rem 0.875rem", borderRadius: 99,
          background: "var(--accent-light)", color: "var(--accent)",
          border: "1px solid rgba(76,26,234,0.2)", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          In Development
        </span>
      </div>

      {/* Hero teaser card */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A4E 0%, #2E1A8E 100%)",
        borderRadius: 20, padding: "3rem 2.5rem", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(76,26,234,0.25)" }} />
        <div style={{ position: "absolute", bottom: -40, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(58,96,231,0.20)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 560 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "0.3rem 0.875rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#12B76A", animation: "pulse 2s ease infinite" }} />
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>Weeks 4–6 · Active development</span>
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "0.875rem" }}>
            Turn your music into<br />scroll-stopping lyric videos
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "1.75rem" }}>
            Upload your track, and our AI will transcribe, animate, and render a professional lyric video — ready to use as a Meta Ad creative in minutes.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className="btn" style={{ background: "#fff", color: "#1A1A4E", fontWeight: 700 }} disabled>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload Track — Coming Soon
            </button>
            <button className="btn btn-ghost" style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)" }} disabled>
              View templates
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: "1rem" }}>How it works</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {STEPS.map((s, i) => (
            <div key={s.step} style={{ position: "relative" }}>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: "absolute", top: 24, left: "calc(100% - 1rem)", width: "2rem",
                  height: 1.5, background: "var(--border)", zIndex: 0,
                  display: "none",
                }} />
              )}
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Step {s.step}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>{s.label}</h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--primary)", marginBottom: "1rem" }}>What&apos;s included</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.875rem" }}>
          {FEATURES.map((f) => (
            <div key={f.label} style={{
              display: "flex", alignItems: "flex-start", gap: "0.875rem",
              padding: "1rem 1.125rem", background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 12,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "var(--primary)", fontSize: "0.9rem" }}>{f.icon}</span>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{f.label}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
