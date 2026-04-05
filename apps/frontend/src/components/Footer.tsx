"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      padding: "3rem 2.5rem 2rem",
      borderTop: "1px solid var(--border)",
      background: "var(--bg-card)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2.5rem", marginBottom: "3rem" }}
          className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Escalium</span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 260 }}>
              The all-in-one music marketing platform for independent artists. Launch Meta Ads, track streams, and create lyric videos.
            </p>
          </div>

          {/* Features */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "1rem" }}>Features</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "Music Marketing",   href: "/features/music-marketing" },
                { label: "Video Generator",   href: "/features/video-generator" },
                { label: "Lyric Videos",      href: "/features/video-generator/make-lyrics-video" },
                { label: "Meta Ads",          href: "/features/music-marketing/meta-ads" },
                { label: "Spotify Analytics", href: "/features/music-marketing/platform" },
              ].map((l) => (
                <Link key={l.label} href={l.href} style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "1rem" }}>Resources</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "Blog",                        href: "/article/how-to-promote-your-song" },
                { label: "How to Go Viral",             href: "/article/how-to-go-viral-with-music" },
                { label: "Marketing Tools",             href: "/article/best-marketing-tools-for-musicians" },
                { label: "Alternatives",                href: "/alternatives" },
                { label: "Pricing",                     href: "/pricing" },
              ].map((l) => (
                <Link key={l.label} href={l.href} style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "1rem" }}>Company</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "Privacy",    href: "#" },
                { label: "Terms",      href: "#" },
                { label: "Contact",    href: "#" },
              ].map((l) => (
                <Link key={l.label} href={l.href} style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textDecoration: "none" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>© 2025 Escalium. All rights reserved.</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Built for independent artists worldwide.</p>
        </div>
      </div>

    </footer>
  );
}
