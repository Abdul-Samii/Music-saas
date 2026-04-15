"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.escalium.io/api/v1";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 44, height: 24, borderRadius: 99, border: "none", cursor: "pointer",
        background: checked ? "var(--primary)" : "var(--border)",
        position: "relative", transition: "background 0.2s ease", flexShrink: 0,
      }}
      aria-checked={checked}
      role="switch"
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3,
        left: checked ? 23 : 3,
        transition: "left 0.2s ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession({ required: false });
  const [name, setName]   = useState(session?.user?.name  || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [saved, setSaved] = useState(false);
  const [metaStatus, setMetaStatus] = useState<{ connected: boolean; adAccountId: string | null; pixelId: string | null } | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const token = (session as unknown as { accessToken?: string })?.accessToken;

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/meta-ads/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setMetaStatus(r.data))
      .catch(() => setMetaStatus({ connected: false, adAccountId: null, pixelId: null }));
  }, [token]);

  async function connectMeta() {
    const redirectUri = `${window.location.origin}/meta/callback`;
    const res = await axios.get(`${API}/meta-ads/oauth-url`, {
      params: { redirect_uri: redirectUri },
      headers: { Authorization: `Bearer ${token}` },
    });
    window.location.href = res.data.url;
  }

  async function disconnectMeta() {
    setDisconnecting(true);
    await axios.delete(`${API}/meta-ads/disconnect`, { headers: { Authorization: `Bearer ${token}` } });
    setMetaStatus({ connected: false, adAccountId: null, pixelId: null });
    setDisconnecting(false);
  }

  const [notifications, setNotifications] = useState({
    campaignUpdates: true,
    weeklyReport:    true,
    streamMilestones: true,
    billing:         false,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleNotif(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "ES";

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 720 }}>

      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Manage your account and connected services
        </p>
      </div>

      {/* ── Profile ── */}
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.5rem" }}>Profile</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #3A60E7, #4C1AEA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.375rem", fontWeight: 700, color: "#fff",
          }}>
            {initials}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary)" }}>{name || "Your Name"}</p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>Artist account</p>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600, padding: 0, marginTop: "0.375rem" }}>
              Change avatar
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="label">Display Name</label>
            <input
              className="input" placeholder="Your artist name"
              value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }}
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              className="input" placeholder="you@email.com" type="email"
              value={email} onChange={(e) => { setEmail(e.target.value); setSaved(false); }}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••" disabled style={{ opacity: 0.5 }} />
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>Password change coming Week 2</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.25rem" }}>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              {saved ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Saved!
                </>
              ) : "Save Changes"}
            </button>
            {saved && <span style={{ fontSize: "0.8rem", color: "var(--success)" }}>Profile updated</span>}
          </div>
        </div>
      </div>

      {/* ── Connected Accounts ── */}
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.375rem" }}>Connected Accounts</h2>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Connect your ad and streaming accounts to start launching campaigns
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>

          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.125rem", background: "var(--bg-elevated)", borderRadius: 12, border: `1px solid ${metaStatus?.connected ? "rgba(24,119,242,0.3)" : "var(--border)"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>Meta Ads</p>
                {metaStatus?.connected ? (
                  <p style={{ fontSize: "0.78rem", color: "#12B76A" }}>
                    ✓ Connected — Account {metaStatus.adAccountId}{metaStatus.pixelId ? " · Pixel active" : ""}
                  </p>
                ) : (
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Launch campaigns on Facebook & Instagram</p>
                )}
              </div>
            </div>
            {metaStatus?.connected ? (
              <button
                className="btn btn-secondary btn-sm"
                onClick={disconnectMeta}
                disabled={disconnecting}
              >
                {disconnecting ? "Disconnecting…" : "Disconnect"}
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={connectMeta}>
                Connect
              </button>
            )}
          </div>

          {/* Spotify */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.125rem", background: "var(--bg-elevated)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1DB954", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>Spotify for Artists</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Track stream growth, plays & listener analytics</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ opacity: 0.65, cursor: "not-allowed" }} disabled>
              Connect — Week 3
            </button>
          </div>

          {/* TikTok */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.125rem", background: "var(--bg-elevated)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#010101", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>TikTok Ads</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Reach music fans on TikTok</p>
              </div>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", background: "var(--bg-card)", border: "1px solid var(--border)", padding: "0.25rem 0.625rem", borderRadius: 99 }}>
              Coming soon
            </span>
          </div>
        </div>
      </div>

      {/* ── Notifications ── */}
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.375rem" }}>Notifications</h2>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>Choose which emails you want to receive</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            { key: "campaignUpdates",  label: "Campaign updates",    desc: "Get notified when your campaign status changes" },
            { key: "weeklyReport",     label: "Weekly report",       desc: "A summary of your streams and ad spend every Monday" },
            { key: "streamMilestones", label: "Stream milestones",   desc: "Alerts when you hit 10k, 50k, 100k streams etc." },
            { key: "billing",          label: "Billing & invoices",  desc: "Receipts and upcoming charge notifications" },
          ].map((n, i, arr) => (
            <div key={n.key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1rem 0",
              borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none",
              gap: "1rem",
            }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>{n.label}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>{n.desc}</p>
              </div>
              <Toggle
                checked={notifications[n.key as keyof typeof notifications]}
                onChange={() => toggleNotif(n.key as keyof typeof notifications)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="card" style={{ border: "1px solid rgba(244,63,94,0.25)" }}>
        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--danger)", marginBottom: "0.375rem" }}>Danger Zone</h2>
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>These actions are permanent and cannot be undone.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "var(--bg-elevated)", borderRadius: 10, border: "1px solid var(--border)", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>Delete account</p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Permanently delete your account and all campaign data</p>
            </div>
            <button className="btn btn-danger btn-sm">Delete Account</button>
          </div>
        </div>
      </div>

    </div>
  );
}
