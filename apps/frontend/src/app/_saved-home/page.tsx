"use client";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

/* ── reusable dot-grid SVG background ── */
const DotGrid = ({ opacity = 0.4 }: { opacity?: number }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" fillOpacity={opacity} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);

  const platforms = [
    { label: "Meta Ads", desc: "Launch targeted campaigns directly to Meta with pre-built music templates. No Ads Manager knowledge needed." },
    { label: "Spotify",  desc: "Track stream growth, Cost per Stream and fan acquisition tied directly to your ad spend." },
    { label: "TikTok",   desc: "Repurpose your lyric videos as TikTok ads and track performance alongside your other campaigns." },
    { label: "YouTube",  desc: "Run pre-roll ads on YouTube and measure views, clicks and subscriber growth from one dashboard." },
  ];

  const testimonials = [
    { name: "Marcus J.",  role: "Independent R&B Artist",        quote: "I went from 800 to 14,000 monthly listeners in 6 weeks. The Cost per Stream metric alone changed how I think about my budget." },
    { name: "Layla K.",   role: "Indie Pop Singer-Songwriter",    quote: "Creating lyric videos used to take me a full day. With Escalium it's 10 minutes and the quality is better than what I did manually." },
    { name: "DJ Ronin",   role: "Electronic Music Producer",      quote: "Finally a tool built for artists, not marketers. The campaign templates are dialled in for music and the analytics are actually useful." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", color: NAVY, overflowX: "hidden" }}>
      <Navbar />

      {/* ────────────────── HERO ────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
        {/* Dot grid */}
        <DotGrid opacity={0.5} />

        {/* Gradient blobs */}
        <div style={{ position: "absolute", top: -120, left: -120, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -80, right: -80,  width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,26,234,0.1) 0%, transparent 70%)",  pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: "40%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "8rem 2rem 5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", position: "relative" }}>
          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "#EEF2FF", border: "1px solid #C7D4FF",
              borderRadius: 99, padding: "0.35rem 1rem",
              marginBottom: "1.75rem", fontSize: "0.8rem", color: BLUE, fontWeight: 600,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, display: "inline-block" }} />
              Now supporting Meta Ads API v21.0
            </div>

            <h1 style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "1.5rem", color: NAVY }}>
              Grow Your Music With{" "}
              <span style={{
                background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Precision Advertising
              </span>
            </h1>

            <p style={{ fontSize: "1.05rem", color: "#4A5370", lineHeight: 1.8, marginBottom: "2.25rem", maxWidth: 460 }}>
              Launch Meta Ads campaigns, track Cost per Stream, and create stunning lyric videos — all without leaving the platform.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              <Link href="/signup" style={{
                display: "inline-flex", alignItems: "center", gap: "0.625rem",
                background: NAVY, color: "#fff", borderRadius: 99,
                padding: "0.8rem 1.75rem", fontWeight: 700, fontSize: "0.95rem",
                textDecoration: "none", boxShadow: "0 4px 20px rgba(11,17,32,0.2)",
              }}>
                Start Growing Free
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1 }}>+</span>
              </Link>
              <Link href="/login" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#fff", color: NAVY, borderRadius: 99,
                padding: "0.8rem 1.75rem", fontWeight: 600, fontSize: "0.95rem",
                textDecoration: "none", border: "1.5px solid #E2E6F0",
              }}>
                See a Demo
              </Link>
            </div>

            {/* Social proof avatars */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ display: "flex" }}>
                {["#3A60E7","#12B76A","#F59E0B","#F43F5E"].map((c, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: "2px solid #fff", marginLeft: i === 0 ? 0 : -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#fff" }}>
                    {["MJ","LK","DR","SA"][i]}
                  </div>
                ))}
              </div>
              <p style={{ color: "#4A5370", fontSize: "0.8125rem" }}>
                <strong style={{ color: NAVY }}>500+</strong> independent artists growing with Escalium
              </p>
            </div>
          </div>

          {/* Right — Dashboard mockup */}
          <div style={{ position: "relative" }}>
            {/* Glow behind card */}
            <div style={{ position: "absolute", inset: -30, borderRadius: 40, background: "radial-gradient(ellipse, rgba(58,96,231,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Main card */}
            <div style={{
              position: "relative",
              background: "#fff",
              borderRadius: 24, padding: "1.5rem",
              border: "1px solid #E2E6F0",
              boxShadow: "0 24px 80px rgba(58,96,231,0.12), 0 4px 16px rgba(0,0,0,0.06)",
            }}>
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div>
                  <p style={{ fontSize: "0.65rem", color: "#9BA3BF", fontWeight: 500 }}>Campaign Overview</p>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: NAVY }}>New Release · Summer 2025</p>
                </div>
                <div style={{ padding: "0.3rem 0.75rem", background: "#DCFCE7", borderRadius: 99, fontSize: "0.7rem", fontWeight: 700, color: "#15803D" }}>● Live</div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                {[
                  { label: "Monthly Streams", value: "14,280", change: "↑ 182%",  color: "#12B76A" },
                  { label: "Cost per Stream", value: "$0.007", change: "↓ 23%",   color: "#12B76A" },
                  { label: "Ad Spend",        value: "$340",   change: "This month", color: "#9BA3BF" },
                  { label: "New Fans",        value: "1,840",  change: "↑ 94%",   color: "#12B76A" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#F8F9FC", borderRadius: 12, padding: "0.875rem", border: "1px solid #E2E6F0" }}>
                    <p style={{ fontSize: "0.6rem", color: "#9BA3BF", marginBottom: "0.3rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 800, color: NAVY, marginBottom: "0.2rem" }}>{s.value}</p>
                    <p style={{ fontSize: "0.65rem", color: s.color, fontWeight: 600 }}>{s.change}</p>
                  </div>
                ))}
              </div>

              {/* Mini bar chart */}
              <div style={{ background: "#F8F9FC", borderRadius: 12, padding: "1rem", border: "1px solid #E2E6F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <p style={{ fontSize: "0.65rem", color: "#9BA3BF", fontWeight: 500 }}>Stream Growth — Last 7 Days</p>
                  <p style={{ fontSize: "0.65rem", color: BLUE, fontWeight: 600 }}>+182%</p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: 52 }}>
                  {[22, 35, 28, 48, 55, 72, 100].map((h, i) => (
                    <div key={i} style={{
                      flex: 1, height: `${h}%`,
                      background: i === 6 ? `linear-gradient(180deg, ${BLUE}, #4C1AEA)` : "#E2E6F0",
                      borderRadius: "4px 4px 0 0", transition: "height 0.3s",
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
                  {["M","T","W","T","F","S","S"].map((d, i) => (
                    <span key={i} style={{ flex: 1, textAlign: "center", fontSize: "0.55rem", color: "#9BA3BF" }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge 1 */}
            <div style={{
              position: "absolute", bottom: 40, left: -48,
              background: "#fff", border: "1px solid #E2E6F0",
              borderRadius: 12, padding: "0.625rem 1rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", gap: "0.5rem",
              whiteSpace: "nowrap",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#12B76A", flexShrink: 0 }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: NAVY }}>Campaign live · 2.3k impressions</span>
            </div>

            {/* Floating badge 2 */}
            <div style={{
              position: "absolute", top: 20, right: -32,
              background: "#fff", border: "1px solid #E2E6F0",
              borderRadius: 12, padding: "0.625rem 1rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", gap: "0.5rem",
              whiteSpace: "nowrap",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: NAVY }}>Cost per Stream ↓ $0.007</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── STATS BAR ────────────────── */}
      <section style={{ borderTop: "1px solid #E2E6F0", borderBottom: "1px solid #E2E6F0", padding: "2rem", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {[
            { value: "$2.4M+", label: "Ad Spend Managed" },
            { value: "1.2M+", label: "New Streams Generated" },
            { value: "$0.008", label: "Avg Cost per Stream" },
            { value: "98%",   label: "Campaign Success Rate" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: NAVY, letterSpacing: "-0.02em" }}>{stat.value}</div>
              <div style={{ fontSize: "0.8rem", color: "#9BA3BF", marginTop: "0.25rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────── FEATURES ────────────────── */}
      <section style={{ position: "relative", padding: "6rem 2rem", overflow: "hidden" }}>
        <DotGrid opacity={0.35} />
        <div style={{ position: "absolute", top: "30%", right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,26,234,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Platform Features</p>
            <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.5rem)", fontWeight: 900, color: NAVY, marginBottom: "1rem", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              The Future of Music Marketing is Here —{" "}
              <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                And It&apos;s Smarter Than Ever
              </span>
            </h2>
            <p style={{ color: "#4A5370", maxWidth: 520, margin: "0 auto", fontSize: "1rem", lineHeight: 1.75 }}>
              Stop juggling between Ads Manager, Spotify for Artists, and video editors. Escalium brings it all together.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
                title: "Campaign Builder",
                desc: "Create and launch Meta Ads in minutes with pre-built music templates. No Ads Manager needed.",
                bg: "#EEF2FF",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                title: "Stream Analytics",
                desc: "See Cost per Stream and Cost per Fan in real time. Know your exact ROI from every dollar spent.",
                bg: "#F0FDF4",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4C1AEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
                title: "Lyric Video Creator",
                desc: "Upload your track, pick a template, and AI auto-generates timed lyric overlays ready for Meta Ads.",
                bg: "#F5F0FF",
              },
              {
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                title: "Auto-Optimisation",
                desc: "Escalium continuously adjusts targeting and bidding to lower your Cost per Stream over time.",
                bg: "#FFFBEB",
              },
            ].map((f) => (
              <div key={f.title}
                style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "1.75rem", cursor: "default", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(58,96,231,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: NAVY, marginBottom: "0.625rem" }}>{f.title}</h3>
                <p style={{ color: "#4A5370", fontSize: "0.875rem", lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── HOW IT WORKS ────────────────── */}
      <section style={{ position: "relative", padding: "6rem 2rem", background: "#fff", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <DotGrid opacity={0.3} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>How It Works</p>
            <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.5rem)", fontWeight: 900, color: NAVY, marginBottom: "1rem", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              Understanding How It Works{" "}
              <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Step by Step
              </span>
            </h2>
            <p style={{ color: "#4A5370", maxWidth: 480, margin: "0 auto" }}>No technical knowledge required. Go live in under 10 minutes.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                step: "01", title: "Connect Accounts",
                desc: "Link your Meta Ads and Spotify accounts in one click.",
                preview: (
                  <div style={{ marginTop: "1.25rem", background: "#F8F9FC", borderRadius: 12, padding: "1rem", border: "1px solid #E2E6F0" }}>
                    {["Meta Ads ✓", "Spotify ✓"].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "#fff", borderRadius: 8, marginBottom: "0.5rem", fontSize: "0.75rem", fontWeight: 600, color: NAVY, border: "1px solid #E2E6F0" }}>
                        <span>{s.replace(" ✓","")}</span>
                        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#12B76A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                step: "02", title: "Pick a Template",
                desc: "Choose from proven campaign templates built for music releases.",
                preview: (
                  <div style={{ marginTop: "1.25rem", background: "#F8F9FC", borderRadius: 12, padding: "1rem", border: "1px solid #E2E6F0" }}>
                    {[{ t: "New Release Boost", active: true }, { t: "Fan Growth", active: false }, { t: "Playlist Push", active: false }].map((item, i) => (
                      <div key={i} style={{ padding: "0.5rem 0.75rem", background: item.active ? BLUE : "#fff", borderRadius: 8, marginBottom: "0.5rem", fontSize: "0.75rem", fontWeight: 600, color: item.active ? "#fff" : "#4A5370", border: `1px solid ${item.active ? BLUE : "#E2E6F0"}` }}>
                        {item.t}
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                step: "03", title: "Set Budget & Launch",
                desc: "Define your spend, approve the creative, and go live instantly.",
                preview: (
                  <div style={{ marginTop: "1.25rem", background: "#F8F9FC", borderRadius: 12, padding: "1rem", border: "1px solid #E2E6F0" }}>
                    <div style={{ fontSize: "0.6rem", color: "#9BA3BF", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Daily Budget</div>
                    <div style={{ background: "#fff", borderRadius: 8, padding: "0.5rem 0.75rem", fontSize: "1rem", fontWeight: 800, color: NAVY, marginBottom: "0.75rem", border: "1px solid #E2E6F0" }}>$20 / day</div>
                    <div style={{ background: NAVY, borderRadius: 8, padding: "0.6rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>Launch Campaign →</div>
                  </div>
                ),
              },
            ].map((s) => (
              <div key={s.step} style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "1.75rem", position: "relative", overflow: "hidden" }}>
                {/* Step number watermark */}
                <div style={{ position: "absolute", top: -10, right: 16, fontSize: "5rem", fontWeight: 900, color: "#F1F5F9", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>{s.step}</div>
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>{s.step}</div>
                    <h3 style={{ fontWeight: 700, fontSize: "1rem", color: NAVY }}>{s.title}</h3>
                  </div>
                  <p style={{ color: "#4A5370", fontSize: "0.875rem", lineHeight: 1.7 }}>{s.desc}</p>
                  {s.preview}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── PLATFORM TABS ────────────────── */}
      <section style={{ padding: "6rem 2rem", position: "relative", overflow: "hidden" }}>
        <DotGrid opacity={0.35} />
        <div style={{ position: "absolute", top: "20%", left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Multi-Platform</p>
            <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.5rem)", fontWeight: 900, color: NAVY, marginBottom: "1rem", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              Works Across Every{" "}
              <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Major Platform
              </span>
            </h2>
            <p style={{ color: "#4A5370", maxWidth: 480, margin: "0 auto" }}>Manage all your music marketing channels from one dashboard.</p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
            {platforms.map((p, i) => (
              <button key={p.label} onClick={() => setActiveTab(i)} style={{
                padding: "0.55rem 1.5rem", borderRadius: 99, fontWeight: 600, fontSize: "0.875rem",
                border: i === activeTab ? "none" : "1.5px solid #E2E6F0",
                background: i === activeTab ? NAVY : "#fff",
                color: i === activeTab ? "#fff" : "#4A5370",
                cursor: "pointer", transition: "all 0.2s",
              }}>
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "3rem 2.5rem", textAlign: "center", minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            <p style={{ color: "#4A5370", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: 560 }}>
              {platforms[activeTab].desc}
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────── TESTIMONIALS ────────────────── */}
      <section style={{ position: "relative", padding: "6rem 2rem", background: "#fff", overflow: "hidden" }}>
        <DotGrid opacity={0.3} />
        <div style={{ position: "absolute", top: "50%", right: -100, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Testimonials</p>
            <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.5rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              What Our Happy{" "}
              <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Artists Are Saying
              </span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {testimonials.map((t, i) => (
              <div key={t.name} style={{
                background: i === 1 ? NAVY : "#fff",
                border: `1px solid ${i === 1 ? NAVY : "#E2E6F0"}`,
                borderRadius: 20, padding: "1.75rem",
                boxShadow: i === 1 ? "0 20px 60px rgba(11,17,32,0.15)" : "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem" }}>
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill={i === 1 ? "#F59E0B" : BLUE} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p style={{ color: i === 1 ? "rgba(255,255,255,0.8)" : "#4A5370", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 1 ? "rgba(255,255,255,0.1)" : "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: i === 1 ? "#fff" : BLUE, flexShrink: 0 }}>
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: i === 1 ? "#fff" : NAVY }}>{t.name}</p>
                    <p style={{ fontSize: "0.75rem", color: i === 1 ? "rgba(255,255,255,0.5)" : "#9BA3BF" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── PRICING ────────────────── */}
      <section style={{ position: "relative", padding: "6rem 2rem", overflow: "hidden" }}>
        <DotGrid opacity={0.35} />
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Pricing</p>
            <h2 style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.5rem)", fontWeight: 900, color: NAVY, marginBottom: "1rem", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              Simple,{" "}
              <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Transparent Pricing
              </span>
            </h2>
            <p style={{ color: "#4A5370" }}>Start free, scale when you grow.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {[
              { name: "Starter", price: "Free", period: "forever", features: ["3 campaigns/month", "Basic analytics", "1 lyric video/month", "Email support"], cta: "Get Started", highlight: false },
              { name: "Pro",     price: "$49",  period: "/month",  features: ["Unlimited campaigns", "Full analytics + CPS", "Unlimited lyric videos", "Priority support", "Meta Ads API access"], cta: "Start Free Trial", highlight: true },
              { name: "Label",   price: "$199", period: "/month",  features: ["Everything in Pro", "Up to 20 artists", "White-label reports", "Dedicated account manager"], cta: "Contact Sales", highlight: false },
            ].map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? NAVY : "#fff",
                border: `1.5px solid ${plan.highlight ? NAVY : "#E2E6F0"}`,
                borderRadius: 20, padding: "2rem", position: "relative",
                boxShadow: plan.highlight ? "0 24px 80px rgba(11,17,32,0.18)" : "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 1rem", borderRadius: 99, whiteSpace: "nowrap" }}>Most Popular</div>
                )}
                <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: plan.highlight ? "rgba(255,255,255,0.4)" : "#9BA3BF", marginBottom: "0.5rem" }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 900, color: plan.highlight ? "#fff" : NAVY, letterSpacing: "-0.03em" }}>{plan.price}</span>
                  <span style={{ color: plan.highlight ? "rgba(255,255,255,0.4)" : "#9BA3BF", fontSize: "0.875rem" }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.75rem" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: plan.highlight ? "rgba(255,255,255,0.75)" : "#4A5370" }}>
                      <span style={{ color: "#12B76A", fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" style={{
                  display: "block", textAlign: "center", padding: "0.8rem",
                  background: plan.highlight ? `linear-gradient(135deg, ${BLUE}, #4C1AEA)` : "#F8F9FC",
                  color: plan.highlight ? "#fff" : NAVY,
                  borderRadius: 10, fontWeight: 700, fontSize: "0.9rem",
                  textDecoration: "none", border: plan.highlight ? "none" : "1.5px solid #E2E6F0",
                }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────── CTA ────────────────── */}
      <section style={{ position: "relative", padding: "7rem 2rem", background: NAVY, textAlign: "center", overflow: "hidden" }}>
        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -80, left: -80,  width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,26,234,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "#fff", marginBottom: "1rem", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
            Ready to Grow Your{" "}
            <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Music Career?
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "2.5rem", lineHeight: 1.8, fontSize: "1.05rem" }}>
            Join hundreds of artists growing with data-driven advertising. Start for free — no credit card required.
          </p>
          <Link href="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: "0.625rem",
            background: "#fff", color: NAVY, borderRadius: 99,
            padding: "0.9rem 2.25rem", fontWeight: 800, fontSize: "1rem",
            textDecoration: "none", boxShadow: "0 4px 24px rgba(255,255,255,0.15)",
          }}>
            Create Your Free Account
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", lineHeight: 1 }}>+</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
