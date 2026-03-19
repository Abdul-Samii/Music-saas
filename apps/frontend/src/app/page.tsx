"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F3" }}>
      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2.5rem", borderBottom: "1px solid #E8E8EC",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#3A60E7,#4C1AEA)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1C1C1E" }}>Escalium</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <a href="#features" style={{ color: "#4A5370", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>Features</a>
          <a href="#pricing" style={{ color: "#4A5370", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>Pricing</a>
          <Link href="/login" style={{ color: "#4A5370", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>Sign In</Link>
          <Link href="/register" style={{ background: "#1C1C1E", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: 99, fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "6rem 2rem 5rem", textAlign: "center", maxWidth: 900, margin: "0 auto", position: "relative" }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
          width: 700, height: 400,
          background: "radial-gradient(ellipse, rgba(103,61,230,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "var(--accent-light)", border: "1px solid rgba(103,61,230,0.3)",
          borderRadius: 99, padding: "0.35rem 1rem", marginBottom: "2rem",
          fontSize: "0.8rem", color: "#a78bfa",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
          Now supporting Meta Ads API v21.0
        </div>

        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800,
          lineHeight: 1.15, marginBottom: "1.5rem", letterSpacing: "-0.02em",
        }}>
          Grow Your Music With{" "}
          <span className="gradient-text">Precision Advertising</span>
        </h1>

        <p style={{
          fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: 600,
          margin: "0 auto 2.5rem", lineHeight: 1.7,
        }}>
          Launch Meta Ads campaigns, track Cost per Stream, and create stunning lyric videos — all without leaving the platform.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" className="btn btn-primary btn-lg">
            Start Growing Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">See a Demo</Link>
        </div>

        {/* Social proof */}
        <p style={{ marginTop: "2.5rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
          Trusted by <strong style={{ color: "var(--text-secondary)" }}>500+ independent artists</strong> worldwide
        </p>
      </section>

      {/* Stats bar */}
      <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "2rem", background: "var(--bg-card)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {[
            { value: "$2.4M+", label: "Ad Spend Managed" },
            { value: "1.2M+", label: "New Streams Generated" },
            { value: "$0.008", label: "Avg Cost per Stream" },
            { value: "98%", label: "Campaign Success Rate" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)" }}>{stat.value}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
            Everything You Need to Grow
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
            Stop juggling between Ads Manager, Spotify for Artists, and video editors. Escalium brings it all together.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              ),
              color: "#7c3aed",
              title: "Campaign Builder",
              desc: "Create and launch premade Meta Ads campaigns in minutes. No Ads Manager needed — just pick a template, set your budget, and go live.",
              bullets: ["Pre-built campaign templates", "One-click launch to Meta", "Auto-optimized targeting for music"],
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              color: "#10b981",
              title: "Cost per Stream Analytics",
              desc: "See exactly how much each new stream costs. We combine your Meta Ads spend with Spotify stream deltas to give you real ROI data.",
              bullets: ["Cost per Stream (CPS)", "Cost per Fan (CPF)", "Stream growth attribution"],
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              ),
              color: "#f59e0b",
              title: "Lyric Video Creator",
              desc: "Upload your track, pick a video template, and we auto-transcribe and overlay timed lyrics — ready to use as a Meta ad creative.",
              bullets: ["AI transcription via Whisper", "Animated lyric overlays", "Export as MP4 for Meta Ads"],
            },
          ].map((f) => (
            <div key={f.title} className="card" style={{ transition: "border-color 0.2s, transform 0.2s" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = f.color + "55";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: f.color + "20", border: `1px solid ${f.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: f.color, marginBottom: "1rem",
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "1.05rem" }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>{f.desc}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {f.bullets.map((b) => (
                  <li key={b} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: f.color, fontWeight: 700 }}>✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "5rem 2rem", background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>From Upload to Growth in 4 Steps</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "3rem" }}>No technical knowledge required.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem" }}>
            {[
              { step: "01", title: "Connect Accounts", desc: "Link your Meta Ads and Spotify accounts in one click." },
              { step: "02", title: "Pick a Template", desc: "Choose from proven campaign templates built for music." },
              { step: "03", title: "Set Budget & Launch", desc: "Define your spend, approve, and go live instantly." },
              { step: "04", title: "Track Real Growth", desc: "Watch streams climb and see your Cost per Stream drop." },
            ].map((s) => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "var(--accent-light)", border: "1px solid rgba(103,61,230,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "0.75rem", fontWeight: 700, color: "#a78bfa",
                }}>{s.step}</div>
                <h4 style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.95rem" }}>{s.title}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "5rem 2rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>Simple, Transparent Pricing</h2>
          <p style={{ color: "var(--text-secondary)" }}>Start free, scale when you grow.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {[
            {
              name: "Starter", price: "Free", period: "forever",
              features: ["3 campaigns/month", "Basic analytics", "1 lyric video/month", "Email support"],
              cta: "Get Started", primary: false,
            },
            {
              name: "Pro", price: "$49", period: "/month",
              features: ["Unlimited campaigns", "Full analytics + CPS", "Unlimited lyric videos", "Priority support", "Meta Ads API access"],
              cta: "Start Free Trial", primary: true,
            },
            {
              name: "Label", price: "$199", period: "/month",
              features: ["Everything in Pro", "Up to 20 artists", "White-label reports", "Dedicated account manager", "Custom integrations"],
              cta: "Contact Sales", primary: false,
            },
          ].map((plan) => (
            <div key={plan.name} className="card" style={{
              position: "relative",
              border: plan.primary ? "1px solid var(--accent)" : "1px solid var(--border)",
              boxShadow: plan.primary ? "0 0 40px var(--accent-glow)" : undefined,
            }}>
              {plan.primary && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "var(--accent)", color: "#fff", fontSize: "0.7rem", fontWeight: 700,
                  padding: "0.2rem 0.75rem", borderRadius: 99, letterSpacing: "0.05em", textTransform: "uppercase",
                }}>Most Popular</div>
              )}
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                  <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>{plan.price}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{plan.period}</span>
                </div>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.75rem" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--success)" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`btn ${plan.primary ? "btn-primary" : "btn-secondary"}`} style={{ width: "100%", justifyContent: "center" }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 2rem", textAlign: "center", background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
          Ready to Grow Your <span className="gradient-text">Music Career</span>?
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: 500, margin: "0 auto 2rem" }}>
          Join hundreds of artists growing with data-driven advertising. Start for free.
        </p>
        <Link href="/register" className="btn btn-primary btn-lg">
          Create Your Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: "2rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Escalium</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>© 2025 Escalium. All rights reserved.</p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.8rem" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
