"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import EscaliumMadePublic from "@/page-components/features/video-generator/EscaliumMadePublic";
import LyricVideo from "@/page-components/features/video-generator/LyricVideo";
import TryItFree from "@/page-components/features/video-generator/TryItFree";
import VideoGeneratorCta from "@/page-components/features/video-generator/VideoGeneratorCta";
import VideoGeneratorHero from "@/page-components/features/video-generator/VideoGeneratorHero";
import VideoGeneratorHowItWorks from "@/page-components/features/video-generator/VideoGeneratorHowItWorks";
import WhatWeCanGenerate from "@/page-components/features/video-generator/WhatWeCanGenerate";
import WhyWeExists from "@/page-components/features/video-generator/WhyWeExists";

export default function VideoGeneratorPage() {
	return (
		<main className="bg-body-2">
			<Navbar />
			<VideoGeneratorHero />
			<VideoGeneratorHowItWorks />
			<WhatWeCanGenerate />
			<WhyWeExists />
			{/*  */}
			<section className="py-20">
				<div className="container">
					<div className="text-center">
						<h2 className="text-3xl lg:text-5xl mb-10 max-w-[600px] mx-auto">
							Start Creating Now
						</h2>
						<button className="btnShiny rounded-md px-5 md:px-10 h-12 md:h-14 inline-flex items-center justify-center md:text-lg! min-w-[170px]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								className="size-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
								/>
							</svg>
							<span>Upload your song</span>
						</button>
					</div>
				</div>
			</section>

			<LyricVideo />
			<EscaliumMadePublic />
			<TryItFree />
			{/* <VideoGeneratorFeatures /> */}
			{/* <VideoGeneratorLearnMore /> */}
			<VideoGeneratorCta />
			<Footer />
		</main>
	);
}
