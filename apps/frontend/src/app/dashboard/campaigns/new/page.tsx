"use client";
import { useState } from "react";
import Link from "next/link";

const STEPS = ["Details", "Audience", "Budget", "Review"];

const GENRES = ["Hip-Hop", "R&B", "Pop", "Electronic", "Indie", "Rock", "Latin", "Afrobeats", "Jazz", "Country"];
const OBJECTIVES = [
  { value: "streams",   label: "Maximize Streams",   desc: "Drive as many Spotify plays as possible" },
  { value: "fans",      label: "Fan Growth",          desc: "Grow your monthly listener count" },
  { value: "awareness", label: "Brand Awareness",     desc: "Reach new audiences with your music" },
];

export default function NewCampaignPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", objective: "streams", platform: "both",
    genres: [] as string[], ageMin: "18", ageMax: "34",
    budget: "", duration: "7",
  });

  function toggleGenre(g: string) {
    setForm((prev) => ({
      ...prev,
      genres: prev.genres.includes(g) ? prev.genres.filter((x) => x !== g) : [...prev.genres, g],
    }));
  }

  const canNext = [
    form.name.length > 0,
    form.genres.length > 0,
    Number(form.budget) >= 5,
    true,
  ][step];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/dashboard/campaigns" style={{ display: "flex", alignItems: "center", color: "var(--text-muted)", textDecoration: "none" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </Link>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>New Campaign</h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Meta Ads integration launches Week 2 — save your draft now</p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: i < step ? "pointer" : "default" }} onClick={() => { if (i < step) setStep(i); }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.78rem", flexShrink: 0,
                background: i < step ? "var(--success)" : i === step ? "#1C1C1E" : "var(--bg-elevated)",
                color: i <= step ? "#fff" : "var(--text-muted)",
                border: i < step ? "none" : i === step ? "none" : "1.5px solid var(--border)",
                transition: "all 0.2s",
              }}>
                {i < step ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : i + 1}
              </div>
              <span style={{ fontSize: "0.8125rem", fontWeight: i === step ? 600 : 400, color: i === step ? "var(--text-primary)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1.5, background: i < step ? "var(--success)" : "var(--border)", margin: "0 0.75rem", minWidth: 24, transition: "background 0.3s" }} />
            )}
          </div>
        ))}
      </div>

      {/* Step card */}
      <div className="card" style={{ padding: "2rem" }}>

        {/* Step 0 — Details */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>Campaign Details</h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Name your campaign and choose an objective</p>
            </div>
            <div>
              <label className="label">Campaign Name</label>
              <input className="input" placeholder="e.g. Summer Drop Promo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Objective</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {OBJECTIVES.map((obj) => (
                  <label key={obj.value} style={{
                    display: "flex", alignItems: "center", gap: "0.875rem", cursor: "pointer",
                    padding: "0.875rem 1rem", borderRadius: 10,
                    border: `1.5px solid ${form.objective === obj.value ? "var(--primary)" : "var(--border)"}`,
                    background: form.objective === obj.value ? "var(--primary-light)" : "var(--bg-elevated)",
                    transition: "all 0.15s",
                  }}>
                    <input type="radio" name="objective" value={obj.value} checked={form.objective === obj.value}
                      onChange={(e) => setForm({ ...form, objective: e.target.value })}
                      style={{ accentColor: "var(--primary)" }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{obj.label}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{obj.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Platform</label>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {[{ v: "facebook", l: "Facebook" }, { v: "instagram", l: "Instagram" }, { v: "both", l: "Both" }].map((p) => (
                  <label key={p.v} style={{
                    display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer",
                    flex: 1, padding: "0.625rem 0.875rem", borderRadius: 8, fontSize: "0.875rem",
                    border: `1.5px solid ${form.platform === p.v ? "var(--primary)" : "var(--border)"}`,
                    background: form.platform === p.v ? "var(--primary-light)" : "var(--bg-elevated)",
                    color: "var(--text-secondary)", transition: "all 0.15s",
                  }}>
                    <input type="radio" name="platform" value={p.v} checked={form.platform === p.v}
                      onChange={(e) => setForm({ ...form, platform: e.target.value })}
                      style={{ accentColor: "var(--primary)" }} />
                    {p.l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Audience */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>Target Audience</h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Select the genres and age range for your ad targeting</p>
            </div>
            <div>
              <label className="label">Genres (select all that apply)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.375rem" }}>
                {GENRES.map((g) => (
                  <button key={g} onClick={() => toggleGenre(g)} style={{
                    padding: "0.4rem 0.875rem", borderRadius: 99, border: "none", cursor: "pointer",
                    fontSize: "0.8125rem", fontWeight: 500, transition: "all 0.15s",
                    background: form.genres.includes(g) ? "#1C1C1E" : "var(--bg-elevated)",
                    color: form.genres.includes(g) ? "#fff" : "var(--text-secondary)",
                    border: `1.5px solid ${form.genres.includes(g) ? "#1C1C1E" : "var(--border)"}`,
                  }}>
                    {g}
                  </button>
                ))}
              </div>
              {form.genres.length === 0 && (
                <p style={{ fontSize: "0.75rem", color: "var(--danger)", marginTop: "0.5rem" }}>Select at least one genre</p>
              )}
            </div>
            <div>
              <label className="label">Age Range</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <select className="input" style={{ flex: 1 }} value={form.ageMin} onChange={(e) => setForm({ ...form, ageMin: e.target.value })}>
                  {[13,18,21,25,30,35,40,45].map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
                <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>to</span>
                <select className="input" style={{ flex: 1 }} value={form.ageMax} onChange={(e) => setForm({ ...form, ageMax: e.target.value })}>
                  {[24,30,34,40,45,50,55,65].map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Budget */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>Budget & Duration</h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Set your daily spend and how long the campaign should run</p>
            </div>
            <div>
              <label className="label">Daily Budget (USD, minimum $5)</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>$</span>
                <input
                  className="input" type="number" min="5" placeholder="50"
                  style={{ paddingLeft: "1.75rem" }}
                  value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>
              {form.budget && Number(form.budget) < 5 && (
                <p style={{ fontSize: "0.75rem", color: "var(--danger)", marginTop: "0.5rem" }}>Minimum daily budget is $5</p>
              )}
            </div>
            <div>
              <label className="label">Campaign Duration</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {[{ v: "7", l: "7 days" }, { v: "14", l: "14 days" }, { v: "30", l: "30 days" }, { v: "0", l: "Ongoing" }].map((d) => (
                  <button key={d.v} onClick={() => setForm({ ...form, duration: d.v })} style={{
                    padding: "0.5rem 1rem", borderRadius: 8, border: "none", cursor: "pointer",
                    fontSize: "0.875rem", fontWeight: 500, transition: "all 0.15s",
                    background: form.duration === d.v ? "#1C1C1E" : "var(--bg-elevated)",
                    color: form.duration === d.v ? "#fff" : "var(--text-secondary)",
                    border: `1.5px solid ${form.duration === d.v ? "#1C1C1E" : "var(--border)"}`,
                  }}>
                    {d.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimate */}
            {form.budget && Number(form.budget) >= 5 && (
              <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.125rem 1.25rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.875rem" }}>Estimated results</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                  {[
                    { label: "Total Budget",   value: form.duration === "0" ? "Ongoing" : `$${(Number(form.budget) * Number(form.duration)).toLocaleString()}` },
                    { label: "Est. Streams",   value: form.duration === "0" ? "—" : `${Math.round(Number(form.budget) * Number(form.duration) / 0.02).toLocaleString()}` },
                    { label: "Est. CPS",       value: "~$0.020" },
                  ].map((e) => (
                    <div key={e.label}>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>{e.label}</p>
                      <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>{e.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>Review & Save</h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Your campaign will be saved as a draft and launched once Meta Ads is connected in Week 2</p>
            </div>
            {[
              { label: "Campaign Name", value: form.name },
              { label: "Objective",     value: OBJECTIVES.find(o => o.value === form.objective)?.label || "" },
              { label: "Platform",      value: form.platform === "both" ? "Facebook & Instagram" : form.platform.charAt(0).toUpperCase() + form.platform.slice(1) },
              { label: "Genres",        value: form.genres.join(", ") || "—" },
              { label: "Age Range",     value: `${form.ageMin}–${form.ageMax}` },
              { label: "Daily Budget",  value: form.budget ? `$${form.budget}` : "—" },
              { label: "Duration",      value: form.duration === "0" ? "Ongoing" : `${form.duration} days` },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", paddingBottom: i < arr.length - 1 ? "1rem" : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500 }}>{row.label}</span>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-primary)", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{row.value}</span>
              </div>
            ))}

            <div style={{ background: "var(--primary-light)", border: "1px solid var(--border-focus)", borderRadius: 10, padding: "0.875rem 1rem", display: "flex", gap: "0.625rem" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ fontSize: "0.8rem", color: "var(--primary)", lineHeight: 1.5 }}>
                Meta Ads integration ships Week 2. This draft will be auto-launched once your account is connected.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/dashboard/campaigns" style={{ display: step === 0 ? "flex" : "none" }} className="btn btn-ghost">
          Cancel
        </Link>
        {step > 0 && (
          <button className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
            ← Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext} style={{ marginLeft: "auto" }}>
            Continue →
          </button>
        ) : (
          <Link href="/dashboard/campaigns" className="btn btn-primary" style={{ marginLeft: "auto" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Save Draft
          </Link>
        )}
      </div>
    </div>
  );
}
