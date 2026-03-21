"use client";

export default function CreativePage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Creative Studio</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Create lyric videos and ad creatives for your music</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          { step: "01", label: "Upload Track", desc: "Upload your audio file and we'll transcribe it with Whisper AI", icon: "🎵" },
          { step: "02", label: "Pick a Video", desc: "Choose from our library of background video templates", icon: "🎬" },
          { step: "03", label: "Export & Launch", desc: "Get your lyric video ready to use as a Meta Ad creative", icon: "🚀" },
        ].map((s) => (
          <div key={s.step} className="card" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{s.icon}</div>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary)", color: "#fff", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem" }}>{s.step}</div>
            <h3 style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>{s.label}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>Lyric Video Creator — Coming Weeks 4–6</p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>AI-powered transcription, lyric overlay, and video rendering via FFmpeg.</p>
      </div>
    </div>
  );
}
