"use client";
import GoogleButton from "@/page-components/GoogleButton";
import Hero from "@/page-components/landing/Hero";
import Navbar from "@/page-components/landing/Navbar";

import EmailForm from "@/page-components/EmailForm";
import BuiltFor from "@/page-components/landing/BuiltFor";
import Features from "@/page-components/landing/Features";
import HowItWorks from "@/page-components/landing/HowItWorks";
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

const pricing = [
	{
		plan: "Free",
		price: "€0",
		commission: "12% on ad spend",
		items: ["5 ads per month", "Up to 20s per ad", "Meta campaign builder"],
		featured: false,
	},
	{
		plan: "Pro",
		price: "€39",
		commission: "5% on ad spend",
		items: ["50 ads per month", "Up to 30s per ad", "Meta campaign builder"],
		featured: true,
	},
	{
		plan: "Studio",
		price: "€59",
		commission: "3.5% on ad spend",
		items: ["100 ads per month", "Up to 60s per ad", "Meta campaign builder"],
		featured: false,
	},
	{
		plan: "Label",
		price: "€79",
		commission: "1% on ad spend",
		items: [
			"250 ads per month",
			"Up to 2min per ad",
			"Full roster management",
		],
		featured: false,
	},
];

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
		<div className={s.page}>
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
			<section className={s.section}>
				<Reveal>
					<span className={s.sectionLabel}>Who it&apos;s for</span>
					<h2 className={s.sectionTitle}>
						Made for everyone in the music industry.
					</h2>
					<p className={s.sectionSubtitle}>
						Whether you&apos;re releasing your first single or managing a
						full roster, Escalium scales with you.
					</p>
				</Reveal>
				<Reveal delay={100}>
					<div className={s.forWhoGrid}>
						{[
							{
								emoji: "🎤",
								title: "Artists",
								desc: "Stop spending hours on Meta Ads. Upload your song, pick your clips, and promote — with no agency fees eating your budget.",
							},
							{
								emoji: "🎛️",
								title: "Producers",
								desc: "Promote your beats with ad creatives that sound and look professional. Stand out where your buyers are scrolling.",
							},
							{
								emoji: "🏢",
								title: "Record labels",
								desc: "Manage campaigns across your entire roster from one dashboard. Scale what works, cut what doesn't — fast.",
							},
						].map((c) => (
							<div key={c.title} className={s.forWhoCard}>
								<div className={s.forWhoEmoji}>{c.emoji}</div>
								<h3 className={s.forWhoTitle}>{c.title}</h3>
								<p className={s.forWhoDesc}>{c.desc}</p>
							</div>
						))}
					</div>
				</Reveal>
			</section>

			{/* ── PRICING ── */}
			<section className={s.sectionDark}>
				<Reveal>
					<span className={`${s.sectionLabel} ${s.sectionLabelLight}`}>
						Pricing
					</span>
					<h2 className={`${s.sectionTitle} ${s.sectionTitleWhite}`}>
						Simple pricing.
						<br />
						No surprises.
					</h2>
					<p className={`${s.sectionSubtitle} ${s.sectionSubtitleLight}`}>
						Start free. Pay only as you scale. A small commission on your
						ad spend — that&apos;s it.
					</p>
				</Reveal>
				<Reveal delay={100}>
					<div className={s.pricingGrid}>
						{pricing.map((p) => (
							<div
								key={p.plan}
								className={`${s.pricingCard} ${p.featured ? s.pricingFeatured : ""}`}
							>
								{p.featured && (
									<div className={s.pricingBadge}>Most popular</div>
								)}
								<div className={s.pricingPlan}>{p.plan}</div>
								<div className={s.pricingPrice}>
									{p.price}{" "}
									<span className={s.pricingPriceSub}>/ mo</span>
								</div>
								<div className={s.pricingCommission}>
									{p.commission}
								</div>
								<div className={s.pricingDivider} />
								<ul className={s.pricingFeatures}>
									{p.items.map((item) => (
										<li key={item} className={s.pricingFeature}>
											<span className={s.pricingDot} />
											{item}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</Reveal>
			</section>

			{/* ── CTA ── */}
			<section id="early-access" className={s.ctaSection}>
				<div className={s.ctaBg} />
				<div className={s.ctaInner}>
					<Reveal>
						<span className={s.sectionLabel}>Early access</span>
						<h2 className={s.ctaTitle}>
							Be the first to promote smarter.
						</h2>
						<p className={s.ctaSub}>
							Join the waitlist and get exclusive early access before the
							public launch.
						</p>
					</Reveal>
					<Reveal delay={100}>
						<GoogleButton />
						<div
							className={s.divider}
							style={{ maxWidth: 360, marginTop: 14 }}
						>
							or
						</div>
						<div style={{ marginTop: 0 }}>
							<EmailForm />
						</div>
					</Reveal>
				</div>
			</section>

			{/* ── FOOTER ── */}
			<footer className={s.footer}>
				<div
					className={s.footerLogo}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "0.5rem",
					}}
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/logo.png"
						alt="Escalium"
						width={28}
						height={28}
						style={{ borderRadius: 6 }}
					/>
					<p>
						Escal<span>ium</span>
					</p>
				</div>
				<p className={s.footerCopy}>
					© 2025 Escalium. All rights reserved.
				</p>
				<p className={s.footerCopy}>escalium.io</p>
			</footer>
		</div>
	);
}
