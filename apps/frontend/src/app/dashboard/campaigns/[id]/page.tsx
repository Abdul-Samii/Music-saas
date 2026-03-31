"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, BarChart, Bar,
} from "recharts";

const ALL_CAMPAIGNS = [
  { id: "1", name: "Summer Vibes Promo",   platform: "Meta", budget: 1240, spent: 1100, streams: 68421,  cps: 0.018, status: "active",    created: "Jan 12, 2025", objective: "Maximize Streams", duration: "30 days", audience: "Hip-Hop, R&B · 18–34" },
  { id: "2", name: "New Single Launch",    platform: "Meta", budget: 900,  spent: 890,  streams: 42100,  cps: 0.021, status: "active",    created: "Jan 18, 2025", objective: "Fan Growth",         duration: "14 days", audience: "Pop, Indie · 18–30" },
  { id: "3", name: "Album Rollout",        platform: "Meta", budget: 2500, spent: 2100, streams: 87300,  cps: 0.024, status: "paused",    created: "Dec 28, 2024", objective: "Brand Awareness",    duration: "30 days", audience: "Pop, R&B · 21–40" },
  { id: "4", name: "Fan Growth Feb",       platform: "Meta", budget: 700,  spent: 640,  streams: 38900,  cps: 0.016, status: "active",    created: "Feb 1, 2025",  objective: "Fan Growth",         duration: "14 days", audience: "Afrobeats, Latin · 18–35" },
  { id: "5", name: "Spotify Push Q1",      platform: "Meta", budget: 3200, spent: 3200, streams: 135241, cps: 0.023, status: "completed", created: "Dec 5, 2024",  objective: "Maximize Streams",   duration: "30 days", audience: "Electronic, Indie · 18–45" },
  { id: "6", name: "Holiday Special",      platform: "Meta", budget: 1800, spent: 1800, streams: 74200,  cps: 0.024, status: "completed", created: "Dec 20, 2024", objective: "Brand Awareness",    duration: "14 days", audience: "Pop · 25–55" },
  { id: "7", name: "Genre Targeting Test", platform: "Meta", budget: 500,  spent: 120,  streams: 0,      cps: 0,     status: "draft",     created: "Feb 5, 2025",  objective: "Maximize Streams",   duration: "7 days",  audience: "Hip-Hop · 18–24" },
  { id: "8", name: "Collab Track Boost",   platform: "Meta", budget: 1500, spent: 0,    streams: 0,      cps: 0,     status: "draft",     created: "Feb 6, 2025",  objective: "Fan Growth",         duration: "Ongoing", audience: "R&B · 21–40" },
];

const streamChartData = [
  { day: "Day 1",  streams: 280,  spend: 38 },
  { day: "Day 3",  streams: 820,  spend: 116 },
  { day: "Day 5",  streams: 1640, spend: 193 },
  { day: "Day 7",  streams: 3200, spend: 311 },
  { day: "Day 10", streams: 6800, spend: 490 },
  { day: "Day 14", streams: 14200, spend: 704 },
  { day: "Day 18", streams: 28400, spend: 891 },
  { day: "Day 21", streams: 42100, spend: 1040 },
  { day: "Day 25", streams: 56800, spend: 1098 },
  { day: "Day 30", streams: 68421, spend: 1100 },
];

const audienceData = [
  { age: "18–24", pct: 42 },
  { age: "25–34", pct: 31 },
  { age: "35–44", pct: 18 },
  { age: "45–54", pct: 6  },
  { age: "55+",   pct: 3  },
];

const deviceData = [
  { device: "Mobile", pct: 74 },
  { device: "Desktop", pct: 18 },
  { device: "Tablet", pct: 8  },
];

const STATUS_COLOR: Record<string, string> = {
  active: "#12B76A", paused: "#F59E0B", completed: "#3A60E7", draft: "#9A9A9E",
};
const STATUS_BG: Record<string, string> = {
  active: "rgba(18,183,106,0.12)", paused: "rgba(245,158,11,0.12)", completed: "rgba(58,96,231,0.12)", draft: "rgba(154,154,158,0.12)",
};

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const campaign = ALL_CAMPAIGNS.find((c) => c.id === id) ?? ALL_CAMPAIGNS[0];
  const [activeChart, setActiveChart] = useState<"streams" | "spend">("streams");
  const [status, setStatus] = useState(campaign.status);

  const budgetPct = campaign.budget > 0 ? Math.min((campaign.spent / campaign.budget) * 100, 100) : 0;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* ── Breadcrumb + header ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <Link href="/dashboard/campaigns" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Campaigns
          </Link>
          <span style={{ color: "var(--border)", fontSize: "0.8rem" }}>/</span>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>{campaign.name}</span>
        </div>

        <div className="dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{campaign.name}</h1>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: 99, background: STATUS_BG[status], color: STATUS_COLOR[status], border: `1px solid ${STATUS_COLOR[status]}30`, textTransform: "capitalize" }}>
              {status}
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            {status === "active" && (
              <button onClick={() => setStatus("paused")} className="btn btn-secondary btn-sm">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
                Pause
              </button>
            )}
            {status === "paused" && (
              <button onClick={() => setStatus("active")} className="btn btn-secondary btn-sm" style={{ color: "#12B76A", borderColor: "rgba(18,183,106,0.3)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Resume
              </button>
            )}
            <Link href="/dashboard/campaigns/new" className="btn btn-primary btn-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Duplicate
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4 stat cards ── */}
      <div className="dash-metrics-grid">
        {[
          { label: "Total Budget",   value: `$${campaign.budget.toLocaleString()}`, sub: `$${campaign.spent.toLocaleString()} spent`, color: "#3A60E7" },
          { label: "Streams",        value: campaign.streams > 0 ? campaign.streams.toLocaleString() : "—", sub: "total streams driven", color: "#1DB954" },
          { label: "Cost per Stream",value: campaign.cps > 0 ? `$${campaign.cps.toFixed(3)}` : "—", sub: "avg across campaign", color: "#4C1AEA" },
          { label: "Budget Used",    value: `${budgetPct.toFixed(0)}%`, sub: `$${(campaign.budget - campaign.spent).toLocaleString()} remaining`, color: "#1877F2" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--bg-card)", borderRadius: 16, padding: "1.25rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.625rem" }}>{s.label}</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Chart + campaign info ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.25rem" }} className="dash-detail-grid">

        {/* Chart */}
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.75rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Performance Over Time</h2>
            <div style={{ display: "flex", background: "var(--bg-elevated)", borderRadius: 99, padding: "0.2rem", border: "1px solid var(--border)", gap: "0.2rem" }}>
              {(["streams", "spend"] as const).map((t) => (
                <button key={t} onClick={() => setActiveChart(t)} style={{ padding: "0.35rem 0.875rem", borderRadius: 99, border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, transition: "all 0.15s", background: activeChart === t ? "#1C1C1E" : "transparent", color: activeChart === t ? "#fff" : "var(--text-muted)", textTransform: "capitalize" }}>
                  {t === "streams" ? "Streams" : "Ad Spend"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={streamChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-detail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeChart === "streams" ? "#3A60E7" : "#1877F2"} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={activeChart === "streams" ? "#3A60E7" : "#1877F2"} stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
              <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => activeChart === "streams" ? (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)) : `$${v}`} width={44} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: "0.78rem" }}
                formatter={(v) => activeChart === "streams" ? [Number(v).toLocaleString(), "Streams"] : [`$${v}`, "Spend"]}
              />
              <Area type="monotone" dataKey={activeChart === "streams" ? "streams" : "spend"}
                stroke={activeChart === "streams" ? "#3A60E7" : "#1877F2"}
                strokeWidth={2.5} fill="url(#grad-detail)" dot={false}
                activeDot={{ r: 5, fill: activeChart === "streams" ? "#3A60E7" : "#1877F2" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign info panel */}
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Campaign Info</h2>
          {[
            { label: "Platform",   value: campaign.platform },
            { label: "Objective",  value: campaign.objective },
            { label: "Duration",   value: campaign.duration },
            { label: "Audience",   value: campaign.audience },
            { label: "Created",    value: campaign.created },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ paddingBottom: i < arr.length - 1 ? "0.875rem" : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.25rem" }}>{row.label}</p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>{row.value}</p>
            </div>
          ))}

          {/* Budget bar */}
          <div style={{ marginTop: "0.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Budget Used</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>{budgetPct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${budgetPct}%`, background: budgetPct >= 90 ? "#F43F5E" : "linear-gradient(90deg, #3A60E7, #4C1AEA)", borderRadius: 99, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.375rem" }}>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>${campaign.spent.toLocaleString()} spent</span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>${campaign.budget.toLocaleString()} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Audience breakdown ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="dash-audience-grid">

        {/* Age chart */}
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem" }}>Audience by Age</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={audienceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={28}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis dataKey="age" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: "0.78rem" }}
                formatter={(v) => [`${v}%`, "Audience"]}
              />
              <Bar dataKey="pct" fill="#3A60E7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device + top metrics */}
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem" }}>Device Breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {deviceData.map((d) => (
              <div key={d.device}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>{d.device}</span>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary)" }}>{d.pct}%</span>
                </div>
                <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.pct}%`, background: d.device === "Mobile" ? "linear-gradient(90deg,#3A60E7,#4C1AEA)" : d.device === "Desktop" ? "#1877F2" : "#1DB954", borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.625rem", padding: "1rem", background: "var(--bg-elevated)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Best performing day</p>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>Friday</p>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>31% more streams than avg</p>
          </div>
        </div>
      </div>

      {/* ── Ad Creatives placeholder ── */}
      <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Ad Creatives</h2>
          <Link href="/dashboard/creative" style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Open Creative Studio →
          </Link>
        </div>
        <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "var(--bg-elevated)", borderRadius: 12, border: "1px dashed var(--border)" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
          </div>
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.375rem" }}>No creatives yet</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Create a lyric video in Creative Studio and attach it to this campaign</p>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .dash-detail-grid { grid-template-columns: 1fr !important; }
          .dash-audience-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
