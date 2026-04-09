import s from "./thankyou.module.css";

export default function ThankYouPage() {
  return (
    <>
      <div className={s.bg} />

      {/* Decorative floating pills */}
      <span className={s.pill}>Early Access</span>
      <span className={s.pill}>v1.0 — coming soon</span>
      <span className={s.pill}>Building…</span>
      <span className={s.pill}>Ship it 🚀</span>

      <main className={s.page}>
        {/* Icon */}
        <div className={s.iconWrap}>
          <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="44" cy="44" r="44" fill="#dbeafe"/>
            <circle cx="44" cy="44" r="32" fill="#bfdbfe"/>
            <rect x="20" y="26" width="48" height="36" rx="6" fill="#2563eb"/>
            <rect x="20" y="26" width="48" height="11" rx="6" fill="#1d4ed8"/>
            <rect x="20" y="31" width="48" height="6" fill="#1d4ed8"/>
            <circle cx="28" cy="32" r="2.2" fill="#93c5fd"/>
            <circle cx="35" cy="32" r="2.2" fill="#93c5fd"/>
            <circle cx="42" cy="32" r="2.2" fill="#93c5fd"/>
            <rect x="27" y="45" width="14" height="3" rx="1.5" fill="#93c5fd" fillOpacity=".9"/>
            <rect x="44" y="45" width="17" height="3" rx="1.5" fill="#60a5fa" fillOpacity=".6"/>
            <rect x="27" y="51" width="9"  height="3" rx="1.5" fill="#60a5fa" fillOpacity=".5"/>
            <rect x="39" y="51" width="12" height="3" rx="1.5" fill="#93c5fd" fillOpacity=".8"/>
            <rect x="54" y="51" width="5" height="3" rx="1" fill="white" fillOpacity=".9">
              <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.1s" repeatCount="indefinite"/>
            </rect>
          </svg>
        </div>

        {/* Badge */}
        <div className={s.badge}>
          <span className={s.badgeDot} />
          Early Access
        </div>

        {/* Headline */}
        <h1 className={s.h1}>
          Thank you.<br /><em>You&apos;re on the list.</em>
        </h1>

        <div className={s.divider} />

        {/* Subtitle */}
        <p className={s.sub}>
          We&apos;re still building something great. You&apos;ll be among the very first to get access the moment we launch — we&apos;ll reach out personally.
        </p>

        {/* Verify email notice */}
        <div style={{
          marginTop: "1.75rem",
          padding: "1rem 1.25rem",
          background: "#EEF2FF",
          border: "1px solid #C7D7FD",
          borderRadius: 12,
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          maxWidth: 420,
          textAlign: "left",
        }}>
          <svg style={{ flexShrink: 0, marginTop: 2 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A60E7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.875rem", color: "#0B1120" }}>Verify your email</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#4A5370", lineHeight: 1.6 }}>
              We sent a verification link to your inbox. Click it to confirm your account. Check your spam folder if you don&apos;t see it.
            </p>
          </div>
        </div>

        <p className={s.note} style={{ marginTop: "1.25rem" }}>
          Keep an eye on your inbox &nbsp;·&nbsp; <strong>No spam, ever.</strong>
        </p>
      </main>
    </>
  );
}
