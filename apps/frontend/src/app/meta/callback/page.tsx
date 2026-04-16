"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";
const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.escalium.io/api/v1";

type AdAccount = { id: string; name: string; currency: string; status: number };
type Business = { id: string; name: string };

function MetaCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState<"exchanging" | "select" | "creating" | "done" | "error">("exchanging");
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [createPixel, setCreatePixel] = useState(true);

  const token = (session as unknown as { accessToken?: string })?.accessToken;

  useEffect(() => {
    // Wait until session is fully loaded
    if (!token) return;

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Facebook connection was cancelled.");
      setStep("error");
      return;
    }

    if (!code) {
      setError("No authorization code received.");
      setStep("error");
      return;
    }

    const redirectUri = `${window.location.origin}/meta/callback`;

    axios
      .post(
        `${API}/meta-ads/exchange-token`,
        { code, redirect_uri: redirectUri },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => {
        setAccounts(res.data.accounts ?? []);
        setBusinesses(res.data.businesses ?? []);
        if (res.data.accounts?.length === 1) {
          setSelectedAccount(res.data.accounts[0].id);
        }
        if (res.data.businesses?.length === 1) {
          setSelectedBusiness(res.data.businesses[0].id);
        }
        setStep("select");
      })
      .catch((err) => {
        setError(err?.response?.data?.message ?? "Failed to connect Facebook.");
        setStep("error");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, status]);

  async function handleSelectAccount() {
    if (!selectedAccount) return;
    setStep("creating");
    try {
      await axios.post(
        `${API}/meta-ads/select-account`,
        {
          adAccountId: selectedAccount,
          businessId: selectedBusiness || undefined,
          createPixel,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setStep("done");
      setTimeout(() => router.push("/dashboard/campaigns"), 2000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to save account.");
      setStep("error");
    }
  }

  const card = (content: React.ReactNode) => (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#F8F9FC", padding: "2rem", position: "relative",
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" fillOpacity={0.4} /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      <div style={{
        position: "relative", width: "100%", maxWidth: 480,
        background: "#fff", border: "1px solid #E2E6F0", borderRadius: 24,
        padding: "2.5rem 2rem", boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
      }}>
        {content}
      </div>
    </div>
  );

  if (step === "exchanging") return card(
    <div style={{ textAlign: "center" }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem", display: "block" }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>Connecting Facebook…</h2>
      <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>Exchanging your authorization code. This takes a moment.</p>
      <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (step === "error") return card(
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFF1F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>Connection failed</h2>
      <p style={{ color: "#4A5370", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{error}</p>
      <button onClick={() => router.push("/dashboard/settings")} style={{ padding: "0.75rem 1.5rem", background: NAVY, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
        Back to settings
      </button>
    </div>
  );

  if (step === "creating") return card(
    <div style={{ textAlign: "center" }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem", display: "block" }}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>Setting up your account…</h2>
      <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>{createPixel ? "Creating your pixel and saving your ad account." : "Saving your ad account."}</p>
      <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (step === "done") return card(
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>Facebook connected!</h2>
      <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>Redirecting you to campaigns…</p>
    </div>
  );

  // step === "select"
  return card(
    <div>
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={BLUE} xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, marginBottom: "0.25rem" }}>Facebook connected!</h2>
        <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>Now select your ad account to use for campaigns.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Ad account selection */}
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginBottom: "0.375rem" }}>
            Ad Account
          </label>
          {accounts.length === 0 ? (
            <div style={{ padding: "1rem", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, fontSize: "0.8125rem", color: "#92400E" }}>
              No ad accounts found. You need to create one at{" "}
              <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>business.facebook.com</a> first.
            </div>
          ) : (
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontSize: "0.875rem", color: NAVY, background: "#F8F9FC", outline: "none" }}
            >
              <option value="">Select an ad account…</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.currency})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Business selection */}
        {businesses.length > 0 && (
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: NAVY, marginBottom: "0.375rem" }}>
              Business Account <span style={{ color: "#9BA3BF", fontWeight: 400 }}>(optional)</span>
            </label>
            <select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              style={{ width: "100%", padding: "0.75rem 1rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontSize: "0.875rem", color: NAVY, background: "#F8F9FC", outline: "none" }}
            >
              <option value="">Select a business…</option>
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Pixel toggle */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem", background: "#F8F9FC", borderRadius: 12, border: "1px solid #E2E6F0" }}>
          <input
            type="checkbox"
            id="createPixel"
            checked={createPixel}
            onChange={(e) => setCreatePixel(e.target.checked)}
            style={{ marginTop: 2, width: 16, height: 16, accentColor: BLUE, flexShrink: 0 }}
          />
          <label htmlFor="createPixel" style={{ fontSize: "0.8125rem", color: NAVY, cursor: "pointer", lineHeight: 1.6 }}>
            <strong>Auto-create Meta Pixel</strong>
            <br />
            <span style={{ color: "#4A5370" }}>We&apos;ll create a pixel for your ad account so conversions are tracked automatically.</span>
          </label>
        </div>

        <button
          onClick={handleSelectAccount}
          disabled={!selectedAccount}
          style={{
            padding: "0.875rem", background: !selectedAccount ? "#E2E6F0" : `linear-gradient(135deg, ${BLUE}, #4C1AEA)`,
            color: !selectedAccount ? "#9BA3BF" : "#fff", border: "none", borderRadius: 10,
            fontWeight: 700, fontSize: "0.9rem", cursor: !selectedAccount ? "not-allowed" : "pointer",
          }}
        >
          Finish setup →
        </button>
      </div>
    </div>
  );
}

export default function MetaCallbackPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F8F9FC" }} />}>
      <MetaCallbackContent />
    </Suspense>
  );
}
