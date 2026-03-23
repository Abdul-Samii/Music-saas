"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function RegisterPage() {
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

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "2rem",
    }}>
      <div style={{
        position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 440 }} className="animate-fade-in">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.5rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>Escalium</span>
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Create your account</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Start growing your music for free</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="label" htmlFor="name">Full Name</label>
              <input id="name" type="text" className="input" required placeholder="John Doe" value={form.name} onChange={set("name")} />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input" required placeholder="you@email.com" value={form.email} onChange={set("email")} />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" type="password" className="input" required placeholder="Min. 8 characters" value={form.password} onChange={set("password")} />
            </div>
            <div>
              <label className="label" htmlFor="confirm">Confirm Password</label>
              <input id="confirm" type="password" className="input" required placeholder="Repeat your password" value={form.confirm} onChange={set("confirm")} />
            </div>

            {error && (
              <div style={{ padding: "0.75rem", background: "var(--danger-light)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-sm)", color: "var(--danger)", fontSize: "0.8125rem" }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: "center", marginTop: "0.5rem" }}>
              {loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              )}
              {loading ? "Creating account..." : "Create Free Account"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "0.75rem", color: "var(--text-muted)", fontSize: "0.75rem" }}>
          By creating an account you agree to our{" "}
          <a href="#" style={{ color: "var(--text-secondary)" }}>Terms</a> and{" "}
          <a href="#" style={{ color: "var(--text-secondary)" }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
