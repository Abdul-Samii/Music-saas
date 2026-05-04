"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { landingPagesApi, usersApi } from "@/lib/api";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

function toSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 60);
}

function inputStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0",
    borderRadius: 10, fontSize: "0.9rem", color: NAVY, background: "#F8F9FC",
    outline: "none", boxSizing: "border-box", ...extra,
  };
}

type LandingPage = {
  id: string;
  title: string;
  artistSlug: string;
  songSlug: string;
  thumbnailUrl: string;
  spotifyUrl?: string;
  createdAt: string;
};

export default function LandingPagesPage() {
  const { data: session } = useSession();
  const token = (session as unknown as { accessToken?: string })?.accessToken;

  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [artistSlug, setArtistSlug] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [created, setCreated] = useState<{ url: string } | null>(null);

  // Analytics modal
  type Analytics = { views: number; clicks: number; title: string };
  const [analyticsPage, setAnalyticsPage] = useState<LandingPage | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  async function openAnalytics(page: LandingPage) {
    setAnalyticsPage(page);
    setAnalytics(null);
    setAnalyticsLoading(true);
    try {
      const data = await landingPagesApi.analytics(page.id);
      setAnalytics(data);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  const songSlugPreview = toSlug(name);
  const landingUrlPreview = artistSlug && songSlugPreview
    ? `escalium.io/p/${artistSlug}/${songSlugPreview}`
    : "";

  useEffect(() => {
    if (!token) return;
    usersApi.me().then((u: { artistName?: string; name?: string }) => {
      setArtistSlug(toSlug(u.artistName ?? u.name ?? "artist"));
    }).catch(() => {});
  }, [token]);

  useEffect(() => {
    setLoading(true);
    landingPagesApi.myPages().then((data) => setPages(data as LandingPage[])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleThumbnail(file: File) {
    setUploadError("");
    setThumbnailPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { url } = await landingPagesApi.uploadThumbnail(file);
      setThumbnailUrl(url);
    } catch {
      setUploadError("Upload failed. Please try again.");
      setThumbnailUrl("");
    } finally {
      setUploading(false);
    }
  }

  async function handleCreate() {
    if (!thumbnailUrl || !name.trim() || !spotifyUrl.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await landingPagesApi.create({
        title: name.trim(),
        description: description.trim() || undefined,
        songSlug: name.trim(),
        thumbnailUrl,
        spotifyUrl: spotifyUrl.trim(),
      });
      setCreated({ url: res.url });
      setPages((prev) => [{
        id: res.id,
        title: name.trim(),
        artistSlug: res.artistSlug,
        songSlug: res.songSlug,
        thumbnailUrl,
        spotifyUrl: spotifyUrl.trim(),
        createdAt: new Date().toISOString(),
      }, ...prev]);
      // Reset form
      setName(""); setDescription(""); setSpotifyUrl("");
      setThumbnailPreview(""); setThumbnailUrl("");
      setShowForm(false);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSubmitError(msg ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canCreate = name.trim().length >= 2 && thumbnailUrl.length > 0 && spotifyUrl.trim().length > 5 && !uploading;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Analytics modal */}
      {analyticsPage && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={() => setAnalyticsPage(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Analytics</p>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: NAVY }}>{analyticsPage.title}</h3>
              </div>
              <button onClick={() => setAnalyticsPage(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "1.4rem", lineHeight: 1, padding: 0 }}>×</button>
            </div>

            {analyticsLoading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Loading…</div>
            ) : analytics ? (
              <div style={{ display: "flex", gap: "1rem" }}>
                {[
                  { label: "Page Views", value: analytics.views, icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )},
                  { label: "Spotify Clicks", value: analytics.clicks, icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                    </svg>
                  )},
                ].map((stat) => (
                  <div key={stat.label} style={{ flex: 1, background: "#F8F9FC", borderRadius: 14, padding: "1.25rem", border: "1px solid #E2E6F0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {stat.icon}
                    <div>
                      <p style={{ fontSize: "1.875rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.03em" }}>{stat.value.toLocaleString()}</p>
                      <p style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500, marginTop: "0.2rem" }}>{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", textAlign: "center" }}>Could not load analytics.</p>
            )}

            {analytics && analytics.views > 0 && (
              <div style={{ marginTop: "1.25rem", padding: "0.875rem 1rem", background: "#F0F4FF", borderRadius: 10, fontSize: "0.8rem", color: BLUE }}>
                Click-through rate: <strong>{analytics.views > 0 ? ((analytics.clicks / analytics.views) * 100).toFixed(1) : "0"}%</strong>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: NAVY, letterSpacing: "-0.02em" }}>Landing Pages</h1>
          <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "0.25rem" }}>Hosted pages for your songs — share them or use in campaigns</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setCreated(null); setSubmitError(""); }}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.65rem 1.25rem", borderRadius: 10, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff",
            fontWeight: 700, fontSize: "0.875rem", flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {showForm ? "Cancel" : "New Landing Page"}
        </button>
      </div>

      {/* Success banner */}
      {created && (
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, color: "#166534", fontSize: "0.875rem" }}>Landing page created!</p>
            <a href={`https://${created.url}`} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "0.8rem", color: BLUE, fontWeight: 600 }}>
              {created.url}
            </a>
          </div>
          <button onClick={() => setCreated(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "1.2rem" }}>×</button>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "2rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: NAVY, marginBottom: "0.25rem" }}>Create Landing Page</h2>
            <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>A hosted page for your song that listeners land on after clicking your ad.</p>
          </div>

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

          {/* Song name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Song / Playlist Name</label>
            <input style={inputStyle()} placeholder="e.g. Meaning of Love" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Thumbnail */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>
              Artwork <span style={{ color: "#F43F5E" }}>*</span>
            </label>
            <label style={{
              display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer",
              padding: "1rem", borderRadius: 12,
              border: `2px dashed ${thumbnailUrl ? "#12B76A" : uploadError ? "#F43F5E" : "#E2E6F0"}`,
              background: thumbnailUrl ? "#F0FDF4" : "#F8F9FC",
            }}>
              <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleThumbnail(f); e.target.value = ""; }} />
              {thumbnailPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnailPreview} alt="thumb" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: 8, background: "#E2E6F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}
              <div>
                {uploading ? <p style={{ fontSize: "0.875rem", color: BLUE, fontWeight: 600 }}>Uploading…</p>
                  : thumbnailUrl ? <><p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#166534" }}>✓ Uploaded</p><p style={{ fontSize: "0.75rem", color: "#64748b" }}>Click to change</p></>
                  : <><p style={{ fontSize: "0.875rem", fontWeight: 600, color: NAVY }}>Upload artwork</p><p style={{ fontSize: "0.75rem", color: "#64748b" }}>JPG, PNG or WebP</p></>}
                {uploadError && <p style={{ fontSize: "0.75rem", color: "#F43F5E" }}>{uploadError}</p>}
              </div>
            </label>
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Description (optional)</label>
            <input style={inputStyle()} placeholder="e.g. New single out now — save it on Spotify!" maxLength={120} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* Spotify URL */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Spotify Link</label>
            <input style={inputStyle()} type="url" placeholder="https://open.spotify.com/track/..." value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} />
          </div>

          {submitError && (
            <div style={{ padding: "0.75rem 1rem", background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 10, fontSize: "0.8rem", color: "#BE123C" }}>{submitError}</div>
          )}

          <button
            onClick={handleCreate}
            disabled={!canCreate || submitting}
            style={{
              padding: "0.875rem", borderRadius: 12, border: "none", fontWeight: 700, fontSize: "0.9rem",
              background: canCreate && !submitting ? `linear-gradient(135deg, ${BLUE}, #4C1AEA)` : "#E2E6F0",
              color: canCreate && !submitting ? "#fff" : "#94a3b8",
              cursor: canCreate && !submitting ? "pointer" : "not-allowed",
            }}
          >
            {submitting ? "Creating…" : "Create Landing Page"}
          </button>
        </div>
      )}

      {/* Pages list */}
      <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontWeight: 700, fontSize: "0.9rem", color: NAVY }}>Your Pages</p>
          <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{pages.length} page{pages.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>Loading…</div>
        ) : pages.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.75rem" }}>
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <p style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: 500 }}>No landing pages yet</p>
            <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.25rem" }}>Create one to share your music with listeners</p>
          </div>
        ) : (
          <div>
            {pages.map((page, i) => {
              const url = `escalium.io/p/${page.artistSlug}/${page.songSlug}`;
              return (
                <div key={page.id} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 1.5rem",
                  borderBottom: i < pages.length - 1 ? "1px solid #F1F5F9" : "none",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={page.thumbnailUrl} alt={page.title} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{page.title}</p>
                    <a href={`https://${url}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "0.78rem", color: BLUE, fontWeight: 500, textDecoration: "none" }}>
                      {url}
                    </a>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <button
                      onClick={() => void openAnalytics(page)}
                      style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.4rem 0.75rem", borderRadius: 8, border: "1px solid #E2E6F0", background: "#F8F9FC", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                      </svg>
                      Analytics
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(`https://${url}`)}
                      style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.4rem 0.75rem", borderRadius: 8, border: "1px solid #E2E6F0", background: "#F8F9FC", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      Copy
                    </button>
                    <a href={`https://${url}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.4rem 0.75rem", borderRadius: 8, border: `1px solid ${BLUE}`, background: "#EEF2FF", textDecoration: "none", fontSize: "0.75rem", fontWeight: 600, color: BLUE }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Open
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
