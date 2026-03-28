"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

const SECTIONS = [
  { heading: "1. Know Your Numbers Before You Spend", body: "The biggest mistake artists make is running ads without a clear success metric. Before you touch Ads Manager, decide what a \"win\" looks like. For most independent artists, Cost per Stream (CPS) is the best KPI — it tells you exactly how much one new stream cost in ad dollars. A good CPS benchmark is under $0.01. If you're spending $100 and getting 8,000+ new streams, your campaign is working." },
  { heading: "2. Build a Lyric Video Ad Creative", body: "Lyric videos consistently outperform static image ads for music. They hold attention longer, they're shareable, and they do double duty as organic content. You don't need a production budget — tools like Escalium can generate a professional lyric video from just your audio file in under 10 minutes, complete with auto-transcribed, synced lyrics." },
  { heading: "3. Target Fans of Similar Artists on Meta", body: "Meta's interest targeting lets you reach people who follow similar artists. If you make indie R&B, target fans of Frank Ocean, SZA, and Daniel Caesar. Layer that with a music-engagement behavioural filter (people who have interacted with music content in the past 60 days) and you'll have an audience that's primed to stream." },
  { heading: "4. Set a Realistic Daily Budget", body: "You don't need a big budget to see results. Start with $10–$20 per day, run for 7 days, and measure your CPS at the end of the week. If your CPS is below $0.01, scale the budget up. If it's above $0.02, revisit your creative or targeting before spending more." },
  { heading: "5. Track the Right Metrics", body: "Ignore vanity metrics like likes and views. The metrics that matter for music promotion are: Cost per Stream (CPS), Cost per Fan (CPF) — how much it costs to turn a listener into a monthly listener — and Stream Lift (the increase in streams during the campaign vs. your 30-day baseline). Escalium calculates all of these automatically by connecting your Meta spend to your Spotify data." },
  { heading: "6. Retarget Warm Audiences", body: "Once you've run your initial campaign, create a retargeting audience from people who watched at least 50% of your lyric video. These are your warmest prospects — they've already heard your music. Run a follow-up ad with a clear call-to-action (\"Follow on Spotify\" or \"Save this track\") to convert them into fans." },
];

export default function BlogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", color: NAVY }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "#fff", borderBottom: "1px solid #E2E6F0" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="dots-blog" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" fillOpacity={0.4} /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots-blog)" />
        </svg>
        <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "9rem 2rem 4rem", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#EEF2FF", border: "1px solid #C7D4FF", borderRadius: 99, padding: "0.35rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: BLUE, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, display: "inline-block" }} /> Music Marketing Guide
          </div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, letterSpacing: "-0.03em", color: NAVY, lineHeight: 1.15, marginBottom: "1.25rem" }}>
            How to Promote Your Song{" "}
            <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>with Meta Ads in 2025</span>
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "#4A5370", lineHeight: 1.75, marginBottom: "2rem" }}>A practical, no-fluff guide to running music ads that actually grow your Spotify streams — without wasting your budget.</p>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.825rem", color: "#9BA3BF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: BLUE }}>ES</div>
              <span style={{ fontWeight: 500, color: "#4A5370" }}>Escalium Team</span>
            </div>
            <span>·</span>
            <span>8 min read</span>
            <span>·</span>
            <span>Music Marketing</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "4rem 2rem 6rem", display: "grid", gridTemplateColumns: "1fr", gap: "0" }}>
        {/* Intro callout */}
        <div style={{ background: "#EEF2FF", border: "1px solid #C7D4FF", borderRadius: 16, padding: "1.5rem 1.75rem", marginBottom: "3rem" }}>
          <p style={{ fontSize: "1rem", color: NAVY, lineHeight: 1.8, fontWeight: 500 }}>
            <strong style={{ color: BLUE }}>The short version:</strong> Run a lyric video ad on Meta, target fans of similar artists, track Cost per Stream, scale what works. The six steps below show you exactly how.
          </p>
        </div>

        {/* Article sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {SECTIONS.map((s) => (
            <div key={s.heading}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: NAVY, marginBottom: "0.875rem", letterSpacing: "-0.01em" }}>{s.heading}</h2>
              <p style={{ color: "#4A5370", lineHeight: 1.85, fontSize: "0.9875rem" }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* CTA inline */}
        <div style={{ marginTop: "4rem", background: NAVY, borderRadius: 20, padding: "2.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff", marginBottom: "0.75rem", letterSpacing: "-0.02em", position: "relative" }}>
            Try Escalium — it does all of this <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>automatically</span>
          </h3>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "1.75rem", lineHeight: 1.7, position: "relative" }}>Connect Meta Ads + Spotify, launch a campaign in minutes, and see your Cost per Stream in real time.</p>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#fff", color: NAVY, borderRadius: 99, padding: "0.8rem 1.75rem", fontWeight: 800, fontSize: "0.9rem", textDecoration: "none", position: "relative" }}>
            Start for Free <span style={{ width: 22, height: 22, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>+</span>
          </Link>
        </div>

        {/* Related links */}
        <div style={{ marginTop: "4rem" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Related Reading</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { label: "Music Marketing Features", href: "/features/music-marketing" },
              { label: "Escalium Pricing", href: "/pricing" },
              { label: "Why Escalium vs Alternatives", href: "/alternatives" },
            ].map((l) => (
              <Link key={l.label} href={l.href} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: BLUE, textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
                <span>→</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
