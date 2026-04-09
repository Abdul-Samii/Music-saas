"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in URL.");
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/thankyou"), 2000);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message;
        setStatus("error");
        setMessage(msg || "Invalid or expired verification link.");
      });
  }, [searchParams]);

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
      {/* Dot grid background */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dots-verify" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" fillOpacity={0.4} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots-verify)" />
      </svg>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          border: "1px solid #E2E6F0",
          borderRadius: 24,
          padding: "2.5rem 2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#EEF2FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={BLUE}
                strokeWidth="2"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>
              Verifying your email…
            </h1>
            <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>
              Email verified!
            </h1>
            <p style={{ color: "#4A5370", fontSize: "0.875rem", marginBottom: "2rem" }}>
              Your email address has been verified successfully. You&apos;re all set.
            </p>
            <Link
              href="/landing"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.75rem",
                background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`,
                color: "#fff",
                textDecoration: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              Go to homepage →
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#FFF1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>
              Verification failed
            </h1>
            <p style={{ color: "#4A5370", fontSize: "0.875rem", marginBottom: "2rem" }}>
              {message}
            </p>
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
          </>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F8F9FC" }} />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
