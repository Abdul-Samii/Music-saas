"use client";
import { useState } from "react";

const ALL_CAMPAIGNS = [
  { id: "1", name: "Summer Vibes Promo",   platform: "Meta",  budget: 1240, spent: 1100, streams: 68421,  cps: 0.018, status: "active",    created: "Jan 12" },
  { id: "2", name: "New Single Launch",    platform: "Meta",  budget: 900,  spent: 890,  streams: 42100,  cps: 0.021, status: "active",    created: "Jan 18" },
  { id: "3", name: "Album Rollout",        platform: "Meta",  budget: 2500, spent: 2100, streams: 87300,  cps: 0.024, status: "paused",    created: "Dec 28" },
  { id: "4", name: "Fan Growth Feb",       platform: "Meta",  budget: 700,  spent: 640,  streams: 38900,  cps: 0.016, status: "active",    created: "Feb 1"  },
  { id: "5", name: "Spotify Push Q1",      platform: "Meta",  budget: 3200, spent: 3200, streams: 135241, cps: 0.023, status: "completed", created: "Dec 5"  },
  { id: "6", name: "Holiday Special",      platform: "Meta",  budget: 1800, spent: 1800, streams: 74200,  cps: 0.024, status: "completed", created: "Dec 20" },
  { id: "7", name: "Genre Targeting Test", platform: "Meta",  budget: 500,  spent: 120,  streams: 0,      cps: 0,     status: "draft",     created: "Feb 5"  },
  { id: "8", name: "Collab Track Boost",   platform: "Meta",  budget: 1500, spent: 0,    streams: 0,      cps: 0,     status: "draft",     created: "Feb 6"  },
];

type Status = "all" | "active" | "paused" | "completed" | "draft";
const TABS: { key: Status; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "active",    label: "Active"    },
  { key: "paused",    label: "Paused"    },
  { key: "completed", label: "Completed" },
  { key: "draft",     label: "Draft"     },
];

function ProgressBar({ spent, budget }: { spent: number; budget: number }) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 100 }}>
      <div className="progress-bar" style={{ flex: 1, height: 5 }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{pct.toFixed(0)}%</span>
    </div>
  );
}

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<Status>("all");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ name: "", budget: "", genre: "", objective: "streams" });

  const filtered = ALL_CAMPAIGNS.filter((c) => {
    const matchTab = activeTab === "all" || c.status === activeTab;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = {
    all: ALL_CAMPAIGNS.length,
    active: ALL_CAMPAIGNS.filter(c => c.status === "active").length,
    paused: ALL_CAMPAIGNS.filter(c => c.status === "paused").length,
    completed: ALL_CAMPAIGNS.filter(c => c.status === "completed").length,
    draft: ALL_CAMPAIGNS.filter(c => c.status === "draft").length,
  };

  return (
    <>
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

        {/* Header */}
        <div className="dash-topbar">
          <div>
            <h1 className="dash-title">Campaigns</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Manage and launch your Meta Ads campaigns
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setDrawerOpen(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Campaign
          </button>
        </div>

        {/* Summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }} className="dash-metrics-grid">
          {[
            { label: "Total Campaigns", value: ALL_CAMPAIGNS.length, color: "#3A60E7" },
            { label: "Active Now",      value: counts.active,        color: "#12B76A" },
            { label: "Total Streams",   value: "446k",               color: "#1DB954" },
            { label: "Avg Cost/Stream", value: "$0.021",             color: "#4C1AEA" },
          ].map((s) => (
            <div key={s.label} className="card-stat" style={{ padding: "1.25rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{s.label}</p>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            {/* Status tabs */}
            <div style={{ display: "flex", gap: "0.25rem", background: "var(--bg-elevated)", borderRadius: 99, padding: "0.25rem", border: "1px solid var(--border)" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "0.35rem 0.875rem", borderRadius: 99, border: "none", cursor: "pointer",
                    fontSize: "0.78rem", fontWeight: 600, transition: "all 0.15s",
                    background: activeTab === tab.key ? "#1C1C1E" : "transparent",
                    color: activeTab === tab.key ? "#fff" : "var(--text-muted)",
                    display: "flex", alignItems: "center", gap: "0.35rem",
                  }}
                >
                  {tab.label}
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: 99,
                    background: activeTab === tab.key ? "rgba(255,255,255,0.2)" : "var(--bg-card)",
                    color: activeTab === tab.key ? "#fff" : "var(--text-muted)",
                    border: "1px solid var(--border)",
                  }}>
                    {counts[tab.key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text" placeholder="Search campaigns..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="dash-search"
                style={{ paddingLeft: "2.25rem", width: 220 }}
              />
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--bg-elevated)", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.375rem" }}>No campaigns found</p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Budget</th>
                    <th>Spend</th>
                    <th>Budget used</th>
                    <th>Streams</th>
                    <th>Cost / Stream</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.125rem" }}>{c.name}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.platform} · {c.created}</p>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>${c.budget.toLocaleString()}</td>
                      <td>${c.spent.toLocaleString()}</td>
                      <td><ProgressBar spent={c.spent} budget={c.budget} /></td>
                      <td>{c.streams > 0 ? c.streams.toLocaleString() : "—"}</td>
                      <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                        {c.cps > 0 ? `$${c.cps.toFixed(3)}` : "—"}
                      </td>
                      <td>
                        <span className={`badge badge-${c.status}`}>{c.status}</span>
                      </td>
                      <td>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem", borderRadius: 6, display: "flex", alignItems: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── New Campaign Drawer ── */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, backdropFilter: "blur(2px)" }}
          />
          {/* Drawer */}
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: "min(480px, 100vw)",
            background: "var(--bg-card)", zIndex: 201, display: "flex", flexDirection: "column",
            boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
          }}>
            {/* Drawer header */}
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)" }}>New Campaign</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Meta Ads integration — Week 2</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.375rem", borderRadius: 8, display: "flex" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Drawer body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Info banner */}
              <div style={{ background: "var(--primary-light)", border: "1px solid var(--border-focus)", borderRadius: 10, padding: "0.875rem 1rem", display: "flex", gap: "0.625rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ fontSize: "0.8rem", color: "var(--primary)", lineHeight: 1.5 }}>
                  Meta Ads integration goes live in Week 2. Fill in your campaign details now and we&apos;ll launch it automatically once connected.
                </p>
              </div>

              <div>
                <label className="label">Campaign Name</label>
                <input
                  className="input" placeholder="e.g. Summer Drop Promo"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Daily Budget (USD)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.9rem" }}>$</span>
                  <input
                    className="input" placeholder="50" type="number" min="1"
                    style={{ paddingLeft: "1.75rem" }}
                    value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Campaign Objective</label>
                <select className="input" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })}>
                  <option value="streams">Maximize Streams</option>
                  <option value="fans">Fan Growth</option>
                  <option value="awareness">Brand Awareness</option>
                </select>
              </div>

              <div>
                <label className="label">Target Genre / Audience</label>
                <input
                  className="input" placeholder="e.g. Hip-Hop, R&B, 18–34"
                  value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Platform</label>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {["Facebook", "Instagram", "Both"].map((p) => (
                    <label key={p} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", color: "var(--text-secondary)", flex: 1,
                      padding: "0.625rem 0.875rem", border: "1.5px solid var(--border)", borderRadius: 8,
                      background: "var(--bg-elevated)", userSelect: "none" }}>
                      <input type="radio" name="platform" defaultChecked={p === "Both"} style={{ accentColor: "var(--primary)" }} />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", gap: "0.75rem" }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDrawerOpen(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setDrawerOpen(false)}>
                Save Campaign Draft
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
