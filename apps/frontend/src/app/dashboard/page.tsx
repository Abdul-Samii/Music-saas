"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell,
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

const METRICS = [
  {
    label: "Total Ad Spend",
    value: "465",
    unit: "$",
    change: "+7%",
    up: true,
    sub: "+$38 this week",
    progress: 72,
    pct: "72%",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#1877F2" opacity="0.15"/>
        <path d="M13.5 8H11a1 1 0 0 0-1 1v1h3.5M11 12h2.5" stroke="#1877F2" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="9" stroke="#1877F2" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    iconBg: "#EBF1FF",
    barColors: ["#f97316", "#f97316", "#3A60E7", "#3A60E7", "#3A60E7", "#12B76A"],
  },
  {
    label: "New Streams",
    value: "8,260",
    unit: "",
    change: "+12%",
    up: true,
    sub: "+340 streams",
    progress: 55,
    pct: "55%",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#1DB954" opacity="0.15"/>
        <path d="M8 11.5a5 5 0 0 1 8 0M6.5 9a7.5 7.5 0 0 1 11 0M9.5 14a2.5 2.5 0 0 1 5 0" stroke="#1DB954" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    iconBg: "#E6F9EE",
    barColors: ["#f97316", "#3A60E7", "#3A60E7", "#12B76A", "#12B76A", "#12B76A"],
  },
  {
    label: "Cost per Stream",
    value: "0.056",
    unit: "$",
    change: "-8.3%",
    up: false,
    sub: "Lower is better",
    progress: 31,
    pct: "31%",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#3A60E7" opacity="0.15"/>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#3A60E7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    iconBg: "#EBF1FF",
    barColors: ["#12B76A", "#12B76A", "#3A60E7", "#3A60E7", "#f97316", "#f97316"],
  },
  {
    label: "Active Campaigns",
    value: "3",
    unit: "",
    change: "+1",
    up: true,
    sub: "of 6 total",
    progress: 54,
    pct: "54%",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#4C1AEA" opacity="0.15"/>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="#4C1AEA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    iconBg: "#F0EBFF",
    barColors: ["#3A60E7", "#3A60E7", "#12B76A", "#12B76A", "#12B76A", "#12B76A"],
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#1C1C1E", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Overview</h1>
          <p style={{ color: "#9A9A9E", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Welcome back, {firstName} — here&apos;s your music performance.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9A9A9E" }}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text" placeholder="Search..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "#FFFFFF", border: "1px solid #E8E8EC",
                borderRadius: 99, padding: "0.5rem 0.875rem 0.5rem 2.25rem",
                fontSize: "0.875rem", color: "#1C1C1E", outline: "none", width: 200,
              }}
            />
          </div>
          {/* Avatar */}
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Tabs */}
        <div style={{
          display: "flex", background: "#FFFFFF", borderRadius: 99,
          padding: "0.25rem", border: "1px solid #E8E8EC", gap: "0.25rem",
        }}>
          {(["campaigns", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.45rem 1.25rem", borderRadius: 99, border: "none",
                cursor: "pointer", fontSize: "0.875rem", fontWeight: 500,
                background: activeTab === tab ? "#1C1C1E" : "transparent",
                color: activeTab === tab ? "#FFFFFF" : "#9A9A9E",
                transition: "all 0.15s ease",
                textTransform: "capitalize",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Time filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {TIME_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              style={{
                padding: "0.45rem 1.1rem", borderRadius: 99, border: "1px solid #E8E8EC",
                cursor: "pointer", fontSize: "0.8125rem", fontWeight: 500,
                background: timeFilter === f ? "#1C1C1E" : "#FFFFFF",
                color: timeFilter === f ? "#FFFFFF" : "#4A4A4E",
                transition: "all 0.15s ease",
              }}
            >
              {f}
            </button>
          ))}
          <button style={{ width: 36, height: 36, borderRadius: 99, background: "#FFFFFF", border: "1px solid #E8E8EC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9A9A9E" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
          </button>
        </div>
      </div>

      {/* ── Performance row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.25rem" }}>

        {/* Bar chart card */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "1.75rem", border: "1px solid #F0F0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1C1C1E", lineHeight: 1, letterSpacing: "-0.02em" }}>8,260</p>
              <p style={{ fontSize: "0.8125rem", color: "#9A9A9E", marginTop: "0.3rem" }}>Performance Trends Over Time</p>
            </div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#12B76A", background: "#E6F9EE", padding: "0.25rem 0.75rem", borderRadius: 99 }}>
              45% Growth
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(90deg,#f97316,#eab308,#22c55e)" }} />
                <span style={{ fontSize: "0.8125rem", color: "#4A4A4E", fontWeight: 500 }}>Stream tracking</span>
              </div>
              <span style={{ fontSize: "0.8125rem", color: "#4A4A4E", fontWeight: 600 }}>8,260 streams</span>
            </div>
            <div style={{ height: 10, background: "#F4F4F6", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,#f97316 0%,#eab308 40%,#22c55e 100%)", borderRadius: 99, position: "relative" }}>
                <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: 16, background: "#1C1C1E", borderRadius: 2 }} />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1rem" }}>
            {[{ color: "#F97316", label: "<500" }, { color: "#EAB308", label: "~1k" }, { color: "#22C55E", label: ">2k" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                <span style={{ fontSize: "0.75rem", color: "#9A9A9E" }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", bottom: 32, left: 0 }}>
              <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1C1C1E", lineHeight: 1.2 }}>Trends<br />Over Time</p>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={barData} barSize={8} margin={{ left: 80, right: 0, top: 0, bottom: 0 }}>
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
        <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "1.5rem", border: "1px solid #F0F0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1C1C1E" }}>Top Campaigns</h2>
            <Link href="/dashboard/campaigns" style={{ fontSize: "0.75rem", color: "#3A60E7", fontWeight: 600, textDecoration: "none" }}>View all</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {topCampaigns.map((c, i) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Rank avatar */}
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                  background: i === 0 ? "linear-gradient(135deg,#3A60E7,#4C1AEA)" : "#F4F4F6",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 700,
                  color: i === 0 ? "#fff" : "#4A4A4E",
                  border: i < 3 ? `2px solid ${["#3A60E7","#9A9A9E","#CD7F32"][i]}` : "2px solid transparent",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1C1C1E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "#9A9A9E" }}>{c.streams.toLocaleString()} streams</p>
                </div>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem",
                  borderRadius: 99, flexShrink: 0,
                  background: c.up ? "#E6F9EE" : "#FFF0F0",
                  color: c.up ? "#12B76A" : "#F43F5E",
                }}>
                  {c.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Metrics row ── */}
      <div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1C1C1E", marginBottom: "1rem" }}>Metrics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
          {METRICS.map((m) => (
            <div key={m.label} style={{ background: "#FFFFFF", borderRadius: 20, padding: "1.25rem", border: "1px solid #F0F0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              {/* Icon + label row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
                <p style={{ fontSize: "0.8125rem", color: "#9A9A9E", fontWeight: 500, lineHeight: 1.3 }}>{m.label}</p>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: m.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {m.icon}
                </div>
              </div>

              {/* Value + change */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <p style={{ fontSize: "1.875rem", fontWeight: 700, color: "#1C1C1E", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {m.unit}{m.value}
                </p>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.45rem",
                  borderRadius: 99,
                  background: m.up ? "#E6F9EE" : "#FFF0F0",
                  color: m.up ? "#12B76A" : "#F43F5E",
                }}>
                  {m.change}
                </span>
              </div>
              <p style={{ fontSize: "0.72rem", color: "#9A9A9E", marginBottom: "1rem" }}>{m.sub}</p>

              {/* Progress bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div style={{ flex: 1, height: 5, background: "#F4F4F6", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.progress}%`, background: "linear-gradient(90deg,#f97316,#22c55e)", borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#4A4A4E" }}>{m.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Setup checklist ── */}
      <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "1.5rem", border: "1px solid #F0F0F4", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1C1C1E", marginBottom: "0.25rem" }}>Setup Checklist</h2>
        <p style={{ fontSize: "0.8125rem", color: "#9A9A9E", marginBottom: "1.25rem" }}>Complete these steps to unlock all features.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
          {[
            { label: "Create your account",            done: true,  href: null },
            { label: "Connect Meta Ads account",       done: false, href: "/dashboard/settings" },
            { label: "Connect Spotify artist profile", done: false, href: "/dashboard/settings" },
            { label: "Launch your first campaign",     done: false, href: "/dashboard/campaigns/new" },
          ].map((step) => (
            <div key={step.label} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.875rem 1rem",
              background: step.done ? "#F0FBF5" : "#F8F8FA",
              border: `1px solid ${step.done ? "#BBF0D6" : "#EBEBEF"}`,
              borderRadius: 12,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: step.done ? "#12B76A" : "transparent",
                border: `2px solid ${step.done ? "#12B76A" : "#D0D0D8"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {step.done && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              {step.href && !step.done ? (
                <Link href={step.href} style={{ fontSize: "0.8125rem", color: "#3A60E7", fontWeight: 500, textDecoration: "none" }}>
                  {step.label} →
                </Link>
              ) : (
                <span style={{ fontSize: "0.8125rem", color: step.done ? "#9A9A9E" : "#4A4A4E", textDecoration: step.done ? "line-through" : "none" }}>
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
