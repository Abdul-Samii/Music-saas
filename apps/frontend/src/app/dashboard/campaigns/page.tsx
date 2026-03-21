"use client";
import Link from "next/link";

export default function CampaignsPage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Campaigns</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Manage and launch your Meta Ads campaigns</p>
        </div>
        <Link href="/dashboard/campaigns/new" className="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Campaign
        </Link>
      </div>

      <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary-light)", margin: "0 auto 1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <h2 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>No campaigns yet</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", maxWidth: 360, margin: "0 auto 1.75rem" }}>
          Launch your first Meta Ads campaign in minutes using premade templates. Meta Ads integration coming Week 2.
        </p>
        <Link href="/dashboard/campaigns/new" className="btn btn-primary">Create Your First Campaign</Link>
      </div>
    </div>
  );
}
