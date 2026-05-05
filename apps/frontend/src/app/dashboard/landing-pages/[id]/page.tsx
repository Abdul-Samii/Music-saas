"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { landingPagesApi } from "@/lib/api";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

type MetaAnalytics = {
  title: string;
  campaigns: number;
  impressions: number;
  linkClicks: number;
  landingPageViews: number;
  reach: number;
  spend: number;
  error?: string;
};

export default function LandingPageAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [analytics, setAnalytics] = useState<MetaAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    landingPagesApi.metaAnalytics(id)
      .then(setAnalytics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Back + header */}
      <div>
        <button
          onClick={() => router.back()}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "0.8rem", fontWeight: 600, padding: 0, marginBottom: "1.25rem" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Landing Pages
        </button>

        <div>
          <p style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>Landing Page Analytics</p>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.02em" }}>
            {loading ? "Loading…" : analytics?.title ?? "Analytics"}
          </h1>
          {!loading && analytics && !analytics.error && (
            <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "0.25rem" }}>
              {analytics.campaigns} linked campaign{analytics.campaigns !== 1 ? "s" : ""} · all-time data from Meta
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "4rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
          Fetching data from Meta…
        </div>
      ) : analytics?.error ? (
        <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 16, padding: "1.5rem", fontSize: "0.875rem", color: "#92400E" }}>
          {analytics.error === "Meta not connected"
            ? "Connect your Meta account in Settings to see ad analytics."
            : analytics.error}
        </div>
      ) : analytics ? (
        <>
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              {
                label: "Impressions",
                value: analytics.impressions.toLocaleString(),
                sub: "Times your ad was shown",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                ),
              },
              {
                label: "Reach",
                value: analytics.reach.toLocaleString(),
                sub: "Unique people who saw the ad",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
              },
              {
                label: "Link Clicks",
                value: analytics.linkClicks.toLocaleString(),
                sub: "Clicks on the ad",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                ),
              },
              {
                label: "Landing Page Views",
                value: analytics.landingPageViews.toLocaleString(),
                sub: "People who loaded the page",
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                ),
              },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: "1px solid #E2E6F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: "2rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.03em", lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginTop: "0.375rem" }}>{stat.label}</p>
                  <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.125rem" }}>{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Spend */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E6F0", padding: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>Total Spend</p>
                <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>All-time across {analytics.campaigns} campaign{analytics.campaigns !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <p style={{ fontSize: "1.75rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.03em" }}>${analytics.spend.toFixed(2)}</p>
          </div>

          {/* CTR */}
          {analytics.impressions > 0 && (
            <div style={{ background: "#F0F4FF", borderRadius: 16, border: "1px solid #C7D7FD", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.875rem", color: BLUE }}>Click-through Rate</p>
                <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.125rem" }}>Link clicks ÷ impressions</p>
              </div>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, color: BLUE, letterSpacing: "-0.03em" }}>
                {((analytics.linkClicks / analytics.impressions) * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "4rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
          Could not load analytics.
        </div>
      )}
    </div>
  );
}
