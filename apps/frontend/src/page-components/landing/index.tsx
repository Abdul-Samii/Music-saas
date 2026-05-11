"use client";
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import DesignedForYou from "./DesignedForYou";
import OurStoryAndResults from "./OurStoryAndResults";
import BestAlternatives from "./BestAlternatives";
import PricingPlan from "./PricingPlan";
import Faqs from "./Faqs";
import CTA from "./CTA";
import LandingFooter from "./LandingFooter";

export default function LandingPageClient() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as Window & { fbq?: (...args: unknown[]) => void }).fbq
    ) {
      (window as Window & { fbq?: (...args: unknown[]) => void }).fbq!(
        "track",
        "ViewContent",
        {
          content_name: "Landing Page",
          content_category: "Music Marketing",
        },
      );
    }
  }, []);

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
    </div>
  );
}
