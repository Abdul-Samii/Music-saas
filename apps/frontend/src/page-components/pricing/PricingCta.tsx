import FadeInUp from "@/components/animations/FadeInUp";
import Link from "next/link";
import { Parallax } from "react-scroll-parallax";

const PricingCta = () => {
	return (
		<section className="relative px-8 py-30 text-center overflow-hidden bg-primary/2">
			<Parallax speed={-5}>
				<FadeInUp>
					<div className="max-w-[560px] mx-auto relative">
						<h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] mb-4 tracking-tight">
							Ready to grow your{" "}
							<span
								style={{
									background:
										"linear-gradient(135deg, #3A60E7, #4C1AEA)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
								}}
							>
								streams?
							</span>
						</h2>
						<p className="text-secondary mb-10 leading-[1.75]">
							Join 500+ independent artists scaling with data-driven
							music marketing.
						</p>
						<Link
							href="/signup"
							className="btnShiny rounded-md px-5 md:px-10 h-12 md:h-14 inline-flex items-center justify-center md:text-lg! min-w-[170px]"
						>
							Create Your Free Account
						</Link>
					</div>
				</FadeInUp>
			</Parallax>
		</section>
	);
};

export default PricingCta;
