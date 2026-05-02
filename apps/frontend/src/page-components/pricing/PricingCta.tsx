import Link from "next/link";
import { DotGrid } from "./DotGrid";

const PricingCta = () => {
	return (
		<section
			className="relative px-8 py-24 text-center overflow-hidden"
			style={{
				background: `url(/img/cta-bg.jpg) no-repeat bottom center / cover`,
			}}
		>
			<div
				className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, rgba(58,96,231,0.3) 0%, transparent 70%)",
				}}
			/>
			<div
				className="absolute -bottom-20 -right-20 w-[320px] h-[320px] rounded-full pointer-events-none"
				style={{
					background:
						"radial-gradient(circle, rgba(76,26,234,0.25) 0%, transparent 70%)",
				}}
			/>
			<div className="absolute inset-0 pointer-events-none bg-black opacity-80" />
			<DotGrid />
			<div className="max-w-[560px] mx-auto relative">
				<h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-black text-white mb-4 tracking-tight">
					Ready to grow your{" "}
					<span
						style={{
							background: "linear-gradient(135deg, #3A60E7, #4C1AEA)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}}
					>
						streams?
					</span>
				</h2>
				<p className="text-white/55 mb-10 leading-[1.75]">
					Join 500+ independent artists scaling with data-driven music
					marketing.
				</p>
				<Link
					href="/signup"
					className="inline-flex items-center gap-2 bg-white text-navy rounded-full px-8 py-3 font-extrabold text-[0.95rem]"
				>
					Create Your Free Account{" "}
					<span className="w-5.5 h-5.5 rounded-full bg-navy text-white flex items-center justify-center">
						+
					</span>
				</Link>
			</div>
		</section>
	);
};

export default PricingCta;
