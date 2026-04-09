"use client";
import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

const ALLOWED_EMAILS = ["demo@gmail.com", "zakabusiness2020@gmail.com", "klaaswijnands00@gmail.com", "infozemmarketing@gmail.com", "absami.us@gmail.com"];

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

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600 as const,
  color: NAVY,
  marginBottom: "0.375rem",
};

function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password" | "blocked">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function checkEmail(e: FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) { setError("Enter a valid email."); return; }
    if (ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
      setError("");
      setStep("password");
    } else {
      setStep("blocked");
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", padding: "2rem", position: "relative", overflow: "hidden" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="dots-login" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" fillOpacity={0.4} /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#dots-login)" />
      </svg>

      <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: NAVY }}>Escalium</span>
          </div>

          {step === "blocked" ? (
            <>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>Access restricted</h1>
              <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>This platform is not yet publicly available.</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: NAVY, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>Welcome back</h1>
              <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>
                {step === "email" ? "Enter your email to continue" : `Signing in as ${email}`}
              </p>
            </>
          )}
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

          {/* Blocked state */}
          {step === "blocked" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFF1F2", border: "1px solid rgba(244,63,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <p style={{ fontSize: "0.875rem", color: "#4A5370", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Escalium is currently in private early access. Join the waitlist to get notified when we launch.
              </p>
              <a href="/landing" style={{ display: "block", padding: "0.8rem", background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", textAlign: "center" }}>
                Join early access →
              </a>
              <button onClick={() => { setStep("email"); setEmail(""); setError(""); }} style={{ marginTop: "0.875rem", background: "none", border: "none", color: "#9BA3BF", fontSize: "0.8rem", cursor: "pointer" }}>
                Try a different email
              </button>
            </div>
          )}

          {/* Step 1 — Email */}
          {step === "email" && (
            <form onSubmit={checkEmail} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle} htmlFor="email">Email address</label>
                <input id="email" type="email" required placeholder="you@email.com" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }} style={inputStyle} />
              </div>
              {error && <div style={{ padding: "0.75rem 1rem", background: "#FFF1F2", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, color: "#F43F5E", fontSize: "0.8125rem" }}>{error}</div>}
              <button type="submit" style={{ padding: "0.8rem", background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
                Continue →
              </button>
            </form>
          )}

          {/* Step 2 — Password */}
          {step === "password" && (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle} htmlFor="password">Password</label>
                <input id="password" type="password" required placeholder="Your password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }} style={inputStyle} autoFocus />
              </div>
              {error && <div style={{ padding: "0.75rem 1rem", background: "#FFF1F2", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, color: "#F43F5E", fontSize: "0.8125rem" }}>{error}</div>}
              <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8rem", background: loading ? "#E2E6F0" : `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>}
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <button type="button" onClick={() => { setStep("email"); setError(""); }} style={{ background: "none", border: "none", color: "#9BA3BF", fontSize: "0.8rem", cursor: "pointer" }}>
                ← Use a different email
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fff" }} />}>
      <LoginForm />
    </Suspense>
  );
}
