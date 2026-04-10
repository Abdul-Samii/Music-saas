"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import axios from "axios";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, { email });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1.5px solid #E2E6F0",
    borderRadius: 10,
    fontSize: "0.9rem",
    color: NAVY,
    background: "#F8F9FC",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F8F9FC",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dots-fp" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" fillOpacity={0.4} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-fp)" />
      </svg>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          border: "1px solid #E2E6F0",
          borderRadius: 24,
          padding: "2.5rem 2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/landing" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.25rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Escalium" width={36} height={36} style={{ borderRadius: 8 }} />
            <span style={{ fontWeight: 800, fontSize: "1rem", color: NAVY }}>Escalium</span>
          </Link>

          {!sent ? (
            <>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>
                Forgot your password?
              </h1>
              <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>
                Enter your email and we&apos;ll send a reset link.
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#ECFDF5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>
                Check your inbox
              </h1>
              <p style={{ color: "#4A5370", fontSize: "0.875rem", lineHeight: 1.6 }}>
                If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your spam folder if you don&apos;t see it.
              </p>
            </>
          )}
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: NAVY, marginBottom: "0.375rem" }} htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            {error && (
              <div style={{ padding: "0.75rem 1rem", background: "#FFF1F2", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, color: "#F43F5E", fontSize: "0.8125rem" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.8rem",
                background: loading ? "#E2E6F0" : `linear-gradient(135deg, ${BLUE}, #4C1AEA)`,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              )}
              {loading ? "Sending…" : "Send reset link →"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9BA3BF" }}>
              Remember it?{" "}
              <Link href="/login" style={{ color: BLUE, fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link
              href="/landing"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.75rem",
                background: NAVY,
                color: "#fff",
                textDecoration: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              Back to homepage
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
