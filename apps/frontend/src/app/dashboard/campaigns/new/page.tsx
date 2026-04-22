"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.escalium.io/api/v1";
const BLUE = "#3A60E7";
const NAVY = "#0B1120";

const STEPS = ["Campaign", "Conversion", "Budget", "Audience", "Placement", "Review"];

const AUDIENCE_TIERS = [
  { value: "tier1",  label: "Tier 1",       desc: "US, UK, Canada, Australia, New Zealand" },
  { value: "tier2",  label: "Tier 2",       desc: "Germany, France, Netherlands, Sweden, Norway + more" },
  { value: "tier3",  label: "Tier 3",       desc: "Spain, Italy, Portugal, Poland + more" },
  { value: "us",     label: "US Only",      desc: "United States only" },
  { value: "top",    label: "Top Tiers",    desc: "US, UK, Canada, Australia, Germany, France + more" },
  { value: "bottom", label: "Bottom Tiers", desc: "Brazil, Mexico, India, Philippines + more" },
];

const PLACEMENTS = [
  {
    value: "pro",
    label: "Placement Pro",
    desc: "Instagram + Facebook — Stories & Reels only",
    icon: "🎯",
  },
  {
    value: "pro_plus",
    label: "Placement Pro+",
    desc: "Instagram only — Stories & Reels only",
    icon: "✨",
  },
];

type Pixel = { id: string; name: string };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function inputStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0",
    borderRadius: 10, fontSize: "0.9rem", color: NAVY, background: "#F8F9FC",
    outline: "none", boxSizing: "border-box", ...extra,
  };
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loadingPixels, setLoadingPixels] = useState(false);

  const [form, setForm] = useState({
    name: "",
    pixelId: "",
    budget: "5",
    startDate: "",
    endDate: "",
    audienceTier: "",
    placement: "",
  });

  useEffect(() => {
    if (!token) return;
    setLoadingPixels(true);
    axios.get(`${API}/meta-ads/pixels`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        setPixels(r.data.pixels ?? []);
        if (r.data.pixels?.length === 1) setForm((f) => ({ ...f, pixelId: r.data.pixels[0].id }));
      })
      .catch(() => setPixels([]))
      .finally(() => setLoadingPixels(false));
  }, [token]);

  const canNext = [
    form.name.trim().length >= 2,
    form.pixelId.length > 0,
    Number(form.budget) >= 5,
    form.audienceTier.length > 0,
    form.placement.length > 0,
    true,
  ][step];

  async function handleSaveDraft() {
    if (!token) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${API}/campaigns`,
        {
          name: form.name,
          budget: Number(form.budget),
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          pixelId: form.pixelId,
          audienceTier: form.audienceTier,
          placement: form.placement,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      router.push("/dashboard/campaigns");
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/dashboard/campaigns" style={{ display: "flex", alignItems: "center", color: "#64748b", textDecoration: "none" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </Link>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.02em" }}>New Campaign</h1>
          <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Meta Ads · Sales campaign</p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.375rem", cursor: i < step ? "pointer" : "default" }}
              onClick={() => { if (i < step) setStep(i); }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.72rem", flexShrink: 0,
                background: i < step ? "#12B76A" : i === step ? BLUE : "#F1F5F9",
                color: i <= step ? "#fff" : "#94a3b8",
                transition: "all 0.2s",
              }}>
                {i < step ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : i + 1}
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: i === step ? 700 : 400, color: i === step ? NAVY : "#94a3b8", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1.5, background: i < step ? "#12B76A" : "#E2E6F0", margin: "0 0.5rem", minWidth: 16, transition: "background 0.3s" }} />
            )}
          </div>
        ))}
      </div>

      {/* Step card */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "2rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

        {/* Step 0 — Campaign */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Campaign Details</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Enter your song or playlist name — this becomes the campaign name</p>
            </div>

            <div style={{ background: "#F0F4FF", border: "1px solid #C7D7FD", borderRadius: 12, padding: "0.875rem 1rem", display: "flex", gap: "0.625rem" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ fontSize: "0.8rem", color: BLUE, lineHeight: 1.5 }}>
                Campaign type is <strong>Sales</strong> (fixed). Budget will be set at the ad set level.
              </p>
            </div>

            <Field label="Song / Playlist Name">
              <input
                style={inputStyle()}
                placeholder="e.g. Meaning of Love"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
              {form.name.length > 0 && form.name.length < 2 && (
                <p style={{ fontSize: "0.75rem", color: "#F43F5E" }}>Name must be at least 2 characters</p>
              )}
            </Field>
          </div>
        )}

        {/* Step 1 — Conversion */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Conversion Setup</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Select your Meta Pixel — it tracks who clicks and comes to your landing page</p>
            </div>

            {/* Fixed settings info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { label: "Conversion Location", value: "Website" },
                { label: "Performance Goal", value: "Maximize Conversions" },
                { label: "Conversion Event", value: "View Content" },
              ].map((item) => (
                <div key={item.label} style={{ background: "#F8F9FC", border: "1px solid #E2E6F0", borderRadius: 10, padding: "0.75rem 1rem" }}>
                  <p style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{item.label}</p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: NAVY }}>{item.value}</p>
                </div>
              ))}
            </div>

            <Field label="Select Pixel (Dataset)">
              {loadingPixels ? (
                <div style={{ padding: "0.75rem 1rem", background: "#F8F9FC", borderRadius: 10, border: "1.5px solid #E2E6F0", color: "#94a3b8", fontSize: "0.875rem" }}>
                  Loading pixels...
                </div>
              ) : pixels.length === 0 ? (
                <div style={{ padding: "1rem", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, fontSize: "0.8125rem", color: "#92400E" }}>
                  No pixels found on your Meta account. Go back to Settings and make sure pixel creation succeeded, or create one in Meta Business Manager.
                </div>
              ) : (
                <select
                  style={inputStyle()}
                  value={form.pixelId}
                  onChange={(e) => setForm({ ...form, pixelId: e.target.value })}
                >
                  <option value="">Select a pixel...</option>
                  {pixels.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        )}

        {/* Step 2 — Budget */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Budget & Schedule</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Set your daily budget and optional campaign dates</p>
            </div>

            <Field label="Daily Budget (minimum $5/day)">
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 600 }}>$</span>
                <input
                  type="number"
                  min="5"
                  placeholder="5"
                  style={inputStyle({ paddingLeft: "2rem" })}
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>
              {form.budget && Number(form.budget) < 5 && (
                <p style={{ fontSize: "0.75rem", color: "#F43F5E" }}>Minimum daily budget is $5</p>
              )}
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Start Date (optional)">
                <input
                  type="date"
                  style={inputStyle()}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="End Date (optional)">
                <input
                  type="date"
                  style={inputStyle()}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
            </div>

            {Number(form.budget) >= 5 && (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "1rem 1.25rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Budget Summary</p>
                <p style={{ fontSize: "0.875rem", color: "#166534" }}>
                  <strong>${form.budget}/day</strong>
                  {form.startDate && form.endDate ? (() => {
                    const days = Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000);
                    return days > 0 ? ` · ${days} days · Total ~$${(Number(form.budget) * days).toLocaleString()}` : "";
                  })() : " · No end date (ongoing)"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Audience */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Audience Tier</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>All tiers target age 18–50 with Music & Spotify interests. Select your location tier.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {AUDIENCE_TIERS.map((tier) => (
                <label
                  key={tier.value}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.875rem", cursor: "pointer",
                    padding: "0.875rem 1rem", borderRadius: 12,
                    border: `1.5px solid ${form.audienceTier === tier.value ? BLUE : "#E2E6F0"}`,
                    background: form.audienceTier === tier.value ? "#F0F4FF" : "#F8F9FC",
                    transition: "all 0.15s",
                  }}
                >
                  <input
                    type="radio"
                    name="audienceTier"
                    value={tier.value}
                    checked={form.audienceTier === tier.value}
                    onChange={(e) => setForm({ ...form, audienceTier: e.target.value })}
                    style={{ accentColor: BLUE }}
                  />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>{tier.label}</p>
                    <p style={{ fontSize: "0.78rem", color: "#64748b" }}>{tier.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Placement */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Placement Template</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Choose where your ads will appear. Facebook feeds and Messenger are always excluded.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {PLACEMENTS.map((p) => (
                <label
                  key={p.value}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "1rem", cursor: "pointer",
                    padding: "1.25rem", borderRadius: 14,
                    border: `1.5px solid ${form.placement === p.value ? BLUE : "#E2E6F0"}`,
                    background: form.placement === p.value ? "#F0F4FF" : "#F8F9FC",
                    transition: "all 0.15s",
                  }}
                >
                  <input
                    type="radio"
                    name="placement"
                    value={p.value}
                    checked={form.placement === p.value}
                    onChange={(e) => setForm({ ...form, placement: e.target.value })}
                    style={{ accentColor: BLUE, marginTop: 2 }}
                  />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", color: NAVY, marginBottom: "0.25rem" }}>
                      {p.icon} {p.label}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "0.875rem 1rem", fontSize: "0.8rem", color: "#92400E" }}>
              ⚠️ "Allow limited spend to excluded placements" is always disabled for both templates.
            </div>
          </div>
        )}

        {/* Step 5 — Review */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Review Campaign</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Check everything before saving. Ad upload happens after saving.</p>
            </div>

            {[
              { label: "Campaign Name",   value: form.name },
              { label: "Campaign Type",   value: "Sales (fixed)" },
              { label: "Pixel",           value: pixels.find((p) => p.id === form.pixelId)?.name ?? form.pixelId },
              { label: "Conversion",      value: "Website → View Content → Maximize Conversions" },
              { label: "Daily Budget",    value: `$${form.budget}/day` },
              { label: "Start Date",      value: form.startDate || "Immediately" },
              { label: "End Date",        value: form.endDate || "No end date" },
              { label: "Audience Tier",   value: AUDIENCE_TIERS.find((t) => t.value === form.audienceTier)?.label ?? "" },
              { label: "Placement",       value: PLACEMENTS.find((p) => p.value === form.placement)?.label ?? "" },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem",
                paddingBottom: i < arr.length - 1 ? "1rem" : 0,
                borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
              }}>
                <span style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 500, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: "0.8125rem", color: NAVY, fontWeight: 600, textAlign: "right" }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {step === 0 ? (
          <Link href="/dashboard/campaigns" style={{ padding: "0.75rem 1.5rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontWeight: 600, fontSize: "0.875rem", color: "#64748b", textDecoration: "none", background: "#fff" }}>
            Cancel
          </Link>
        ) : (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{ padding: "0.75rem 1.5rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontWeight: 600, fontSize: "0.875rem", color: "#64748b", background: "#fff", cursor: "pointer" }}
          >
            ← Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            style={{
              padding: "0.75rem 1.75rem", borderRadius: 10, fontWeight: 700, fontSize: "0.875rem",
              background: canNext ? `linear-gradient(135deg, ${BLUE}, #4C1AEA)` : "#E2E6F0",
              color: canNext ? "#fff" : "#94a3b8", border: "none",
              cursor: canNext ? "pointer" : "not-allowed",
            }}
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSaveDraft}
            disabled={submitting}
            style={{
              padding: "0.75rem 1.75rem", borderRadius: 10, fontWeight: 700, fontSize: "0.875rem",
              background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff",
              border: "none", cursor: "pointer", opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Saving..." : "Save Campaign Draft"}
          </button>
        )}
      </div>
    </div>
  );
}
