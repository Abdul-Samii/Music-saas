"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

const NAV = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    label: "Campaigns",
    href: "/dashboard/campaigns",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    label: "Landing Pages",
    href: "/dashboard/landing-pages",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    label: "Creative Studio",
    href: "/dashboard/studio",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession({ required: false });
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useAppStore();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Dark Sidebar ── */}
      <aside className={`sidebar-desktop${sidebarOpen ? " open" : ""}`} style={{
        width: 260,
        flexShrink: 0,
        background: "#1C1C1E",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "1.5rem 1.5rem 1rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Escalium" width={34} height={34} style={{ borderRadius: 8, flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#FFFFFF", letterSpacing: "-0.01em" }}>Escalium</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.5rem 0.875rem", display: "flex", flexDirection: "column", gap: "0.25rem", overflowY: "auto" }}>
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.7rem 1rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#1C1C1E" : "#9A9A9E",
                  background: active ? "#FFFFFF" : "transparent",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#9A9A9E";
                  }
                }}
              >
                <span style={{ color: active ? "#3A60E7" : "inherit", flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Support */}
        <div style={{ padding: "0.5rem 0.875rem" }}>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: "0.75rem",
            padding: "0.7rem 1rem", borderRadius: "12px", background: "none",
            border: "none", cursor: "pointer", color: "#9A9A9E", fontSize: "0.875rem", fontWeight: 400,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
            </svg>
            Support
          </button>
        </div>

        {/* Bottom — user + dark mode toggle */}
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Light/Dark toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "#9A9A9E" }}>{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
            <button
              onClick={toggleTheme}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              aria-label="Toggle theme"
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "0.25rem",
                background: "#2C2C2E", borderRadius: 99, padding: "0.2rem",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 99,
                  background: theme === "light" ? "#FFFFFF" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s ease",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme === "light" ? "#1C1C1E" : "#9A9A9E"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: 99,
                  background: theme === "dark" ? "#FFFFFF" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s ease",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={theme === "dark" ? "#1C1C1E" : "#9A9A9E"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* User */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "0.625rem",
                background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10,
                padding: "0.5rem 0.625rem", cursor: "pointer",
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg,#3A60E7,#4C1AEA)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700, color: "#fff", flexShrink: 0,
              }}>
                {session?.user?.name ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) : "ES"}
              </div>
              <div style={{ textAlign: "left", overflow: "hidden", flex: 1 }}>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {session?.user?.name || "Demo Artist"}
                </p>
                <p style={{ fontSize: "0.7rem", color: "#9A9A9E", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {session?.user?.email || "artist@escalium.io"}
                </p>
              </div>
            </button>

            {userMenuOpen && (
              <div style={{
                position: "absolute", bottom: "110%", left: 0, right: 0,
                background: "#2C2C2E", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "0.375rem", zIndex: 50,
                boxShadow: "0 -8px 24px rgba(0,0,0,0.4)",
              }}>
                <button
                  onClick={() => { router.push("/dashboard/settings"); setUserMenuOpen(false); }}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0.5rem 0.75rem", borderRadius: 6, textAlign: "left", fontSize: "0.8125rem", color: "#D1D1D6", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/>
                  </svg>
                  Settings
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "0.5rem 0.75rem", borderRadius: 6, textAlign: "left", fontSize: "0.8125rem", color: "#FF453A", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "var(--bg)" }}>
        {/* Mobile top bar */}
        <div className="mobile-topbar" style={{ alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", display: "flex", alignItems: "center" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Escalium</span>
        </div>
        <main className="dash-main" style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
