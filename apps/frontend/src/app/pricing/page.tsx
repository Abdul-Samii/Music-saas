"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PricingHero from "@/page-components/pricing/PricingHero";
import Link from "next/link";
import { useState } from "react";

const BLUE = "#3A60E7";
const NAVY = "#0B1120";

const FAQ = [
	{
		q: "Is there a free trial?",
		a: "Yes — the Pro plan comes with a 14-day free trial. No credit card required to start.",
	},
	{
		q: "Can I cancel anytime?",
		a: "Absolutely. Cancel from your settings at any time. You keep access until the end of the billing period.",
	},
	{
		q: "How does the lyric video creator work?",
		a: "Upload your MP3 or WAV, pick a background style, and our AI transcribes and syncs lyrics. Export as 1080p MP4.",
	},
	{
		q: "Do I need a Meta Ads account?",
		a: "Yes, to launch live campaigns. We walk you through connecting it in under 2 minutes.",
	},
	{
		q: "What's Cost per Stream (CPS)?",
		a: "CPS = total ad spend ÷ new streams gained. It tells you exactly what each new stream cost you in ad dollars.",
	},
	{
		q: "Is Spotify connection required?",
		a: "Only to pull stream data automatically. Without it you can still use the campaign builder and lyric video creator.",
	},
];

export default function PricingPage() {
	const [openFaq, setOpenFaq] = useState<number | null>(null);

	return (
		<div style={{ minHeight: "100vh", background: "#F9FAFB", color: NAVY }}>
			<Navbar />
			<PricingHero />

			{/* FAQ */}
			<section
				style={{
					position: "relative",
					maxWidth: 720,
					margin: "0 auto",
					padding: "0 2rem 6rem",
					overflow: "hidden",
				}}
			>
				<div style={{ textAlign: "center", marginBottom: "3rem" }}>
					<p
						style={{
							fontSize: "0.8rem",
							fontWeight: 700,
							color: BLUE,
							textTransform: "uppercase",
							letterSpacing: "0.1em",
							marginBottom: "0.75rem",
						}}
					>
						FAQ
					</p>
					<h2
						style={{
							fontSize: "clamp(1.5rem,3vw,2rem)",
							fontWeight: 900,
							color: NAVY,
							letterSpacing: "-0.03em",
						}}
					>
						Frequently Asked{" "}
						<span
							style={{
								background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`,
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}
						>
							Questions
						</span>
					</h2>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "0.625rem",
					}}
				>
					{FAQ.map((item, i) => (
						<div
							key={i}
							style={{
								background: "#fff",
								border: "1px solid #E2E6F0",
								borderRadius: 14,
								overflow: "hidden",
							}}
						>
							<button
								onClick={() => setOpenFaq(openFaq === i ? null : i)}
								style={{
									width: "100%",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									padding: "1.125rem 1.25rem",
									background: "none",
									border: "none",
									cursor: "pointer",
									textAlign: "left",
									gap: "1rem",
								}}
							>
								<span
									style={{
										fontWeight: 600,
										fontSize: "0.9rem",
										color: NAVY,
									}}
								>
									{item.q}
								</span>
								<span
									style={{
										color: BLUE,
										fontSize: "1.25rem",
										flexShrink: 0,
										fontWeight: 300,
										transform:
											openFaq === i ? "rotate(45deg)" : "none",
										transition: "transform 0.2s",
										display: "inline-block",
									}}
								>
									+
								</span>
							</button>
							{openFaq === i && (
								<div style={{ padding: "0 1.25rem 1.125rem" }}>
									<p
										style={{
											fontSize: "0.875rem",
											color: "#4A5370",
											lineHeight: 1.75,
										}}
									>
										{item.a}
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<section
				style={{
					position: "relative",
					padding: "7rem 2rem",
					background: NAVY,
					textAlign: "center",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: -80,
						left: -80,
						width: 320,
						height: 320,
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(58,96,231,0.3) 0%, transparent 70%)",
						pointerEvents: "none",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: -80,
						right: -80,
						width: 320,
						height: 320,
						borderRadius: "50%",
						background:
							"radial-gradient(circle, rgba(76,26,234,0.25) 0%, transparent 70%)",
						pointerEvents: "none",
					}}
				/>
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage:
							"radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
						pointerEvents: "none",
					}}
				/>
				<div
					style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}
				>
					<h2
						style={{
							fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
							fontWeight: 900,
							color: "#fff",
							marginBottom: "1rem",
							letterSpacing: "-0.03em",
						}}
					>
						Ready to grow your{" "}
						<span
							style={{
								background: `linear-gradient(135deg, ${BLUE}, #4C1AEA)`,
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}
						>
							streams?
						</span>
					</h2>
					<p
						style={{
							color: "rgba(255,255,255,0.55)",
							marginBottom: "2.5rem",
							lineHeight: 1.75,
						}}
					>
						Join 500+ independent artists scaling with data-driven music
						marketing.
					</p>
					<Link
						href="/signup"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "0.5rem",
							background: "#fff",
							color: NAVY,
							borderRadius: 99,
							padding: "0.875rem 2rem",
							fontWeight: 800,
							fontSize: "0.95rem",
							textDecoration: "none",
						}}
					>
						Create Your Free Account{" "}
						<span
							style={{
								width: 22,
								height: 22,
								borderRadius: "50%",
								background: NAVY,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							+
						</span>
					</Link>
				</div>
			</section>
			<Footer />
		</div>
	);
}
