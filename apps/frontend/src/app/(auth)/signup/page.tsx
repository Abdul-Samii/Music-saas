"use client";
import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) setForm((f) => ({ ...f, email }));
  }, [searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      });
      router.push("/thankyou");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function set(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
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

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600 as const,
    color: NAVY,
    marginBottom: "0.375rem",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#fff", color: NAVY }}>
      {/* Left panel — decorative */}
      <div
        style={{ display: "none", flex: 1, background: NAVY, position: "relative", overflow: "hidden", alignItems: "center", justifyContent: "center", padding: "3rem" }}
        className="signup-left"
      >
        <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.4) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(76,26,234,0.3) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 360 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#fff", marginBottom: "1rem", letterSpacing: "-0.02em" }}>Start growing your music</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "2.5rem" }}>Launch Meta Ads, track Cost per Stream, and create lyric videos — all in one platform.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {["14-day free trial on Pro", "No credit card required", "500+ artists growing"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.625rem", background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "0.75rem 1rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ color: "#12B76A", fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="dots-signup" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" fillOpacity={0.4} /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots-signup)" />
        </svg>
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(58,96,231,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <Link href="/landing" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.5rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: "1rem", color: NAVY }}>Escalium</span>
            </Link>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em", color: NAVY }}>Join the early access</h1>
            <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>Fill in your details to secure your spot</p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle} htmlFor="name">Full Name</label>
                <input id="name" type="text" required placeholder="John Doe" value={form.name} onChange={set("name")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="email">Email</label>
                <input id="email" type="email" required placeholder="you@email.com" value={form.email} onChange={set("email")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={set("phone")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="password">Password</label>
                <input id="password" type="password" required placeholder="Min. 8 characters" value={form.password} onChange={set("password")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="confirm">Confirm Password</label>
                <input id="confirm" type="password" required placeholder="Repeat your password" value={form.confirm} onChange={set("confirm")} style={inputStyle} />
              </div>

              {error && (
                <div style={{ padding: "0.75rem 1rem", background: "#FFF1F2", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, color: "#F43F5E", fontSize: "0.8125rem" }}>{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8rem", background: loading ? "#E2E6F0" : `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.25rem" }}
              >
                {loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>}
                {loading ? "Saving your spot..." : "Secure my early access →"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", marginTop: "0.75rem", color: "#9BA3BF", fontSize: "0.75rem" }}>
            By signing up you agree to our{" "}
            <a href="#" style={{ color: "#4A5370" }}>Terms</a> and{" "}
            <a href="#" style={{ color: "#4A5370" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) { .signup-left { display: flex !important; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#fff" }} />}>
      <SignupForm />
    </Suspense>
  );
}
