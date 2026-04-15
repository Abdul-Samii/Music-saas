"use client";
import { useState, useEffect, FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

const COUNTRY_CODES = [
  { code: "+1",   flag: "🇺🇸", name: "US" },
  { code: "+1",   flag: "🇨🇦", name: "CA" },
  { code: "+7",   flag: "🇷🇺", name: "RU" },
  { code: "+20",  flag: "🇪🇬", name: "EG" },
  { code: "+27",  flag: "🇿🇦", name: "ZA" },
  { code: "+30",  flag: "🇬🇷", name: "GR" },
  { code: "+31",  flag: "🇳🇱", name: "NL" },
  { code: "+32",  flag: "🇧🇪", name: "BE" },
  { code: "+33",  flag: "🇫🇷", name: "FR" },
  { code: "+34",  flag: "🇪🇸", name: "ES" },
  { code: "+36",  flag: "🇭🇺", name: "HU" },
  { code: "+39",  flag: "🇮🇹", name: "IT" },
  { code: "+40",  flag: "🇷🇴", name: "RO" },
  { code: "+41",  flag: "🇨🇭", name: "CH" },
  { code: "+43",  flag: "🇦🇹", name: "AT" },
  { code: "+44",  flag: "🇬🇧", name: "GB" },
  { code: "+45",  flag: "🇩🇰", name: "DK" },
  { code: "+46",  flag: "🇸🇪", name: "SE" },
  { code: "+47",  flag: "🇳🇴", name: "NO" },
  { code: "+48",  flag: "🇵🇱", name: "PL" },
  { code: "+49",  flag: "🇩🇪", name: "DE" },
  { code: "+51",  flag: "🇵🇪", name: "PE" },
  { code: "+52",  flag: "🇲🇽", name: "MX" },
  { code: "+53",  flag: "🇨🇺", name: "CU" },
  { code: "+54",  flag: "🇦🇷", name: "AR" },
  { code: "+55",  flag: "🇧🇷", name: "BR" },
  { code: "+56",  flag: "🇨🇱", name: "CL" },
  { code: "+57",  flag: "🇨🇴", name: "CO" },
  { code: "+58",  flag: "🇻🇪", name: "VE" },
  { code: "+60",  flag: "🇲🇾", name: "MY" },
  { code: "+61",  flag: "🇦🇺", name: "AU" },
  { code: "+62",  flag: "🇮🇩", name: "ID" },
  { code: "+63",  flag: "🇵🇭", name: "PH" },
  { code: "+64",  flag: "🇳🇿", name: "NZ" },
  { code: "+65",  flag: "🇸🇬", name: "SG" },
  { code: "+66",  flag: "🇹🇭", name: "TH" },
  { code: "+81",  flag: "🇯🇵", name: "JP" },
  { code: "+82",  flag: "🇰🇷", name: "KR" },
  { code: "+84",  flag: "🇻🇳", name: "VN" },
  { code: "+86",  flag: "🇨🇳", name: "CN" },
  { code: "+90",  flag: "🇹🇷", name: "TR" },
  { code: "+91",  flag: "🇮🇳", name: "IN" },
  { code: "+92",  flag: "🇵🇰", name: "PK" },
  { code: "+93",  flag: "🇦🇫", name: "AF" },
  { code: "+94",  flag: "🇱🇰", name: "LK" },
  { code: "+95",  flag: "🇲🇲", name: "MM" },
  { code: "+98",  flag: "🇮🇷", name: "IR" },
  { code: "+212", flag: "🇲🇦", name: "MA" },
  { code: "+213", flag: "🇩🇿", name: "DZ" },
  { code: "+216", flag: "🇹🇳", name: "TN" },
  { code: "+218", flag: "🇱🇾", name: "LY" },
  { code: "+220", flag: "🇬🇲", name: "GM" },
  { code: "+221", flag: "🇸🇳", name: "SN" },
  { code: "+223", flag: "🇲🇱", name: "ML" },
  { code: "+224", flag: "🇬🇳", name: "GN" },
  { code: "+225", flag: "🇨🇮", name: "CI" },
  { code: "+226", flag: "🇧🇫", name: "BF" },
  { code: "+227", flag: "🇳🇪", name: "NE" },
  { code: "+228", flag: "🇹🇬", name: "TG" },
  { code: "+229", flag: "🇧🇯", name: "BJ" },
  { code: "+230", flag: "🇲🇺", name: "MU" },
  { code: "+231", flag: "🇱🇷", name: "LR" },
  { code: "+232", flag: "🇸🇱", name: "SL" },
  { code: "+233", flag: "🇬🇭", name: "GH" },
  { code: "+234", flag: "🇳🇬", name: "NG" },
  { code: "+235", flag: "🇹🇩", name: "TD" },
  { code: "+236", flag: "🇨🇫", name: "CF" },
  { code: "+237", flag: "🇨🇲", name: "CM" },
  { code: "+238", flag: "🇨🇻", name: "CV" },
  { code: "+240", flag: "🇬🇶", name: "GQ" },
  { code: "+241", flag: "🇬🇦", name: "GA" },
  { code: "+242", flag: "🇨🇬", name: "CG" },
  { code: "+243", flag: "🇨🇩", name: "CD" },
  { code: "+244", flag: "🇦🇴", name: "AO" },
  { code: "+245", flag: "🇬🇼", name: "GW" },
  { code: "+248", flag: "🇸🇨", name: "SC" },
  { code: "+249", flag: "🇸🇩", name: "SD" },
  { code: "+250", flag: "🇷🇼", name: "RW" },
  { code: "+251", flag: "🇪🇹", name: "ET" },
  { code: "+252", flag: "🇸🇴", name: "SO" },
  { code: "+253", flag: "🇩🇯", name: "DJ" },
  { code: "+254", flag: "🇰🇪", name: "KE" },
  { code: "+255", flag: "🇹🇿", name: "TZ" },
  { code: "+256", flag: "🇺🇬", name: "UG" },
  { code: "+257", flag: "🇧🇮", name: "BI" },
  { code: "+258", flag: "🇲🇿", name: "MZ" },
  { code: "+260", flag: "🇿🇲", name: "ZM" },
  { code: "+261", flag: "🇲🇬", name: "MG" },
  { code: "+262", flag: "🇷🇪", name: "RE" },
  { code: "+263", flag: "🇿🇼", name: "ZW" },
  { code: "+264", flag: "🇳🇦", name: "NA" },
  { code: "+265", flag: "🇲🇼", name: "MW" },
  { code: "+266", flag: "🇱🇸", name: "LS" },
  { code: "+267", flag: "🇧🇼", name: "BW" },
  { code: "+268", flag: "🇸🇿", name: "SZ" },
  { code: "+269", flag: "🇰🇲", name: "KM" },
  { code: "+290", flag: "🇸🇭", name: "SH" },
  { code: "+291", flag: "🇪🇷", name: "ER" },
  { code: "+297", flag: "🇦🇼", name: "AW" },
  { code: "+298", flag: "🇫🇴", name: "FO" },
  { code: "+299", flag: "🇬🇱", name: "GL" },
  { code: "+350", flag: "🇬🇮", name: "GI" },
  { code: "+351", flag: "🇵🇹", name: "PT" },
  { code: "+352", flag: "🇱🇺", name: "LU" },
  { code: "+353", flag: "🇮🇪", name: "IE" },
  { code: "+354", flag: "🇮🇸", name: "IS" },
  { code: "+355", flag: "🇦🇱", name: "AL" },
  { code: "+356", flag: "🇲🇹", name: "MT" },
  { code: "+357", flag: "🇨🇾", name: "CY" },
  { code: "+358", flag: "🇫🇮", name: "FI" },
  { code: "+359", flag: "🇧🇬", name: "BG" },
  { code: "+370", flag: "🇱🇹", name: "LT" },
  { code: "+371", flag: "🇱🇻", name: "LV" },
  { code: "+372", flag: "🇪🇪", name: "EE" },
  { code: "+373", flag: "🇲🇩", name: "MD" },
  { code: "+374", flag: "🇦🇲", name: "AM" },
  { code: "+375", flag: "🇧🇾", name: "BY" },
  { code: "+376", flag: "🇦🇩", name: "AD" },
  { code: "+377", flag: "🇲🇨", name: "MC" },
  { code: "+380", flag: "🇺🇦", name: "UA" },
  { code: "+381", flag: "🇷🇸", name: "RS" },
  { code: "+382", flag: "🇲🇪", name: "ME" },
  { code: "+385", flag: "🇭🇷", name: "HR" },
  { code: "+386", flag: "🇸🇮", name: "SI" },
  { code: "+387", flag: "🇧🇦", name: "BA" },
  { code: "+389", flag: "🇲🇰", name: "MK" },
  { code: "+420", flag: "🇨🇿", name: "CZ" },
  { code: "+421", flag: "🇸🇰", name: "SK" },
  { code: "+423", flag: "🇱🇮", name: "LI" },
  { code: "+500", flag: "🇫🇰", name: "FK" },
  { code: "+501", flag: "🇧🇿", name: "BZ" },
  { code: "+502", flag: "🇬🇹", name: "GT" },
  { code: "+503", flag: "🇸🇻", name: "SV" },
  { code: "+504", flag: "🇭🇳", name: "HN" },
  { code: "+505", flag: "🇳🇮", name: "NI" },
  { code: "+506", flag: "🇨🇷", name: "CR" },
  { code: "+507", flag: "🇵🇦", name: "PA" },
  { code: "+509", flag: "🇭🇹", name: "HT" },
  { code: "+590", flag: "🇬🇵", name: "GP" },
  { code: "+591", flag: "🇧🇴", name: "BO" },
  { code: "+592", flag: "🇬🇾", name: "GY" },
  { code: "+593", flag: "🇪🇨", name: "EC" },
  { code: "+595", flag: "🇵🇾", name: "PY" },
  { code: "+597", flag: "🇸🇷", name: "SR" },
  { code: "+598", flag: "🇺🇾", name: "UY" },
  { code: "+599", flag: "🇧🇶", name: "BQ" },
  { code: "+670", flag: "🇹🇱", name: "TL" },
  { code: "+673", flag: "🇧🇳", name: "BN" },
  { code: "+674", flag: "🇳🇷", name: "NR" },
  { code: "+675", flag: "🇵🇬", name: "PG" },
  { code: "+676", flag: "🇹🇴", name: "TO" },
  { code: "+677", flag: "🇸🇧", name: "SB" },
  { code: "+678", flag: "🇻🇺", name: "VU" },
  { code: "+679", flag: "🇫🇯", name: "FJ" },
  { code: "+680", flag: "🇵🇼", name: "PW" },
  { code: "+682", flag: "🇨🇰", name: "CK" },
  { code: "+685", flag: "🇼🇸", name: "WS" },
  { code: "+686", flag: "🇰🇮", name: "KI" },
  { code: "+687", flag: "🇳🇨", name: "NC" },
  { code: "+688", flag: "🇹🇻", name: "TV" },
  { code: "+689", flag: "🇵🇫", name: "PF" },
  { code: "+690", flag: "🇹🇰", name: "TK" },
  { code: "+691", flag: "🇫🇲", name: "FM" },
  { code: "+692", flag: "🇲🇭", name: "MH" },
  { code: "+850", flag: "🇰🇵", name: "KP" },
  { code: "+852", flag: "🇭🇰", name: "HK" },
  { code: "+853", flag: "🇲🇴", name: "MO" },
  { code: "+855", flag: "🇰🇭", name: "KH" },
  { code: "+856", flag: "🇱🇦", name: "LA" },
  { code: "+880", flag: "🇧🇩", name: "BD" },
  { code: "+886", flag: "🇹🇼", name: "TW" },
  { code: "+960", flag: "🇲🇻", name: "MV" },
  { code: "+961", flag: "🇱🇧", name: "LB" },
  { code: "+962", flag: "🇯🇴", name: "JO" },
  { code: "+963", flag: "🇸🇾", name: "SY" },
  { code: "+964", flag: "🇮🇶", name: "IQ" },
  { code: "+965", flag: "🇰🇼", name: "KW" },
  { code: "+966", flag: "🇸🇦", name: "SA" },
  { code: "+967", flag: "🇾🇪", name: "YE" },
  { code: "+968", flag: "🇴🇲", name: "OM" },
  { code: "+970", flag: "🇵🇸", name: "PS" },
  { code: "+971", flag: "🇦🇪", name: "AE" },
  { code: "+972", flag: "🇮🇱", name: "IL" },
  { code: "+973", flag: "🇧🇭", name: "BH" },
  { code: "+974", flag: "🇶🇦", name: "QA" },
  { code: "+975", flag: "🇧🇹", name: "BT" },
  { code: "+976", flag: "🇲🇳", name: "MN" },
  { code: "+977", flag: "🇳🇵", name: "NP" },
  { code: "+992", flag: "🇹🇯", name: "TJ" },
  { code: "+993", flag: "🇹🇲", name: "TM" },
  { code: "+994", flag: "🇦🇿", name: "AZ" },
  { code: "+995", flag: "🇬🇪", name: "GE" },
  { code: "+996", flag: "🇰🇬", name: "KG" },
  { code: "+998", flag: "🇺🇿", name: "UZ" },
];

function SignupForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", artistName: "", email: "", phone: "", password: "", confirm: "" });
  const [dialCode, setDialCode] = useState("+1");
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) setForm((f) => ({ ...f, email }));
  }, [searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setPhoneError("");

    // Phone validation (if provided)
    if (form.phone) {
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 6 || digits.length > 15) {
        setPhoneError("Enter a valid phone number.");
        return;
      }
    }

    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const fullPhone = form.phone ? `${dialCode}${form.phone.replace(/^0/, "")}` : undefined;
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        name: form.name,
        artistName: form.artistName || undefined,
        email: form.email,
        phone: fullPhone,
        password: form.password,
      });
      setEmailSent(true);
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Escalium" width={36} height={36} style={{ borderRadius: 8 }} />
              <span style={{ fontWeight: 800, fontSize: "1rem", color: NAVY }}>Escalium</span>
            </Link>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em", color: NAVY }}>Join the early access</h1>
            <p style={{ color: "#4A5370", fontSize: "0.875rem" }}>Fill in your details to secure your spot</p>
          </div>

          {emailSent ? (
            <div style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "2.5rem 2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, marginBottom: "0.5rem" }}>Check your inbox</h2>
              <p style={{ color: "#4A5370", fontSize: "0.875rem", lineHeight: 1.7 }}>
                We sent a verification link to <strong>{form.email}</strong>.<br />
                Click it to activate your account.
              </p>
              <p style={{ color: "#9BA3BF", fontSize: "0.75rem", marginTop: "1.25rem" }}>
                Didn&apos;t receive it? Check your spam folder.
              </p>
            </div>
          ) : (
          <div style={{ background: "#fff", border: "1px solid #E2E6F0", borderRadius: 20, padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle} htmlFor="name">Full Name</label>
                <input id="name" type="text" required placeholder="John Doe" value={form.name} onChange={set("name")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="artistName">Artist Name <span style={{ color: "#9BA3BF", fontWeight: 400 }}>(optional)</span></label>
                <input id="artistName" type="text" placeholder="Your stage name" value={form.artistName} onChange={set("artistName")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="email">Email</label>
                <input id="email" type="email" required placeholder="you@email.com" value={form.email} onChange={set("email")} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="phone">Phone Number <span style={{ color: "#9BA3BF", fontWeight: 400 }}>(optional)</span></label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    style={{ ...inputStyle, width: "auto", paddingLeft: "0.75rem", paddingRight: "0.5rem", flexShrink: 0, cursor: "pointer" }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code + c.name} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone" type="tel" placeholder="234 567 8900"
                    value={form.phone} onChange={set("phone")}
                    style={{ ...inputStyle, borderColor: phoneError ? "#F43F5E" : "#E2E6F0" }}
                  />
                </div>
                {phoneError && <p style={{ fontSize: "0.75rem", color: "#F43F5E", marginTop: "0.375rem" }}>{phoneError}</p>}
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
          )}

          {!emailSent && (
            <p style={{ textAlign: "center", marginTop: "0.75rem", color: "#9BA3BF", fontSize: "0.75rem" }}>
              By signing up you agree to our{" "}
              <a href="#" style={{ color: "#4A5370" }}>Terms</a> and{" "}
              <a href="#" style={{ color: "#4A5370" }}>Privacy Policy</a>.
            </p>
          )}
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
