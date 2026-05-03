import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Parallax } from "react-scroll-parallax";

export const pricing = [
	{
		plan: "Free",
		price: "€0",
		commission: "12% on ad spend",
		items: ["5 ads per month", "Up to 20s per ad", "Meta campaign builder"],
		featured: false,
		buttonText: "Get Started",
	},
	{
		plan: "Pro",
		price: "€39",
		commission: "5% on ad spend",
		items: ["50 ads per month", "Up to 30s per ad", "Meta campaign builder"],
		featured: true,
		buttonText: "Select Pro",
	},
	{
		plan: "Studio",
		price: "€59",
		commission: "3.5% on ad spend",
		items: ["100 ads per month", "Up to 60s per ad", "Meta campaign builder"],
		featured: false,
		buttonText: "Select Studio",
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
		buttonText: "Contact Sales",
	},
];

const PricingPlan = () => {
	return (
		<section className="pb-20 lg:pb-[120px] overflow-hidden bg-primary/2">
			<div className="container">
				<FadeInUp>
					<div className="text-center mb-8 md:mb-16">
						<span className="sectionLabel mb-3">Pricing</span>
						<h2 className="text-3xl lg:text-5xl mb-6">
							<TextAnimation text="Choose your plan" />
						</h2>
						<p className="md:text-lg">
							Start free. Pay only as you scale. A small commission on
							your ad spend — that&apos;s it.
						</p>
					</div>
				</FadeInUp>
				<Parallax speed={-2}>
					<FadeInUp>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1320px] mx-auto">
							{pricing.map((plan, i) => (
								<PricingCard key={i} plan={plan} />
							))}
						</div>
					</FadeInUp>
				</Parallax>
			</div>
		</section>
	);
};
export const PricingCard = ({ plan }: { plan: (typeof pricing)[0] }) => {
	return (
		<div
			className={cn(
				"group p-8 border border-gray-200 bg-white rounded-2xl relative hover:bg-dark-bg hover:text-white transition-all duration-300 hover:border-dark-bg",
				{
					"border-primary": plan.featured,
				},
			)}
		>
			{plan.featured && (
				<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white uppercase font-bold text-sm rounded-full px-3 py-[2px]">
					Most popular
				</div>
			)}
			<div className="text-xl mb-5">{plan.plan}</div>
			<div className="text-3xl mb-8">
				<span className="font-bold">{plan.price}</span>{" "}
				<span className="text-sm text-gray-400">/ mo</span>
			</div>

			<div className="text-base mb-6">{plan.commission}</div>

			<ul className="flex flex-col gap-3">
				{plan.items.map((item) => (
					<li key={item} className="text-sm flex gap-3">
						<svg
							width="15"
							height="18"
							viewBox="0 0 12 12"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="text-primary"
						>
							<path
								d="M5.01667 8.51667L9.12917 4.40417L8.3125 3.5875L5.01667 6.88333L3.35417 5.22083L2.5375 6.0375L5.01667 8.51667ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C7.13611 10.5 8.23958 10.0479 9.14375 9.14375C10.0479 8.23958 10.5 7.13611 10.5 5.83333C10.5 4.53056 10.0479 3.42708 9.14375 2.52292C8.23958 1.61875 7.13611 1.16667 5.83333 1.16667C4.53056 1.16667 3.42708 1.61875 2.52292 2.52292C1.61875 3.42708 1.16667 4.53056 1.16667 5.83333C1.16667 7.13611 1.61875 8.23958 2.52292 9.14375C3.42708 10.0479 4.53056 10.5 5.83333 10.5Z"
								fill="currentColor"
							/>
						</svg>
						<span className="w-0 self-center grow">{item}</span>
					</li>
				))}
			</ul>
			<div className="mt-6 flex justify-center">
				<Link
					href="/signup"
					className={cn(
						"text-primary border border-border outline-0 shadow-none rounded-md w-full px-5 h-12 cursor-pointer font-semibold group-hover:bg-white group-hover:text-dark-bg group-hover:border-white transition-all duration-300 flex items-center justify-center",
						{
							"bg-primary border-primary text-white font-bold":
								plan.featured,
						},
					)}
				>
					{plan.buttonText}
				</Link>
			</div>
		</div>
	);
};
export default PricingPlan;
