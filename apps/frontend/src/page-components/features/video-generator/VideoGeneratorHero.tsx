import FadeInUp from "@/components/animations/FadeInUp";
import { DotGrid } from "@/page-components/pricing/DotGrid";
import Link from "next/link";
import { Parallax } from "react-scroll-parallax";

const VideoGeneratorHero = () => {
	return (
		<section
			className="relative overflow-hidden pb-24"
			style={{
				background: "url(/img/hero-bg-2.jpg) no-repeat center center/cover",
			}}
		>
			<div className="absolute pointer-events-none bg-black inset-0 opacity-50" />
			<div
				style={{
					background:
						"radial-gradient(circle, rgba(58,96,231,0.1) 0%, transparent 70%)",
				}}
				className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
			/>
			<DotGrid id="dots-pr1" />
			<Parallax speed={-10}>
				<FadeInUp>
					<div className="pt-32 pb-28 px-2 text-center relative">
						<div className="sectionLabel mb-4">
							AI Lyric Video Generator
						</div>
						<h1 className="text-white text-[clamp(2rem,5vw,3rem)] leading-[1.15] mb-4 tracking-tight font-black">
							AI Lyric Video Generator
							<br />
							<span className="gradient-text">
								scroll-stopping lyric videos.
							</span>
						</h1>

						{/* <h1 className="text-white text-[clamp(2rem,5vw,3rem)] leading-[1.15] mb-4 tracking-tight font-black">
							Turn your music into
							<br />
							<span className="gradient-text">
								scroll-stopping lyric videos.
							</span>
						</h1> */}

						<p className="text-gray-400 mb-10 mx-auto max-w-[560px]">
							Upload your track, let Whisper AI transcribe it, pick a
							visual style, and export a 1080p lyric video — ready to use
							as a Meta Ad creative in minutes.
						</p>
						<div
							style={{
								display: "flex",
								gap: "1rem",
								justifyContent: "center",
								flexWrap: "wrap",
							}}
						>
							<Link
								href="/signup"
								className="btnShiny rounded-md px-5 md:px-10 h-12 md:h-14 inline-flex items-center justify-center md:text-lg! min-w-[170px]"
							>
								Try It For Free
							</Link>
							{/* <Link href="/pricing" className="btn btn-secondary btn-lg">
								View Pricing
							</Link> */}
						</div>
					</div>
				</FadeInUp>
			</Parallax>
		</section>
	);
};

export default VideoGeneratorHero;
