"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-card)] px-10 pt-12 pb-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="footer-grid mb-12 grid gap-10 [grid-template-columns:2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="mb-3.5 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Escalium"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="text-[1.1rem] font-extrabold tracking-[-0.02em] text-[var(--text-primary)]">
                Escalium
              </span>
            </div>
            <p className="max-w-[260px] text-[0.8125rem] leading-[1.7] text-[var(--text-muted)]">
              The all-in-one music marketing platform for independent artists.
              Launch Meta Ads, track streams, and create lyric videos.
            </p>
          </div>

          {/* Features */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.07em] text-[var(--text-muted)]">
              Features
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Music Marketing", href: "/features/music-marketing" },
                { label: "Video Generator", href: "/features/video-generator" },
                {
                  label: "Lyric Videos",
                  href: "/features/video-generator/make-lyrics-video",
                },
                {
                  label: "Meta Ads",
                  href: "/features/music-marketing/meta-ads",
                },
                {
                  label: "Spotify Analytics",
                  href: "/features/music-marketing/platform",
                },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[0.8125rem] text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--text-primary)]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.07em] text-[var(--text-muted)]">
              Resources
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Blog", href: "/article/how-to-promote-your-song" },
                {
                  label: "How to Go Viral",
                  href: "/article/how-to-go-viral-with-music",
                },
                {
                  label: "Marketing Tools",
                  href: "/article/best-marketing-tools-for-musicians",
                },
                { label: "Alternatives", href: "/alternatives" },
                { label: "Pricing", href: "/pricing" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[0.8125rem] text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--text-primary)]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.07em] text-[var(--text-muted)]">
              Company
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
                { label: "Contact", href: "#" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[0.8125rem] text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--text-primary)]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6">
          <p className="text-[0.8rem] text-[var(--text-muted)]">
            © 2025 Escalium. All rights reserved.
          </p>
          <p className="text-[0.8rem] text-[var(--text-muted)]">
            Built for independent artists worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
