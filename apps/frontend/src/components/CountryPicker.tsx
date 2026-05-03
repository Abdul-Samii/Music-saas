"use client";
import { useState, useMemo } from "react";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

export const COUNTRIES: { code: string; name: string }[] = [
  { code: "AF", name: "Afghanistan" }, { code: "AL", name: "Albania" }, { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" }, { code: "AM", name: "Armenia" }, { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" }, { code: "AZ", name: "Azerbaijan" }, { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" }, { code: "BY", name: "Belarus" }, { code: "BE", name: "Belgium" },
  { code: "BO", name: "Bolivia" }, { code: "BA", name: "Bosnia and Herzegovina" }, { code: "BR", name: "Brazil" },
  { code: "BG", name: "Bulgaria" }, { code: "KH", name: "Cambodia" }, { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" }, { code: "CN", name: "China" }, { code: "CO", name: "Colombia" },
  { code: "CR", name: "Costa Rica" }, { code: "HR", name: "Croatia" }, { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" }, { code: "DK", name: "Denmark" }, { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" }, { code: "EG", name: "Egypt" }, { code: "SV", name: "El Salvador" },
  { code: "EE", name: "Estonia" }, { code: "ET", name: "Ethiopia" }, { code: "FI", name: "Finland" },
  { code: "FR", name: "France" }, { code: "GE", name: "Georgia" }, { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" }, { code: "GR", name: "Greece" }, { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" }, { code: "HK", name: "Hong Kong" }, { code: "HU", name: "Hungary" },
  { code: "IN", name: "India" }, { code: "ID", name: "Indonesia" }, { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" }, { code: "IL", name: "Israel" }, { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" }, { code: "JP", name: "Japan" }, { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" }, { code: "KE", name: "Kenya" }, { code: "KW", name: "Kuwait" },
  { code: "LV", name: "Latvia" }, { code: "LB", name: "Lebanon" }, { code: "LY", name: "Libya" },
  { code: "LT", name: "Lithuania" }, { code: "LU", name: "Luxembourg" }, { code: "MY", name: "Malaysia" },
  { code: "MX", name: "Mexico" }, { code: "MA", name: "Morocco" }, { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" }, { code: "NG", name: "Nigeria" }, { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" }, { code: "PK", name: "Pakistan" }, { code: "PA", name: "Panama" },
  { code: "PY", name: "Paraguay" }, { code: "PE", name: "Peru" }, { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" }, { code: "PT", name: "Portugal" }, { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" }, { code: "RU", name: "Russia" }, { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" }, { code: "RS", name: "Serbia" }, { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" }, { code: "SI", name: "Slovenia" }, { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" }, { code: "ES", name: "Spain" }, { code: "LK", name: "Sri Lanka" },
  { code: "SE", name: "Sweden" }, { code: "CH", name: "Switzerland" }, { code: "TW", name: "Taiwan" },
  { code: "TZ", name: "Tanzania" }, { code: "TH", name: "Thailand" }, { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" }, { code: "UA", name: "Ukraine" }, { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" }, { code: "US", name: "United States" }, { code: "UY", name: "Uruguay" },
  { code: "VE", name: "Venezuela" }, { code: "VN", name: "Vietnam" }, { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" }, { code: "ZW", name: "Zimbabwe" },
];

function flag(code: string) {
  return code.toUpperCase().split("").map((c) =>
    String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)
  ).join("");
}

interface Props {
  selected: string[];
  onChange: (codes: string[]) => void;
}

export default function CountryPicker({ selected, onChange }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() =>
    query.trim()
      ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase()))
      : COUNTRIES,
    [query]
  );

  function toggle(code: string) {
    onChange(selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code]);
  }

  function selectAll() { onChange(filtered.map((c) => c.code)); }
  function clearAll() { onChange([]); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries…"
          style={{ width: "100%", padding: "0.6rem 0.75rem 0.6rem 2rem", border: "1.5px solid #E2E6F0", borderRadius: 10, fontSize: "0.875rem", color: NAVY, background: "#F8F9FC", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* Actions row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
          {selected.length > 0 ? <><b style={{ color: BLUE }}>{selected.length}</b> selected</> : "No countries selected"}
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={selectAll} style={{ fontSize: "0.72rem", color: BLUE, background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}>Select all</button>
          {selected.length > 0 && (
            <button onClick={clearAll} style={{ fontSize: "0.72rem", color: "#94a3b8", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Clear</button>
          )}
        </div>
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {selected.map((code) => {
            const c = COUNTRIES.find((x) => x.code === code);
            return (
              <span key={code} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.5rem", background: "#EEF2FF", borderRadius: 6, fontSize: "0.75rem", color: BLUE, fontWeight: 600 }}>
                {flag(code)} {c?.name ?? code}
                <button onClick={() => toggle(code)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1, marginLeft: 2 }}>×</button>
              </span>
            );
          })}
        </div>
      )}

      {/* Country grid */}
      <div style={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px", border: "1.5px solid #E2E6F0", borderRadius: 10, padding: "0.375rem" }}>
        {filtered.map((c) => {
          const isSelected = selected.includes(c.code);
          return (
            <button
              key={c.code}
              onClick={() => toggle(c.code)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.45rem 0.625rem", borderRadius: 7, border: "none",
                background: isSelected ? "#EEF2FF" : "transparent",
                cursor: "pointer", textAlign: "left", width: "100%",
              }}
            >
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{flag(c.code)}</span>
              <span style={{ fontSize: "0.8rem", color: isSelected ? BLUE : NAVY, fontWeight: isSelected ? 600 : 400, flex: 1 }}>{c.name}</span>
              <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontFamily: "monospace" }}>{c.code}</span>
              {isSelected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p style={{ padding: "1rem", textAlign: "center", color: "#94a3b8", fontSize: "0.8rem" }}>No countries found</p>
        )}
      </div>
    </div>
  );
}
