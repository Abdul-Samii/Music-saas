"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid,
} from "recharts";

const PERIODS = ["24h", "7d", "30d", "90d", "1y"] as const;
type Period = typeof PERIODS[number];

const areaData: Record<Period, { label: string; current: number; prev: number }[]> = {
  "24h": [
    { label: "00:00", current: 120, prev: 95 },  { label: "04:00", current: 80,  prev: 60  },
    { label: "08:00", current: 340, prev: 210 }, { label: "12:00", current: 620, prev: 510 },
    { label: "16:00", current: 740, prev: 600 }, { label: "20:00", current: 510, prev: 430 },
    { label: "Now",   current: 420, prev: 340 },
  ],
  "7d": [
    { label: "Mon", current: 1200, prev: 980 },  { label: "Tue", current: 1900, prev: 1500 },
    { label: "Wed", current: 1400, prev: 1100 }, { label: "Thu", current: 2400, prev: 1800 },
    { label: "Fri", current: 3100, prev: 2400 }, { label: "Sat", current: 2200, prev: 1700 },
    { label: "Sun", current: 1800, prev: 1400 },
  ],
  "30d": [
    { label: "Jan 1",  current: 8000,  prev: 6000  }, { label: "Jan 8",  current: 12000, prev: 9000  },
    { label: "Jan 15", current: 9500,  prev: 8000  }, { label: "Jan 22", current: 15000, prev: 11000 },
    { label: "Jan 29", current: 18000, prev: 13000 }, { label: "Feb 5",  current: 22000, prev: 16000 },
  ],
  "90d": [
    { label: "Oct", current: 42000, prev: 31000 }, { label: "Nov", current: 58000, prev: 44000 },
    { label: "Dec", current: 51000, prev: 40000 }, { label: "Jan", current: 72380, prev: 55000 },
  ],
  "1y": [
    { label: "Jan", current: 32000, prev: 24000 }, { label: "Mar", current: 41000, prev: 30000 },
    { label: "May", current: 72000, prev: 53000 }, { label: "Jul", current: 68000, prev: 51000 },
    { label: "Sep", current: 55000, prev: 42000 }, { label: "Nov", current: 63000, prev: 49000 },
    { label: "Dec", current: 72380, prev: 55000 },
  ],
};

/* ── Mock data ── */

const topCampaigns = [
  { name: "Summer Vibes Promo", streams: 2340, change: "+18%", up: true },
  { name: "New Single Launch",  streams: 1180, change: "+12%", up: true },
  { name: "Album Rollout",      streams: 640,  change: "-4%",  up: false },
  { name: "Fan Growth Feb",     streams: 4100, change: "+31%", up: true },
  { name: "Spotify Push",       streams: 890,  change: "+7%",  up: true },
];

/* ── Sparkline data per metric (7 days) ── */
const METRICS = [
  {
    label: "Total Ad Spend",
    value: "465", unit: "$", change: "+7%", up: true, sub: "+$38 this week",
    color: "#1877F2",
    iconBg: "rgba(24,119,242,0.12)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#1877F2" strokeWidth="1.5" fill="none"/>
        <path d="M13.5 8H11a1 1 0 0 0-1 1v1h3.5M11 12h2.5" stroke="#1877F2" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    sparkData: [
      { d: "M", current: 280, prev: 240 }, { d: "T", current: 320, prev: 270 },
      { d: "W", current: 290, prev: 255 }, { d: "T", current: 410, prev: 310 },
      { d: "F", current: 380, prev: 290 }, { d: "S", current: 430, prev: 360 },
      { d: "S", current: 465, prev: 380 },
    ],
  },
  {
    label: "New Streams",
    value: "8,260", unit: "", change: "+12%", up: true, sub: "+340 streams",
    color: "#1DB954",
    iconBg: "rgba(29,185,84,0.12)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M8 11.5a5 5 0 0 1 8 0M6.5 9a7.5 7.5 0 0 1 11 0M9.5 14a2.5 2.5 0 0 1 5 0" stroke="#1DB954" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    sparkData: [
      { d: "M", current: 5800, prev: 4900 }, { d: "T", current: 6200, prev: 5300 },
      { d: "W", current: 5900, prev: 5100 }, { d: "T", current: 7100, prev: 6200 },
      { d: "F", current: 7400, prev: 6500 }, { d: "S", current: 7900, prev: 6800 },
      { d: "S", current: 8260, prev: 7100 },
    ],
  },
  {
    label: "Cost per Stream",
    value: "0.056", unit: "$", change: "-8.3%", up: false, sub: "Lower is better",
    color: "#3A60E7",
    iconBg: "rgba(58,96,231,0.12)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#3A60E7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    sparkData: [
      { d: "M", current: 0.082, prev: 0.095 }, { d: "T", current: 0.078, prev: 0.091 },
      { d: "W", current: 0.074, prev: 0.088 }, { d: "T", current: 0.069, prev: 0.084 },
      { d: "F", current: 0.065, prev: 0.081 }, { d: "S", current: 0.060, prev: 0.078 },
      { d: "S", current: 0.056, prev: 0.075 },
    ],
  },
  {
    label: "Active Campaigns",
    value: "3", unit: "", change: "+1", up: true, sub: "of 6 total",
    color: "#4C1AEA",
    iconBg: "rgba(76,26,234,0.12)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="#4C1AEA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    sparkData: [
      { d: "M", current: 1, prev: 0 }, { d: "T", current: 1, prev: 1 },
      { d: "W", current: 2, prev: 1 }, { d: "T", current: 2, prev: 1 },
      { d: "F", current: 2, prev: 2 }, { d: "S", current: 3, prev: 2 },
      { d: "S", current: 3, prev: 2 },
    ],
  },
];

export default function DashboardPage() {
  const { data: session } = useSession({ required: false });
  const [activeTab, setActiveTab] = useState<"campaigns" | "analytics">("campaigns");
  const [period, setPeriod] = useState<Period>("7d");
  const [search, setSearch] = useState("");

  const firstName = session?.user?.name?.split(" ")[0] || "Artist";

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* ── Top bar ── */}
      <div className="dash-topbar">
        <div>
          <h1 className="dash-title">Overview</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Welcome back, {firstName} — here&apos;s your music performance.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dash-search"
            />
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,#3A60E7,#4C1AEA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.8125rem", fontWeight: 700, color: "#fff",
            border: "2px solid #12B76A", cursor: "pointer",
          }}>
            {session?.user?.name ? session.user.name[0].toUpperCase() : "E"}
          </div>
        </div>
      </div>

      {/* ── Tabs + period filter ── */}
      <div className="dash-filters">
        <div style={{ display: "flex", background: "var(--bg-card)", borderRadius: 99, padding: "0.25rem", border: "1px solid var(--border)", gap: "0.25rem" }}>
          {(["campaigns", "analytics"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "0.45rem 1.25rem", borderRadius: 99, border: "none", cursor: "pointer",
              fontSize: "0.875rem", fontWeight: 500, transition: "all 0.15s ease",
              background: activeTab === tab ? "#1C1C1E" : "transparent",
              color: activeTab === tab ? "#fff" : "var(--text-muted)",
              textTransform: "capitalize",
            }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", background: "var(--bg-card)", borderRadius: 99, padding: "0.25rem", border: "1px solid var(--border)", gap: "0.2rem" }}>
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "0.4rem 0.875rem", borderRadius: 99, border: "none", cursor: "pointer",
              fontSize: "0.78rem", fontWeight: 600, transition: "all 0.15s",
              background: period === p ? "#1C1C1E" : "transparent",
              color: period === p ? "#fff" : "var(--text-muted)",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* ── Performance row ── */}
      <div className="dash-perf-grid">
        {/* Area chart card */}
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.75rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <p style={{ fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>8,260</p>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>Stream Growth Over Time</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#12B76A", background: "rgba(18,183,106,0.12)", padding: "0.25rem 0.75rem", borderRadius: 99 }}>
                +45% Growth
              </span>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <div style={{ width: 20, height: 2.5, background: "#3A60E7", borderRadius: 2 }} />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>2025</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="4 3"/></svg>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>2024</span>
                </div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={areaData[period]} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-overview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3A60E7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3A60E7" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
              <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(v)} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: "0.78rem" }}
                labelStyle={{ color: "var(--text-muted)", fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="current" name="2025" stroke="#3A60E7" strokeWidth={2.5} fill="url(#grad-overview)" dot={false} activeDot={{ r: 5, fill: "#3A60E7" }} />
              <Area type="monotone" dataKey="prev" name="2024" stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="6 4" fill="none" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Campaigns list */}
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>Top Campaigns</h2>
            <Link href="/dashboard/campaigns" style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>View all</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {topCampaigns.map((c, i) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: i === 0 ? "linear-gradient(135deg,#3A60E7,#4C1AEA)" : "var(--bg-elevated)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 700,
                  color: i === 0 ? "#fff" : "var(--text-secondary)",
                  border: i < 3 ? `2px solid ${["#3A60E7","#9A9A9E","#CD7F32"][i]}` : "2px solid transparent",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.streams.toLocaleString()} streams</p>
                </div>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem",
                  borderRadius: 99, flexShrink: 0,
                  background: c.up ? "rgba(18,183,106,0.12)" : "rgba(244,63,94,0.12)",
                  color: c.up ? "#12B76A" : "#F43F5E",
                }}>
                  {c.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Metrics row with sparklines ── */}
      <div>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>Metrics</h2>
        <div className="dash-metrics-grid">
          {METRICS.map((m) => (
            <div key={m.label} style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.25rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

              {/* Icon + label */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>{m.label}</p>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: m.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {m.icon}
                </div>
              </div>

              {/* Value + change */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {m.unit}{m.value}
                </p>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.45rem", borderRadius: 99,
                  background: m.up ? "rgba(18,183,106,0.12)" : "rgba(244,63,94,0.12)",
                  color: m.up ? "#12B76A" : "#F43F5E",
                }}>
                  {m.change}
                </span>
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{m.sub}</p>

              {/* ── Sparkline chart ── */}
              <div style={{ marginTop: "auto" }}>
                <ResponsiveContainer width="100%" height={64}>
                  <AreaChart data={m.sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${m.label.replace(/\s+/g, "-")}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={m.color} stopOpacity={0.22} />
                        <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: "0.72rem", color: "var(--text-primary)" }}
                      itemStyle={{ color: m.color }}
                      formatter={(val) => [`${m.unit}${val}`, ""]}
                      labelFormatter={() => ""}
                    />
                    <Area type="monotone" dataKey="prev" stroke={m.color} strokeWidth={1} strokeDasharray="3 3" fill="none" dot={false} strokeOpacity={0.4} />
                    <Area
                      type="monotone" dataKey="current"
                      stroke={m.color} strokeWidth={2}
                      fill={`url(#grad-${m.label.replace(/\s+/g, "-")})`}
                      dot={false} activeDot={{ r: 4, fill: m.color, stroke: "var(--bg-card)", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.375rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <div style={{ width: 14, height: 2, background: m.color, borderRadius: 1 }} />
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>This period</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <div style={{ width: 14, height: 2, background: m.color, borderRadius: 1, opacity: 0.4, backgroundImage: `repeating-linear-gradient(to right, ${m.color} 0, ${m.color} 3px, transparent 3px, transparent 6px)` }} />
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Prev period</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Setup checklist ── */}
      <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>Setup Checklist</h2>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>Complete these steps to unlock all features.</p>
        <div className="dash-checklist-grid">
          {[
            { label: "Create your account",            done: true,  href: null },
            { label: "Connect Meta Ads account",       done: false, href: "/dashboard/settings" },
            { label: "Connect Spotify artist profile", done: false, href: "/dashboard/settings" },
            { label: "Launch your first campaign",     done: false, href: "/dashboard/campaigns/new" },
          ].map((step) => (
            <div key={step.label} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.875rem 1rem",
              background: step.done ? "var(--success-light)" : "var(--bg-elevated)",
              border: `1px solid ${step.done ? "rgba(18,183,106,0.25)" : "var(--border)"}`,
              borderRadius: 12,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: step.done ? "#12B76A" : "transparent",
                border: `2px solid ${step.done ? "#12B76A" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {step.done && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              {step.href && !step.done ? (
                <Link href={step.href} style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>
                  {step.label} →
                </Link>
              ) : (
                <span style={{ fontSize: "0.8125rem", color: step.done ? "var(--text-muted)" : "var(--text-secondary)", textDecoration: step.done ? "line-through" : "none" }}>
                  {step.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
