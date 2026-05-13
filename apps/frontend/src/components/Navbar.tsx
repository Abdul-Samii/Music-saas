"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "Features", href: "/features/ai-lyrics-video-generator" },
  { label: "Pricing", href: "/pricing" },
  { label: "Alternatives", href: "/alternatives" },
  { label: "Blog", href: "/article/how-to-promote-your-song" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  /* Close on route change */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  /* Close on ESC */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="
          fixed top-5 left-1/2 -translate-x-1/2 z-50
          w-[calc(100%-3rem)] max-w-[850px]
          min-h-[58px]
          px-6 sm:px-10
          flex items-center justify-between
          rounded-full
          bg-white/85 backdrop-blur-xl
          border border-white/20
          shadow-[0_8px_32px_rgba(0,0,0,0.1)]
        "
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Escalium"
            width={30}
            height={30}
            priority
            className="rounded-md"
          />
          <span className="font-black tracking-tight sm:text-[1.43rem]">
            ESCALIUM
          </span>
        </Link>

        {/* Desktop links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`
                text-[15px] font-medium transition-colors
                ${
                  pathname === l.href
                    ? "text-primary"
                    : "text-secondary hover:text-primary"
                }
              `}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={(e) => {
              setOpen(!open);
            }}
            className={cn("md:hidden p-1 text-secondary", {
              "pointer-events-none": open,
            })}
          >
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>

          {/* CTA */}
          <Link
            href="/signup"
            className="
              rounded-full bg-primary text-white
              px-4 py-2 sm:px-5
              text-sm font-semibold
              shadow-[0_4px_15px_rgba(58,96,231,0.35)]
            "
          >
            Start for Free
          </Link>
        </div>
      </nav>

      {/* Overlay */}
      {/* {open && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" />
      )} */}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`
          fixed top-20 left-1/2 -translate-x-1/2 z-50
          w-[calc(95%-2rem)]
          rounded-2xl bg-white/95 backdrop-blur-xl
          border border-border
          p-5
          flex flex-col gap-4
          shadow-[0_8px_32px_rgba(0,0,0,0.12)]
          transition-all duration-200 ease-out
          ${
            open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }
        `}
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`
              text-sm font-medium transition-colors
              ${pathname === l.href ? "text-primary" : "text-secondary"}
            `}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
