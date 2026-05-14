import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { DotGrid } from "@/page-components/pricing/DotGrid";
import { Parallax } from "react-scroll-parallax";
import SongUploader from "./SongUploader";

const VideoGeneratorHero = () => {
	return (
		<section className="relative overflow-hidden bg-white">
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
						<h1 className="text-4xl lg:text-6xl lg:leading-[1.3] tracking-wide mb-4">
							<span className="text-primary block">
								<TextAnimation text="Lyric" />{" "}
							</span>
							<TextAnimation text="Video Maker" delay={0.4} />
						</h1>

						<p className="text-gray-400 mb-10 mx-auto max-w-[560px]">
							Make a lyric video for any song and use the viral lyrics
							that you see all the time
						</p>
						<SongUploader />
					</div>
				</FadeInUp>
			</Parallax>
		</section>
	);
};

export default VideoGeneratorHero;
