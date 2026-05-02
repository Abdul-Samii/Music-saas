import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import { Parallax } from "react-scroll-parallax";
import EmailForm from "../EmailForm";
import GoogleButton from "../GoogleButton";
import { DotGrid } from "../pricing/DotGrid";

const Hero = () => {
	return (
		<section className="py-20 min-h-screen relative overflow-hidden flex flex-col justify-center bg-primary/2">
			<DotGrid className="opacity-100" id="dots-hero" />
			<div className="mx-auto max-w-5xl px-6 text-center relative z-20 max-lg:pt-16">
				<Parallax speed={-25}>
					<div>
						<FadeInUp>
							<div className="sectionLabel mb-4">
								<div>Now accepting early access signups</div>
							</div>
							<h1 className="text-4xl lg:text-6xl lg:leading-[1.3] tracking-wide">
								<TextAnimation text="Promote your music. Scale your audience." />
							</h1>

							<p className="max-w-2xl mx-auto md:text-lg lg:text-xl mt-6 mb-8 text-secondary">
								Create converting ads from your tracks and launch Meta
								campaigns — all in one place. Built for artists,
								producers and labels.
							</p>
							<GoogleButton />
							<span className={cn("or w-[220px] my-7!")}>
								<span>or</span>
							</span>
							<EmailForm
								{...{
									inputClass: "border-gray-300 bg-white",
								}}
							/>
						</FadeInUp>
					</div>
				</Parallax>
			</div>
		</section>
	);
};

export default Hero;
