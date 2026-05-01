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
import { useEffect, useRef, useState } from "react";
import s from "./landing.module.css";

/* ── Reveal on scroll ── */
function Reveal({
	children,
	delay = 0,
}: {
	children: React.ReactNode;
	delay?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) setVisible(true);
			},
			{ threshold: 0.1 },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	return (
		<div
			ref={ref}
			className={`${s.reveal} ${visible ? s.revealVisible : ""}`}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</div>
	);
}

/* ── Feature icons ── */

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
			{/* ── NAV ── */}
			<Navbar />
			{/* ── HERO ── */}
			<Hero />
			{/* ── LOGOS ── */}
			<BuiltFor />
			{/* ── HOW IT WORKS ── */}
			<HowItWorks />
			{/* ── FEATURES ── */}
			<Features />
			{/* ── WHO IT'S FOR ── */}
			<DesignedForYou />
			{/* ── PRICING ── */}
			<PricingPlan />

			{/* ── CTA ── */}
			<CTA />

			{/* ── FOOTER ── */}
			<LandingFooter />
		</div>
	);
}
