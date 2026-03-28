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

const SUB_FEATURES = [
  { label: "Instagram Ads",      desc: "Reach music fans on Instagram Stories and Reels with auto-optimised creative." },
  { label: "Facebook Ads",       desc: "Run awareness and conversion campaigns across Facebook's 3 billion users." },
  { label: "Meta Ads Platform",  desc: "One dashboard for all Meta placements — Facebook, Instagram, Messenger, Audience Network." },
  { label: "TikTok Ads",         desc: "Tap into TikTok's music-first audience with short-form video campaigns." },
  { label: "Digital Marketing",  desc: "Strategy, targeting, and creative — everything you need to market music online." },
  { label: "Promotion",          desc: "Push your releases to the right listeners at the right time." },
  { label: "Platform Overview",  desc: "How Escalium connects ads, streams, and analytics in one place." },
  { label: "Software",           desc: "The technology behind Escalium — Meta Ads API, Spotify data, AI creative tools." },
];

export default function MusicMarketingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", color: NAVY }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
        <DotGrid id="dots-fm1" />
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,26,234,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", padding: "9rem 2rem 5rem", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#EEF2FF", border: "1px solid #C7D4FF", borderRadius: 99, padding: "0.35rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: BLUE, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, display: "inline-block" }} /> Music Marketing Platform
          </div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 900, letterSpacing: "-0.03em", color: NAVY, lineHeight: 1.15, marginBottom: "1.25rem" }}>
            Advertise your music.{" "}
            <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Know exactly what it costs.</span>
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "#4A5370", lineHeight: 1.75, maxWidth: 580, margin: "0 auto 2.5rem" }}>Escalium connects your Meta Ads spend to your Spotify stream growth — so you stop guessing and start scaling with data.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: NAVY, color: "#fff", borderRadius: 99, padding: "0.8rem 1.75rem", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 4px 20px rgba(11,17,32,0.2)" }}>Start Growing Free <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>+</span></Link>
            <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", background: "#fff", color: NAVY, borderRadius: 99, padding: "0.8rem 1.75rem", fontWeight: 600, fontSize: "0.95rem", textDecoration: "none", border: "1.5px solid #E2E6F0" }}>See Pricing</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "1px solid #E2E6F0", borderBottom: "1px solid #E2E6F0", padding: "2rem", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {[{ value: "$0.008", label: "Avg Cost per Stream" }, { value: "1.2M+", label: "Streams Generated" }, { value: "500+", label: "Artists Using Escalium" }, { value: "98%", label: "Campaign Success Rate" }].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: BLUE, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "#9BA3BF", marginTop: "0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core features */}
      <section style={{ position: "relative", padding: "6rem 2rem", overflow: "hidden" }}>
        <DotGrid id="dots-fm2" />
        <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Core Features</p>
            <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.25rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>Everything <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>in one place</span></h2>
            <p style={{ color: "#4A5370", maxWidth: 500, margin: "0 auto" }}>Stop switching between Ads Manager, Spotify for Artists, and spreadsheets.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {[
              { color: BLUE, bg: "#EEF2FF", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Campaign Builder", desc: "Launch Meta Ads campaigns in minutes using music-specific templates — no Ads Manager experience needed.", bullets: ["Pre-built campaign templates", "One-click launch to Meta", "Auto-optimised music targeting"] },
              { color: "#12B76A", bg: "#F0FDF4", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "Cost per Stream Analytics", desc: "See your real ROI. We calculate Cost per Stream and Cost per Fan by connecting your ad spend to actual Spotify data.", bullets: ["Cost per Stream (CPS)", "Cost per Fan (CPF)", "Stream growth attribution"] },
              { color: "#4C1AEA", bg: "#F5F0FF", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4C1AEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, title: "Unified Dashboard", desc: "Overview of all active campaigns, stream performance, and ad spend in a single clean dashboard.", bullets: ["Real-time spend tracking", "Campaign status & pacing", "Historical trend charts"] },
            ].map((f) => (
              <div key={f.title} style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "1.75rem", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.transform = "translateY(-6px)"; d.style.boxShadow = "0 16px 48px rgba(58,96,231,0.1)"; }}
                onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.transform = "translateY(0)"; d.style.boxShadow = "none"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: NAVY, marginBottom: "0.625rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#4A5370", lineHeight: 1.75, marginBottom: "1.25rem" }}>{f.desc}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {f.bullets.map((b) => (<li key={b} style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", color: "#4A5370" }}><span style={{ color: f.color, fontWeight: 700 }}>✓</span>{b}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels */}
      <section style={{ position: "relative", background: "#fff", borderTop: "1px solid #E2E6F0", padding: "6rem 2rem", overflow: "hidden" }}>
        <DotGrid id="dots-fm3" />
        <div style={{ position: "absolute", top: "40%", right: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Explore by Channel</p>
            <h2 style={{ fontSize: "clamp(1.75rem,3vw,2.25rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>Deep-dives into <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>every platform</span></h2>
            <p style={{ color: "#4A5370" }}>Each advertising channel, broken down for music artists.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {SUB_FEATURES.map((f) => (
              <div key={f.label} style={{ background: "#F8F9FC", border: "1px solid #E2E6F0", borderRadius: 16, padding: "1.5rem", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.transform = "translateY(-4px)"; d.style.borderColor = BLUE; d.style.boxShadow = "0 8px 24px rgba(58,96,231,0.1)"; }}
                onMouseLeave={(e) => { const d = e.currentTarget as HTMLDivElement; d.style.transform = "translateY(0)"; d.style.borderColor = "#E2E6F0"; d.style.boxShadow = "none"; }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: NAVY, marginBottom: "0.5rem" }}>{f.label}</p>
                <p style={{ fontSize: "0.8rem", color: "#9BA3BF", lineHeight: 1.6 }}>{f.desc}</p>
                <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: BLUE, fontWeight: 600 }}>Learn more →</div>
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
          <h2 style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", fontWeight: 900, color: "#fff", marginBottom: "1rem", letterSpacing: "-0.03em" }}>Ready to market <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>smarter?</span></h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "2.5rem", lineHeight: 1.75 }}>Join hundreds of independent artists growing with Escalium.</p>
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
