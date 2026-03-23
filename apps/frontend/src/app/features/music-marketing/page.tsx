"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SUB_FEATURES = [
  { label: "Instagram Ads",     href: "/features/music-marketing/instagram-ads",    desc: "Reach music fans on Instagram Stories and Reels with auto-optimised creative." },
  { label: "Facebook Ads",      href: "/features/music-marketing/facebook-ads",     desc: "Run awareness and conversion campaigns across Facebook's 3 billion users." },
  { label: "Meta Ads Platform", href: "/features/music-marketing/meta-ads",         desc: "One dashboard for all Meta placements — Facebook, Instagram, Messenger, Audience Network." },
  { label: "TikTok Ads",        href: "/features/music-marketing/tiktok-ads",       desc: "Tap into TikTok's music-first audience with short-form video campaigns." },
  { label: "Digital Marketing", href: "/features/music-marketing/digital-marketing", desc: "Strategy, targeting, and creative — everything you need to market music online." },
  { label: "Promotion",         href: "/features/music-marketing/promotion",         desc: "Push your releases to the right listeners at the right time." },
  { label: "Platform Overview", href: "/features/music-marketing/platform",          desc: "How the Escalium platform connects ads, streams, and analytics in one place." },
  { label: "Software",          href: "/features/music-marketing/software",          desc: "The technology behind Escalium — Meta Ads API, Spotify data, AI creative tools." },
];

const STATS = [
  { value: "$0.008", label: "Avg Cost per Stream" },
  { value: "1.2M+",  label: "Streams Generated" },
  { value: "500+",   label: "Artists Using Escalium" },
  { value: "98%",    label: "Campaign Success Rate" },
];

export default function MusicMarketingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: "9rem", paddingBottom: "5rem", maxWidth: 820, margin: "0 auto", padding: "9rem 2rem 5rem", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "var(--primary-light)", border: "1px solid var(--primary-glow)",
          borderRadius: 99, padding: "0.35rem 1rem", marginBottom: "1.5rem",
          fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
          Music Marketing Platform
        </div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "1.25rem" }}>
          Advertise your music.<br />
          <span className="gradient-text">Know exactly what it costs.</span>
        </h1>
        <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 2.5rem" }}>
          Escalium connects your Meta Ads spend to your Spotify stream growth — so you stop guessing and start scaling with data.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" className="btn btn-primary btn-lg">Start Growing Free</Link>
          <Link href="/pricing"  className="btn btn-secondary btn-lg">See Pricing</Link>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "2rem", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core value props */}
      <section style={{ maxWidth: 1060, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            Everything in one place
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
            Stop switching between Ads Manager, Spotify for Artists, and spreadsheets. Escalium does it all.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="features-3col">
          {[
            {
              color: "#3A60E7",
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
              title: "Campaign Builder",
              desc: "Launch Meta Ads campaigns in minutes using music-specific templates — no Ads Manager experience needed.",
              bullets: ["Pre-built campaign templates", "One-click launch to Meta", "Auto-optimised music targeting"],
            },
            {
              color: "#1DB954",
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
              title: "Cost per Stream Analytics",
              desc: "See your real ROI. We calculate Cost per Stream and Cost per Fan by connecting your ad spend to actual Spotify data.",
              bullets: ["Cost per Stream (CPS)", "Cost per Fan (CPF)", "Stream growth attribution"],
            },
            {
              color: "#4C1AEA",
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
              title: "Unified Dashboard",
              desc: "Overview of all active campaigns, stream performance, and ad spend in a single clean dashboard.",
              bullets: ["Real-time spend tracking", "Campaign status & pacing", "Historical trend charts"],
            },
          ].map((f) => (
            <div key={f.title} className="card">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: "1.125rem" }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--text-primary)", marginBottom: "0.625rem" }}>{f.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1.25rem" }}>{f.desc}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {f.bullets.map((b) => (
                  <li key={b} style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: f.color, fontWeight: 700 }}>✓</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Sub-feature links */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              Explore by channel
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>Deep-dives into each advertising platform and strategy.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }} className="features-4col">
            {SUB_FEATURES.map((f) => (
              <Link key={f.label} href={f.href} style={{ textDecoration: "none" }}>
                <div className="card" style={{ height: "100%", transition: "border-color 0.15s, transform 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>{f.label}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
                  <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600 }}>Learn more →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Ready to market smarter?
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: 460, margin: "0 auto 2rem" }}>
          Join hundreds of independent artists growing with Escalium.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" className="btn btn-primary btn-lg">Start for Free</Link>
          <Link href="/pricing"  className="btn btn-secondary btn-lg">View Pricing</Link>
        </div>
      </section>

      <Footer />

    </div>
  );
}
