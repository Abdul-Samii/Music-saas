"use client";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PLANS = [
  {
    name: "Starter",
    monthlyPrice: 29,
    yearlyPrice: 23,
    desc: "For artists just starting out with paid promotion.",
    features: [
      { text: "3 active campaigns / month",       included: true  },
      { text: "Basic stream analytics",            included: true  },
      { text: "1 lyric video / month",             included: true  },
      { text: "Cost per Stream tracking",          included: true  },
      { text: "Email support",                     included: true  },
      { text: "Meta Ads API access",               included: false },
      { text: "Unlimited lyric videos",            included: false },
      { text: "White-label reports",               included: false },
      { text: "Multi-artist management",           included: false },
    ],
    cta: "Get Started Free",
    primary: false,
  },
  {
    name: "Pro",
    monthlyPrice: 79,
    yearlyPrice: 63,
    desc: "For serious independent artists scaling their reach.",
    features: [
      { text: "Unlimited active campaigns",        included: true  },
      { text: "Full analytics dashboard",          included: true  },
      { text: "Unlimited lyric videos",            included: true  },
      { text: "Cost per Stream & Fan tracking",    included: true  },
      { text: "Priority email + chat support",     included: true  },
      { text: "Meta Ads API access",               included: true  },
      { text: "Campaign performance alerts",       included: true  },
      { text: "White-label reports",               included: false },
      { text: "Multi-artist management",           included: false },
    ],
    cta: "Start 14-Day Free Trial",
    primary: true,
  },
  {
    name: "Agency",
    monthlyPrice: 199,
    yearlyPrice: 159,
    desc: "For managers and labels running multiple artists.",
    features: [
      { text: "Everything in Pro",                 included: true  },
      { text: "Up to 20 artist accounts",          included: true  },
      { text: "White-label PDF reports",           included: true  },
      { text: "Dedicated account manager",         included: true  },
      { text: "Custom Meta Ads integrations",      included: true  },
      { text: "Bulk campaign management",          included: true  },
      { text: "API access for custom reporting",   included: true  },
      { text: "SLA & uptime guarantee",            included: true  },
      { text: "Multi-artist management",           included: true  },
    ],
    cta: "Contact Sales",
    primary: false,
  },
];

const FAQ = [
  { q: "Is there a free trial?",                     a: "Yes — the Pro plan comes with a 14-day free trial. No credit card required to start." },
  { q: "Can I cancel anytime?",                       a: "Absolutely. Cancel from your settings at any time. You keep access until the end of the billing period." },
  { q: "How does the lyric video creator work?",      a: "Upload your MP3 or WAV, pick a background style, and our AI (Whisper) transcribes and syncs lyrics. Export as 1080p MP4." },
  { q: "Do I need a Meta Ads account?",               a: "Yes, to launch live campaigns. We walk you through connecting it in under 2 minutes." },
  { q: "What's Cost per Stream (CPS)?",               a: "CPS = total ad spend ÷ new streams gained. It tells you exactly what each new stream cost you in ad dollars." },
  { q: "Is Spotify connection required?",             a: "Only to pull stream data automatically. Without it you can still use the campaign builder and lyric video creator." },
];

export default function PricingPage() {
  const [annual, setAnnual]     = useState(false);
  const [openFaq, setOpenFaq]   = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: "9rem", paddingBottom: "4rem", textAlign: "center", maxWidth: 680, margin: "0 auto", padding: "9rem 2rem 4rem" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "var(--primary-light)", border: "1px solid var(--primary-glow)",
          borderRadius: 99, padding: "0.35rem 1rem", marginBottom: "1.5rem",
          fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
          Simple, transparent pricing
        </div>
        <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "1rem", lineHeight: 1.15 }}>
          Start free. Scale when{" "}
          <span className="gradient-text">you grow.</span>
        </h1>
        <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
          No hidden fees. No long-term contracts. Cancel anytime.
        </p>

        {/* Annual / Monthly toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.875rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 99, padding: "0.375rem 1.125rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: annual ? "var(--text-muted)" : "var(--text-primary)" }}>Monthly</span>
          <button onClick={() => setAnnual(!annual)} style={{
            width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer",
            background: annual ? "var(--primary)" : "var(--border)", position: "relative", transition: "background 0.2s",
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3, left: annual ? 23 : 3,
              transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }} />
          </button>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: annual ? "var(--text-primary)" : "var(--text-muted)" }}>
            Annual
            <span style={{ marginLeft: "0.4rem", fontSize: "0.68rem", fontWeight: 700, background: "var(--success-light)", color: "var(--success)", padding: "0.1rem 0.45rem", borderRadius: 99 }}>−20%</span>
          </span>
        </div>
      </section>

      {/* Plan cards */}
      <section style={{ maxWidth: 1060, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="pricing-grid">
          {PLANS.map((plan) => {
            const price = annual ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div key={plan.name} style={{
                background: "var(--bg-card)", borderRadius: 20, padding: "2rem",
                border: plan.primary ? "2px solid var(--primary)" : "1px solid var(--border)",
                boxShadow: plan.primary ? "0 0 40px var(--primary-glow)" : "0 1px 6px rgba(0,0,0,0.04)",
                position: "relative", display: "flex", flexDirection: "column",
              }}>
                {plan.primary && (
                  <div style={{
                    position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                    background: "var(--primary)", color: "#fff", fontSize: "0.68rem",
                    fontWeight: 700, padding: "0.2rem 0.875rem", borderRadius: 99,
                    letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap",
                  }}>Most Popular</div>
                )}

                <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.625rem" }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.375rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", lineHeight: 1 }}>${price}</span>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>/mo</span>
                </div>
                {annual && (
                  <p style={{ fontSize: "0.75rem", color: "var(--success)", fontWeight: 600, marginBottom: "0.375rem" }}>Billed ${price * 12}/year</p>
                )}
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.75rem" }}>{plan.desc}</p>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem", flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f.text} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.8125rem", color: f.included ? "var(--text-secondary)" : "var(--text-muted)", opacity: f.included ? 1 : 0.45 }}>
                      <span style={{ color: f.included ? "var(--success)" : "var(--text-muted)", fontWeight: 700, flexShrink: 0 }}>
                        {f.included ? "✓" : "✕"}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>

                <Link href={plan.name === "Agency" ? "#" : "/register"}
                  className={`btn ${plan.primary ? "btn-primary" : "btn-secondary"}`}
                  style={{ justifyContent: "center", textDecoration: "none" }}>
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Trust signals */}
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", marginTop: "2.5rem", padding: "1.5rem 2rem", background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)" }}>
          {[
            { icon: "🔒", label: "No credit card to start" },
            { icon: "↩", label: "Cancel anytime" },
            { icon: "⚡", label: "Setup in under 5 minutes" },
            { icon: "🎵", label: "Built for independent artists" },
          ].map((t) => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>
              <span>{t.icon}</span>{t.label}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 2rem 6rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, textAlign: "center", marginBottom: "2.5rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "1.125rem 1.25rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem",
              }}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{item.q}</span>
                <span style={{ color: "var(--primary)", fontSize: "1.25rem", flexShrink: 0, fontWeight: 300, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 1.25rem 1.125rem" }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: "5rem 2rem", textAlign: "center", background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Ready to grow your <span className="gradient-text">streams?</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: 460, margin: "0 auto 2rem" }}>
          Join 500+ independent artists scaling with data-driven music marketing.
        </p>
        <Link href="/signup" className="btn btn-primary btn-lg">Create Your Free Account</Link>
      </section>

      <Footer />

    </div>
  );
}
