import FadeInUp from "@/components/animations/FadeInUp";
import { Parallax } from "react-scroll-parallax";

const VideoGeneratorCta = () => {
	return (
		<section className="relative px-8 py-30 text-center overflow-hidden bg-primary/2">
			<Parallax speed={-5}>
				<FadeInUp>
					<div className="max-w-[560px] mx-auto relative">
						<h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] mb-8 tracking-tight">
							Let the world see what your music is made of.
						</h2>
						<button className="btnShiny rounded-md px-5 md:px-10 h-12 md:h-14 inline-flex items-center justify-center md:text-lg! min-w-[170px]">
							<span>Create Lyric Video Now</span>
						</button>
					</div>
				</FadeInUp>
			</Parallax>
		</section>
	);
};

export default VideoGeneratorCta;
