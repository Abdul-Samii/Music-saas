"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VideoGeneratorCta from "@/page-components/features/video-generator/VideoGeneratorCta";
import VideoGeneratorFeatures from "@/page-components/features/video-generator/VideoGeneratorFeatures";
import VideoGeneratorHero from "@/page-components/features/video-generator/VideoGeneratorHero";
import VideoGeneratorHowItWorks from "@/page-components/features/video-generator/VideoGeneratorHowItWorks";
import Link from "next/link";

const SUB_PAGES = [
	{
		label: "Make a Lyrics Video",
		href: "/features/video-generator/make-lyrics-video",
		desc: "Step-by-step guide to creating a lyric video with Escalium in minutes.",
	},
	{
		label: "AI Lyrics Video Generator",
		href: "/features/video-generator/ai-lyrics-video-generator",
		desc: "How our Whisper AI model auto-transcribes your track and syncs every word.",
	},
	{
		label: "Content Creation for Musicians",
		href: "/features/video-generator/content-creation-for-musicians",
		desc: "Turn your music into social-ready content — Reels, Stories, TikToks.",
	},
	{
		label: "Music Video Maker",
		href: "/features/video-generator/music-video-maker",
		desc: "Create professional-looking music videos from your audio with no editing skills.",
	},
	{
		label: "Song Video Generator",
		href: "/features/video-generator/song-video-generator",
		desc: "Generate compelling song videos paired with animated lyric overlays.",
	},
];

export default function VideoGeneratorPage() {
	return (
		<div style={{ minHeight: "100vh", background: "var(--bg)" }}>
			<Navbar />
			<VideoGeneratorHero />
			<VideoGeneratorHowItWorks />
			<VideoGeneratorFeatures />

			{/* Sub-page links */}
			<section
				style={{
					background: "var(--bg-card)",
					borderTop: "1px solid var(--border)",
					borderBottom: "1px solid var(--border)",
					padding: "5rem 2rem",
				}}
			>
				<div style={{ maxWidth: 900, margin: "0 auto" }}>
					<div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
						<h2
							style={{
								fontSize: "1.75rem",
								fontWeight: 700,
								color: "var(--text-primary)",
								letterSpacing: "-0.02em",
							}}
						>
							Learn more
						</h2>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "0.75rem",
						}}
					>
						{SUB_PAGES.map((p) => (
							<Link
								key={p.label}
								href={p.href}
								style={{ textDecoration: "none" }}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										gap: "1.5rem",
										padding: "1.125rem 1.375rem",
										background: "var(--bg)",
										border: "1px solid var(--border)",
										borderRadius: 12,
										transition: "border-color 0.15s",
									}}
									onMouseEnter={(e) =>
										((
											e.currentTarget as HTMLDivElement
										).style.borderColor = "var(--primary)")
									}
									onMouseLeave={(e) =>
										((
											e.currentTarget as HTMLDivElement
										).style.borderColor = "var(--border)")
									}
								>
									<div>
										<p
											style={{
												fontWeight: 600,
												fontSize: "0.9375rem",
												color: "var(--text-primary)",
												marginBottom: "0.25rem",
											}}
										>
											{p.label}
										</p>
										<p
											style={{
												fontSize: "0.8125rem",
												color: "var(--text-muted)",
											}}
										>
											{p.desc}
										</p>
									</div>
									<span
										style={{
											color: "var(--primary)",
											fontSize: "1.1rem",
											flexShrink: 0,
										}}
									>
										→
									</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<VideoGeneratorCta />

			<Footer />
		</div>
	);
}
