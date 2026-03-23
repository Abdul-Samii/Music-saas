"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COMPETITORS = [
  {
    name: "Kapwing",
    href: "/alternatives/capcut",
    category: "Video editor",
    desc: "A general-purpose video editor with some lyric video templates. Not built for music marketing.",
    pros: ["Good template library", "Easy to use", "Free tier"],
    cons: ["No Meta Ads integration", "No Spotify analytics", "No Cost per Stream tracking", "Manual lyric sync required"],
    price: "Free / $16/mo",
    musicFocus: false,
    adsIntegration: false,
    spotifyData: false,
    lyricVideo: true,
  },
  {
    name: "CapCut",
    href: "/alternatives/capcut",
    category: "Video editor",
    desc: "Popular short-form video editor great for TikTok. No music marketing or ad campaign tools.",
    pros: ["Great for TikTok content", "Free", "Easy mobile use"],
    cons: ["No ad campaign management", "No stream analytics", "No CPS tracking", "Not built for artists"],
    price: "Free / $7.99/mo",
    musicFocus: false,
    adsIntegration: false,
    spotifyData: false,
    lyricVideo: true,
  },
  {
    name: "Kashie",
    href: "/alternatives/kashie",
    category: "Music marketing",
    desc: "A music promotion tool focused on playlist pitching. Limited ad campaign features.",
    pros: ["Playlist pitching", "Some analytics", "Artist-focused"],
    cons: ["No lyric video creation", "Limited Meta Ads tools", "No real-time CPS tracking"],
    price: "$19/mo+",
    musicFocus: true,
    adsIntegration: false,
    spotifyData: true,
    lyricVideo: false,
  },
  {
    name: "Inteliijend",
    href: "/alternatives/intelijjend",
    category: "Music analytics",
    desc: "A music analytics dashboard. Tracks streams and social stats but lacks ad campaign management.",
    pros: ["Deep analytics", "Multi-platform data", "Clean UI"],
    cons: ["No campaign builder", "No lyric video creation", "No Meta Ads integration"],
    price: "$29/mo+",
    musicFocus: true,
    adsIntegration: false,
    spotifyData: true,
    lyricVideo: false,
  },
];

const COMPARISON_FEATURES = [
  { label: "Meta Ads Campaign Builder",    escalium: true,  kapwing: false, capcut: false, kashie: false, inteliijend: false },
  { label: "Cost per Stream Tracking",     escalium: true,  kapwing: false, capcut: false, kashie: false, inteliijend: false },
  { label: "Spotify Stream Analytics",     escalium: true,  kapwing: false, capcut: false, kashie: true,  inteliijend: true  },
  { label: "AI Lyric Video Creator",       escalium: true,  kapwing: true,  capcut: true,  kashie: false, inteliijend: false },
  { label: "Automated Ad Targeting",       escalium: true,  kapwing: false, capcut: false, kashie: false, inteliijend: false },
  { label: "Cost per Fan (CPF) Tracking",  escalium: true,  kapwing: false, capcut: false, kashie: false, inteliijend: false },
  { label: "Music-Specific Templates",     escalium: true,  kapwing: false, capcut: false, kashie: true,  inteliijend: false },
  { label: "Campaign ROI Dashboard",       escalium: true,  kapwing: false, capcut: false, kashie: false, inteliijend: true  },
  { label: "Built for Independent Artists",escalium: true,  kapwing: false, capcut: false, kashie: true,  inteliijend: true  },
];

function Check({ yes }: { yes: boolean }) {
  return yes
    ? <span style={{ color: "#12B76A", fontWeight: 700, fontSize: "1rem" }}>✓</span>
    : <span style={{ color: "#E5E7EB", fontWeight: 700, fontSize: "1rem" }}>✕</span>;
}

export default function AlternativesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: "9rem", paddingBottom: "4rem", maxWidth: 760, margin: "0 auto", padding: "9rem 2rem 4rem", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "var(--primary-light)", border: "1px solid var(--primary-glow)",
          borderRadius: 99, padding: "0.35rem 1rem", marginBottom: "1.5rem",
          fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
          Escalium vs the alternatives
        </div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "1.25rem" }}>
          Why artists choose Escalium<br />
          <span className="gradient-text">over everything else.</span>
        </h1>
        <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 2.5rem" }}>
          Most tools do one thing — edit videos or show analytics. Escalium is the only platform that connects your Meta Ads spend directly to your Spotify stream growth, so you always know your Cost per Stream.
        </p>
        <Link href="/register" className="btn btn-primary btn-lg">Try Escalium Free</Link>
      </section>

      {/* Full comparison table */}
      <section style={{ maxWidth: 1060, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Feature Comparison
          </h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--bg-card)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid var(--border)", minWidth: 220 }}>Feature</th>
                {[
                  { name: "Escalium",   highlight: true  },
                  { name: "Kapwing",    highlight: false },
                  { name: "CapCut",     highlight: false },
                  { name: "Kashie",     highlight: false },
                  { name: "Inteliijend",highlight: false },
                ].map((col) => (
                  <th key={col.name} style={{
                    padding: "1rem 1.25rem", textAlign: "center", fontSize: "0.875rem",
                    fontWeight: 700, borderBottom: "1px solid var(--border)",
                    color: col.highlight ? "var(--primary)" : "var(--text-primary)",
                    background: col.highlight ? "var(--primary-light)" : undefined,
                    minWidth: 120,
                  }}>
                    {col.name}
                    {col.highlight && (
                      <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--primary)", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>← You are here</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((row, i) => (
                <tr key={row.label} style={{ borderBottom: i < COMPARISON_FEATURES.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>{row.label}</td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center", background: "rgba(58,96,231,0.04)" }}><Check yes={row.escalium} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center" }}><Check yes={row.kapwing} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center" }}><Check yes={row.capcut} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center" }}><Check yes={row.kashie} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center" }}><Check yes={row.inteliijend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Individual competitor cards */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              Escalium vs each alternative
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>See exactly where each tool falls short for music artists.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.5rem" }} className="alt-2col">
            {COMPETITORS.map((c) => (
              <div key={c.name} className="card">
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
                      <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--text-primary)" }}>{c.name}</h3>
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: 99, background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{c.category}</span>
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{c.desc}</p>
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", whiteSpace: "nowrap", marginLeft: "1rem" }}>{c.price}</span>
                </div>

                {/* Quick feature flags */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  {[
                    { label: "Music focus",   val: c.musicFocus     },
                    { label: "Ads",           val: c.adsIntegration },
                    { label: "Spotify data",  val: c.spotifyData    },
                    { label: "Lyric video",   val: c.lyricVideo     },
                  ].map((f) => (
                    <span key={f.label} style={{
                      fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.625rem", borderRadius: 99,
                      background: f.val ? "rgba(18,183,106,0.1)" : "var(--bg-elevated)",
                      color: f.val ? "#12B76A" : "var(--text-muted)",
                      border: `1px solid ${f.val ? "rgba(18,183,106,0.2)" : "var(--border)"}`,
                    }}>
                      {f.val ? "✓" : "✕"} {f.label}
                    </span>
                  ))}
                </div>

                {/* Pros / Cons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#12B76A", marginBottom: "0.5rem" }}>Pros</p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {c.pros.map((p) => (
                        <li key={p} style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", gap: "0.4rem" }}>
                          <span style={{ color: "#12B76A", flexShrink: 0 }}>+</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#F43F5E", marginBottom: "0.5rem" }}>Cons</p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {c.cons.map((con) => (
                        <li key={con} style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", gap: "0.4rem" }}>
                          <span style={{ color: "#F43F5E", flexShrink: 0 }}>−</span>{con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: "1.25rem", paddingTop: "1.125rem", borderTop: "1px solid var(--border)" }}>
                  <Link href={c.href} style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
                    Read full comparison: Escalium vs {c.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Escalium wins */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            The one thing no alternative does
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="steps-3col">
          {[
            { color: "#3A60E7", title: "Ads → Streams, connected", desc: "We link your Meta Ads spend directly to the new Spotify streams it drives. No spreadsheets. Real numbers." },
            { color: "#1DB954", title: "Cost per Stream (CPS)", desc: "The single most important KPI for music advertising. Every campaign shows you exactly what one stream cost you." },
            { color: "#4C1AEA", title: "Everything in one place", desc: "Campaign builder, stream analytics, lyric video creator. No tab-switching between 4 different tools." },
          ].map((f) => (
            <div key={f.title} className="card" style={{ borderTop: `3px solid ${f.color}` }}>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.625rem" }}>{f.title}</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 2rem", textAlign: "center", background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Ready to switch to <span className="gradient-text">Escalium?</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: 460, margin: "0 auto 2rem" }}>
          No credit card required. Set up in under 5 minutes.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" className="btn btn-primary btn-lg">Start for Free</Link>
          <Link href="/pricing"  className="btn btn-secondary btn-lg">View Pricing</Link>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) { .alt-2col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
