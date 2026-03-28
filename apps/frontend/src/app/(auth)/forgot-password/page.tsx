"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Show success either way — don't reveal if email exists
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: "2rem", position: "relative", overflow: "hidden" }}>
      {/* Dot grid background */}
      <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="dots-fp" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" fillOpacity={0.4} /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#dots-fp)" />
      </svg>
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.75rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: NAVY }}>Escalium</span>
          </Link>

          {!submitted ? (
            <>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em", color: NAVY }}>Forgot your password?</h1>
              <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>Enter your email and we&apos;ll send you a reset link.</p>
            </>
          ) : (
            <>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EEF2FF", border: "1px solid #C7D4FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em", color: NAVY }}>Check your email</h1>
              <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>
                If <strong style={{ color: NAVY }}>{email}</strong> is registered, you&apos;ll receive a reset link shortly.
              </p>
            </>
          )}
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: NAVY, marginBottom: "0.375rem" }} htmlFor="email">Email address</label>
                <input
                  id="email" type="email" required
                  placeholder="you@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontSize: "0.9rem", color: NAVY, background: "#F8F9FC", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8rem", background: loading ? "#E2E6F0" : NAVY, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.25rem" }}>
                {loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#4A5370", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                Didn&apos;t receive it? Check your spam folder or try again.
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(""); }}
                style={{ width: "100%", padding: "0.8rem", background: "#F8F9FC", border: "1.5px solid #E2E6F0", borderRadius: 10, fontWeight: 600, fontSize: "0.9rem", color: NAVY, cursor: "pointer" }}
              >
                Try a different email
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#9BA3BF", fontSize: "0.875rem" }}>
          Remember it?{" "}
          <Link href="/login" style={{ color: BLUE, textDecoration: "none", fontWeight: 600 }}>Back to sign in</Link>
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
