"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import { landingPagesApi, usersApi, zonesApi, type Zone } from "@/lib/api";
import MetaGate from "@/components/MetaGate";
import VideoEditor from "@/components/VideoEditor";
import CountryPicker from "@/components/CountryPicker";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.escalium.io/api/v1";
const BLUE = "#3A60E7";
const NAVY = "#0B1120";

const STEPS = ["Campaign", "Landing Page", "Conversion", "Budget", "Audience", "Placement", "Ad Creative", "Advertiser", "Review"];

const AUDIENCE_TIERS = [
  { value: "tier1",  label: "Tier 1",       desc: "Countries with the highest advertising costs, but also the highest Cost per Thousand Streams (CPMS) on Spotify and other streaming platforms." },
  { value: "tier2",  label: "Tier 2",       desc: "Countries with moderate advertising costs and average Cost per Thousand Streams (CPMS) on Spotify and other streaming platforms." },
  { value: "tier3",  label: "Tier 3",       desc: "Countries with low advertising costs and lower Cost per Thousand Streams (CPMS) on Spotify and other streaming platforms." },
  { value: "top",    label: "Top Tiers",    desc: "A strategic mix of high-paying countries and markets with balanced advertising costs." },
  { value: "bottom", label: "Bottom Tiers", desc: "A mix of lower-cost markets with affordable advertising rates and lower streaming payouts." },
];

const PLACEMENT_ICONS: Record<string, React.ReactNode> = {
  pro: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A60E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  pro_plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A60E7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};
const PLACEMENTS = [
  { value: "pro",      label: "Placement Pro",  desc: "This placement can increase results while giving you lower costs, but can also add less real listeners on your Spotify." },
  { value: "pro_plus", label: "Placement Pro+", desc: "This placement offers great results on campaigns and on real streams." },
];

type Pixel = { id: string; name: string };
type IgAccount = { id: string; username: string };
type FbPage = { id: string; name: string; instagramAccounts: IgAccount[] };
type UploadResult = { type: "video"; videoId: string } | { type: "image"; imageHash: string };

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function inputStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0",
    borderRadius: 10, fontSize: "0.9rem", color: NAVY, background: "#F8F9FC",
    outline: "none", boxSizing: "border-box", ...extra,
  };
}

function VideoPreview({ file }: { file: File }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <video
      src={url}
      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "#000", display: "block" }}
      preload="metadata"
      muted
      playsInline
      onLoadedMetadata={(e) => { e.currentTarget.currentTime = 0.1; }}
    />
  );
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{ index: number; file: File } | null>(null);

  // Artist slug (fetched from profile for landing page URL preview)
  const [artistSlug, setArtistSlug] = useState("");

  // Step 1 — landing page mode
  const [lpMode, setLpMode] = useState<"create" | "existing">("create");
  const [existingLandingUrl, setExistingLandingUrl] = useState("");

  // Step 4 — saved zones
  const [zones, setZones] = useState<Zone[]>([]);
  const [useCustomZone, setUseCustomZone] = useState(false);
  const [customZoneCountries, setCustomZoneCountries] = useState<string[]>([]);
  const [customZoneBudget, setCustomZoneBudget] = useState("5");
  const [customZoneName, setCustomZoneName] = useState("");
  const [savingZone, setSavingZone] = useState(false);

  // Step 2 — pixels
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [loadingPixels, setLoadingPixels] = useState(false);

  // Step 6 — pages + IG accounts
  const [pages, setPages] = useState<FbPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);

  // Step 6 — multi-video upload (min 3, max 8)
  type AdSlot = { file: File | null; result: UploadResult | null; uploading: boolean; error: string };
  const EMPTY_SLOT: AdSlot = { file: null, result: null, uploading: false, error: "" };
  const [adSlots, setAdSlots] = useState<AdSlot[]>([EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT]);

  // Step 4 — tier dropdown
  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const tierDropdownRef = useRef<HTMLDivElement>(null);

  // Landing page step state
  const [lpThumbnailPreview, setLpThumbnailPreview] = useState("");
  const [lpUploading, setLpUploading] = useState(false);
  const [lpUploadError, setLpUploadError] = useState("");

  // Error from launch
  const [launchError, setLaunchError] = useState("");

  const [form, setForm] = useState({
    name: "",
    pixelId: "",
    budget: "5",
    startDate: "",
    endDate: "",
    audienceTiers: [] as string[],
    tierBudgets: {} as Record<string, string>,
    placement: "",
    // Landing page
    landingThumbnailUrl: "",
    landingDescription: "",
    spotifyUrl: "",
    landingPageUrl: "",  // auto-filled at launch
    // Ad creative
    facebookPageId: "",
    instagramActorId: "",
    adTitle: "",
    adDescription: "",
    // Advertiser & payer
    advertiserName: "",
    payerDiffers: false,
    payerName: "",
  });

  // Fetch artist name for slug preview
  useEffect(() => {
    if (!token) return;
    usersApi.me().then((u: { artistName?: string; name?: string }) => {
      const raw = u.artistName ?? u.name ?? "artist";
      setArtistSlug(toSlug(raw));
    }).catch(() => {});
  }, [token]);

  // Load pixels on mount
  useEffect(() => {
    if (!token) return;
    setLoadingPixels(true);
    axios.get(`${API}/meta-ads/pixels`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        const fetched: Pixel[] = r.data.pixels ?? [];
        const list = fetched.length > 0 ? fetched : [{ id: "test-pixel-123", name: "Test Pixel (demo)" }];
        setPixels(list);
        if (list.length === 1) setForm((f) => ({ ...f, pixelId: list[0].id }));
      })
      .catch(() => setPixels([{ id: "test-pixel-123", name: "Test Pixel (demo)" }]))
      .finally(() => setLoadingPixels(false));
  }, [token]);

  // Close tier dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tierDropdownRef.current && !tierDropdownRef.current.contains(e.target as Node)) {
        setTierDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load saved zones when entering step 4
  useEffect(() => {
    if (step !== 4) return;
    zonesApi.list().then(setZones).catch(() => {});
  }, [step]);

  // Load FB pages when entering step 6
  useEffect(() => {
    if (step !== 6 || !token || pages.length > 0) return;
    setLoadingPages(true);
    axios.get(`${API}/meta-ads/pages`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        const fetched: FbPage[] = r.data.pages ?? [];
        setPages(fetched);
      })
      .catch(() => setPages([]))
      .finally(() => setLoadingPages(false));
  }, [step, token, pages.length]);

  const selectedPage = pages.find((p) => p.id === form.facebookPageId);
  const igAccounts = selectedPage?.instagramAccounts ?? [];

  // Landing page thumbnail selection & upload
  async function handleThumbnailSelect(file: File) {
    setLpUploadError("");
    const objectUrl = URL.createObjectURL(file);
    setLpThumbnailPreview(objectUrl);
    setLpUploading(true);
    try {
      const { url } = await landingPagesApi.uploadThumbnail(file);
      setForm((f) => ({ ...f, landingThumbnailUrl: url }));
    } catch {
      setLpUploadError("Upload failed. Please try again.");
      setForm((f) => ({ ...f, landingThumbnailUrl: "" }));
    } finally {
      setLpUploading(false);
    }
  }

  async function handleUploadSlot(index: number, fileOverride?: File) {
    const file = fileOverride ?? adSlots[index].file;
    if (!file || !token) return;
    setAdSlots((prev) => prev.map((s, i) => i === index ? { ...s, uploading: true, error: "" } : s));
    const fd = new FormData();
    fd.append("file", file);
    try {
      const { data } = await axios.post(`${API}/meta-ads/upload-asset`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdSlots((prev) => prev.map((s, i) => i === index ? { ...s, result: data as UploadResult, uploading: false } : s));
    } catch {
      setAdSlots((prev) => prev.map((s, i) => i === index ? { ...s, uploading: false, error: "Upload failed. Try again." } : s));
    }
  }

  const uploadedCount = adSlots.filter((s) => s.result !== null).length;
  const assetReady = uploadedCount >= 3;

  function validateAndSetSlot(index: number, file: File) {
    setEditingSlot({ index, file });
  }

  // Computed landing page preview URL
  const songSlugPreview = toSlug(form.name);
  const landingUrlPreview = artistSlug && songSlugPreview
    ? `escalium.io/p/${artistSlug}/${songSlugPreview}`
    : "";

  const canNext = [
    form.name.trim().length >= 2,                                              // 0 Campaign
    lpMode === "existing"
      ? existingLandingUrl.trim().length > 5
      : form.landingThumbnailUrl.length > 0 && form.spotifyUrl.trim().length > 5, // 1 Landing Page
    form.pixelId.length > 0,                                                   // 2 Conversion
    Number(form.budget) >= 5,                                                  // 3 Budget
    useCustomZone
      ? customZoneCountries.length > 0 && Number(customZoneBudget) >= 5
      : form.audienceTiers.length > 0 &&
        form.audienceTiers.every((v) => Number(form.tierBudgets[v] ?? 5) >= 5), // 4 Audience
    form.placement.length > 0,                                                 // 5 Placement
    form.facebookPageId.length > 0 && form.adTitle.trim().length >= 2         // 6 Ad Creative
      && assetReady,
    form.advertiserName.trim().length >= 2 &&                                 // 7 Advertiser
      (!form.payerDiffers || form.payerName.trim().length >= 2),
    true,                                                                      // 8 Review
  ][step];

  async function handleLaunch() {
    if (!token) return;
    setSubmitting(true);
    setLaunchError("");
    try {
      // 1. Create the landing page (or use existing URL)
      let landingPageUrl: string;
      if (lpMode === "existing") {
        landingPageUrl = existingLandingUrl.trim();
      } else {
        const lpRes = await landingPagesApi.create({
          title: form.name,
          description: form.landingDescription || undefined,
          songSlug: form.name,
          thumbnailUrl: form.landingThumbnailUrl,
          spotifyUrl: form.spotifyUrl,
          pixelId: form.pixelId || undefined,
        });
        landingPageUrl = lpRes.url;
      }

      // 2. Save draft campaign
      const { data: campaign } = await axios.post(
        `${API}/campaigns`,
        {
          name: form.name,
          budget: useCustomZone
            ? Number(customZoneBudget)
            : form.audienceTiers.reduce((sum, v) => sum + (Number(form.tierBudgets[v]) || 5), 0),
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          pixelId: form.pixelId,
          audienceTier: useCustomZone ? `custom:${customZoneName || "Custom Zone"}` : form.audienceTiers.join(","),
          placement: form.placement,
          landingPageUrl,
          adTitle: form.adTitle,
          adDescription: form.adDescription || undefined,
          metaPageId: form.facebookPageId,
          metaIgActorId: form.instagramActorId || undefined,
          adVideoUrl: adSlots.find((s) => s.result?.type === "video")
            ? (adSlots.find((s) => s.result?.type === "video")!.result as { type: "video"; videoId: string }).videoId
            : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // 3. Launch on Meta
      await axios.post(
        `${API}/meta-ads/launch-campaign`,
        {
          campaignId: (campaign as { id: string }).id,
          pixelId: form.pixelId,
          audienceTiers: useCustomZone ? [] : form.audienceTiers,
          tierBudgets: useCustomZone ? [] : form.audienceTiers.map((v) => Number(form.tierBudgets[v]) || 5),
          ...(useCustomZone && {
            customZone: {
              countries: customZoneCountries,
              budget: Number(customZoneBudget),
              name: customZoneName || "Custom Zone",
            },
          }),
          placement: form.placement,
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          pageId: form.facebookPageId,
          instagramActorId: form.instagramActorId || undefined,
          videoIds: adSlots.filter((s) => s.result?.type === "video").map((s) => (s.result as { type: "video"; videoId: string }).videoId),
          adTitle: form.adTitle,
          adDescription: form.adDescription || undefined,
          landingPageUrl,
          advertiserName: form.advertiserName,
          payerName: form.payerDiffers ? form.payerName : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      router.push("/dashboard/campaigns");
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setLaunchError(msg ?? "Launch failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <MetaGate>
    {editingSlot && (
      <VideoEditor
        file={editingSlot.file}
        onConfirm={(processed) => {
          const { index } = editingSlot;
          setEditingSlot(null);
          setAdSlots((prev) => prev.map((s, i) =>
            i === index ? { ...s, file: processed, result: null, error: "" } : s,
          ));
          void handleUploadSlot(index, processed);
        }}
        onCancel={() => setEditingSlot(null)}
      />
    )}
    <div className="animate-fade-in" style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {step === 0 ? (
          <Link href="/dashboard/campaigns" style={{ display: "flex", alignItems: "center", color: "#64748b", textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </Link>
        ) : (
          <button onClick={() => setStep((s) => s - 1)} style={{ display: "flex", alignItems: "center", color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
        )}
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.02em" }}>New Campaign</h1>
          <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Meta Ads · Sales campaign</p>
          <p style={{ fontSize: "0.8125rem", color: BLUE, fontWeight: 600, marginTop: "0.2rem" }}>Create your campaign in under 3 minutes</p>
        </div>
      </div>

      {/* Step indicator — two rows */}
      {(() => {
        const ROW1 = [0, 1, 2, 3, 4, 5];
        const ROW2 = [6, 7, 8];
        const renderRow = (indices: number[]) => (
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {indices.map((i, pos) => (
              <div key={STEPS[i]} style={{ display: "flex", alignItems: "center", flex: pos < indices.length - 1 ? 1 : "none" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.375rem", cursor: i < step ? "pointer" : "default", flexShrink: 0 }}
                  onClick={() => { if (i < step) setStep(i); }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.72rem", flexShrink: 0,
                    background: i < step ? "#12B76A" : i === step ? BLUE : "#F1F5F9",
                    color: i <= step ? "#fff" : "#94a3b8",
                    transition: "all 0.2s",
                  }}>
                    {i < step ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : i + 1}
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: i === step ? 700 : 400, color: i === step ? NAVY : "#94a3b8", whiteSpace: "nowrap" }}>
                    {STEPS[i]}
                  </span>
                </div>
                {pos < indices.length - 1 && (
                  <div style={{ flex: 1, height: 1.5, background: i < step ? "#12B76A" : "#E2E6F0", margin: "0 0.5rem", minWidth: 8, transition: "background 0.3s" }} />
                )}
              </div>
            ))}
          </div>
        );
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {renderRow(ROW1)}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {renderRow(ROW2)}
            </div>
          </div>
        );
      })()}

      {/* Step card */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "2rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>

        {/* Step 0 — Campaign */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Campaign Details</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Enter your song or playlist name — this becomes the campaign name</p>
            </div>
            <div style={{ background: "#F0F4FF", border: "1px solid #C7D7FD", borderRadius: 12, padding: "0.875rem 1rem", display: "flex", gap: "0.625rem" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ fontSize: "0.8rem", color: BLUE, lineHeight: 1.5 }}>
                Campaign type is <strong>Sales</strong> (fixed). Budget will be set at the ad set level.
              </p>
            </div>
            <Field label="Song / Playlist Name">
              <input
                style={inputStyle()}
                placeholder="e.g. Meaning of Love"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
              {form.name.length > 0 && form.name.length < 2 && (
                <p style={{ fontSize: "0.75rem", color: "#F43F5E" }}>Name must be at least 2 characters</p>
              )}
            </Field>
          </div>
        )}

        {/* Step 1 — Landing Page */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Landing Page</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                Create a new landing page or use one you already have.
              </p>
            </div>

            {/* Tab switcher */}
            <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 10, padding: 4, gap: 2 }}>
              {([{ label: "Create New", value: "create" }, { label: "Use Existing URL", value: "existing" }] as const).map(({ label, value }) => (
                <button key={value} onClick={() => setLpMode(value)} style={{
                  flex: 1, padding: "0.5rem", borderRadius: 8, border: "none", cursor: "pointer",
                  fontWeight: 600, fontSize: "0.8rem",
                  background: lpMode === value ? "#fff" : "transparent",
                  color: lpMode === value ? NAVY : "#64748b",
                  boxShadow: lpMode === value ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                }}>{label}</button>
              ))}
            </div>

            {/* Existing URL mode */}
            {lpMode === "existing" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ background: "#F0F4FF", border: "1px solid #C7D7FD", borderRadius: 12, padding: "0.875rem 1rem", display: "flex", gap: "0.625rem" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p style={{ fontSize: "0.8rem", color: BLUE, lineHeight: 1.5 }}>
                    Paste the URL of an existing landing page. Your pixel will still be tracked from the campaign.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Landing Page URL</label>
                  <input
                    style={inputStyle()}
                    type="url"
                    placeholder="https://escalium.io/p/artist/song"
                    value={existingLandingUrl}
                    onChange={(e) => setExistingLandingUrl(e.target.value)}
                    autoFocus
                  />
                </div>
                <a href="/dashboard/landing-pages" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "0.8rem", color: BLUE, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.35rem", textDecoration: "none" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  View my landing pages →
                </a>
              </div>
            )}

            {/* Create new mode */}
            {lpMode === "create" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* URL preview */}
                {landingUrlPreview && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.75rem 1rem", background: "#F0F4FF", border: "1px solid #C7D7FD", borderRadius: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <div>
                      <p style={{ fontSize: "0.72rem", color: BLUE, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.1rem" }}>Your landing page URL</p>
                      <p style={{ fontSize: "0.85rem", color: NAVY, fontWeight: 700 }}>{landingUrlPreview}</p>
                    </div>
                  </div>
                )}

                {/* Thumbnail upload */}
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>
                    Song / Playlist Artwork <span style={{ color: "#F43F5E" }}>*</span>
                  </label>
                  <label style={{
                    display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer",
                    padding: "1rem", borderRadius: 12,
                    border: `2px dashed ${form.landingThumbnailUrl ? "#12B76A" : lpUploadError ? "#F43F5E" : "#E2E6F0"}`,
                    background: form.landingThumbnailUrl ? "#F0FDF4" : "#F8F9FC",
                    transition: "all 0.15s",
                  }}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void handleThumbnailSelect(f);
                        e.target.value = "";
                      }}
                    />
                    {lpThumbnailPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={lpThumbnailPreview} alt="thumbnail" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: 8, background: "#E2E6F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      {lpUploading ? (
                        <p style={{ fontSize: "0.875rem", color: BLUE, fontWeight: 600 }}>Uploading…</p>
                      ) : form.landingThumbnailUrl ? (
                        <>
                          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#166534" }}>✓ Artwork uploaded</p>
                          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>Click to change</p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: NAVY }}>Upload artwork</p>
                          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>JPG, PNG or WebP · Max 10 MB</p>
                        </>
                      )}
                      {lpUploadError && <p style={{ fontSize: "0.75rem", color: "#F43F5E", marginTop: 2 }}>{lpUploadError}</p>}
                    </div>
                  </label>
                </div>

                {/* Description */}
                <Field label="Description (optional)">
                  <input
                    style={inputStyle()}
                    type="text"
                    placeholder="e.g. New single out now — save it on Spotify!"
                    maxLength={120}
                    value={form.landingDescription}
                    onChange={(e) => setForm({ ...form, landingDescription: e.target.value })}
                  />
                  <p style={{ fontSize: "0.72rem", color: "#64748b" }}>Short line shown below the song title on the landing page.</p>
                </Field>

                {/* Spotify URL */}
                <Field label="Spotify Link">
                  <input
                    style={inputStyle()}
                    type="url"
                    placeholder="https://open.spotify.com/track/..."
                    value={form.spotifyUrl}
                    onChange={(e) => setForm({ ...form, spotifyUrl: e.target.value })}
                  />
                  <p style={{ fontSize: "0.72rem", color: "#64748b" }}>Paste the Spotify link for your song or playlist. Listeners click this button on the landing page.</p>
                </Field>

                {/* Mini preview */}
                {(lpThumbnailPreview || form.spotifyUrl) && (
                  <div style={{ border: "1px solid #E2E6F0", borderRadius: 14, overflow: "hidden" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0.625rem 1rem", background: "#F8F9FC", borderBottom: "1px solid #E2E6F0" }}>Page Preview</p>
                    <div style={{ padding: "1.25rem", background: "#1a1a2e", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem" }}>
                      {lpThumbnailPreview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={lpThumbnailPreview} alt="artwork" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }} />
                      )}
                      <p style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", textAlign: "center" }}>{form.name || "Song Title"}</p>
                      {form.landingDescription && <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", textAlign: "center" }}>{form.landingDescription}</p>}
                      {form.spotifyUrl && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", background: "#1DB954", borderRadius: 10, padding: "0.5rem 0.875rem", width: "100%", maxWidth: 240 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                          <div>
                            <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.78rem" }}>Stream on Spotify</p>
                            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.68rem" }}>Click (+) to Save it</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Conversion */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Conversion Setup</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Select your Meta Pixel — it tracks who clicks and comes to your landing page</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { label: "Conversion Location", value: "Website" },
                { label: "Performance Goal",    value: "Maximize Conversions" },
                { label: "Conversion Event",    value: "View Content" },
              ].map((item) => (
                <div key={item.label} style={{ background: "#F8F9FC", border: "1px solid #E2E6F0", borderRadius: 10, padding: "0.75rem 1rem" }}>
                  <p style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{item.label}</p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: NAVY }}>{item.value}</p>
                </div>
              ))}
            </div>
            <Field label="Select Pixel (Dataset)">
              {loadingPixels ? (
                <div style={{ padding: "0.75rem 1rem", background: "#F8F9FC", borderRadius: 10, border: "1.5px solid #E2E6F0", color: "#94a3b8", fontSize: "0.875rem" }}>
                  Loading pixels...
                </div>
              ) : pixels.length === 0 ? (
                <div style={{ padding: "1rem", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, fontSize: "0.8125rem", color: "#1e40af" }}>
                  No pixels found. Go to Settings and make sure pixel creation succeeded, or create one in Meta Business Manager.
                </div>
              ) : (
                <select style={inputStyle()} value={form.pixelId} onChange={(e) => setForm({ ...form, pixelId: e.target.value })}>
                  <option value="">Select a pixel...</option>
                  {pixels.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        )}

        {/* Step 3 — Budget */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Budget & Schedule</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Set your daily budget and optional campaign dates</p>
            </div>
            <Field label="Daily Budget (minimum $5/day)">
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontWeight: 600 }}>$</span>
                <input
                  type="number" min="5" placeholder="5"
                  style={inputStyle({ paddingLeft: "2rem" })}
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>
              {form.budget && Number(form.budget) < 5 && (
                <p style={{ fontSize: "0.75rem", color: "#F43F5E" }}>Minimum daily budget is $5</p>
              )}
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label="Start Date (optional)">
                <input type="date" style={inputStyle()} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </Field>
              <Field label="End Date (optional)">
                <input type="date" style={inputStyle()} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </Field>
            </div>
            {Number(form.budget) >= 5 && (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "1rem 1.25rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Budget Summary</p>
                <p style={{ fontSize: "0.875rem", color: "#166534" }}>
                  <strong>${form.budget}/day</strong>
                  {form.startDate && form.endDate ? (() => {
                    const days = Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000);
                    return days > 0 ? ` · ${days} days · Total ~$${(Number(form.budget) * days).toLocaleString()}` : "";
                  })() : " · No end date (ongoing)"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4 — Audience */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Audience</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Use preset tiers or build a custom zone with specific countries.</p>
            </div>

            {/* Tab switcher */}
            <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 10, padding: 4, gap: 2 }}>
              {[{ label: "Preset Tiers", value: false }, { label: "Custom Zone", value: true }].map(({ label, value }) => (
                <button key={label} onClick={() => setUseCustomZone(value)} style={{
                  flex: 1, padding: "0.5rem", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem",
                  background: useCustomZone === value ? "#fff" : "transparent",
                  color: useCustomZone === value ? NAVY : "#64748b",
                  boxShadow: useCustomZone === value ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                }}>{label}</button>
              ))}
            </div>

            {/* ── Preset Tiers ── */}
            {!useCustomZone && (
              <>
                <div ref={tierDropdownRef} style={{ position: "relative" }}>
                  <button type="button" onClick={() => setTierDropdownOpen((o) => !o)} style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "0.75rem 1rem", borderRadius: 10, cursor: "pointer",
                    border: `1.5px solid ${tierDropdownOpen ? BLUE : "#E2E6F0"}`,
                    background: "#F8F9FC", fontSize: "0.875rem", fontWeight: 600, color: NAVY,
                  }}>
                    <span>{form.audienceTiers.length === 0 ? "Select tiers…" : form.audienceTiers.map((v) => AUDIENCE_TIERS.find((t) => t.value === v)?.label).join(", ")}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: tierDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {tierDropdownOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: "#fff", borderRadius: 12, border: "1.5px solid #E2E6F0", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                      {AUDIENCE_TIERS.map((tier) => {
                        const selected = form.audienceTiers.includes(tier.value);
                        return (
                          <label key={tier.value} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", padding: "0.875rem 1rem", background: selected ? "#F0F4FF" : "#fff", borderBottom: "1px solid #F1F5F9" }}>
                            <input type="checkbox" checked={selected} onChange={() => setForm((f) => {
                              const next = f.audienceTiers.includes(tier.value) ? f.audienceTiers.filter((t) => t !== tier.value) : [...f.audienceTiers, tier.value];
                              const budgets = { ...f.tierBudgets };
                              if (!f.audienceTiers.includes(tier.value)) budgets[tier.value] = budgets[tier.value] ?? "5";
                              return { ...f, audienceTiers: next, tierBudgets: budgets };
                            })} style={{ accentColor: BLUE, marginTop: 2, flexShrink: 0 }} />
                            <div>
                              <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY }}>{tier.label}</p>
                              <p style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.4 }}>{tier.desc}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {form.audienceTiers.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: NAVY }}>Daily budget per tier</p>
                    {form.audienceTiers.map((v) => {
                      const tier = AUDIENCE_TIERS.find((t) => t.value === v)!;
                      const val = form.tierBudgets[v] ?? "5";
                      const tooLow = Number(val) < 5;
                      return (
                        <div key={v} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", borderRadius: 10, border: `1.5px solid ${tooLow ? "#FECDD3" : "#E2E6F0"}`, background: tooLow ? "#FFF1F2" : "#F8F9FC" }}>
                          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: NAVY }}>{tier.label}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ color: "#64748b", fontWeight: 600 }}>$</span>
                            <input type="number" min={5} value={val}
                              onChange={(e) => setForm((f) => ({ ...f, tierBudgets: { ...f.tierBudgets, [v]: e.target.value } }))}
                              style={{ width: 80, padding: "0.375rem 0.5rem", borderRadius: 8, border: `1.5px solid ${tooLow ? "#FECDD3" : "#E2E6F0"}`, fontSize: "0.875rem", fontWeight: 600, color: NAVY, background: "#fff", textAlign: "right" }} />
                            <span style={{ color: "#64748b", fontSize: "0.8rem" }}>/day</span>
                          </div>
                        </div>
                      );
                    })}
                    <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      Total: <strong style={{ color: NAVY }}>${form.audienceTiers.reduce((sum, v) => sum + (Number(form.tierBudgets[v]) || 0), 0).toFixed(2)}/day</strong>
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ── Custom Zone ── */}
            {useCustomZone && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* Saved zones */}
                {zones.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <p style={{ fontSize: "0.78rem", fontWeight: 700, color: NAVY }}>My Saved Zones</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {zones.map((z) => (
                        <button key={z.id} onClick={() => {
                          setCustomZoneCountries(z.countries);
                          setCustomZoneName(z.name);
                        }} style={{
                          display: "flex", alignItems: "center", gap: "0.4rem",
                          padding: "0.35rem 0.75rem", borderRadius: 8, border: `1.5px solid ${customZoneName === z.name && customZoneCountries.length === z.countries.length ? BLUE : "#E2E6F0"}`,
                          background: customZoneName === z.name && customZoneCountries.length === z.countries.length ? "#EEF2FF" : "#F8F9FC",
                          cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, color: NAVY,
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {z.name} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({z.countries.length})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Country picker */}
                <CountryPicker selected={customZoneCountries} onChange={setCustomZoneCountries} />

                {/* Budget + save */}
                {customZoneCountries.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", padding: "1rem", background: "#F8F9FC", borderRadius: 12, border: "1.5px solid #E2E6F0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.875rem", color: NAVY }}>Daily budget</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "#64748b", fontWeight: 600 }}>$</span>
                        <input type="number" min={5} value={customZoneBudget} onChange={(e) => setCustomZoneBudget(e.target.value)}
                          style={{ width: 80, padding: "0.375rem 0.5rem", borderRadius: 8, border: `1.5px solid ${Number(customZoneBudget) < 5 ? "#FECDD3" : "#E2E6F0"}`, fontSize: "0.875rem", fontWeight: 600, color: NAVY, background: "#fff", textAlign: "right" }} />
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>/day</span>
                      </div>
                    </div>

                    {/* Save zone */}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input value={customZoneName} onChange={(e) => setCustomZoneName(e.target.value)}
                        placeholder="Zone name (e.g. Spain + France)…"
                        style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: 8, border: "1.5px solid #E2E6F0", fontSize: "0.8rem", color: NAVY, background: "#fff", outline: "none" }} />
                      <button
                        disabled={!customZoneName.trim() || savingZone}
                        onClick={async () => {
                          if (!customZoneName.trim()) return;
                          setSavingZone(true);
                          try {
                            const z = await zonesApi.create({ name: customZoneName.trim(), countries: customZoneCountries });
                            setZones((prev) => [z, ...prev]);
                          } finally { setSavingZone(false); }
                        }}
                        style={{
                          padding: "0.5rem 0.875rem", borderRadius: 8, border: "none", cursor: customZoneName.trim() ? "pointer" : "not-allowed",
                          background: customZoneName.trim() ? BLUE : "#E2E6F0", color: customZoneName.trim() ? "#fff" : "#94a3b8",
                          fontSize: "0.78rem", fontWeight: 700, flexShrink: 0,
                        }}
                      >
                        {savingZone ? "Saving…" : "Save zone"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 5 — Placement */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Placement Template</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Choose where your ads will appear. Facebook feeds and Messenger are always excluded.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {PLACEMENTS.map((p) => (
                <label key={p.value} style={{
                  display: "flex", alignItems: "flex-start", gap: "1rem", cursor: "pointer",
                  padding: "1.25rem", borderRadius: 14,
                  border: `1.5px solid ${form.placement === p.value ? BLUE : "#E2E6F0"}`,
                  background: form.placement === p.value ? "#F0F4FF" : "#F8F9FC",
                  transition: "all 0.15s",
                }}>
                  <input type="radio" name="placement" value={p.value} checked={form.placement === p.value}
                    onChange={(e) => setForm({ ...form, placement: e.target.value })} style={{ accentColor: BLUE, marginTop: 2 }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", color: NAVY, marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>{PLACEMENT_ICONS[p.value]}{p.label}</p>
                    <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 6 — Ad Creative */}
        {step === 6 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Ad Creative</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Upload your video and set the ad copy. All fields except description are required.</p>
            </div>

            {/* Landing page URL (read-only) */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "0.05em" }}>Landing Page (auto-created)</p>
                <p style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 600 }}>{landingUrlPreview || "escalium.io/p/…"}</p>
              </div>
            </div>

            {/* Facebook Page */}
            <Field label="Facebook Page">
              {loadingPages ? (
                <div style={{ padding: "0.75rem 1rem", background: "#F8F9FC", borderRadius: 10, border: "1.5px solid #E2E6F0", color: "#94a3b8", fontSize: "0.875rem" }}>
                  Loading pages...
                </div>
              ) : pages.length === 0 ? (
                <div style={{ padding: "1rem", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, fontSize: "0.8125rem", color: "#1e40af" }}>
                  No Facebook Pages found. Make sure your connected Meta account manages at least one Page.
                </div>
              ) : (
                <select style={inputStyle()} value={form.facebookPageId}
                  onChange={(e) => setForm({ ...form, facebookPageId: e.target.value, instagramActorId: "" })}>
                  <option value="">Select a Page...</option>
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
            </Field>

            {/* Instagram Account */}
            <Field label="Instagram Account (optional)">
              <select style={inputStyle()} value={form.instagramActorId}
                onChange={(e) => setForm({ ...form, instagramActorId: e.target.value })}
                disabled={igAccounts.length === 0}>
                <option value="">{igAccounts.length === 0 ? "No IG account linked to this Page" : "Select Instagram account..."}</option>
                {igAccounts.map((ig) => (
                  <option key={ig.id} value={ig.id}>@{ig.username}</option>
                ))}
              </select>
            </Field>

            {/* Multi-video Upload */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.375rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Ad Videos
                </label>
                <span style={{ fontSize: "0.72rem", color: uploadedCount >= 3 ? "#12B76A" : BLUE, fontWeight: 600 }}>
                  {uploadedCount}/8 uploaded · min 3 · recommended 4–6
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "0.5rem", lineHeight: 1.55 }}>
                This helps the campaign give you the best results while optimising the focus on the best ads without wasting too much of your budget.
              </p>
              <p style={{ fontSize: "0.75rem", color: BLUE, fontWeight: 600, marginBottom: "0.875rem" }}>
                Any video format accepted. We&apos;ll crop to 9:16, mute audio, and let you trim the clip (max 60s).
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {adSlots.map((slot, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem",
                    borderRadius: 12, border: `1.5px solid ${slot.result ? "#BBF7D0" : "#E2E6F0"}`,
                    background: slot.result ? "#F0FDF4" : "#F8F9FC",
                  }}>
                    {slot.file ? (
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <VideoPreview file={slot.file} />
                        <div style={{
                          position: "absolute", bottom: 4, right: 4,
                          width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          background: slot.result ? "#12B76A" : "#3A60E7",
                        }}>
                          {slot.result ? (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : (
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: 60, height: 60, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#E2E6F0", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 700 }}>
                        {i + 1}
                      </div>
                    )}

                    {slot.result ? (
                      <>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#166534", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slot.file?.name}</p>
                          <p style={{ fontSize: "0.72rem", color: "#12B76A", marginTop: 2 }}>Uploaded</p>
                        </div>
                        <button onClick={() => setAdSlots((prev) => prev.map((s, idx) => idx === i ? { ...s, file: null, result: null, error: "" } : s))}
                          style={{ fontSize: "0.72rem", color: "#64748b", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", flexShrink: 0 }}>
                          Remove
                        </button>
                      </>
                    ) : slot.file ? (
                      <>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "0.8rem", color: NAVY, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slot.file.name}</p>
                          {slot.uploading
                            ? <p style={{ fontSize: "0.72rem", color: BLUE, marginTop: 2 }}>Uploading…</p>
                            : slot.error && <p style={{ fontSize: "0.72rem", color: "#F43F5E", marginTop: 2 }}>{slot.error}</p>
                          }
                        </div>
                        {slot.error && !slot.uploading && (
                          <button onClick={() => void handleUploadSlot(i)}
                            style={{ padding: "0.35rem 0.875rem", borderRadius: 7, fontWeight: 700, fontSize: "0.75rem", border: "none", cursor: "pointer", background: BLUE, color: "#fff", flexShrink: 0 }}>
                            Retry
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "0.8rem", color: slot.error ? "#F43F5E" : "#94a3b8" }}>
                            {slot.error ? slot.error : "No video selected"}
                          </p>
                        </div>
                        <label htmlFor={`ad-slot-${i}`} style={{ padding: "0.35rem 0.875rem", borderRadius: 7, fontWeight: 600, fontSize: "0.75rem", border: `1px solid ${BLUE}`, cursor: "pointer", color: BLUE, background: "#fff", flexShrink: 0 }}>
                          {slot.error ? "Try again" : "Select"}
                        </label>
                        <input id={`ad-slot-${i}`} type="file" accept="video/*" style={{ display: "none" }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) validateAndSetSlot(i, f);
                            e.target.value = "";
                          }} />
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem" }}>
                {adSlots.length < 8 ? (
                  <button onClick={() => setAdSlots((prev) => [...prev, { file: null, result: null, uploading: false, error: "" }])}
                    style={{ fontSize: "0.8rem", color: BLUE, background: "none", border: "none", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem", padding: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add another video
                  </button>
                ) : (
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Maximum 8 videos reached</span>
                )}
                {adSlots.length > 3 && (
                  <button onClick={() => setAdSlots((prev) => prev.slice(0, -1))}
                    style={{ fontSize: "0.75rem", color: "#94a3b8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                    Remove last slot
                  </button>
                )}
              </div>
              {uploadedCount < 3 && uploadedCount > 0 && (
                <p style={{ fontSize: "0.75rem", color: "#3A60E7", marginTop: "0.5rem" }}>Upload at least {3 - uploadedCount} more video{3 - uploadedCount > 1 ? "s" : ""} to continue.</p>
              )}
              {uploadedCount === 0 && adSlots.some(s => s.file) && (
                <p style={{ fontSize: "0.75rem", color: BLUE, marginTop: "0.5rem" }}>Videos upload automatically once selected.</p>
              )}
            </div>

            {/* Ad Title */}
            <Field label="Ad Title">
              <input
                style={inputStyle()}
                placeholder="e.g. Listen to Meaning of Love"
                maxLength={40}
                value={form.adTitle}
                onChange={(e) => setForm({ ...form, adTitle: e.target.value })}
              />
              <p style={{ fontSize: "0.72rem", color: "#94a3b8", textAlign: "right" }}>{form.adTitle.length}/40</p>
            </Field>

            {/* Ad Description */}
            <Field label="Ad Description (optional)">
              <textarea
                style={{ ...inputStyle(), resize: "vertical", minHeight: 80 }}
                placeholder="e.g. New single out now — stream it on Spotify"
                maxLength={125}
                value={form.adDescription}
                onChange={(e) => setForm({ ...form, adDescription: e.target.value })}
              />
              <p style={{ fontSize: "0.72rem", color: "#94a3b8", textAlign: "right" }}>{form.adDescription.length}/125</p>
            </Field>
          </div>
        )}

        {/* Step 7 — Advertiser & Payer */}
        {step === 7 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Advertiser & Payer</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Meta requires ad transparency. Enter who is advertising and who is paying for this campaign.</p>
            </div>

            <Field label="Advertiser Name">
              <input
                style={inputStyle()}
                placeholder="Your name or business name"
                value={form.advertiserName}
                onChange={(e) => setForm({ ...form, advertiserName: e.target.value })}
              />
            </Field>

            <div
              onClick={() => setForm((f) => ({ ...f, payerDiffers: !f.payerDiffers, payerName: f.payerDiffers ? "" : f.payerName }))}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", userSelect: "none" }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5, border: `2px solid ${form.payerDiffers ? BLUE : "#CBD5E1"}`,
                background: form.payerDiffers ? BLUE : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {form.payerDiffers && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: "0.875rem", color: NAVY, fontWeight: 500 }}>The payer is different from the advertiser</span>
            </div>

            {form.payerDiffers && (
              <Field label="Payer Name">
                <input
                  style={inputStyle()}
                  placeholder="Name or business name of the payer"
                  value={form.payerName}
                  onChange={(e) => setForm({ ...form, payerName: e.target.value })}
                />
              </Field>
            )}

            <div style={{ background: "#F0F4FF", border: "1px solid #C7D7FD", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.8rem", color: BLUE }}>
              This information will be recorded for Meta&apos;s ad transparency requirements.
            </div>
          </div>
        )}

        {/* Step 8 — Review */}
        {step === 8 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Review & Launch</h2>
              <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Everything looks good? Click Launch to create your landing page and campaign on Meta.</p>
            </div>

            {[
              { label: "Campaign Name",      value: form.name,                  goStep: 0 },
              { label: "Campaign Type",      value: "Sales (fixed)",             goStep: 0 },
              { label: "Landing Page",       value: landingUrlPreview || "—",    goStep: 1 },
              { label: "Spotify Link",       value: form.spotifyUrl || "—",      goStep: 1 },
              { label: "Pixel",              value: pixels.find((p) => p.id === form.pixelId)?.name ?? form.pixelId, goStep: 2 },
              { label: "Conversion",         value: "Website → View Content → Maximize Conversions", goStep: 2 },
              { label: "Start Date",         value: form.startDate || "Immediately", goStep: 3 },
              { label: "End Date",           value: form.endDate || "No end date",   goStep: 3 },
              { label: useCustomZone ? "Custom Zone" : "Audience Tiers", value: useCustomZone ? `${customZoneName || "Custom Zone"} · ${customZoneCountries.length} countries · $${customZoneBudget}/day` : form.audienceTiers.map((v) => `${AUDIENCE_TIERS.find((t) => t.value === v)?.label ?? v} ($${form.tierBudgets[v] ?? 5}/day)`).join(", "), goStep: 4 },
              { label: "Total Daily Budget", value: useCustomZone ? `$${customZoneBudget}/day` : `$${form.audienceTiers.reduce((sum, v) => sum + (Number(form.tierBudgets[v]) || 5), 0).toFixed(2)}/day`, goStep: 4 },
              { label: "Placement",          value: PLACEMENTS.find((p) => p.value === form.placement)?.label ?? "", goStep: 5 },
              { label: "Facebook Page",      value: pages.find((p) => p.id === form.facebookPageId)?.name ?? form.facebookPageId, goStep: 6 },
              { label: "Instagram Account",  value: igAccounts.find((ig) => ig.id === form.instagramActorId)?.username ? `@${igAccounts.find((ig) => ig.id === form.instagramActorId)!.username}` : "None", goStep: 6 },
              { label: "Ad Videos",          value: uploadedCount > 0 ? `${uploadedCount} video${uploadedCount > 1 ? "s" : ""} uploaded` : "None", goStep: 6 },
              { label: "Ad Title",           value: form.adTitle,               goStep: 6 },
              { label: "Description",        value: form.adDescription || "—",  goStep: 6 },
              { label: "CTA",                value: "Listen Now",               goStep: 6 },
              { label: "Advertiser",         value: form.advertiserName,        goStep: 7 },
              { label: "Payer",              value: form.payerDiffers ? form.payerName : "Same as advertiser", goStep: 7 },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
                paddingBottom: i < arr.length - 1 ? "1rem" : 0,
                borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
              }}>
                <span style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 500, flexShrink: 0 }}>{row.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.8125rem", color: NAVY, fontWeight: 600, textAlign: "right", wordBreak: "break-all" }}>{row.value}</span>
                  <button
                    onClick={() => setStep(row.goStep)}
                    style={{ fontSize: "0.72rem", fontWeight: 600, color: BLUE, background: "#EEF2FF", border: "none", borderRadius: 6, padding: "0.2rem 0.5rem", cursor: "pointer", flexShrink: 0 }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}

            {launchError && (
              <div style={{ padding: "0.875rem 1rem", background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 10, fontSize: "0.8125rem", color: "#BE123C" }}>
                {launchError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {step === 0 ? (
          <Link href="/dashboard/campaigns" style={{ padding: "0.75rem 1.5rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontWeight: 600, fontSize: "0.875rem", color: "#64748b", textDecoration: "none", background: "#fff" }}>
            Cancel
          </Link>
        ) : (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{ padding: "0.75rem 1.5rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontWeight: 600, fontSize: "0.875rem", color: "#64748b", background: "#fff", cursor: "pointer" }}
          >
            ← Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext || (step === 1 && lpMode === "create" && lpUploading)}
            style={{
              padding: "0.75rem 1.75rem", borderRadius: 10, fontWeight: 700, fontSize: "0.875rem",
              background: (canNext && !(step === 1 && lpMode === "create" && lpUploading)) ? `linear-gradient(135deg, ${BLUE}, #4C1AEA)` : "#E2E6F0",
              color: (canNext && !(step === 1 && lpMode === "create" && lpUploading)) ? "#fff" : "#94a3b8", border: "none",
              cursor: (canNext && !(step === 1 && lpMode === "create" && lpUploading)) ? "pointer" : "not-allowed",
            }}
          >
            {step === 1 && lpMode === "create" && lpUploading ? "Uploading…" : "Continue →"}
          </button>
        ) : (
          <button
            onClick={handleLaunch}
            disabled={submitting}
            style={{
              padding: "0.75rem 2rem", borderRadius: 10, fontWeight: 700, fontSize: "0.875rem",
              background: submitting ? "#E2E6F0" : `linear-gradient(135deg, ${BLUE}, #4C1AEA)`,
              color: submitting ? "#94a3b8" : "#fff",
              border: "none", cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Launching..." : "Launch Now"}
          </button>
        )}
      </div>
    </div>
    </MetaGate>
  );
}
