import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

const targetAudience = [
	{
		id: 1,
		header: "Singers",
		description:
			"Independent artists, vocalists, bands, and performers who want to turn their songs into viral videos for YouTube, Instagram & TikTok.",
		img: "image of singers",
	},
	{
		id: 2,
		header: "Producers",
		description:
			"Music producers and beat makers who want videos to showcase their work, collaborations, and client projects without needing advanced editing skills.",
		img: "image of producers",
	},
	{
		id: 3,
		header: "Content Creators",
		description:
			"YouTubers, streamers, influencers, and social media creators who post music videos and want lyric visuals to get more views and followers.",
		img: "image of content creators",
	},
	{
		id: 4,
		header: "Video Editors",
		description:
			"Freelance editors, creative studios, marketing agencies, and post-production professionals who need a faster way to create lyric videos for clients.",
		img: "image of video editors",
	},
	{
		id: 5,
		header: "Record Labels",
		description:
			"Independent and major labels managing multiple artists and releases that need scalable lyric video production for marketing campaigns, social media, releases, audience promotion and test songs.",
		img: "image of record labels",
	},
];

const Features = () => {
	const [currentItem, setCurrentItem] = useState<number>(targetAudience[0].id);

	const container = {
		hidden: { opacity: 0, y: 7 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};
	return (
		<section className="relative z-10 py-20 lg:py-30">
			<div className="container md:bg-bg md:rounded-xl md:px-100 lg:px-16 md:py-10 md:shadow-[0_10px_60px_rgba(0,0,0,.05)]">
				<FadeInUp>
					<div className="text-center mb-8 md:mb-12">
						<span className="sectionLabel mb-4">Features</span>
						<h2 className="text-3xl lg:text-5xl mb-6 max-w-150 mx-auto">
							<TextAnimation text="Features you also get" />{" "}
							<span className="text-primary">
								<TextAnimation text="using Escalium" delay={0.8} />
							</span>
						</h2>
					</div>
				</FadeInUp>

				<div className="grid grid-cols-12 gap-5 md:gap-7.5">
					<div className="col-span-12 md:col-span-7 order-1 md:order-2">
						{targetAudience.find((item) => item.id === currentItem)?.img}
					</div>
					<div className="col-span-12 md:col-span-5 order-2 md:order-1 grid grid-cols-1 gap-4.5">
						{targetAudience.map((item) => {
							const isActive = item.id === currentItem;

							return (
								<div
									className={cn("flex flex-col gap-4 cursor-pointer", {
										"cursor-default pointer-events-none": isActive,
									})}
									onClick={() => {
										setCurrentItem(item.id);
									}}
									key={item.id}
								>
									<h3
										className={cn(
											"text-3xl lg:text-5xl font-bold text-muted",
											{
												"text-text-primary": isActive,
											},
										)}
									>
										{item.header}
									</h3>
									{isActive && (
										<motion.div
											initial="hidden"
											whileInView="show"
											variants={container}
											viewport={{ once: true }}
										>
											<p className="leading-[1.2]">
												{item.description}
											</p>
										</motion.div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Features;
