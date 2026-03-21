"use client";
import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const PERIODS = ["24h", "7d", "30d", "90d", "1y"] as const;
type Period = typeof PERIODS[number];

const chartData: Record<Period, { label: string; current: number; prev: number }[]> = {
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

const METRICS = [
  { label: "Total Ad Spend",   value: "$72,380", change: "+22%", up: true,  sub: "vs previous period", color: "#1877F2",
    spark: [220,280,250,340,310,400,380,460,420,520,490,580] },
  { label: "New Streams",      value: "371,962", change: "+18%", up: true,  sub: "vs previous period", color: "#1DB954",
    spark: [3100,4200,3800,5100,4700,6200,5800,7100,6500,8000,7600,9200] },
  { label: "Cost per Stream",  value: "$0.019",  change: "-8%",  up: true,  sub: "lower is better",    color: "#4C1AEA",
    spark: [28,26,27,24,25,22,23,21,22,20,19,19] },
  { label: "Active Campaigns", value: "64",      change: "+7%",  up: true,  sub: "currently running",  color: "#F59E0B",
    spark: [40,44,41,48,46,52,50,55,53,58,61,64] },
];

const CAMPAIGNS = [
  { name: "Summer Vibes Promo", spend: "$1,240", streams: "68,421",  cps: "$0.018", status: "active"    },
  { name: "New Single Launch",  spend: "$890",   streams: "42,100",  cps: "$0.021", status: "active"    },
  { name: "Album Rollout",      spend: "$2,100", streams: "87,300",  cps: "$0.024", status: "paused"    },
  { name: "Fan Growth Feb",     spend: "$640",   streams: "38,900",  cps: "$0.016", status: "active"    },
  { name: "Spotify Push Q1",    spend: "$3,200", streams: "135,241", cps: "$0.023", status: "completed" },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const W = 100, H = 40;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / (max - min || 1)) * H}`);
  const id = `g${color.replace("#", "")}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${H} ${pts.join(" ")} ${W},${H}`} fill={`url(#${id})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface TooltipProps { active?: boolean; payload?: { value: number }[]; label?: string; }
function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.8rem", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
      <p style={{ color: "var(--text-muted)", marginBottom: "0.4rem", fontWeight: 600 }}>{label}</p>
      <p style={{ color: "#3A60E7", fontWeight: 700 }}>2025: {payload[0]?.value?.toLocaleString()}</p>
      <p style={{ color: "var(--text-muted)", marginTop: "0.2rem" }}>2024: {payload[1]?.value?.toLocaleString()}</p>
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
              background: period === p ? "var(--primary)" : "transparent",
              color: period === p ? "#fff" : "var(--text-muted)",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* 4 metric cards with sparklines */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }} className="dash-metrics-grid">
        {METRICS.map((m) => (
          <div key={m.label} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>{m.label}</p>
              <span style={{
                fontSize: "0.68rem", fontWeight: 700, padding: "0.18rem 0.5rem", borderRadius: 99,
                background: m.up ? "rgba(18,183,106,0.12)" : "rgba(244,63,94,0.12)",
                color: m.up ? "#12B76A" : "#F43F5E",
              }}>{m.change}</span>
            </div>
            <p style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1, color: "var(--text-primary)" }}>{m.value}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{m.sub}</p>
              <Sparkline data={m.spark} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Main area chart — current vs previous period */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.35rem" }}>Stream Growth</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
              <span style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>371,962</span>
              <span style={{ fontSize: "0.85rem", color: "#12B76A", fontWeight: 700 }}>+22% YOY</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 24, height: 2.5, background: "#3A60E7", borderRadius: 2 }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>2025</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <svg width="24" height="4"><line x1="0" y1="2" x2="24" y2="2" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="5 3" /></svg>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>2024</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData[period]} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="grad-current" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3A60E7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3A60E7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
            <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="current" stroke="#3A60E7" strokeWidth={2.5} fill="url(#grad-current)" dot={false} activeDot={{ r: 5, fill: "#3A60E7" }} />
            <Area type="monotone" dataKey="prev" stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray="6 4" fill="none" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
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
