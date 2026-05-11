"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import EscaliumMadePublic from "@/page-components/features/ai-lyrics-video-generator/EscaliumMadePublic";
import LyricVideo from "@/page-components/features/ai-lyrics-video-generator/LyricVideo";
import StartCreating from "@/page-components/features/ai-lyrics-video-generator/StartCreating";
import TryItFree from "@/page-components/features/ai-lyrics-video-generator/TryItFree";
import VideoGeneratorCta from "@/page-components/features/ai-lyrics-video-generator/VideoGeneratorCta";
import VideoGeneratorHero from "@/page-components/features/ai-lyrics-video-generator/VideoGeneratorHero";
import VideoGeneratorHowItWorks from "@/page-components/features/ai-lyrics-video-generator/VideoGeneratorHowItWorks";
import WhatWeCanGenerate from "@/page-components/features/ai-lyrics-video-generator/WhatWeCanGenerate";
import WhyWeExists from "@/page-components/features/ai-lyrics-video-generator/WhyWeExists";

export default function AiLyricsVideoGeneratorClient() {
  return (
    <main className="bg-body-2">
      <Navbar />
      <VideoGeneratorHero />
      <VideoGeneratorHowItWorks />
      <WhatWeCanGenerate />
      <WhyWeExists />
      <StartCreating />
      <LyricVideo />
      <EscaliumMadePublic />
      <TryItFree />
      <VideoGeneratorCta />
      <Footer />
    </main>
  );
}
