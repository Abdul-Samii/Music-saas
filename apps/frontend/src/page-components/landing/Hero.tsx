import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import { Parallax } from "react-scroll-parallax";
import EmailForm from "../EmailForm";
import GoogleButton from "../GoogleButton";
import { DotGrid } from "../pricing/DotGrid";
import BuiltFor from "./BuiltFor";

const Hero = () => {
	return (
		<section>
			<div className="py-20 min-h-screen relative overflow-hidden flex flex-col justify-center bg-primary/2">
				<div
					style={{
						background:
							"radial-gradient(circle, rgba(58,96,231,0.1) 0%, transparent 70%)",
					}}
					className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
				/>
				<DotGrid id="dots-hero" />
				<div className="mx-auto max-w-5xl px-6 text-center relative z-20 max-lg:pt-16">
					<Parallax speed={-25}>
						<div>
							<FadeInUp>
								<button className="sectionLabel mx-auto mb-4">
									89 days left from launching
								</button>
								<h1 className="text-4xl lg:text-6xl lg:leading-[1.3] tracking-wide">
									<TextAnimation text="You make the music, Escalium Scales it." />
								</h1>

								<p className="max-w-2xl mx-auto md:text-lg lg:text-xl mt-6 mb-8 text-secondary">
									Escalium is your all in one music platform, we
									integrate everything you need to create content, make
									campaigns, and achieve success.
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
			</div>
			<BuiltFor />
		</section>
	);
};

export default Hero;
