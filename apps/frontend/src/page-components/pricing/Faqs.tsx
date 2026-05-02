import FadeInUp from "@/components/animations/FadeInUp";
import { useState } from "react";
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
const Faqs = () => {
	const [openFaq, setOpenFaq] = useState<number | null>(null);
	return (
		<section
			style={{
				position: "relative",
				maxWidth: 720,
				margin: "0 auto",
				padding: "0 2rem 6rem",
				overflow: "hidden",
			}}
		>
			<FadeInUp>
				<div style={{ textAlign: "center", marginBottom: "3rem" }}>
					<p
						style={{
							fontSize: "0.8rem",
							fontWeight: 700,
							textTransform: "uppercase",
							letterSpacing: "0.1em",
							marginBottom: "0.75rem",
						}}
						className="text-blue"
					>
						FAQ
					</p>
					<h2
						style={{
							fontSize: "clamp(1.5rem,3vw,2rem)",
							fontWeight: 900,
							letterSpacing: "-0.03em",
						}}
						className="text-navy"
					>
						Frequently Asked{" "}
						<span
							style={{
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}
							className="bg-linear-to-r from-blue to-primary"
						>
							Questions
						</span>
					</h2>
				</div>
			</FadeInUp>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "0.625rem",
				}}
			>
				{FAQ.map((item, i) => (
					<FadeInUp key={i}>
						<div className="overflow-hidden bg-white rounded-[14px] border border-border">
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
									}}
									className="text-navy"
								>
									{item.q}
								</span>
								<span
									style={{
										fontSize: "1.25rem",
										flexShrink: 0,
										fontWeight: 300,
										transform:
											openFaq === i ? "rotate(45deg)" : "none",
										transition: "transform 0.2s",
										display: "inline-block",
									}}
									className="text-blue"
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
					</FadeInUp>
				))}
			</div>
		</section>
	);
};

export default Faqs;
