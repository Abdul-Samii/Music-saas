import TextAnimation from "@/components/animations/TextAnimation";
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
const VideoGeneratorLearnMore = () => {
	return (
		<section
			className="pb-[120px]"
			// style={{
			// 	background: "var(--bg-card)",
			// 	borderTop: "1px solid var(--border)",
			// 	borderBottom: "1px solid var(--border)",
			// 	padding: "5rem 2rem",
			// }}
		>
			<div className="container">
				<div className="text-center mb-10">
					<h2 className="text-3xl lg:text-4xl font-black mb-3">
						<TextAnimation text="Learn more" />
					</h2>
				</div>
				<div className="flex flex-col gap-3 max-w-[1100px] mx-auto">
					{SUB_PAGES.map((p) => (
						<Link key={p.label} href={p.href} className="block">
							<div className="flex items-center justify-between gap-6 p-5 border border-border hover:bg-secondary/5 duration-300 transition-all rounded-[12px]">
								<div className="flex-1">
									<h6
										style={{
											fontWeight: 600,
											fontSize: "0.9375rem",
											color: "var(--text-primary)",
											marginBottom: "0.25rem",
										}}
										className="font-semibold text-[0.9375rem] text-dark-bg mb-1"
									>
										{p.label}
									</h6>
									<p
										style={{
											fontSize: "0.8125rem",
											color: "var(--text-muted)",
										}}
									>
										{p.desc}
									</p>
								</div>
								<span className="shrink-0 text-primary text-[1.1rem]">
									→
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};

export default VideoGeneratorLearnMore;
