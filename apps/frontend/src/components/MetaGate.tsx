"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function MetaGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected">("loading");

  useEffect(() => {
    api
      .get("/meta-ads/status")
      .then((r) => setStatus(r.data?.connected ? "connected" : "disconnected"))
      .catch(() => setStatus("disconnected"));
  }, []);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #E2E6F0", borderTopColor: "#3A60E7", animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  if (status === "disconnected") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: 340, gap: "1.25rem", textAlign: "center", padding: "2rem",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: "linear-gradient(135deg, #1877F2 0%, #0C5FD6 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(24,119,242,0.25)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.375rem" }}>
            Connect your Meta account
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: 380, lineHeight: 1.6 }}>
            This page requires a connected Meta Ads account. Link your account in Settings to access campaigns, pixels, and ad management.
          </p>
        </div>

        <Link href="/dashboard/settings" style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.65rem 1.5rem", borderRadius: 10, fontWeight: 700, fontSize: "0.875rem",
          background: "linear-gradient(135deg, #3A60E7, #4C1AEA)",
          color: "#fff", textDecoration: "none",
          boxShadow: "0 4px 14px rgba(58,96,231,0.35)",
          transition: "opacity 0.15s",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Go to Settings
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
