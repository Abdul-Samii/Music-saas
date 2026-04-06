"use client";
import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.escalium.io/api/v1";
const NAVY = "#0B1120";
const BLUE = "#3A60E7";

type Stats = {
  totalUsers: number;
  monthlyUsers: number;
  payingUsers: number;
  earlyAccessTotal: number;
  growth: { day: string; count: number }[];
};

type User = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  metaAdAccountId: string | null;
  spotifyArtistId: string | null;
  type: "user" | "early_access";
};

type EarlyAccess = {
  id: string;
  name: string | null;
  email: string;
  source: string;
  activated: boolean;
  createdAt: string;
};

type Tab = "users" | "early-access";

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [input, setInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [earlyAccess, setEarlyAccess] = useState<EarlyAccess[]>([]);
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async (s: string) => {
    setLoading(true);
    try {
      const headers = { "x-admin-secret": s };
      const [statsRes, usersRes, eaRes] = await Promise.all([
        fetch(`${API}/admin/stats`, { headers }),
        fetch(`${API}/admin/users`, { headers }),
        fetch(`${API}/admin/early-access`, { headers }),
      ]);
      if (statsRes.status === 401) { setAuthError("Wrong password."); setSecret(""); setLoading(false); return; }
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const eaData = await eaRes.json();
      setStats(statsData);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setEarlyAccess(Array.isArray(eaData) ? eaData : []);
      setSecret(s);
      setAuthError("");
    } catch {
      setAuthError("Could not connect to backend.");
    }
    setLoading(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchAll(input);
  }

  // Auto-refresh every 60s
  useEffect(() => {
    if (!secret) return;
    const id = setInterval(() => fetchAll(secret), 60000);
    return () => clearInterval(id);
  }, [secret, fetchAll]);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0",
    borderRadius: 10, fontSize: "0.9rem", color: NAVY, background: "#F8F9FC",
    outline: "none", boxSizing: "border-box",
  };

  /* ── Login screen ── */
  if (!secret) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FC" }}>
        <div style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 20, padding: "2.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E2E6F0" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <h1 style={{ fontWeight: 900, fontSize: "1.4rem", color: NAVY, marginBottom: "0.25rem" }}>Escalium Admin</h1>
            <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Enter your admin password to continue</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="password" placeholder="Admin password" value={input} autoFocus
              onChange={(e) => setInput(e.target.value)} style={inputStyle}
            />
            {authError && <p style={{ color: "#F43F5E", fontSize: "0.8rem", textAlign: "center" }}>{authError}</p>}
            <button type="submit" disabled={loading} style={{ padding: "0.8rem", background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
              {loading ? "Verifying..." : "Enter dashboard →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.phone].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );
  const filteredEA = earlyAccess.filter((u) =>
    [u.name, u.email].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const statCards = [
    { label: "Total Users",          value: stats?.totalUsers ?? 0,      color: BLUE,      icon: "👥" },
    { label: "Monthly New Users",    value: stats?.monthlyUsers ?? 0,     color: "#12B76A", icon: "📈" },
    { label: "Paying Users",         value: stats?.payingUsers ?? 0,      color: "#4C1AEA", icon: "💳" },
    { label: "Early Access Signups", value: stats?.earlyAccessTotal ?? 0, color: "#F59E0B", icon: "🚀" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FC", fontFamily: "system-ui, sans-serif", color: NAVY }}>

      {/* Header */}
      <div style={{ background: NAVY, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, color: "#fff", fontSize: "1rem" }}>Escalium <span style={{ color: "#3A60E7" }}>Admin</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>Auto-refreshes every 60s</span>
          <button onClick={() => setSecret("")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "0.4rem 0.875rem", cursor: "pointer", fontSize: "0.8rem" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.75rem" }}>
          {statCards.map((c) => (
            <div key={c.label} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: "1px solid #E2E6F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <p style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</p>
                <span style={{ fontSize: "1.25rem" }}>{c.icon}</span>
              </div>
              <p style={{ fontSize: "2.25rem", fontWeight: 800, color: c.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Growth chart */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "1.75rem", border: "1px solid #E2E6F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: "1.75rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem", color: NAVY }}>User Growth — Last 30 Days</h2>
          {stats?.growth && stats.growth.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.growth} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="admin-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BLUE} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 10, fontSize: "0.78rem" }}
                  labelFormatter={(v) => fmt(v)}
                  formatter={(v: number) => [`${v} users`, "New signups"]}
                />
                <Area type="monotone" dataKey="count" stroke={BLUE} strokeWidth={2.5} fill="url(#admin-grad)" dot={false} activeDot={{ r: 5, fill: BLUE }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", textAlign: "center", padding: "3rem 0" }}>No growth data yet.</p>
          )}
        </div>

        {/* Tables */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E6F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>

          {/* Tab bar + search */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E2E6F0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.25rem", background: "#F8F9FC", borderRadius: 99, padding: "0.25rem", border: "1px solid #E2E6F0" }}>
              {(["users", "early-access"] as Tab[]).map((t) => (
                <button key={t} onClick={() => { setTab(t); setSearch(""); }} style={{
                  padding: "0.4rem 1.1rem", borderRadius: 99, border: "none", cursor: "pointer",
                  fontSize: "0.8rem", fontWeight: 600, transition: "all 0.15s",
                  background: tab === t ? NAVY : "transparent",
                  color: tab === t ? "#fff" : "#64748b",
                }}>
                  {t === "users" ? `Users (${users.length})` : `Early Access (${earlyAccess.length})`}
                </button>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <svg style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: "2.25rem", width: 220, background: "#F8F9FC" }} />
            </div>
          </div>

          {/* Users table */}
          {tab === "users" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
                <thead>
                  <tr style={{ background: "#F8F9FC", borderBottom: "1px solid #E2E6F0" }}>
                    {["Name", "Email", "Phone", "Type", "Meta Connected", "Spotify Connected", "Joined"].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>No users found.</td></tr>
                  ) : filteredUsers.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFBFC" }}>
                      <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: NAVY }}>{u.name ?? "—"}</td>
                      <td style={{ padding: "0.875rem 1.25rem", color: "#334155" }}>{u.email}</td>
                      <td style={{ padding: "0.875rem 1.25rem", color: "#64748b" }}>{u.phone ?? "—"}</td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span style={{ background: u.type === "user" ? "#EFF6FF" : "#FEF3C7", color: u.type === "user" ? "#2563EB" : "#D97706", padding: "0.2rem 0.6rem", borderRadius: 99, fontSize: "0.72rem", fontWeight: 600 }}>
                          {u.type === "user" ? "Signed up" : "Early access"}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: u.metaAdAccountId ? "#12B76A" : "#E2E6F0" }} />
                        <span style={{ marginLeft: "0.4rem", color: u.metaAdAccountId ? "#12B76A" : "#94a3b8", fontSize: "0.75rem" }}>{u.metaAdAccountId ? "Yes" : "No"}</span>
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: u.spotifyArtistId ? "#1DB954" : "#E2E6F0" }} />
                        <span style={{ marginLeft: "0.4rem", color: u.spotifyArtistId ? "#1DB954" : "#94a3b8", fontSize: "0.75rem" }}>{u.spotifyArtistId ? "Yes" : "No"}</span>
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem", color: "#64748b", whiteSpace: "nowrap" }}>{fmt(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Early access table */}
          {tab === "early-access" && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8375rem" }}>
                <thead>
                  <tr style={{ background: "#F8F9FC", borderBottom: "1px solid #E2E6F0" }}>
                    {["Name", "Email", "Source", "Activated", "Joined"].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEA.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>No early access signups yet.</td></tr>
                  ) : filteredEA.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFBFC" }}>
                      <td style={{ padding: "0.875rem 1.25rem", fontWeight: 600, color: NAVY }}>{u.name ?? "—"}</td>
                      <td style={{ padding: "0.875rem 1.25rem", color: "#334155" }}>{u.email}</td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span style={{ background: u.source === "google" ? "#FEF3C7" : "#EFF6FF", color: u.source === "google" ? "#D97706" : "#2563EB", padding: "0.2rem 0.6rem", borderRadius: 99, fontSize: "0.72rem", fontWeight: 600 }}>
                          {u.source}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem" }}>
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: u.activated ? "#12B76A" : "#E2E6F0" }} />
                        <span style={{ marginLeft: "0.4rem", color: u.activated ? "#12B76A" : "#94a3b8", fontSize: "0.75rem" }}>{u.activated ? "Yes" : "No"}</span>
                      </td>
                      <td style={{ padding: "0.875rem 1.25rem", color: "#64748b", whiteSpace: "nowrap" }}>{fmt(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
