import FadeInUp from "@/components/animations/FadeInUp";
import SlideDown from "@/components/animations/SlideDown";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Parallax } from "react-scroll-parallax";
import { DotGrid } from "./DotGrid";

const PLANS = [
	{
		name: "Starter",
		monthlyPrice: 29,
		yearlyPrice: 23,
		desc: "For artists just starting with paid promotion.",
		features: [
			{ text: "3 active campaigns / month", yes: true },
			{ text: "Basic stream analytics", yes: true },
			{ text: "1 lyric video / month", yes: true },
			{ text: "Cost per Stream tracking", yes: true },
			{ text: "Email support", yes: true },
			{ text: "Meta Ads API access", yes: false },
			{ text: "Unlimited lyric videos", yes: false },
			{ text: "White-label reports", yes: false },
		],
		cta: "Get Started Free",
		highlight: false,
	},
	{
		name: "Pro",
		monthlyPrice: 79,
		yearlyPrice: 63,
		desc: "For serious independent artists scaling their reach.",
		features: [
			{ text: "Unlimited active campaigns", yes: true },
			{ text: "Full analytics dashboard", yes: true },
			{ text: "Unlimited lyric videos", yes: true },
			{ text: "Cost per Stream & Fan tracking", yes: true },
			{ text: "Priority email + chat support", yes: true },
			{ text: "Meta Ads API access", yes: true },
			{ text: "Campaign performance alerts", yes: true },
			{ text: "White-label reports", yes: false },
		],
		cta: "Start 14-Day Free Trial",
		highlight: true,
	},
	{
		name: "Agency",
		monthlyPrice: 199,
		yearlyPrice: 159,
		desc: "For managers and labels running multiple artists.",
		features: [
			{ text: "Everything in Pro", yes: true },
			{ text: "Up to 20 artist accounts", yes: true },
			{ text: "White-label PDF reports", yes: true },
			{ text: "Dedicated account manager", yes: true },
			{ text: "Custom Meta Ads integrations", yes: true },
			{ text: "Bulk campaign management", yes: true },
			{ text: "API access for custom reporting", yes: true },
			{ text: "SLA & uptime guarantee", yes: true },
		],
		cta: "Contact Sales",
		highlight: false,
	},
];

const PricingHero = () => {
	const [annual, setAnnual] = useState(false);
	return (
		<>
			{/* Hero */}
			<section className="relative overflow-hidden pb-24 bg-white">
				<div
					style={{
						background:
							"radial-gradient(circle, rgba(58,96,231,0.1) 0%, transparent 70%)",
					}}
					className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
				/>
				<DotGrid id="dots-pr1" />
				<Parallax speed={-10}>
					<FadeInUp>
						<div className="max-w-[680px] mx-auto pt-32 pb-28 px-2 text-center relative">
							<div className="sectionLabel mb-6">
								Simple, transparent pricing
							</div>
							{/* <h1 className="text-white text-[clamp(2rem,5vw,3rem)] leading-[1.15] mb-4 tracking-tight font-black"> */}
							<h1 className="text-4xl lg:text-6xl lg:leading-[1.15] tracking-wide mb-4">
								Start free. Scale when{" "}
								<span className="text-primary">you grow.</span>
							</h1>
							<p className="text-gray-400 md:text-lg mb-10">
								No hidden fees. No long-term contracts. Cancel anytime.
							</p>
							{/* Toggle */}
							<div className="bg-white inline-flex items-center gap-3 rounded-full px-7 py-2">
								<span
									className={cn("text-sm font-semibold", {
										"text-gray-400": annual,
										"text-navy": !annual,
									})}
								>
									Monthly
								</span>
								<button
									onClick={() => setAnnual(!annual)}
									className={cn(
										"transition-all duration-200 relative border-0 cursor-pointer w-11 h-6 rounded-full",
										{
											"bg-blue": annual,
											"bg-gray-300": !annual,
										},
									)}
								>
									<div
										style={{
											width: 18,
											height: 18,
											borderRadius: "50%",
											background: "#fff",
											position: "absolute",
											top: 3,
											left: annual ? 23 : 3,
											transition: "left 0.2s",
											boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
										}}
									/>
								</button>
								<span
									className={cn("text-sm font-semibold", {
										"text-navy": annual,
										"text-gray-400": !annual,
									})}
								>
									Annual{" "}
									<span
										style={{
											marginLeft: "0.3rem",
											fontSize: "0.68rem",
											fontWeight: 700,
											background: "#F0FDF4",
											color: "#12B76A",
											padding: "0.1rem 0.45rem",
											borderRadius: 99,
										}}
									>
										−20%
									</span>
								</span>
							</div>
						</div>
					</FadeInUp>
				</Parallax>
			</section>

			{/* Plans */}
			<section className="relative mx-auto max-w-[1060px] z-10 -translate-y-20 overflow-visible px-6 lg:px-8">
				<div className="relative grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
					{PLANS.map((plan) => {
						const price = annual ? plan.yearlyPrice : plan.monthlyPrice;
						return (
							<SlideDown key={plan.name}>
								<div
									style={{
										boxShadow: plan.highlight
											? "0 24px 80px rgba(11,17,32,0.18)"
											: "0 2px 12px rgba(0,0,0,0.04)",
									}}
									className={cn(
										"bg-white flex flex-col relative p-8 rounded-[20px] border border-[#E2E6F0]",
										{
											"border-2 border-primary/40": plan.highlight,
										},
									)}
								>
									{plan.highlight && (
										<div className="absolute top-[-13px] left-1/2 transform -translate-x-1/2 bg-linear-to-r from-blue-500 to-primary text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
											Most Popular
										</div>
									)}
									<p
										className={cn(
											"text-[0.7rem] font-bold uppercase tracking-wider mb-3 text-muted",
										)}
									>
										{plan.name}
									</p>
									<div className="flex items-baseline gap-1 mb-1.5">
										<span className="text-[2.5rem] font-bold tracking-tight leading-none">
											${price}
										</span>
										<span className="text-sm text-muted">/mo</span>
									</div>
									{annual && (
										<p className="text-xs text-green-600 font-semibold mb-1.5">
											Billed ${price * 12}/year
										</p>
									)}
									<p
										className={cn("text-[0.8125rem] mb-7", {
											"text-muted": !plan.highlight,
											"text-muted/50": plan.highlight,
										})}
									>
										{plan.desc}
									</p>
									<ul className="list-none flex flex-col gap-2.5 mb-8 flex-1">
										{plan.features.map((f) => (
											<li
												key={f.text}
												className={cn(
													"flex items-start gap-2.5 text-secondary text-[0.8125rem]",
													{
														"text-muted/50": !f.yes,
													},
												)}
											>
												<span
													className={cn("font-bold shrink-0", {
														"text-green-600": f.yes,
														"text-muted": !f.yes,
													})}
												>
													{f.yes ? "✓" : "✕"}
												</span>
												{f.text}
											</li>
										))}
									</ul>
									<Link
										href={plan.name === "Agency" ? "#" : "/signup"}
										className={cn(
											"block text-center p-[0.8rem] rounded-[10px] font-bold text-[0.9rem] ",
											{
												"border border-border text-navy bg-bg-card":
													!plan.highlight,
												"bg-linear-to-r from-blue to-[#4C1AEA] text-white":
													plan.highlight,
											},
										)}
									>
										{plan.cta}
									</Link>
								</div>
							</SlideDown>
						);
					})}
				</div>

				{/* Trust signals */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "3rem",
						flexWrap: "wrap",
						marginTop: "2.5rem",
						padding: "1.5rem 2rem",
						background: "#fff",
						borderRadius: 16,
						border: "1px solid #E2E6F0",
						position: "relative",
					}}
				>
					{[
						{ icon: "🔒", label: "No credit card to start" },
						{ icon: "↩", label: "Cancel anytime" },
						{ icon: "⚡", label: "Setup in under 5 minutes" },
						{ icon: "🎵", label: "Built for independent artists" },
					].map((t) => (
						<div
							key={t.label}
							style={{
								display: "flex",
								alignItems: "center",
								gap: "0.5rem",
								fontSize: "0.8125rem",
								color: "#4A5370",
								fontWeight: 500,
							}}
						>
							<span>{t.icon}</span>
							{t.label}
						</div>
					))}
				</div>
			</section>
		</>
	);
};

export default PricingHero;
