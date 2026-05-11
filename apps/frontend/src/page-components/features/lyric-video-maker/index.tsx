"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import EscaliumMadePublic from "./EscaliumMadePublic";
import LyricVideo from "./LyricVideo";
import StartCreating from "./StartCreating";
import TryItFree from "./TryItFree";
import VideoGeneratorCta from "./VideoGeneratorCta";
import VideoGeneratorHero from "./VideoGeneratorHero";
import VideoGeneratorHowItWorks from "./VideoGeneratorHowItWorks";
import WhatWeCanGenerate from "./WhatWeCanGenerate";
import WhyWeExists from "./WhyWeExists";

export default function LyricVideoMakerClient() {
  return (
    <main className="bg-body-2">
      <Navbar />
      <VideoGeneratorHero />
      <WhatWeCanGenerate />
      <VideoGeneratorHowItWorks />
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
