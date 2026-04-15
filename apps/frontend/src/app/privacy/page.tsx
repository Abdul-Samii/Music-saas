import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Escalium Privacy Policy — how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F9FC", fontFamily: "system-ui, sans-serif", color: "#0B1120" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "4rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "2rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Escalium" width={32} height={32} style={{ borderRadius: 8 }} />
            <span style={{ fontWeight: 800, color: "#0B1120", fontSize: "1rem" }}>Escalium</span>
          </a>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 900, color: "#0B1120", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Last updated: 15/04/2024</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E6F0", padding: "2.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <Section title="1. Introduction">
            <p>Welcome to Escalium ("we", "our", or "us"). We are committed to protecting your personal data and respecting your privacy.</p>
            <p>This Privacy Policy explains how we collect, use, and safeguard your information when you visit <strong>https://escalium.io</strong> and use our services.</p>
            <p>Escalium operates from Spain and complies with the General Data Protection Regulation (GDPR).</p>
          </Section>

          <Section title="2. Data Controller">
            <p><strong>Escalium</strong></p>
            <p>Email: <a href="mailto:hello@escalium.io" style={{ color: "#3A60E7" }}>hello@escalium.io</a></p>
          </Section>

          <Section title="3. Information We Collect">
            <SubSection title="3.1 Information You Provide">
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Password (encrypted)</li>
                <li>Billing information (processed securely via third-party providers)</li>
                <li>Any content, files, or data you upload or generate within the platform</li>
              </ul>
            </SubSection>
            <SubSection title="3.2 Automatically Collected Data">
              <ul>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and interactions</li>
                <li>Date and time of access</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="4. How We Use Your Information">
            <p>We use your data to:</p>
            <ul>
              <li>Provide, operate, and maintain our services</li>
              <li>Manage user accounts</li>
              <li>Process payments and subscriptions</li>
              <li>Improve our platform and user experience</li>
              <li>Communicate with you (support, updates, etc.)</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </Section>

          <Section title="5. Legal Basis for Processing (GDPR)">
            <p>We process your data based on:</p>
            <ul>
              <li><strong>Contractual necessity</strong> — to provide our service</li>
              <li><strong>Legal obligations</strong></li>
              <li><strong>Legitimate interests</strong> — improving services, security</li>
              <li><strong>Consent</strong> — for marketing, cookies, analytics where required</li>
            </ul>
          </Section>

          <Section title="6. Payments">
            <p>We use third-party payment processors such as Stripe to handle payments securely. We do not store your full payment details.</p>
          </Section>

          <Section title="7. Third-Party Services">
            <p>We use trusted third-party services, including:</p>
            <ul>
              <li>Google Analytics (analytics)</li>
              <li>Google Search Console</li>
              <li>Meta Pixel and Meta API (advertising and tracking)</li>
              <li>Stripe (payments)</li>
              <li>Email service providers (for transactional and communication emails)</li>
            </ul>
            <p>These providers may process data on our behalf under their own privacy policies.</p>
          </Section>

          <Section title="8. Data Retention">
            <p>We retain your personal data only as long as necessary to:</p>
            <ul>
              <li>Provide the service</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
            </ul>
            <p>If you delete your account, your data will be deleted or anonymized within a reasonable timeframe (typically within 30–90 days), unless legally required otherwise.</p>
          </Section>

          <Section title="9. Your Rights (GDPR)">
            <p>As a user in the European Economic Area, you have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>To exercise these rights, contact: <a href="mailto:hello@escalium.io" style={{ color: "#3A60E7" }}>hello@escalium.io</a></p>
          </Section>

          <Section title="10. Account Deletion">
            <p>You may delete your account at any time. Upon deletion, your personal data will be removed in accordance with our retention policy.</p>
          </Section>

          <Section title="11. Data Security">
            <p>We implement appropriate technical and organizational measures to protect your data, including:</p>
            <ul>
              <li>Encrypted passwords</li>
              <li>Secure infrastructure</li>
              <li>Access controls</li>
            </ul>
            <p>However, no system is completely secure.</p>
          </Section>

          <Section title="12. International Data Transfers">
            <p>Some of our service providers may be located outside the European Economic Area. In such cases, we ensure appropriate safeguards are in place (e.g., Standard Contractual Clauses).</p>
          </Section>

          <Section title="13. Cookies">
            <p>We use cookies and similar technologies for:</p>
            <ul>
              <li>Analytics</li>
              <li>Performance</li>
              <li>Marketing</li>
            </ul>
            <p>You can control cookies through your browser settings. Where required, we request your consent.</p>
          </Section>

          <Section title="14. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
          </Section>

          <Section title="15. Contact" last>
            <p>If you have any questions about this Privacy Policy, you can contact us at:</p>
            <p>
              <a href="mailto:hello@escalium.io" style={{ color: "#3A60E7", fontWeight: 600 }}>hello@escalium.io</a>
            </p>
          </Section>
        </div>

        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.8rem", marginTop: "2rem" }}>
          © {new Date().getFullYear()} Escalium. All rights reserved.
        </p>
      </div>
    </main>
  );
}

function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section style={{ marginBottom: last ? 0 : "2rem", paddingBottom: last ? 0 : "2rem", borderBottom: last ? "none" : "1px solid #F1F5F9" }}>
      <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0B1120", marginBottom: "0.875rem" }}>{title}</h2>
      <div style={{ color: "#334155", fontSize: "0.9rem", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0B1120", marginBottom: "0.5rem" }}>{title}</h3>
      <div style={{ color: "#334155", fontSize: "0.9rem", lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}
