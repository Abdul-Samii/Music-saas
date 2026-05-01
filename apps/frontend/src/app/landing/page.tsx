"use client";
import Hero from "@/page-components/landing/Hero";
import { signIn } from "next-auth/react";
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

/* ── Email form ── */
function EmailForm() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState(false);

	function submit() {
		if (!email || !email.includes("@")) {
			setError(true);
			return;
		}
		// Fire Meta Lead event
		if (
			typeof window !== "undefined" &&
			(window as Window & { fbq?: (...args: unknown[]) => void }).fbq
		) {
			(window as Window & { fbq?: (...args: unknown[]) => void }).fbq!(
				"track",
				"Lead",
			);
		}
		window.location.href = `/signup?email=${encodeURIComponent(email)}`;
	}

	return (
		<div className={s.emailForm}>
			<input
				type="email"
				value={email}
				placeholder="your@email.com"
				className={`${s.emailInput} ${error ? s.emailInputError : ""}`}
				onChange={(e) => {
					setEmail(e.target.value);
					setError(false);
				}}
				onKeyDown={(e) => e.key === "Enter" && submit()}
			/>
			<button className={`${s.btnShiny} ${s.emailBtn}`} onClick={submit}>
				Get early access →
			</button>
		</div>
	);
}

/* ── Google button ── */
function GoogleButton({ onClick }: { onClick: () => void }) {
	return (
		<button className={s.googleBtn} onClick={onClick}>
			<svg width="19" height="19" viewBox="0 0 24 24">
				<path
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					fill="#4285F4"
				/>
				<path
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					fill="#34A853"
				/>
				<path
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
					fill="#FBBC05"
				/>
				<path
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					fill="#EA4335"
				/>
			</svg>
			Continue with Google
		</button>
	);
}

/* ── Feature icons ── */
const features = [
	{
		d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
		title: "Ads Generator",
		desc: "Upload any audio and our engine auto-syncs your lyrics to converting visual clips.",
	},
	{
		d: "M2 2h20v20H2zM7 2v20M17 2v20M2 12h20",
		title: "Video Library",
		desc: "Hundreds of licensed clips curated for music promotion — not generic stock footage.",
	},
	{
		d: "M3 11l19-9-9 19-2-8-8-2z",
		title: "Meta Ads integration",
		desc: "Launch Facebook & Instagram campaigns from Escalium. No ad manager knowledge needed.",
	},
	{
		d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
		title: "Launch",
		desc: "From upload to live campaign in under 5 minutes. Speed is your advantage in music.",
	},
	{
		d: "M18 20V10M12 20V4M6 20v-6",
		title: "Performance tracking",
		desc: "Stream growth, click rates, cost per result — all in one clean dashboard.",
	},
	{
		d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
		title: "Free to start",
		desc: "Create your first ads free. No credit card. Upgrade only when you're ready to scale.",
	},
];

const steps = [
	{
		num: "01",
		title: "Upload your track",
		desc: "Drop your .mp3, .flac or .wav file. Add your lyrics. Escalium handles the rest automatically.",
	},
	{
		num: "02",
		title: "Pick your clips",
		desc: "Browse our curated library of visual clips that sync to your audio and are proven to convert.",
	},
	{
		num: "03",
		title: "Generate your ad",
		desc: "Your ad is rendered with lyrics, visuals and audio perfectly combined. Ready in seconds.",
	},
	{
		num: "04",
		title: "Launch on Meta",
		desc: "Set your budget, target your audience and launch directly on Facebook and Instagram.",
	},
];

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
	const handleGoogle = () => {
		void signIn("google", { callbackUrl: "/dashboard" });
	};

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
			<nav className={s.nav}>
				<a
					className={s.navLogo}
					href="#"
					style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
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
				</a>
				<div className={s.navRight}>
					<button
						className={`${s.btnShiny} ${s.navBtn}`}
						onClick={() =>
							document
								.getElementById("early-access")
								?.scrollIntoView({ behavior: "smooth" })
						}
					>
						Get early access
					</button>
				</div>
			</nav>
			<Hero />
			{/* ── HERO ── */}
			<section className={s.hero}>
				<div className={s.heroBg} />
				<div className={s.heroGrid} />
				<div className={s.heroInner}>
					<div className={s.heroBadge}>
						<div className={s.heroBadgeDot} />
						Now accepting early access signups
					</div>
					<h1 className={s.heroH1}>
						Promote your music.
						<br />
						Scale your <span className={s.heroAccent}>audience.</span>
					</h1>
					<p className={s.heroSub}>
						Create converting ads from your tracks and launch Meta
						campaigns — all in one place. Built for artists, producers and
						labels.
					</p>
					<div className={s.heroCtaGroup}>
						<GoogleButton onClick={handleGoogle} />
						<div className={s.divider}>or</div>
						<EmailForm />
					</div>
					<p className={s.heroCopy}>
						Free to join. No credit card required.
					</p>
				</div>
			</section>

			{/* ── LOGOS ── */}
			<div className={s.logosBar}>
				<span className={s.logosLabel}>Built for</span>
				{[
					"Independent Artists",
					"Music Producers",
					"Record Labels",
					"Artist Managers",
				].map((l) => (
					<span key={l} className={s.logoPill}>
						{l}
					</span>
				))}
			</div>

			{/* ── HOW IT WORKS ── */}
			<section className={s.section}>
				<Reveal>
					<span className={s.sectionLabel}>How it works</span>
					<h2 className={s.sectionTitle}>
						From upload to live campaign in minutes.
					</h2>
					<p className={s.sectionSubtitle}>
						No ad agency. No complicated tools. Just your music and
						results.
					</p>
				</Reveal>
				<Reveal delay={100}>
					<div className={s.timeline}>
						<div className={s.timelineLine} />
						{steps.map((step) => (
							<div key={step.num} className={s.timelineStep}>
								<div className={s.timelineDot}>{step.num}</div>
								<div className={s.timelineContent}>
									<h3 className={s.timelineTitle}>{step.title}</h3>
									<p className={s.timelineDesc}>{step.desc}</p>
								</div>
							</div>
						))}
					</div>
				</Reveal>
			</section>

			{/* ── FEATURES ── */}
			<section className={s.sectionGray}>
				<Reveal>
					<span className={s.sectionLabel}>Features</span>
					<h2 className={s.sectionTitle}>
						Everything you need to promote smarter.
					</h2>
					<p className={s.sectionSubtitle}>
						We built the tools music marketing agencies charge thousands
						for — and made them simple.
					</p>
				</Reveal>
				<Reveal delay={100}>
					<div className={s.featuresGrid}>
						{features.map((f) => (
							<div key={f.title} className={s.featureCard}>
								<div className={s.featureIcon}>
									<svg
										width="22"
										height="22"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#2563EB"
										strokeWidth="1.75"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d={f.d} />
									</svg>
								</div>
								<h3 className={s.featureTitle}>{f.title}</h3>
								<p className={s.featureDesc}>{f.desc}</p>
							</div>
						))}
					</div>
				</Reveal>
			</section>

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
						<GoogleButton onClick={handleGoogle} />
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
