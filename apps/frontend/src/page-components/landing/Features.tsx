import FadeIn from "@/components/animations/FadeIn";
import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import { Parallax } from "react-scroll-parallax";
const features = [
	{
		d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
		title: "Ads Generator",
		desc: "Upload any audio and our engine auto-syncs your lyrics to converting visual clips.",
		className: "lg:col-span-3",
	},
	{
		d: "M2 2h20v20H2zM7 2v20M17 2v20M2 12h20",
		title: "Video Library",
		desc: "Hundreds of licensed clips curated for music promotion — not generic stock footage.",
		className: "lg:col-span-5",
	},
	{
		d: "M3 11l19-9-9 19-2-8-8-2z",
		title: "Meta Ads integration",
		desc: "Launch Facebook & Instagram campaigns from Escalium. No ad manager knowledge needed.",
		className: "lg:col-span-4",
	},
	{
		d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
		title: "Launch",
		desc: "From upload to live campaign in under 5 minutes. Speed is your advantage in music.",
		className: "lg:col-span-4",
	},
	{
		d: "M18 20V10M12 20V4M6 20v-6",
		title: "Performance tracking",
		desc: "Stream growth, click rates, cost per result — all in one clean dashboard.",
		className: "lg:col-span-5",
	},
	{
		d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
		title: "Free to start",
		desc: "Create your first ads free. No credit card. Upgrade only when you're ready to scale.",
		className: "lg:col-span-3",
	},
];

const Features = () => {
	return (
		<section className="py-[120px] overflow-hidden bg-bg-card">
			<div className="container">
				<FadeInUp>
					<div className="mb-8 md:mb-12">
						<span className="sectionLabel mb-3">Features</span>
						<h2 className="text-3xl lg:text-5xl mb-6 max-w-[720px]">
							<TextAnimation text="Everything you need to promote smarter." />
						</h2>
						<p className="md:text-lg">
							We built the tools music marketing agencies charge
							thousands for — and made them simple.
						</p>
					</div>
				</FadeInUp>
				<FadeInUp>
					<Parallax speed={-5}>
						<FadeIn>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-5">
								{features.map((feature, i) => (
									<div
										className={cn(
											"group relative sm:px-4 rounded-2xl bg-white shadow-card p-6 xl:p-10",
											feature.className,
											{
												"bg-dark-bg text-white": i == 4,
												"bg-primary text-white": i == 2,
											},
										)}
										key={i}
									>
										<div>
											<div
												className={cn("text-primary mb-7 xl:mb-8", {
													"text-white": i == 4 || i == 2,
												})}
											>
												<svg
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1.75"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d={feature.d} />
												</svg>
											</div>
											<h3 className="font-semibold mb-2 xl:text-xl xl:mb-3">
												{feature.title}
											</h3>
											<p className="text-sm">{feature.desc}</p>
										</div>
									</div>
								))}
							</div>
						</FadeIn>
					</Parallax>
				</FadeInUp>
			</div>
		</section>
	);
};

export default Features;
