"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import FAQs from "./FAQs";
import Features from "./Features";
import VideoGeneratorHero from "./VideoGeneratorHero";
import VideoGeneratorHowItWorks from "./VideoGeneratorHowItWorks";
import WhatWeCanGenerate from "./WhatWeCanGenerate";
import WhoIsItFor from "./WhoIsItFor";

export default function LyricVideoMakerClient() {
	return (
		<main className="bg-body-2">
			<Navbar />
			<VideoGeneratorHero />
			<WhatWeCanGenerate />
			<VideoGeneratorHowItWorks />
			<WhoIsItFor />
			<Features />
			<FAQs />
			<Footer />
		</main>
	);
}
