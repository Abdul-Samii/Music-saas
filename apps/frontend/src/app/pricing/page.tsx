"use client";
import Link from "next/link";
import { useState } from "react";
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

const PLANS = [
  { name: "Starter", monthlyPrice: 29, yearlyPrice: 23, desc: "For artists just starting with paid promotion.", features: [{ text: "3 active campaigns / month", yes: true }, { text: "Basic stream analytics", yes: true }, { text: "1 lyric video / month", yes: true }, { text: "Cost per Stream tracking", yes: true }, { text: "Email support", yes: true }, { text: "Meta Ads API access", yes: false }, { text: "Unlimited lyric videos", yes: false }, { text: "White-label reports", yes: false }], cta: "Get Started Free", highlight: false },
  { name: "Pro", monthlyPrice: 79, yearlyPrice: 63, desc: "For serious independent artists scaling their reach.", features: [{ text: "Unlimited active campaigns", yes: true }, { text: "Full analytics dashboard", yes: true }, { text: "Unlimited lyric videos", yes: true }, { text: "Cost per Stream & Fan tracking", yes: true }, { text: "Priority email + chat support", yes: true }, { text: "Meta Ads API access", yes: true }, { text: "Campaign performance alerts", yes: true }, { text: "White-label reports", yes: false }], cta: "Start 14-Day Free Trial", highlight: true },
  { name: "Agency", monthlyPrice: 199, yearlyPrice: 159, desc: "For managers and labels running multiple artists.", features: [{ text: "Everything in Pro", yes: true }, { text: "Up to 20 artist accounts", yes: true }, { text: "White-label PDF reports", yes: true }, { text: "Dedicated account manager", yes: true }, { text: "Custom Meta Ads integrations", yes: true }, { text: "Bulk campaign management", yes: true }, { text: "API access for custom reporting", yes: true }, { text: "SLA & uptime guarantee", yes: true }], cta: "Contact Sales", highlight: false },
];

const FAQ = [
  { q: "Is there a free trial?", a: "Yes — the Pro plan comes with a 14-day free trial. No credit card required to start." },
  { q: "Can I cancel anytime?", a: "Absolutely. Cancel from your settings at any time. You keep access until the end of the billing period." },
  { q: "How does the lyric video creator work?", a: "Upload your MP3 or WAV, pick a background style, and our AI transcribes and syncs lyrics. Export as 1080p MP4." },
  { q: "Do I need a Meta Ads account?", a: "Yes, to launch live campaigns. We walk you through connecting it in under 2 minutes." },
  { q: "What's Cost per Stream (CPS)?", a: "CPS = total ad spend ÷ new streams gained. It tells you exactly what each new stream cost you in ad dollars." },
  { q: "Is Spotify connection required?", a: "Only to pull stream data automatically. Without it you can still use the campaign builder and lyric video creator." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", color: NAVY }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "#fff" }}>
        <DotGrid id="dots-pr1" />
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "9rem 2rem 5rem", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#EEF2FF", border: "1px solid #C7D4FF", borderRadius: 99, padding: "0.35rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: BLUE, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, display: "inline-block" }} /> Simple, transparent pricing
          </div>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, letterSpacing: "-0.03em", color: NAVY, marginBottom: "1rem", lineHeight: 1.15 }}>
            Start free. Scale when{" "}
            <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>you grow.</span>
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "#4A5370", lineHeight: 1.75, marginBottom: "2.5rem" }}>No hidden fees. No long-term contracts. Cancel anytime.</p>
          {/* Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.875rem", background: "#fff", border: "1px solid #E2E6F0", borderRadius: 99, padding: "0.375rem 1.125rem" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: annual ? "#9BA3BF" : NAVY }}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} style={{ width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer", background: annual ? BLUE : "#E2E6F0", position: "relative", transition: "background 0.2s" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: annual ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
            </button>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: annual ? NAVY : "#9BA3BF" }}>
              Annual <span style={{ marginLeft: "0.3rem", fontSize: "0.68rem", fontWeight: 700, background: "#F0FDF4", color: "#12B76A", padding: "0.1rem 0.45rem", borderRadius: 99 }}>−20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{ position: "relative", maxWidth: 1060, margin: "0 auto", padding: "0 2rem 5rem", overflow: "visible" }}>
        <DotGrid id="dots-pr2" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", position: "relative" }}>
          {PLANS.map((plan) => {
            const price = annual ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div key={plan.name} style={{ background: plan.highlight ? NAVY : "#fff", border: `1.5px solid ${plan.highlight ? NAVY : "#E2E6F0"}`, borderRadius: 20, padding: "2rem", position: "relative", display: "flex", flexDirection: "column", boxShadow: plan.highlight ? "0 24px 80px rgba(11,17,32,0.18)" : "0 2px 12px rgba(0,0,0,0.04)" }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", fontSize: "0.68rem", fontWeight: 700, padding: "0.25rem 1rem", borderRadius: 99, whiteSpace: "nowrap" }}>Most Popular</div>
                )}
                <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: plan.highlight ? "rgba(255,255,255,0.4)" : "#9BA3BF", marginBottom: "0.625rem" }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.375rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.03em", color: plan.highlight ? "#fff" : NAVY, lineHeight: 1 }}>${price}</span>
                  <span style={{ fontSize: "0.875rem", color: plan.highlight ? "rgba(255,255,255,0.4)" : "#9BA3BF" }}>/mo</span>
                </div>
                {annual && <p style={{ fontSize: "0.75rem", color: "#12B76A", fontWeight: 600, marginBottom: "0.375rem" }}>Billed ${price * 12}/year</p>}
                <p style={{ fontSize: "0.8125rem", color: plan.highlight ? "rgba(255,255,255,0.5)" : "#9BA3BF", lineHeight: 1.6, marginBottom: "1.75rem" }}>{plan.desc}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem", flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f.text} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.8125rem", color: plan.highlight ? (f.yes ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)") : (f.yes ? "#4A5370" : "#9BA3BF"), opacity: f.yes ? 1 : 0.5 }}>
                      <span style={{ color: f.yes ? "#12B76A" : "#9BA3BF", fontWeight: 700, flexShrink: 0 }}>{f.yes ? "✓" : "✕"}</span>{f.text}
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === "Agency" ? "#" : "/signup"} style={{ display: "block", textAlign: "center", padding: "0.8rem", background: plan.highlight ? `linear-gradient(135deg, ${BLUE}, #4C1AEA)` : "#F8F9FC", color: plan.highlight ? "#fff" : NAVY, borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", border: plan.highlight ? "none" : "1.5px solid #E2E6F0" }}>{plan.cta}</Link>
              </div>
            );
          })}
        </div>

        {/* Trust signals */}
        <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", marginTop: "2.5rem", padding: "1.5rem 2rem", background: "#fff", borderRadius: 16, border: "1px solid #E2E6F0", position: "relative" }}>
          {[{ icon: "🔒", label: "No credit card to start" }, { icon: "↩", label: "Cancel anytime" }, { icon: "⚡", label: "Setup in under 5 minutes" }, { icon: "🎵", label: "Built for independent artists" }].map((t) => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#4A5370", fontWeight: 500 }}>
              <span>{t.icon}</span>{t.label}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "0 2rem 6rem", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>FAQ</p>
          <h2 style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 900, color: NAVY, letterSpacing: "-0.03em" }}>Frequently Asked <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Questions</span></h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 14, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.125rem 1.25rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: NAVY }}>{item.q}</span>
                <span style={{ color: BLUE, fontSize: "1.25rem", flexShrink: 0, fontWeight: 300, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 1.25rem 1.125rem" }}>
                  <p style={{ fontSize: "0.875rem", color: "#4A5370", lineHeight: 1.75 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: "relative", padding: "7rem 2rem", background: NAVY, textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,26,234,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <h2 style={{ fontSize: "clamp(1.75rem,3.5vw,2.5rem)", fontWeight: 900, color: "#fff", marginBottom: "1rem", letterSpacing: "-0.03em" }}>Ready to grow your <span style={{ background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>streams?</span></h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "2.5rem", lineHeight: 1.75 }}>Join 500+ independent artists scaling with data-driven music marketing.</p>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#fff", color: NAVY, borderRadius: 99, padding: "0.875rem 2rem", fontWeight: 800, fontSize: "0.95rem", textDecoration: "none" }}>Create Your Free Account <span style={{ width: 22, height: 22, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>+</span></Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
