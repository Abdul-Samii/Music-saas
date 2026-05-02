import SlideDown from "@/components/animations/SlideDown";

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

const VideoGeneratorHowItWorks = () => {
	return (
		<section className="relative z-10 -translate-y-20">
			<div className="container">
				<div className="max-w-[1000px] mx-auto">
					<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
						{STEPS.map((s) => (
							<SlideDown key={s.step}>
								<div className="card flex flex-col gap-4 bg-white! shadow-none! duration-300 transition-all hover:-translate-y-2">
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
							</SlideDown>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default VideoGeneratorHowItWorks;
