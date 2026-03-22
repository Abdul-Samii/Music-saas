"use client";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const PERIODS = ["24h", "7d", "30d", "90d", "1y"] as const;
type Period = typeof PERIODS[number];

const streamData: Record<Period, { label: string; current: number; prev: number }[]> = {
  "24h": [
    { label: "00:00", current: 120, prev: 95 },  { label: "03:00", current: 80,  prev: 60  },
    { label: "06:00", current: 200, prev: 140 }, { label: "09:00", current: 480, prev: 390 },
    { label: "12:00", current: 620, prev: 510 }, { label: "15:00", current: 740, prev: 600 },
    { label: "18:00", current: 580, prev: 480 }, { label: "21:00", current: 310, prev: 260 },
    { label: "Now",   current: 410, prev: 340 },
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
    { label: "Jan", current: 32000, prev: 24000 }, { label: "Feb", current: 41000, prev: 30000 },
    { label: "Mar", current: 55000, prev: 39000 }, { label: "Apr", current: 48000, prev: 36000 },
    { label: "May", current: 72000, prev: 53000 }, { label: "Jun", current: 68000, prev: 51000 },
    { label: "Jul", current: 72380, prev: 54000 },
  ],
};

const spendData: Record<Period, { label: string; current: number; prev: number }[]> = {
  "24h": [
    { label: "00:00", current: 120, prev: 95 }, { label: "06:00", current: 340, prev: 260 },
    { label: "12:00", current: 890, prev: 720 }, { label: "18:00", current: 1240, prev: 980 },
    { label: "Now",   current: 1580, prev: 1200 },
  ],
  "7d": [
    { label: "Mon", current: 8200,  prev: 6800  }, { label: "Tue", current: 11400, prev: 9200 },
    { label: "Wed", current: 9800,  prev: 8100  }, { label: "Thu", current: 14200, prev: 11000 },
    { label: "Fri", current: 18600, prev: 14800 }, { label: "Sat", current: 13400, prev: 10600 },
    { label: "Sun", current: 16780, prev: 13200 },
  ],
  "30d": [
    { label: "Jan 1",  current: 4200,  prev: 3100  }, { label: "Jan 8",  current: 9800,  prev: 7200 },
    { label: "Jan 15", current: 7400,  prev: 5900  }, { label: "Jan 22", current: 14200, prev: 10800 },
    { label: "Jan 29", current: 19600, prev: 14200 }, { label: "Feb 5",  current: 17180, prev: 13600 },
  ],
  "90d": [
    { label: "Oct", current: 18400, prev: 14200 }, { label: "Nov", current: 24800, prev: 19600 },
    { label: "Dec", current: 21200, prev: 16800 }, { label: "Jan", current: 28980, prev: 22400 },
  ],
  "1y": [
    { label: "Jan", current: 14200, prev: 10800 }, { label: "Mar", current: 22400, prev: 17200 },
    { label: "May", current: 38600, prev: 29400 }, { label: "Jul", current: 31800, prev: 24200 },
    { label: "Sep", current: 42400, prev: 32600 }, { label: "Nov", current: 58200, prev: 44800 },
    { label: "Dec", current: 72380, prev: 56200 },
  ],
};

const newStreamsData: Record<Period, { label: string; current: number; prev: number }[]> = {
  "24h": [
    { label: "00:00", current: 240, prev: 190 }, { label: "06:00", current: 680, prev: 520 },
    { label: "12:00", current: 1240, prev: 980 }, { label: "18:00", current: 1820, prev: 1420 },
    { label: "Now",   current: 2160, prev: 1680 },
  ],
  "7d": [
    { label: "Mon", current: 38200, prev: 29800 }, { label: "Tue", current: 52400, prev: 41200 },
    { label: "Wed", current: 44800, prev: 36200 }, { label: "Thu", current: 61200, prev: 48600 },
    { label: "Fri", current: 78600, prev: 62400 }, { label: "Sat", current: 57400, prev: 45800 },
    { label: "Sun", current: 71962, prev: 57200 },
  ],
  "30d": [
    { label: "Jan 1",  current: 24200, prev: 18400 }, { label: "Jan 8",  current: 48600, prev: 36200 },
    { label: "Jan 15", current: 38400, prev: 30200 }, { label: "Jan 22", current: 62800, prev: 48400 },
    { label: "Jan 29", current: 81200, prev: 62600 }, { label: "Feb 5",  current: 117062, prev: 90200 },
  ],
  "90d": [
    { label: "Oct", current: 82400, prev: 64200 }, { label: "Nov", current: 118600, prev: 92400 },
    { label: "Dec", current: 98200, prev: 76800 }, { label: "Jan", current: 171962, prev: 134200 },
  ],
  "1y": [
    { label: "Jan", current: 48200, prev: 36400 }, { label: "Mar", current: 82400, prev: 62800 },
    { label: "May", current: 142600, prev: 108400 }, { label: "Jul", current: 118400, prev: 90200 },
    { label: "Sep", current: 168200, prev: 128600 }, { label: "Nov", current: 214800, prev: 164200 },
    { label: "Dec", current: 371962, prev: 286400 },
  ],
};

const cpsData: Record<Period, { label: string; current: number; prev: number }[]> = {
  "24h": [
    { label: "00:00", current: 0.028, prev: 0.034 }, { label: "06:00", current: 0.026, prev: 0.032 },
    { label: "12:00", current: 0.024, prev: 0.030 }, { label: "18:00", current: 0.022, prev: 0.028 },
    { label: "Now",   current: 0.019, prev: 0.024 },
  ],
  "7d": [
    { label: "Mon", current: 0.024, prev: 0.029 }, { label: "Tue", current: 0.022, prev: 0.027 },
    { label: "Wed", current: 0.023, prev: 0.028 }, { label: "Thu", current: 0.021, prev: 0.026 },
    { label: "Fri", current: 0.020, prev: 0.025 }, { label: "Sat", current: 0.022, prev: 0.027 },
    { label: "Sun", current: 0.019, prev: 0.024 },
  ],
  "30d": [
    { label: "Jan 1",  current: 0.028, prev: 0.034 }, { label: "Jan 8",  current: 0.026, prev: 0.032 },
    { label: "Jan 15", current: 0.024, prev: 0.030 }, { label: "Jan 22", current: 0.022, prev: 0.028 },
    { label: "Jan 29", current: 0.020, prev: 0.026 }, { label: "Feb 5",  current: 0.019, prev: 0.024 },
  ],
  "90d": [
    { label: "Oct", current: 0.032, prev: 0.040 }, { label: "Nov", current: 0.027, prev: 0.034 },
    { label: "Dec", current: 0.023, prev: 0.029 }, { label: "Jan", current: 0.019, prev: 0.024 },
  ],
  "1y": [
    { label: "Jan", current: 0.038, prev: 0.046 }, { label: "Mar", current: 0.034, prev: 0.042 },
    { label: "May", current: 0.029, prev: 0.036 }, { label: "Jul", current: 0.025, prev: 0.031 },
    { label: "Sep", current: 0.022, prev: 0.028 }, { label: "Nov", current: 0.020, prev: 0.026 },
    { label: "Dec", current: 0.019, prev: 0.024 },
  ],
};

const BIG_METRICS = [
  {
    id: "stream-growth",
    label: "Stream Growth",
    value: "371,962",
    change: "+22%",
    up: true,
    sub: "vs previous period",
    color: "#3A60E7",
    gradId: "grad-streams",
    data: streamData,
    formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v),
  },
  {
    id: "total-spend",
    label: "Total Ad Spend",
    value: "$72,380",
    change: "+18%",
    up: true,
    sub: "vs previous period",
    color: "#1877F2",
    gradId: "grad-spend",
    data: spendData,
    formatter: (v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`,
  },
  {
    id: "new-streams",
    label: "New Streams",
    value: "371,962",
    change: "+18%",
    up: true,
    sub: "vs previous period",
    color: "#1DB954",
    gradId: "grad-newstreams",
    data: newStreamsData,
    formatter: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v),
  },
  {
    id: "cost-per-stream",
    label: "Cost per Stream",
    value: "$0.019",
    change: "-8%",
    up: true,
    sub: "lower is better",
    color: "#4C1AEA",
    gradId: "grad-cps",
    data: cpsData,
    formatter: (v: number) => `$${v.toFixed(3)}`,
  },
];

const CAMPAIGNS = [
  { name: "Summer Vibes Promo", spend: "$1,240", streams: "68,421",  cps: "$0.018", status: "active"    },
  { name: "New Single Launch",  spend: "$890",   streams: "42,100",  cps: "$0.021", status: "active"    },
  { name: "Album Rollout",      spend: "$2,100", streams: "87,300",  cps: "$0.024", status: "paused"    },
  { name: "Fan Growth Feb",     spend: "$640",   streams: "38,900",  cps: "$0.016", status: "active"    },
  { name: "Spotify Push Q1",    spend: "$3,200", streams: "135,241", cps: "$0.023", status: "completed" },
];

interface TooltipProps { active?: boolean; payload?: { value: number; name: string }[]; label?: string; color: string; }
function ChartTooltip({ active, payload, label, color }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.8rem", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
      <p style={{ color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>{label}</p>
      {payload[0] && <p style={{ color, fontWeight: 700 }}>2025: {payload[0].value?.toLocaleString()}</p>}
      {payload[1] && <p style={{ color: "var(--text-muted)", marginTop: "0.2rem" }}>2024: {payload[1].value?.toLocaleString()}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* Header + time filter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>Analytics</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Track ad spend, stream growth and cost efficiency</p>
        </div>
        <div style={{ display: "flex", background: "var(--bg-elevated)", borderRadius: 99, padding: "0.25rem", border: "1px solid var(--border)", gap: "0.2rem" }}>
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: "0.35rem 0.875rem", borderRadius: 99, border: "none", cursor: "pointer",
              fontSize: "0.78rem", fontWeight: 600, transition: "all 0.15s",
              background: period === p ? "#1C1C1E" : "transparent",
              color: period === p ? "#fff" : "var(--text-muted)",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* 2×2 big metric + chart cards */}
      <div className="dash-analytics-grid">
        {BIG_METRICS.map((m) => {
          const chartColor = m.change.startsWith("-") ? "#F43F5E" : "#3A60E7";
          return (
          <div key={m.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Top row: label + change badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.4rem" }}>{m.label}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.625rem" }}>
                  <span style={{ fontSize: "1.875rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", lineHeight: 1 }}>{m.value}</span>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: 99,
                    background: m.up ? "rgba(18,183,106,0.12)" : "rgba(244,63,94,0.12)",
                    color: m.up ? "#12B76A" : "#F43F5E",
                  }}>{m.change}</span>
                </div>
                <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{m.sub}</p>
              </div>
              {/* Legend */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <div style={{ width: 20, height: 2.5, background: chartColor, borderRadius: 2 }} />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>2025</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="4 3" /></svg>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>2024</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={m.data[period]} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={m.gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={chartColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={m.formatter} width={46} />
                <Tooltip content={<ChartTooltip color={chartColor} />} />
                <Area type="monotone" dataKey="prev" stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="6 4" fill="none" dot={false} activeDot={{ r: 3 }} />
                <Area type="monotone" dataKey="current" stroke={chartColor} strokeWidth={2.5} fill={`url(#${m.gradId})`} dot={false} activeDot={{ r: 5, fill: chartColor }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          );
        })}
      </div>

      {/* Campaign breakdown table */}
      <div className="card">
        <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem" }}>Campaign Breakdown</p>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Campaign</th><th>Ad Spend</th><th>New Streams</th><th>Cost / Stream</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map((row) => (
                <tr key={row.name}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.name}</td>
                  <td>{row.spend}</td>
                  <td>{row.streams}</td>
                  <td style={{ fontWeight: 700, color: "var(--primary)" }}>{row.cps}</td>
                  <td><span className={`badge badge-${row.status}`}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
