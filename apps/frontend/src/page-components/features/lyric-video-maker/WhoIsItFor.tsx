import FadeInUp from "@/components/animations/FadeInUp";
import SlideDown from "@/components/animations/SlideDown";
import TextAnimation from "@/components/animations/TextAnimation";
import {
	Building,
	FileStack,
	MicVocal,
	SlidersVertical,
	Zap,
} from "lucide-react";

const targetAudience = [
	{
		icon: MicVocal,
		header: "Singers",
		description:
			"Independent artists, vocalists, bands, and performers who want to turn their songs into viral videos for YouTube, Instagram & TikTok.",
	},
	{
		icon: SlidersVertical,
		header: "Producers",
		description:
			"Music producers and beat makers who want videos to showcase their work, collaborations, and client projects without needing advanced editing skills.",
	},
	{
		icon: FileStack,
		header: "Content Creators",
		description:
			"YouTubers, streamers, influencers, and social media creators who post music videos and want lyric visuals to get more views and followers.",
	},
	{
		icon: Zap,
		header: "Video Editors",
		description:
			"Freelance editors, creative studios, marketing agencies, and post-production professionals who need a faster way to create lyric videos for clients.",
	},
	{
		icon: Building,
		header: "Record Labels",
		description:
			"Independent and major labels managing multiple artists and releases that need scalable lyric video production for marketing campaigns, social media, releases, audience promotion and test songs.",
	},
];

const WhoIsItFor = () => {
	return (
		<section className="relative z-10 py-20 lg:py-[120px] bg-white">
			<div className="container">
				<FadeInUp>
					<div className="text-center mb-8 md:mb-12">
						<h2 className="text-3xl lg:text-5xl mb-6 max-w-[600px] mx-auto">
							<TextAnimation text="The Lyric Video Maker" />{" "}
							<span className="text-primary">
								<TextAnimation text="for Everyone" delay={0.8} />
							</span>
						</h2>
					</div>
				</FadeInUp>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
					{targetAudience.map((item, index) => (
						<SlideDown key={index}>
							<div className="card flex flex-col gap-4 bg-bg-card! shadow-none! duration-300 transition-all hover:-translate-y-2 h-full border! border-border-light!">
								<span className="size-12 rounded-[14px] flex-center shrink-0 bg-bg">
									<item.icon className="size-6 text-primary" />
								</span>
								<h3 className="font-bold text-base text-text-primary mb-2">
									{item.header}
								</h3>
								<p className="text-sm text-muted leading-relaxed">
									{item.description}
								</p>
							</div>
						</SlideDown>
					))}
				</div>
			</div>
		</section>
	);
};

export default WhoIsItFor;
