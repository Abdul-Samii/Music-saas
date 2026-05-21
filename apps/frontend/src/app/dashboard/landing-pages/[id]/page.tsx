"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { landingPagesApi } from "@/lib/api";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

type OwnAnalytics = { views: number; clicks: number; title: string };

type MetaAnalytics = {
  title: string;
  campaigns: number;
  impressions: number;
  linkClicks: number;
  landingPageViews: number;
  spotifyClicks: number;
  reach: number;
  spend: number;
  error?: string;
};

export default function LandingPageAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [own, setOwn] = useState<OwnAnalytics | null>(null);
  const [meta, setMeta] = useState<MetaAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      landingPagesApi.analytics(id),
      landingPagesApi.metaAnalytics(id),
    ]).then(([ownRes, metaRes]) => {
      if (ownRes.status === "fulfilled") setOwn(ownRes.value);
      if (metaRes.status === "fulfilled") setMeta(metaRes.value as MetaAnalytics);
    }).finally(() => setLoading(false));
  }, [id]);

  const title = own?.title ?? meta?.title ?? "Analytics";

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
        <p style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>Landing Page Analytics</p>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.02em" }}>
          {loading ? "Loading…" : title}
        </h1>
      </div>

      {loading ? (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "4rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
          Loading analytics…
        </div>
      ) : (
        <>
          {/* Our own counters — all traffic sources */}
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>Landing Page Activity</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: "1px solid #E2E6F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "2rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.03em", lineHeight: 1 }}>{(own?.views ?? 0).toLocaleString()}</p>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginTop: "0.375rem" }}>Page Visits</p>
                  <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.125rem" }}>All sources — ads, shares, direct</p>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: "1px solid #E2E6F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: "2rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.03em", lineHeight: 1 }}>{(own?.clicks ?? 0).toLocaleString()}</p>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginTop: "0.375rem" }}>Spotify Button Clicks</p>
                  <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.125rem" }}>Clicks on Stream on Spotify</p>
                </div>
              </div>
            </div>

            {(own?.views ?? 0) > 0 && (
              <div style={{ marginTop: "0.75rem", background: "#F0F4FF", borderRadius: 12, border: "1px solid #C7D7FD", padding: "0.875rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: BLUE, fontWeight: 600 }}>Spotify Click Rate</span>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: NAVY }}>{(((own?.clicks ?? 0) / (own?.views ?? 1)) * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>

          {/* Meta Ads performance */}
          {meta && !meta.error && (
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.75rem" }}>Meta Ads Performance</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "Impressions", value: meta.impressions.toLocaleString(), sub: "Times your ad was shown" },
                  { label: "Reach", value: meta.reach.toLocaleString(), sub: "Unique people who saw the ad" },
                  { label: "Link Clicks", value: meta.linkClicks.toLocaleString(), sub: "Clicks on the ad" },
                  { label: "Ad CTR", value: meta.impressions > 0 ? `${((meta.linkClicks / meta.impressions) * 100).toFixed(2)}%` : "—", sub: "Link clicks ÷ impressions" },
                ].map((stat) => (
                  <div key={stat.label} style={{ background: "#fff", borderRadius: 16, padding: "1.5rem", border: "1px solid #E2E6F0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                    <p style={{ fontSize: "2rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.03em", lineHeight: 1 }}>{stat.value}</p>
                    <p style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginTop: "0.375rem" }}>{stat.label}</p>
                    <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.125rem" }}>{stat.sub}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "0.75rem", background: "#fff", borderRadius: 16, border: "1px solid #E2E6F0", padding: "1.25rem 1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>Total Spend</p>
                  <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{meta.campaigns} campaign{meta.campaigns !== 1 ? "s" : ""} · all-time</p>
                </div>
                <p style={{ fontSize: "1.75rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.03em" }}>${meta.spend.toFixed(2)}</p>
              </div>
            </div>
          )}

          {meta?.error === "Meta not connected" && (
            <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 16, padding: "1.25rem 1.5rem", fontSize: "0.875rem", color: "#92400E" }}>
              Connect your Meta account in Settings to see ad performance data.
            </div>
          )}
        </>
      )}
    </div>
  );
}
