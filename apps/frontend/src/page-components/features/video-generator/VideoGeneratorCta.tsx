import FadeInUp from "@/components/animations/FadeInUp";
import { DotGrid } from "@/page-components/pricing/DotGrid";
import Link from "next/link";
import { Parallax } from "react-scroll-parallax";

const VideoGeneratorCta = () => {
	return (
		<section
			className="relative px-8 py-30 text-center overflow-hidden"
			style={{
				background: `url(/img/cta-bg.jpg) no-repeat bottom center / cover`,
			}}
		>
			<div
				className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, rgba(58,96,231,0.3) 0%, transparent 70%)",
				}}
			/>
			<div
				className="absolute -bottom-20 -right-20 w-[320px] h-[320px] rounded-full pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, rgba(76,26,234,0.25) 0%, transparent 70%)",
				}}
			/>
			<div className="absolute inset-0 pointer-events-none bg-black opacity-80" />
			<DotGrid />
			<Parallax speed={-5}>
				<FadeInUp>
					<div className="relative">
						<h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-black text-white mb-4 tracking-tight">
							Ready to create your first lyric{" "}
							<span
								style={{
									background:
										"linear-gradient(135deg, #3A60E7, #4C1AEA)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
								}}
							>
								video?
							</span>
						</h2>
						<p className="text-white/55 mb-10 leading-[1.75]">
							Sign up free — no credit card required. Lyric video creator
							goes live in Weeks 4–6.
						</p>
						<Link
							href="/signup"
							className="btnShiny rounded-md px-5 md:px-10 h-12 md:h-14 inline-flex items-center justify-center md:text-lg! min-w-[170px]"
						>
							Get Early Access
						</Link>
					</div>
				</FadeInUp>
			</Parallax>
		</section>
	);
};

export default VideoGeneratorCta;
