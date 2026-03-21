"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell,
  AreaChart, Area, Tooltip,
} from "recharts";

/* ── Mock data ── */
const barData = [
  { day: "Mon", v: 800 },  { day: "Tue", v: 1400 }, { day: "Wed", v: 600 },
  { day: "Thu", v: 1800 }, { day: "Fri", v: 2200 }, { day: "Sat", v: 1100 },
  { day: "Sun", v: 900 },  { day: "Mon", v: 1600 }, { day: "Tue", v: 2400 },
  { day: "Wed", v: 700 },  { day: "Thu", v: 2100 }, { day: "Fri", v: 1900 },
  { day: "Sat", v: 1300 }, { day: "Sun", v: 800 },  { day: "Mon", v: 2600 },
  { day: "Tue", v: 1700 }, { day: "Wed", v: 900 },  { day: "Thu", v: 2800 },
  { day: "Fri", v: 3100 }, { day: "Sat", v: 1500 }, { day: "Sun", v: 1100 },
];

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
    spark: [
      { d: "M", v: 280 }, { d: "T", v: 320 }, { d: "W", v: 290 },
      { d: "T", v: 410 }, { d: "F", v: 380 }, { d: "S", v: 430 }, { d: "S", v: 465 },
    ],
    prev: [
      { d: "M", v: 240 }, { d: "T", v: 270 }, { d: "W", v: 255 },
      { d: "T", v: 310 }, { d: "F", v: 290 }, { d: "S", v: 360 }, { d: "S", v: 380 },
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
    spark: [
      { d: "M", v: 5800 }, { d: "T", v: 6200 }, { d: "W", v: 5900 },
      { d: "T", v: 7100 }, { d: "F", v: 7400 }, { d: "S", v: 7900 }, { d: "S", v: 8260 },
    ],
    prev: [
      { d: "M", v: 4900 }, { d: "T", v: 5300 }, { d: "W", v: 5100 },
      { d: "T", v: 6200 }, { d: "F", v: 6500 }, { d: "S", v: 6800 }, { d: "S", v: 7100 },
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
    spark: [
      { d: "M", v: 0.082 }, { d: "T", v: 0.078 }, { d: "W", v: 0.074 },
      { d: "T", v: 0.069 }, { d: "F", v: 0.065 }, { d: "S", v: 0.060 }, { d: "S", v: 0.056 },
    ],
    prev: [
      { d: "M", v: 0.095 }, { d: "T", v: 0.091 }, { d: "W", v: 0.088 },
      { d: "T", v: 0.084 }, { d: "F", v: 0.081 }, { d: "S", v: 0.078 }, { d: "S", v: 0.075 },
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
    spark: [
      { d: "M", v: 1 }, { d: "T", v: 1 }, { d: "W", v: 2 },
      { d: "T", v: 2 }, { d: "F", v: 2 }, { d: "S", v: 3 }, { d: "S", v: 3 },
    ],
    prev: [
      { d: "M", v: 0 }, { d: "T", v: 1 }, { d: "W", v: 1 },
      { d: "T", v: 1 }, { d: "F", v: 2 }, { d: "S", v: 2 }, { d: "S", v: 2 },
    ],
  },
];

const TIME_FILTERS = ["Last 3 days", "Last Week", "Last Month"];

function getBarColor(v: number) {
  if (v < 1000) return "#F97316";
  if (v < 2000) return "#EAB308";
  return "#22C55E";
}

export default function DashboardPage() {
  const { data: session } = useSession({ required: false });
  const [activeTab, setActiveTab] = useState<"campaigns" | "analytics">("campaigns");
  const [timeFilter, setTimeFilter] = useState("Last 3 days");
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

      {/* ── Tabs + time filters ── */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {TIME_FILTERS.map((f) => (
            <button key={f} onClick={() => setTimeFilter(f)} style={{
              padding: "0.45rem 1.1rem", borderRadius: 99, border: "1px solid var(--border)",
              cursor: "pointer", fontSize: "0.8125rem", fontWeight: 500, transition: "all 0.15s ease",
              background: timeFilter === f ? "#1C1C1E" : "var(--bg-card)",
              color: timeFilter === f ? "#fff" : "var(--text-secondary)",
            }}>
              {f}
            </button>
          ))}
          <button style={{ width: 36, height: 36, borderRadius: 99, background: "var(--bg-card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
          </button>
        </div>
      </div>

      {/* ── Performance row ── */}
      <div className="dash-perf-grid">
        {/* Bar chart card */}
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.75rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <p style={{ fontSize: "2.25rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.02em" }}>8,260</p>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>Performance Trends Over Time</p>
            </div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#12B76A", background: "rgba(18,183,106,0.12)", padding: "0.25rem 0.75rem", borderRadius: 99 }}>
              45% Growth
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(90deg,#f97316,#eab308,#22c55e)" }} />
                <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>Stream tracking</span>
              </div>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 600 }}>8,260 streams</span>
            </div>
            <div style={{ height: 10, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,#f97316 0%,#eab308 40%,#22c55e 100%)", borderRadius: 99, position: "relative" }}>
                <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: 16, background: "var(--text-primary)", borderRadius: 2 }} />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {[{ color: "#F97316", label: "<500" }, { color: "#EAB308", label: "~1k" }, { color: "#22C55E", label: ">2k" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", bottom: 32, left: 0 }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>Trends<br />Over Time</p>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={barData} barSize={7} margin={{ left: 80, right: 0, top: 0, bottom: 0 }}>
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={getBarColor(entry.v)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
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
                  <AreaChart data={m.spark} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${m.label}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={m.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, fontSize: "0.75rem", color: "var(--text-primary)" }}
                      itemStyle={{ color: m.color }}
                      formatter={(val) => [`${m.unit}${val}`, m.label]}
                      labelFormatter={() => ""}
                    />
                    {/* Previous period — dashed */}
                    <AreaChart data={m.prev}>
                      <Area type="monotone" dataKey="v" stroke={m.color} strokeWidth={1} strokeDasharray="3 3" fill="none" dot={false} />
                    </AreaChart>
                    {/* Current period — solid */}
                    <Area
                      type="monotone" dataKey="v"
                      stroke={m.color} strokeWidth={2}
                      fill={`url(#grad-${m.label})`}
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
