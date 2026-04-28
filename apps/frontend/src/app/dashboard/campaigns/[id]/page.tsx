"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, BarChart, Bar,
} from "recharts";
import { campaignsApi } from "@/lib/api";
import api from "@/lib/api";

const AUDIENCE_TIERS = [
  { value: "tier1",  label: "Tier 1"       },
  { value: "tier2",  label: "Tier 2"       },
  { value: "tier3",  label: "Tier 3"       },
  { value: "top",    label: "Top Tiers"    },
  { value: "bottom", label: "Bottom Tiers" },
];

type SyncState = "idle" | "syncing" | "done" | "error";

type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";

interface CampaignMetric {
  id: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  streamsBefore?: number;
  streamsAfter?: number;
  costPerStream?: number;
}

interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  audienceTier: string | null;
  placement: string | null;
  pixelId: string | null;
  adTitle: string | null;
  adDescription: string | null;
  landingPageUrl: string | null;
  metaCampaignId: string | null;
  metaAdSetId: string | null;
  metaAdId: string | null;
  metaAdCreativeId: string | null;
  metaPageId: string | null;
  adVideoUrl: string | null;
  adImageHash: string | null;
  metrics: CampaignMetric[];
  automationPhase: string | null;
  automationWarning: string | null;
  adsDisabledCount: number;
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "#12B76A", PAUSED: "#F59E0B", COMPLETED: "#3A60E7", DRAFT: "#9A9A9E",
};
const STATUS_BG: Record<string, string> = {
  ACTIVE: "rgba(18,183,106,0.12)", PAUSED: "rgba(245,158,11,0.12)", COMPLETED: "rgba(58,96,231,0.12)", DRAFT: "rgba(154,154,158,0.12)",
};

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [activeChart, setActiveChart] = useState<"streams" | "spend">("streams");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTier, setAddTier] = useState("tier1");
  const [addBudget, setAddBudget] = useState("5");
  const [addVideoFile, setAddVideoFile] = useState<File | null>(null);
  const [addAdTitle, setAddAdTitle] = useState("");
  const [addAdDescription, setAddAdDescription] = useState("");
  const [addLandingUrl, setAddLandingUrl] = useState("");
  const [addUploadProgress, setAddUploadProgress] = useState(0);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("5");
  const [budgetLoading, setBudgetLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const data = await campaignsApi.get(id);
        const camp = data as Campaign;
        setCampaign({ ...camp, metrics: camp.metrics ?? [] });
        if (searchParams.get("action") === "addAd") setShowAddModal(true);

        // Silently sync status + spend data from Meta, then refresh
        if (camp.metaCampaignId) {
          Promise.all([
            campaignsApi.syncStatuses(),
            campaignsApi.syncInsights(camp.id),
          ])
            .then(() => campaignsApi.get(id))
            .then((fresh) => {
              const f = fresh as Campaign;
              setCampaign({ ...f, metrics: f.metrics ?? [] });
            })
            .catch(() => {});
        }
      } catch {
        setError("Failed to load campaign.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [id, searchParams]);

  async function handlePause() {
    if (!campaign) return;
    setActionLoading(true);
    try {
      await campaignsApi.pause(campaign.id);
      setCampaign({ ...campaign, status: "PAUSED" });
    } catch {
      // silent
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResume() {
    if (!campaign) return;
    setActionLoading(true);
    try {
      await campaignsApi.resume(campaign.id);
      setCampaign({ ...campaign, status: "ACTIVE" });
    } catch {
      // silent
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAddAdSet() {
    if (!campaign || Number(addBudget) < 5) return;
    if (!addVideoFile || !addAdTitle.trim() || !addLandingUrl.trim()) return;
    setAddLoading(true);
    setAddError("");
    setAddUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append("file", addVideoFile);
      const uploadRes = await api.post("/meta-ads/upload-asset", fd, {
        onUploadProgress: (e) =>
          setAddUploadProgress(Math.round(((e.loaded ?? 0) * 100) / (e.total ?? 1))),
      });
      const { videoId } = uploadRes.data as { videoId: string };

      await api.post("/meta-ads/add-adset", {
        campaignId: campaign.id,
        audienceTier: addTier,
        budget: Number(addBudget),
        videoId,
        adTitle: addAdTitle.trim(),
        adDescription: addAdDescription.trim() || undefined,
        landingPageUrl: addLandingUrl.trim(),
      });
      setShowAddModal(false);
      setAddTier("tier1");
      setAddBudget("5");
      setAddVideoFile(null);
      setAddAdTitle("");
      setAddAdDescription("");
      setAddLandingUrl("");
      setAddUploadProgress(0);
    } catch {
      setAddError("Failed to add ad set. Please try again.");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleDelete() {
    if (!campaign) return;
    setDeleteLoading(true);
    try {
      await campaignsApi.deleteCampaign(campaign.id);
      router.push("/dashboard/campaigns");
    } catch {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleIncreaseBudget() {
    if (!campaign || Number(budgetAmount) < 5) return;
    setBudgetLoading(true);
    try {
      await campaignsApi.increaseBudget(campaign.id, Number(budgetAmount));
      setCampaign({ ...campaign, budget: (campaign.budget ?? 0) + Number(budgetAmount) });
      setShowBudgetModal(false);
      setBudgetAmount("5");
    } catch {
      // silent
    } finally {
      setBudgetLoading(false);
    }
  }

  async function handleSync() {
    if (!campaign) return;
    setSyncState("syncing");
    try {
      await campaignsApi.syncInsights(campaign.id);
      const fresh = await campaignsApi.get(campaign.id) as Campaign;
      setCampaign({ ...fresh, metrics: fresh.metrics ?? [] });
      setSyncState("done");
      setTimeout(() => setSyncState("idle"), 2500);
    } catch {
      setSyncState("error");
      setTimeout(() => setSyncState("idle"), 2500);
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: 80, borderRadius: 16, background: "var(--bg-card)", border: "1px solid var(--border)", animation: "pulse 1.4s ease-in-out infinite" }} />
        ))}
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>{error ?? "Campaign not found."}</p>
        <Link href="/dashboard/campaigns" className="btn btn-secondary">← Back to Campaigns</Link>
      </div>
    );
  }

  const totalSpent = campaign.metrics.reduce((s, m) => s + m.spend, 0);
  const totalStreams = campaign.metrics.reduce((s, m) => s + ((m.streamsAfter ?? 0) - (m.streamsBefore ?? 0)), 0);
  const avgCps = totalStreams > 0 ? totalSpent / totalStreams : 0;
  const safeBudget = campaign.budget ?? 0;
  const budgetPct = safeBudget > 0 ? Math.min((totalSpent / safeBudget) * 100, 100) : 0;

  // Build chart data from real metrics
  const chartData = campaign.metrics.map((m) => ({
    day: new Date(m.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    streams: (m.streamsAfter ?? 0) - (m.streamsBefore ?? 0),
    spend: m.spend,
  }));

  const hasMetrics = chartData.length > 0;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* ── Breadcrumb + header ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <Link href="/dashboard/campaigns" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Campaigns
          </Link>
          <span style={{ color: "var(--border)", fontSize: "0.8rem" }}>/</span>
          <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>{campaign.name}</span>
        </div>

        <div className="dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{campaign.name}</h1>
            <span style={{
              fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: 99,
              background: STATUS_BG[campaign.status], color: STATUS_COLOR[campaign.status],
              border: `1px solid ${STATUS_COLOR[campaign.status]}30`, textTransform: "capitalize",
            }}>
              {campaign.status.toLowerCase()}
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            {campaign.metaCampaignId && (
              <button
                onClick={handleSync}
                disabled={syncState === "syncing"}
                className="btn btn-secondary btn-sm"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                {syncState === "syncing" ? "Syncing…" : syncState === "done" ? "Synced ✓" : "Sync Insights"}
              </button>
            )}
            {campaign.metaCampaignId && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-secondary btn-sm"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add New Ads
              </button>
            )}
            {campaign.status === "ACTIVE" && (
              <button
                onClick={handlePause}
                disabled={actionLoading}
                className="btn btn-secondary btn-sm"
                style={{ color: "#F59E0B", borderColor: "rgba(245,158,11,0.3)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
                {actionLoading ? "Pausing…" : "Pause Campaign"}
              </button>
            )}
            {campaign.status === "PAUSED" && (
              <button
                onClick={handleResume}
                disabled={actionLoading}
                className="btn btn-secondary btn-sm"
                style={{ color: "#12B76A", borderColor: "rgba(18,183,106,0.3)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                {actionLoading ? "Resuming…" : "Resume Campaign"}
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-secondary btn-sm"
              style={{ color: "#F43F5E", borderColor: "rgba(244,63,94,0.3)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ── Automation banner ── */}
      {campaign.automationPhase && (() => {
        const phase = campaign.automationPhase!;
        const banners: Record<string, { bg: string; border: string; icon: React.ReactNode; title: string; body: string; addBudget?: boolean }> = {
          optimising: {
            bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
            title: "Optimising Campaign",
            body: "Your campaign is in the learning phase (first 72 hours). Results may vary — this is normal.",
          },
          evaluating: {
            bg: "rgba(58,96,231,0.08)", border: "rgba(58,96,231,0.3)",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A60E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
            title: "Gathering Data",
            body: "Your campaign is past the initial phase. We're collecting enough data to evaluate performance (up to 144 hours).",
          },
          poor: {
            bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.3)",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
            title: `Ad ${campaign.adsDisabledCount ?? 0}`,
            body: `${campaign.adsDisabledCount ?? 0} ad${(campaign.adsDisabledCount ?? 0) !== 1 ? "s were" : " was"} automatically paused — cost per result exceeded $0.60 with 500+ impressions.`,
          },
          average: {
            bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.3)",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
            title: "Add New and Better Ads",
            body: "Your campaign's cost per result is between $0.25–$0.59. Consider uploading higher-quality creatives to improve performance.",
          },
          healthy: {
            bg: "rgba(18,183,106,0.08)", border: "rgba(18,183,106,0.3)",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
            title: "This Campaign is Going Good",
            body: "Cost per result is below $0.25 for the last 48h. We recommend adding more budget to increase results.",
            addBudget: true,
          },
          top_performer: {
            bg: "linear-gradient(135deg, rgba(58,96,231,0.10), rgba(76,26,234,0.10))",
            border: "rgba(76,26,234,0.35)",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4C1AEA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
            title: "Top 0.1% Campaign 🚀",
            body: "This campaign is among the top 0.1% of all campaigns. Add more budget now to maximise your results.",
            addBudget: true,
          },
        };
        const b = banners[phase];
        if (!b) return null;
        return (
          <div style={{ background: b.bg, border: `1px solid ${b.border}`, borderRadius: 14, padding: "1rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>{b.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>{b.title}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.55 }}>{b.body}</p>
            </div>
            {b.addBudget && (
              <button
                onClick={() => setShowBudgetModal(true)}
                className="btn btn-primary btn-sm"
                style={{ flexShrink: 0, alignSelf: "center" }}
              >
                Add Budget
              </button>
            )}
          </div>
        );
      })()}

      {/* ── 4 stat cards ── */}
      <div className="dash-metrics-grid">
        {[
          { label: "Total Budget",    value: `€${safeBudget.toLocaleString()}`, sub: totalSpent > 0 ? `€${totalSpent.toFixed(2)} spent` : "No spend yet",        color: "#3A60E7" },
          { label: "Streams",         value: totalStreams > 0 ? totalStreams.toLocaleString() : "—",    sub: "total streams driven",   color: "#1DB954" },
          { label: "Cost per Stream", value: avgCps > 0 ? `€${avgCps.toFixed(3)}` : "—",             sub: "avg across campaign",     color: "#4C1AEA" },
          { label: "Budget Used",     value: `${budgetPct.toFixed(0)}%`,                              sub: `€${(safeBudget - totalSpent).toFixed(2)} remaining`,  color: "#1877F2" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--bg-card)", borderRadius: 16, padding: "1.25rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.625rem" }}>{s.label}</p>
            <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Chart + campaign info ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.25rem" }} className="dash-detail-grid">

        {/* Chart */}
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.75rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Performance Over Time</h2>
            {hasMetrics && (
              <div style={{ display: "flex", background: "var(--bg-elevated)", borderRadius: 99, padding: "0.2rem", border: "1px solid var(--border)", gap: "0.2rem" }}>
                {(["streams", "spend"] as const).map((t) => (
                  <button key={t} onClick={() => setActiveChart(t)} style={{
                    padding: "0.35rem 0.875rem", borderRadius: 99, border: "none", cursor: "pointer",
                    fontSize: "0.78rem", fontWeight: 600, transition: "all 0.15s",
                    background: activeChart === t ? "#1C1C1E" : "transparent",
                    color: activeChart === t ? "#fff" : "var(--text-muted)", textTransform: "capitalize",
                  }}>
                    {t === "streams" ? "Streams" : "Ad Spend"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasMetrics ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-detail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={activeChart === "streams" ? "#3A60E7" : "#1877F2"} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={activeChart === "streams" ? "#3A60E7" : "#1877F2"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
                <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => activeChart === "streams" ? (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)) : `€${v}`} width={44} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: "0.78rem" }}
                  formatter={(v) => activeChart === "streams" ? [Number(v).toLocaleString(), "Streams"] : [`€${v}`, "Spend"]}
                />
                <Area type="monotone" dataKey={activeChart === "streams" ? "streams" : "spend"}
                  stroke={activeChart === "streams" ? "#3A60E7" : "#1877F2"}
                  strokeWidth={2.5} fill="url(#grad-detail)" dot={false}
                  activeDot={{ r: 5, fill: activeChart === "streams" ? "#3A60E7" : "#1877F2" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-elevated)", borderRadius: 12 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "0.75rem" }}>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>No performance data yet</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Data will appear once your campaign goes live</p>
            </div>
          )}
        </div>

        {/* Campaign info panel */}
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Campaign Info</h2>
          {[
            { label: "Platform",      value: "Meta (Facebook / Instagram)" },
            { label: "Audience Tier", value: campaign.audienceTier ?? "—" },
            { label: "Placement",     value: campaign.placement ?? "—" },
            { label: "Start Date",    value: fmtDate(campaign.startDate) },
            { label: "End Date",      value: fmtDate(campaign.endDate) },
            { label: "Created",       value: fmtDate(campaign.createdAt) },
            ...(campaign.metaCampaignId ? [{ label: "Meta Campaign ID", value: campaign.metaCampaignId }] : []),
          ].map((row, i, arr) => (
            <div key={row.label} style={{ paddingBottom: i < arr.length - 1 ? "0.875rem" : 0, borderBottom: i < arr.length - 1 ? "1px solid var(--border-light)" : "none" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.25rem" }}>{row.label}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 500, wordBreak: "break-all" }}>{row.value}</p>
            </div>
          ))}

          {/* Budget bar */}
          <div style={{ marginTop: "0.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Budget Used</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>{budgetPct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${budgetPct}%`, background: budgetPct >= 90 ? "#F43F5E" : "linear-gradient(90deg, #3A60E7, #4C1AEA)", borderRadius: 99, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.375rem" }}>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>€{totalSpent.toFixed(2)} spent</span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>€{safeBudget.toLocaleString()} total</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ad details ── */}
      {(campaign.adTitle || campaign.landingPageUrl) && (
        <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem" }}>Ad Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { label: "Ad Title",      value: campaign.adTitle },
              { label: "Description",   value: campaign.adDescription },
              { label: "Landing URL",   value: campaign.landingPageUrl },
              { label: "Pixel ID",      value: campaign.pixelId },
            ].filter((r) => r.value).map((row) => (
              <div key={row.label} style={{ padding: "0.875rem 1rem", background: "var(--bg-elevated)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.375rem" }}>{row.label}</p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500, wordBreak: "break-all" }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Audience breakdown (only if metrics exist) ── */}
      {hasMetrics && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="dash-audience-grid">
          <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "1.25rem" }}>Spend by Day</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={28}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: "0.78rem" }}
                  formatter={(v) => [`€${v}`, "Spend"]}
                />
                <Bar dataKey="spend" fill="#3A60E7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "1.5rem", border: "1px solid var(--border)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>Summary</h2>
            {[
              { label: "Total Impressions", value: campaign.metrics.reduce((s, m) => s + m.impressions, 0).toLocaleString() },
              { label: "Total Clicks",      value: campaign.metrics.reduce((s, m) => s + m.clicks, 0).toLocaleString() },
              { label: "Total Streams",     value: totalStreams.toLocaleString() },
              { label: "Avg Cost/Stream",   value: avgCps > 0 ? `€${avgCps.toFixed(3)}` : "—" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.625rem 0", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{r.label}</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary)" }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Increase Budget Modal ── */}
      {showBudgetModal && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowBudgetModal(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}
        >
          <div style={{ background: "var(--bg-card)", borderRadius: 20, padding: "2rem", border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", width: "100%", maxWidth: 380 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)" }}>Add Budget</h2>
              <button onClick={() => setShowBudgetModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.55 }}>
              This amount will be added to the daily budget of each active ad set.
            </p>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
              Additional Daily Budget (min $5)
            </label>
            <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontWeight: 600 }}>$</span>
              <input
                type="number" min={5} step={1} value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="dash-search"
                style={{ width: "100%", paddingLeft: "1.75rem", boxSizing: "border-box" }}
              />
            </div>
            {Number(budgetAmount) < 5 && (
              <p style={{ fontSize: "0.75rem", color: "#F43F5E", marginTop: "-1rem", marginBottom: "1rem" }}>Minimum $5/day required</p>
            )}
            <div style={{ display: "flex", gap: "0.625rem" }}>
              <button onClick={() => setShowBudgetModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button
                onClick={handleIncreaseBudget}
                disabled={budgetLoading || Number(budgetAmount) < 5}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {budgetLoading ? "Updating…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteConfirm(false); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem",
          }}
        >
          <div style={{
            background: "var(--bg-card)", borderRadius: 20, padding: "2rem", border: "1px solid var(--border)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)", width: "100%", maxWidth: 420,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", marginBottom: "0.625rem" }}>Delete Campaign?</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.75rem" }}>
              Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{campaign.name}</strong>? This will delete all previous data and you won&apos;t be able to get it back.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary" style={{ flex: 1 }} disabled={deleteLoading}>
                No, keep it
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                style={{ flex: 1, background: "#F43F5E", color: "#fff", border: "none", borderRadius: 10, padding: "0.625rem 1rem", fontWeight: 600, fontSize: "0.875rem", cursor: deleteLoading ? "not-allowed" : "pointer", opacity: deleteLoading ? 0.7 : 1 }}
              >
                {deleteLoading ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Add New Ads Modal ── */}
      {showAddModal && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem",
          }}
        >
          <div style={{
            background: "var(--bg-card)", borderRadius: 20, padding: "2rem", border: "1px solid var(--border)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)", width: "100%", maxWidth: 480,
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)" }}>Add New Ad</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem", borderRadius: 6, display: "flex" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Video upload */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                  Ad Video <span style={{ color: "#F43F5E" }}>*</span>
                </label>
                <label style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "0.5rem", padding: "1.25rem", borderRadius: 10, cursor: "pointer",
                  border: `2px dashed ${addVideoFile ? "#3A60E7" : "var(--border)"}`,
                  background: addVideoFile ? "rgba(58,96,231,0.06)" : "var(--bg-elevated)",
                  transition: "all 0.15s",
                }}>
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    style={{ display: "none" }}
                    onChange={(e) => setAddVideoFile(e.target.files?.[0] ?? null)}
                  />
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={addVideoFile ? "#3A60E7" : "var(--text-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                  <span style={{ fontSize: "0.8rem", fontWeight: 500, color: addVideoFile ? "#3A60E7" : "var(--text-muted)", textAlign: "center" }}>
                    {addVideoFile ? addVideoFile.name : "Click to upload video (MP4 / MOV)"}
                  </span>
                  {addVideoFile && (
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {(addVideoFile.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  )}
                </label>
                {addLoading && addUploadProgress > 0 && addUploadProgress < 100 && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <div style={{ height: 4, background: "var(--bg-elevated)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${addUploadProgress}%`, background: "#3A60E7", borderRadius: 99, transition: "width 0.2s" }} />
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Uploading… {addUploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* Ad Title */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                  Ad Title <span style={{ color: "#F43F5E" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Listen to my new single"
                  value={addAdTitle}
                  onChange={(e) => setAddAdTitle(e.target.value)}
                  className="dash-search"
                  style={{ width: "100%", paddingLeft: "0.875rem", boxSizing: "border-box" }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                  Description <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Short description for the ad"
                  value={addAdDescription}
                  onChange={(e) => setAddAdDescription(e.target.value)}
                  className="dash-search"
                  style={{ width: "100%", paddingLeft: "0.875rem", boxSizing: "border-box" }}
                />
              </div>

              {/* Landing URL */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                  Landing Page URL <span style={{ color: "#F43F5E" }}>*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://open.spotify.com/..."
                  value={addLandingUrl}
                  onChange={(e) => setAddLandingUrl(e.target.value)}
                  className="dash-search"
                  style={{ width: "100%", paddingLeft: "0.875rem", boxSizing: "border-box" }}
                />
              </div>

              {/* Tier */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                  Audience Tier
                </label>
                <select
                  value={addTier}
                  onChange={(e) => setAddTier(e.target.value)}
                  className="dash-search"
                  style={{ width: "100%", paddingLeft: "0.875rem" }}
                >
                  {AUDIENCE_TIERS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                  Daily Budget (min $5)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.875rem", fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    min={5}
                    step={1}
                    value={addBudget}
                    onChange={(e) => setAddBudget(e.target.value)}
                    className="dash-search"
                    style={{ width: "100%", paddingLeft: "1.75rem", boxSizing: "border-box" }}
                  />
                </div>
                {Number(addBudget) < 5 && (
                  <p style={{ fontSize: "0.75rem", color: "#F43F5E", marginTop: "0.375rem" }}>Minimum $5/day required</p>
                )}
              </div>

              {addError && (
                <p style={{ fontSize: "0.8rem", color: "#F43F5E", padding: "0.625rem 0.875rem", background: "rgba(244,63,94,0.08)", borderRadius: 8, border: "1px solid rgba(244,63,94,0.2)" }}>
                  {addError}
                </p>
              )}

              <div style={{ display: "flex", gap: "0.625rem", marginTop: "0.25rem" }}>
                <button onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button
                  onClick={handleAddAdSet}
                  disabled={addLoading || Number(addBudget) < 5 || !addVideoFile || !addAdTitle.trim() || !addLandingUrl.trim()}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {addLoading ? (addUploadProgress > 0 && addUploadProgress < 100 ? `Uploading ${addUploadProgress}%…` : "Creating…") : "Add Ad"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .dash-detail-grid { grid-template-columns: 1fr !important; }
          .dash-audience-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
