"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VideoGeneratorCta from "@/page-components/features/video-generator/VideoGeneratorCta";
import VideoGeneratorHero from "@/page-components/features/video-generator/VideoGeneratorHero";
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

const STEPS = [
	{
		step: "01",
		color: "#3A60E7",
		title: "Upload Your Track",
		desc: "Drop in your MP3 or WAV. Whisper AI transcribes your lyrics automatically — no manual input needed.",
		icon: (
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="17 8 12 3 7 8" />
				<line x1="12" y1="3" x2="12" y2="15" />
			</svg>
		),
	},
	{
		step: "02",
		color: "#4C1AEA",
		title: "Pick a Visual Style",
		desc: "Choose from animated backgrounds — abstract, concert footage, nature — and select your lyric font and colour.",
		icon: (
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polygon points="23 7 16 12 23 17 23 7" />
				<rect x="1" y="5" width="15" height="14" rx="2" />
			</svg>
		),
	},
	{
		step: "03",
		color: "#12B76A",
		title: "Export & Launch",
		desc: "Render your lyric video in 1080p via FFmpeg. Download it or push it directly into a Meta Ads campaign.",
		icon: (
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
			</svg>
		),
	},
];

export default function VideoGeneratorPage() {
	return (
		<div style={{ minHeight: "100vh", background: "var(--bg)" }}>
			<Navbar />
			<VideoGeneratorHero />
			{/* Hero */}

			{/* How it works */}
			<section
				style={{
					background: "var(--bg-card)",
					borderTop: "1px solid var(--border)",
					borderBottom: "1px solid var(--border)",
					padding: "5rem 2rem",
				}}
			>
				<div style={{ maxWidth: 1000, margin: "0 auto" }}>
					<div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
						<p
							style={{
								fontSize: "0.75rem",
								fontWeight: 700,
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								color: "var(--primary)",
								marginBottom: "0.75rem",
							}}
						>
							How it works
						</p>
						<h2
							style={{
								fontSize: "1.875rem",
								fontWeight: 700,
								color: "var(--text-primary)",
								letterSpacing: "-0.02em",
							}}
						>
							Three steps to a pro lyric video
						</h2>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(3,1fr)",
							gap: "1.5rem",
						}}
						className="steps-3col"
					>
						{STEPS.map((s) => (
							<div
								key={s.step}
								className="card"
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "1rem",
								}}
							>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.875rem",
									}}
								>
									<div
										style={{
											width: 48,
											height: 48,
											borderRadius: 14,
											background: s.color,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexShrink: 0,
										}}
									>
										{s.icon}
									</div>
									<span
										style={{
											fontSize: "0.68rem",
											fontWeight: 700,
											color: "var(--text-muted)",
											letterSpacing: "0.08em",
											textTransform: "uppercase",
										}}
									>
										Step {s.step}
									</span>
								</div>
								<div>
									<h3
										style={{
											fontWeight: 700,
											fontSize: "1rem",
											color: "var(--text-primary)",
											marginBottom: "0.5rem",
										}}
									>
										{s.title}
									</h3>
									<p
										style={{
											fontSize: "0.8125rem",
											color: "var(--text-muted)",
											lineHeight: 1.7,
										}}
									>
										{s.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<section
				style={{ maxWidth: 1060, margin: "0 auto", padding: "5rem 2rem" }}
			>
				<div style={{ textAlign: "center", marginBottom: "3rem" }}>
					<h2
						style={{
							fontSize: "1.875rem",
							fontWeight: 700,
							color: "var(--text-primary)",
							letterSpacing: "-0.02em",
							marginBottom: "0.75rem",
						}}
					>
						What&apos;s included
					</h2>
					<p style={{ color: "var(--text-secondary)" }}>
						Everything you need to create and deploy lyric video ads.
					</p>
				</div>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(2,1fr)",
						gap: "1rem",
					}}
					className="features-2col"
				>
					{[
						{
							title: "AI Transcription",
							desc: "Whisper AI syncs lyrics to exact timestamps — accurate even for fast rap verses.",
							color: "#3A60E7",
						},
						{
							title: "Animated Lyrics",
							desc: "Word-by-word or line-by-line karaoke-style animations. Multiple font and colour options.",
							color: "#4C1AEA",
						},
						{
							title: "Background Library",
							desc: "Choose from abstract loops, concert footage, gradient animations, and more.",
							color: "#1DB954",
						},
						{
							title: "1080p MP4 Export",
							desc: "Broadcast-quality renders via FFmpeg. Download instantly or push to Meta Ads.",
							color: "#F59E0B",
						},
						{
							title: "Direct Meta Ads Push",
							desc: "Export your creative straight into your Escalium campaign — no file transfer needed.",
							color: "#3A60E7",
						},
						{
							title: "Multiple Formats",
							desc: "Export for Instagram Reels (9:16), Facebook Feed (1:1), or YouTube (16:9).",
							color: "#4C1AEA",
						},
					].map((f) => (
						<div
							key={f.title}
							style={{
								display: "flex",
								alignItems: "flex-start",
								gap: "1rem",
								padding: "1.125rem 1.25rem",
								background: "var(--bg-card)",
								border: "1px solid var(--border)",
								borderRadius: 14,
							}}
						>
							<div
								style={{
									width: 36,
									height: 36,
									borderRadius: 9,
									background: f.color + "18",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexShrink: 0,
								}}
							>
								<span
									style={{
										color: f.color,
										fontWeight: 700,
										fontSize: "1rem",
									}}
								>
									✦
								</span>
							</div>
							<div>
								<p
									style={{
										fontWeight: 700,
										fontSize: "0.9rem",
										color: "var(--text-primary)",
										marginBottom: "0.35rem",
									}}
								>
									{f.title}
								</p>
								<p
									style={{
										fontSize: "0.8rem",
										color: "var(--text-muted)",
										lineHeight: 1.6,
									}}
								>
									{f.desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

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
