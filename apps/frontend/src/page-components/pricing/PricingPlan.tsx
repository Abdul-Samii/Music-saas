import SlideDown from "@/components/animations/SlideDown";
import { Parallax } from "react-scroll-parallax";
import { pricing, PricingCard } from "../landing/PricingPlan";

const PricingPlan = () => {
	return (
		<section>
			<div className="relative z-10 -translate-y-20 overflow-visible px-6 lg:px-8">
				<div className="container">
					<div className="max-w-[1320px] mx-auto">
						<Parallax speed={-2}>
							<SlideDown>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
									{pricing.map((plan, i) => (
										<PricingCard key={i} plan={plan} />
									))}
								</div>
							</SlideDown>
						</Parallax>
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
					</div>
				</div>
			</div>
		</section>
	);
};
export default PricingPlan;
