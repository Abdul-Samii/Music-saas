import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import { Parallax, ParallaxBanner } from "react-scroll-parallax";
import EmailForm from "../EmailForm";
import GoogleButton from "../GoogleButton";

const Hero = () => {
	return (
		<section
			className="py-20 min-h-screen relative before:absolute before:inset-0 before:bg-[#111111]/60 overflow-hidden flex flex-col justify-center"
			style={{
				background: `url(/img/hero-bg.jpg) no-repeat center center / cover`,
			}}
		>
			<ParallaxBanner
				className="absolute! inset-0"
				layers={[
					{
						image: "/img/hero-bg.jpg",
						speed: 0,
						className: "w-full h-full object-cover",
					},
				]}
			/>
			<div className="mx-auto max-w-5xl px-6 text-center relative z-20 text-white">
				<Parallax speed={-25}>
					<div>
						<FadeInUp>
							<div className="sectionLabel mb-4">
								<div>Now accepting early access signups</div>
							</div>
							<h1 className="text-white text-4xl lg:text-6xl lg:leading-[1.3] tracking-wide">
								<TextAnimation text="Promote your music. Scale your audience." />
							</h1>

							<p className="text-white/80 max-w-2xl mx-auto md:text-lg lg:text-xl mt-6 mb-8">
								Create converting ads from your tracks and launch Meta
								campaigns — all in one place. Built for artists,
								producers and labels.
							</p>
							<GoogleButton />
							<span
								className={cn(
									"or w-[220px] before:opacity-40 after:opacity-40 my-7!",
								)}
							>
								<span>or</span>
							</span>
							<EmailForm />
						</FadeInUp>
					</div>
				</Parallax>
			</div>
		</section>
	);
};

export default Hero;
