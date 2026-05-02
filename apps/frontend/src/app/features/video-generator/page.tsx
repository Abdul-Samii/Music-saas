"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import VideoGeneratorCta from "@/page-components/features/video-generator/VideoGeneratorCta";
import VideoGeneratorFeatures from "@/page-components/features/video-generator/VideoGeneratorFeatures";
import VideoGeneratorHero from "@/page-components/features/video-generator/VideoGeneratorHero";
import VideoGeneratorHowItWorks from "@/page-components/features/video-generator/VideoGeneratorHowItWorks";
import VideoGeneratorLearnMore from "@/page-components/features/video-generator/VideoGeneratorLearnMore";

export default function VideoGeneratorPage() {
	return (
		<div style={{ minHeight: "100vh", background: "var(--bg)" }}>
			<Navbar />
			<VideoGeneratorHero />
			<VideoGeneratorHowItWorks />
			<VideoGeneratorFeatures />
			<VideoGeneratorLearnMore />
			<VideoGeneratorCta />
			<Footer />
		</div>
	);
}
