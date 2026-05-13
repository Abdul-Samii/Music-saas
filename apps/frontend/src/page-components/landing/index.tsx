"use client";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import CTA from "./CTA";
import LandingFooter from "./LandingFooter";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { TrackingWrapper } from "./tracking";

const Features = dynamic(() => import("./Features"), {
  ssr: false,
  loading: () => <section className="py-20 lg:py-[120px] bg-bg-card" />,
});
const DesignedForYou = dynamic(() => import("./DesignedForYou"), {
  ssr: false,
  loading: () => <section className="py-20 lg:py-[120px]" />,
});
const OurStoryAndResults = dynamic(() => import("./OurStoryAndResults"), {
  ssr: false,
  loading: () => <section className="py-20 lg:py-[120px]" />,
});
const BestAlternatives = dynamic(() => import("./BestAlternatives"), {
  ssr: false,
  loading: () => <section className="py-20 lg:py-[120px]" />,
});
const PricingPlan = dynamic(() => import("./PricingPlan"), {
  ssr: false,
  loading: () => <section className="py-20 lg:py-[120px] bg-primary/2" />,
});
const Faqs = dynamic(() => import("./Faqs"), {
  ssr: false,
  loading: () => <section className="py-20 lg:py-[120px] bg-primary/2" />,
});

export default function LandingPageClient() {
  return (
    <div className="page">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <DesignedForYou />
      <OurStoryAndResults />
      <BestAlternatives />
      <PricingPlan />
      <Faqs />
      <CTA />
      <LandingFooter />
      <TrackingWrapper />
    </div>
  );
}
