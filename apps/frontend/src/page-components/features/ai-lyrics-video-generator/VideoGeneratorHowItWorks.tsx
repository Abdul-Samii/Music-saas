import FadeInUp from "@/components/animations/FadeInUp";
import SlideDown from "@/components/animations/SlideDown";
import TextAnimation from "@/components/animations/TextAnimation";

const STEPS = [
	{
		step: "01",
		title: "Upload your song",
		desc: "Upload your music to escalium.",
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
		// color: "#4C1AEA",
		title: "Select from our library or Upload your own clips",
		desc: "We have a made a full list library where you can choose from a variety of organized clips to make your video stand out more and attract more streams for your song or saves for your playlsit",
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
		// color: "#12B76A",
		title: "Adjust",
		desc: "Adjust the specific part of the clip and the part of the song you want to promote",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="white"
				className="size-5.5"
			>
				<path d="M6.111 11.89A5.5 5.5 0 1 1 15.501 8 .75.75 0 0 0 17 8a7 7 0 1 0-11.95 4.95.75.75 0 0 0 1.06-1.06Z" />
				<path d="M8.232 6.232a2.5 2.5 0 0 0 0 3.536.75.75 0 1 1-1.06 1.06A4 4 0 1 1 14 8a.75.75 0 0 1-1.5 0 2.5 2.5 0 0 0-4.268-1.768Z" />
				<path d="M10.766 7.51a.75.75 0 0 0-1.37.365l-.492 6.861a.75.75 0 0 0 1.204.65l1.043-.799.985 3.678a.75.75 0 0 0 1.45-.388l-.978-3.646 1.292.204a.75.75 0 0 0 .74-1.16l-3.874-5.764Z" />
			</svg>
		),
	},
	{
		step: "04",
		// color: "#12B76A",
		title: "Generate Lyrics",
		desc: "Click “generate lyrics” and choose from a variety of lyrics design we have designed to make your video go viral.",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="white"
				className="size-5.5"
			>
				<path
					fillRule="evenodd"
					d="M17.721 1.599a.75.75 0 0 1 .279.583v11.29a2.25 2.25 0 0 1-1.774 2.2l-2.041.44a2.216 2.216 0 0 1-.938-4.332l2.662-.577a.75.75 0 0 0 .591-.733V6.112l-8 1.73v7.684a2.25 2.25 0 0 1-1.774 2.2l-2.042.44a2.216 2.216 0 1 1-.935-4.331l2.659-.573A.75.75 0 0 0 7 12.529V4.236a.75.75 0 0 1 .591-.733l9.5-2.054a.75.75 0 0 1 .63.15Z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		step: "05",
		// color: "#12B76A",
		title: "Export Video & Upload to Campaign",
		desc: "Export your video by clicking “export” and click “Create campaign” with that ad if you want to start promoting your song with the videos you’ve made!",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="white"
				className="size-5.5"
			>
				<path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
				<path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
			</svg>
		),
	},
];

const VideoGeneratorHowItWorks = () => {
	return (
		<section className="relative z-10 py-20 lg:py-[120px] bg-white">
			<div className="container">
				<FadeInUp>
					<div className="text-center mb-8 md:mb-12">
						<h2 className="text-3xl lg:text-5xl mb-6 max-w-[600px] mx-auto">
							<TextAnimation text="How to create lyric videos with Escalium" />
						</h2>
					</div>
				</FadeInUp>
				<div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
						{STEPS.map((s) => (
							<SlideDown key={s.step}>
								<div className="card flex flex-col gap-4 bg-white! shadow-none! duration-300 transition-all hover:-translate-y-2 h-full">
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: "0.875rem",
										}}
									>
										<div className="w-12 h-12 rounded-[14px] bg-primary flex-center shrink-0">
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
