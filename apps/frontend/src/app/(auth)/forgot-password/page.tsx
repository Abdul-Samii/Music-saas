"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      // Show success either way — don't reveal if email exists
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "2rem",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse, rgba(103,61,230,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420 }} className="animate-fade-in">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.5rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>Escalium</span>
          </Link>

          {!submitted ? (
            <>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Forgot your password?</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </>
          ) : (
            <>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(103,61,230,0.12)", border: "1px solid rgba(103,61,230,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Check your email</h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                If <strong style={{ color: "var(--text-primary)" }}>{email}</strong> is registered, you&apos;ll receive a reset link shortly.
              </p>
            </>
          )}
        </div>

        {!submitted ? (
          <div className="card">
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="label" htmlFor="email">Email address</label>
                <input
                  id="email" type="email" className="input" required
                  placeholder="you@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ padding: "0.75rem", background: "var(--danger-light)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-sm)", color: "var(--danger)", fontSize: "0.8125rem" }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: "center", marginTop: "0.25rem" }}>
                {loading ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : null}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              Didn&apos;t receive it? Check your spam folder or try again.
            </p>
            <button
              onClick={() => { setSubmitted(false); setEmail(""); }}
              className="btn btn-secondary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Try a different email
            </button>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Remember it?{" "}
          <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
