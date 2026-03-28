"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

const DotGrid = ({ id = "dots" }: { id?: string }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id={id} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" fillOpacity={0.4} /></pattern></defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

const COMPETITORS = [
  { name: "Kapwing", category: "Video editor", desc: "A general-purpose video editor with some lyric video templates. Not built for music marketing.", pros: ["Good template library", "Easy to use", "Free tier"], cons: ["No Meta Ads integration", "No Spotify analytics", "No Cost per Stream tracking"], price: "Free / $16/mo", musicFocus: false, adsIntegration: false, spotifyData: false, lyricVideo: true },
  { name: "CapCut", category: "Video editor", desc: "Popular short-form video editor great for TikTok. No music marketing or ad campaign tools.", pros: ["Great for TikTok content", "Free", "Easy mobile use"], cons: ["No ad campaign management", "No stream analytics", "Not built for artists"], price: "Free / $7.99/mo", musicFocus: false, adsIntegration: false, spotifyData: false, lyricVideo: true },
  { name: "Kashie", category: "Music marketing", desc: "A music promotion tool focused on playlist pitching. Limited ad campaign features.", pros: ["Playlist pitching", "Some analytics", "Artist-focused"], cons: ["No lyric video creation", "Limited Meta Ads tools", "No real-time CPS tracking"], price: "$19/mo+", musicFocus: true, adsIntegration: false, spotifyData: true, lyricVideo: false },
  { name: "Inteliijend", category: "Music analytics", desc: "A music analytics dashboard. Tracks streams and social stats but lacks ad campaign management.", pros: ["Deep analytics", "Multi-platform data", "Clean UI"], cons: ["No campaign builder", "No lyric video creation", "No Meta Ads integration"], price: "$29/mo+", musicFocus: true, adsIntegration: false, spotifyData: true, lyricVideo: false },
];

const ROWS = [
  { label: "Meta Ads Campaign Builder",  e: true,  k: false, cc: false, ka: false, i: false },
  { label: "Cost per Stream Tracking",   e: true,  k: false, cc: false, ka: false, i: false },
  { label: "Spotify Stream Analytics",   e: true,  k: false, cc: false, ka: true,  i: true  },
  { label: "AI Lyric Video Creator",     e: true,  k: true,  cc: true,  ka: false, i: false },
  { label: "Automated Ad Targeting",     e: true,  k: false, cc: false, ka: false, i: false },
  { label: "Cost per Fan (CPF) Tracking",e: true,  k: false, cc: false, ka: false, i: false },
  { label: "Music-Specific Templates",   e: true,  k: false, cc: false, ka: true,  i: false },
  { label: "Campaign ROI Dashboard",     e: true,  k: false, cc: false, ka: false, i: true  },
];

function Check({ yes }: { yes: boolean }) {
  return yes
    ? <span style={{ color: "#12B76A", fontWeight: 700 }}>✓</span>
    : <span style={{ color: "#E2E6F0", fontWeight: 700 }}>✕</span>;
}

export default function AlternativesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", color: NAVY }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
        <DotGrid id="dots-alt1" />
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "9rem 2rem 5rem", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#EEF2FF", border: "1px solid #C7D4FF", borderRadius: 99, padding: "0.35rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: BLUE, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, display: "inline-block" }} /> Escalium vs the alternatives
          </div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, letterSpacing: "-0.03em", color: NAVY, lineHeight: 1.15, marginBottom: "1.25rem" }}>
            Why artists choose Escalium{" "}
            <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>over everything else.</span>
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "#4A5370", lineHeight: 1.75, maxWidth: 580, margin: "0 auto 2.5rem" }}>Most tools do one thing. Escalium is the only platform that connects your Meta Ads spend directly to your Spotify stream growth, so you always know your Cost per Stream.</p>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: NAVY, color: "#fff", borderRadius: 99, padding: "0.8rem 1.75rem", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(11,17,32,0.2)" }}>Try Escalium Free <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>+</span></Link>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ position: "relative", maxWidth: 1060, margin: "0 auto", padding: "5rem 2rem", overflow: "hidden" }}>
        <DotGrid id="dots-alt2" />
        <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Feature Comparison</p>
          <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.25rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em" }}>Escalium vs <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>the competition</span></h2>
        </div>
        <div style={{ overflowX: "auto", position: "relative" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #E2E6F0" }}>
            <thead>
              <tr style={{ background: "#F8F9FC" }}>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#9BA3BF", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E2E6F0", minWidth: 220 }}>Feature</th>
                {[{ name: "Escalium", highlight: true }, { name: "Kapwing" }, { name: "CapCut" }, { name: "Kashie" }, { name: "Inteliijend" }].map((col) => (
                  <th key={col.name} style={{ padding: "1rem 1.25rem", textAlign: "center", fontSize: "0.875rem", fontWeight: 700, borderBottom: "1px solid #E2E6F0", color: col.highlight ? BLUE : NAVY, background: col.highlight ? "#EEF2FF" : undefined, minWidth: 120 }}>
                    {col.name}
                    {col.highlight && <div style={{ fontSize: "0.62rem", color: BLUE, marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>← You are here</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.label} style={{ borderBottom: i < ROWS.length - 1 ? "1px solid #E2E6F0" : "none" }}>
                  <td style={{ padding: "0.875rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, color: "#4A5370" }}>{row.label}</td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center", background: "rgba(58,96,231,0.03)" }}><Check yes={row.e} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center" }}><Check yes={row.k} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center" }}><Check yes={row.cc} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center" }}><Check yes={row.ka} /></td>
                  <td style={{ padding: "0.875rem 1.25rem", textAlign: "center" }}><Check yes={row.i} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Competitor cards */}
      <section style={{ position: "relative", background: "#fff", borderTop: "1px solid #E2E6F0", padding: "6rem 2rem", overflow: "hidden" }}>
        <DotGrid id="dots-alt3" />
        <div style={{ position: "absolute", top: "30%", left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Head to Head</p>
            <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.25rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>Escalium vs <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>each alternative</span></h2>
            <p style={{ color: "#4A5370" }}>See exactly where each tool falls short for music artists.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "1.5rem" }}>
            {COMPETITORS.map((c) => (
              <div key={c.name} style={{ background: "#F8F9FC", border: "1px solid #E2E6F0", borderRadius: 20, padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
                      <h3 style={{ fontWeight: 800, fontSize: "1.05rem", color: NAVY }}>{c.name}</h3>
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: 99, background: "#fff", color: "#9BA3BF", border: "1px solid #E2E6F0" }}>{c.category}</span>
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "#9BA3BF", lineHeight: 1.6 }}>{c.desc}</p>
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#4A5370", whiteSpace: "nowrap", marginLeft: "1rem" }}>{c.price}</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  {[{ label: "Music focus", val: c.musicFocus }, { label: "Ads", val: c.adsIntegration }, { label: "Spotify data", val: c.spotifyData }, { label: "Lyric video", val: c.lyricVideo }].map((f) => (
                    <span key={f.label} style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.625rem", borderRadius: 99, background: f.val ? "rgba(18,183,106,0.1)" : "#fff", color: f.val ? "#12B76A" : "#9BA3BF", border: `1px solid ${f.val ? "rgba(18,183,106,0.2)" : "#E2E6F0"}` }}>
                      {f.val ? "✓" : "✕"} {f.label}
                    </span>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#12B76A", marginBottom: "0.5rem" }}>Pros</p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {c.pros.map((p) => (<li key={p} style={{ fontSize: "0.8rem", color: "#4A5370", display: "flex", gap: "0.4rem" }}><span style={{ color: "#12B76A", flexShrink: 0 }}>+</span>{p}</li>))}
                    </ul>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#F43F5E", marginBottom: "0.5rem" }}>Cons</p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {c.cons.map((con) => (<li key={con} style={{ fontSize: "0.8rem", color: "#4A5370", display: "flex", gap: "0.4rem" }}><span style={{ color: "#F43F5E", flexShrink: 0 }}>−</span>{con}</li>))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", padding: "7rem 2rem", background: NAVY, textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,26,234,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", fontWeight: 900, color: "#fff", marginBottom: "1rem", letterSpacing: "-0.03em" }}>Ready to switch to <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Escalium?</span></h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "2.5rem", lineHeight: 1.75 }}>No credit card required. Set up in under 5 minutes.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#fff", color: NAVY, borderRadius: 99, padding: "0.875rem 2rem", fontWeight: 800, fontSize: "0.95rem", textDecoration: "none" }}>Start for Free <span style={{ width: 22, height: 22, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>+</span></Link>
            <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", background: "transparent", color: "#fff", borderRadius: 99, padding: "0.875rem 2rem", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.2)" }}>View Pricing</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
