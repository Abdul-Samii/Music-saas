"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        name: form.name, email: form.email, password: form.password,
      });
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/dashboard");
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

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#fff", color: NAVY }}>
      {/* Left panel — decorative */}
      <div style={{ display: "none", flex: 1, background: NAVY, position: "relative", overflow: "hidden", alignItems: "center", justifyContent: "center", padding: "3rem" }} className="signup-left">
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
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.75rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <span style={{ fontWeight: 800, fontSize: "1rem", color: NAVY }}>Escalium</span>
            </Link>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em", color: NAVY }}>Create your account</h1>
            <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>Start growing your music for free</p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {/* Google */}
            <button onClick={handleGoogle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", padding: "0.75rem", background: "#F8F9FC", border: "1.5px solid #E2E6F0", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem", color: NAVY, marginBottom: "1.25rem" }}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1, height: 1, background: "#E2E6F0" }} />
              <span style={{ color: "#9BA3BF", fontSize: "0.75rem" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#E2E6F0" }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: NAVY, marginBottom: "0.375rem" }} htmlFor="name">Full Name</label>
                <input id="name" type="text" required placeholder="John Doe" value={form.name} onChange={set("name")}
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontSize: "0.9rem", color: NAVY, background: "#F8F9FC", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: NAVY, marginBottom: "0.375rem" }} htmlFor="email">Email</label>
                <input id="email" type="email" required placeholder="you@email.com" value={form.email} onChange={set("email")}
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontSize: "0.9rem", color: NAVY, background: "#F8F9FC", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: NAVY, marginBottom: "0.375rem" }} htmlFor="password">Password</label>
                <input id="password" type="password" required placeholder="Min. 8 characters" value={form.password} onChange={set("password")}
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontSize: "0.9rem", color: NAVY, background: "#F8F9FC", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: NAVY, marginBottom: "0.375rem" }} htmlFor="confirm">Confirm Password</label>
                <input id="confirm" type="password" required placeholder="Repeat your password" value={form.confirm} onChange={set("confirm")}
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontSize: "0.9rem", color: NAVY, background: "#F8F9FC", outline: "none", boxSizing: "border-box" }} />
              </div>

              {error && (
                <div style={{ padding: "0.75rem 1rem", background: "#FFF1F2", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, color: "#F43F5E", fontSize: "0.8125rem" }}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.8rem", background: loading ? "#E2E6F0" : `linear-gradient(135deg, ${BLUE}, #4C1AEA)`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.25rem" }}>
                {loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>}
                {loading ? "Creating account..." : "Create Free Account"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#9BA3BF", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: BLUE, textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
          </p>
          <p style={{ textAlign: "center", marginTop: "0.75rem", color: "#9BA3BF", fontSize: "0.75rem" }}>
            By creating an account you agree to our{" "}
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
