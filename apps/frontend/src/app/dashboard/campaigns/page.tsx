"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { campaignsApi } from "@/lib/api";

interface AdSet {
  id: string;
  name: string;
  status: string;
  dailyBudget: number;
}

interface Campaign {
  id: string;
  localId: string | null;
  name: string;
  status: string;
  dailyBudget: number;
  startTime: string | null;
  stopTime: string | null;
  createdTime: string;
  adSets: AdSet[];
}

type FilterStatus = "all" | "active" | "paused" | "other";
const TABS: { key: FilterStatus; label: string }[] = [
  { key: "all",    label: "All"    },
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
  { key: "other",  label: "Other"  },
];


function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" });
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    campaignsApi.liveCampaigns()
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  const statusKey = (s: string): FilterStatus =>
    s === "ACTIVE" ? "active" : s === "PAUSED" ? "paused" : "other";

  const filtered = campaigns.filter((c) => {
    const matchTab = activeTab === "all" || statusKey(c.status) === activeTab;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts: Record<FilterStatus, number> = {
    all: campaigns.length,
    active: campaigns.filter(c => c.status === "ACTIVE").length,
    paused: campaigns.filter(c => c.status === "PAUSED").length,
    other: campaigns.filter(c => c.status !== "ACTIVE" && c.status !== "PAUSED").length,
  };


  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* Header */}
      <div className="dash-topbar">
        <div>
          <h1 className="dash-title">Campaigns</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Manage and launch your Meta Ads campaigns
          </p>
        </div>
        <Link href="/dashboard/campaigns/new" className="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Campaign
        </Link>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }} className="dash-metrics-grid">
        {[
          { label: "Total Campaigns",    value: loading ? "—" : campaigns.length,  color: "#3A60E7" },
          { label: "Active Now",         value: loading ? "—" : counts.active,    color: "#12B76A" },
          { label: "Paused",             value: loading ? "—" : counts.paused,    color: "#F59E0B" },
          { label: "Total Daily Budget", value: loading ? "—" : campaigns.reduce((s, c) => s + c.dailyBudget, 0) > 0 ? `$${campaigns.reduce((s, c) => s + c.dailyBudget, 0).toFixed(2)}/day` : "—", color: "#4C1AEA" },
        ].map((s) => (
          <div key={s.label} className="card-stat" style={{ padding: "1.25rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{s.label}</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters + Table */}
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

        {/* Loading skeleton */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem 0" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 52, borderRadius: 10, background: "var(--bg-elevated)", animation: "pulse 1.4s ease-in-out infinite" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--bg-elevated)", margin: "0 auto 1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.375rem" }}>
              {campaigns.length === 0 ? "No campaigns yet" : "No campaigns found"}
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              {campaigns.length === 0
                ? "Create your first campaign to get started."
                : "Try adjusting your search or filter."}
            </p>
            {campaigns.length === 0 && (
              <Link href="/dashboard/campaigns/new" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-flex" }}>
                Create Campaign
              </Link>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Ad Sets</th>
                  <th>Daily Budget</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const totalBudget = c.adSets.length > 0
                    ? c.adSets.reduce((s, a) => s + a.dailyBudget, 0)
                    : c.dailyBudget;
                  const detailHref = c.localId ? `/dashboard/campaigns/${c.localId}` : null;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div>
                          <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.125rem" }}>{c.name}</p>
                          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            Meta · {fmtDate(c.createdTime)} · ID: {c.id}
                          </p>
                        </div>
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {c.adSets.length > 0 ? `${c.adSets.length} ad set${c.adSets.length > 1 ? "s" : ""}` : "—"}
                      </td>
                      <td style={{ fontWeight: 600 }}>${totalBudget.toFixed(2)}/day</td>
                      <td>
                        <span className={`badge badge-${statusKey(c.status)}`}>
                          {c.status.toLowerCase().replace(/_/g, " ")}
                        </span>
                      </td>
                      <td>
                        {detailHref && (
                          <Link href={detailHref} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem", borderRadius: 6, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                            </svg>
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
