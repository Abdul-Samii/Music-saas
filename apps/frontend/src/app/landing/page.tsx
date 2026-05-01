"use client";
import Hero from "@/page-components/landing/Hero";
import Navbar from "@/page-components/landing/Navbar";

import BuiltFor from "@/page-components/landing/BuiltFor";
import CTA from "@/page-components/landing/CTA";
import DesignedForYou from "@/page-components/landing/DesignedForYou";
import Features from "@/page-components/landing/Features";
import HowItWorks from "@/page-components/landing/HowItWorks";
import LandingFooter from "@/page-components/landing/LandingFooter";
import PricingPlan from "@/page-components/landing/PricingPlan";
import { useEffect } from "react";

export default function LandingPage() {
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
			<BuiltFor />
			<HowItWorks />
			<Features />
			<DesignedForYou />
			<PricingPlan />
			<CTA />
			<LandingFooter />
		</div>
	);
}
