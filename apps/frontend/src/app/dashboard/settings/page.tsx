"use client";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Settings</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Manage your account and connected services</p>
      </div>

      {/* Connected accounts */}
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem" }}>Connected Accounts</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { name: "Meta Ads", desc: "Connect to launch campaigns directly", icon: "📘", connected: false },
            { name: "Spotify",  desc: "Connect to track stream growth & analytics", icon: "🎧", connected: false },
          ].map((acc) => (
            <div key={acc.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "var(--bg-elevated)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{acc.icon}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>{acc.name}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{acc.desc}</p>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                Connect — Week 2
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Profile */}
      <div className="card">
        <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem" }}>Profile</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label className="label">Display Name</label>
            <input className="input" placeholder="Your artist name" disabled style={{ opacity: 0.6 }} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" placeholder="you@email.com" disabled style={{ opacity: 0.6 }} />
          </div>
          <button className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start", opacity: 0.6, cursor: "not-allowed" }} disabled>
            Save Changes — Coming soon
          </button>
        </div>
      </div>
    </div>
  );
}
