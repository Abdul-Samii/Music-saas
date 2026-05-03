import FadeInDown from "@/components/animations/FadeInDown";
import FadeInUp from "@/components/animations/FadeInUp";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Parallax } from "react-scroll-parallax";
const FAQ = [
	{
		q: "How is this any different from intellijend?",
		a: [
			"Our campaign structure is designed specifically to make you win. But this came with our own artists results first, Try us and you will see that we give you the lowest Costs in the industry",
			"We have an integrated tool to generate ads in seconds, while they sell you the ads for an extra cost",
		],
	},
	{
		q: "How do you track Cost Per Fan (CPF)?",
		a: [
			"We integrate all your growth data and ads spend into a unified analytics system. By consolidating these data streams, our platform automatically calculates your Cost Per Fan in real time—giving you clear, actionable insights into acquisition efficiency and campaign performance.",
		],
	},
	{
		q: "Do you take a percentage of ad spend?",
		a: [
			"Yes, we take a small percentage in Pro and Studio plans. This helps ensure we’re focused on getting you the best results and improve our platform every day.",
			"In the Free plan, you’ll pay 0% on ad spend for your first $50. And with the Label plan, you benefit from 0% ad spend fees with no limits.",
		],
	},
	{
		q: "Will this work for my genre?",
		a: [
			"Yes, our platform works across all genres. Before launching, we tested it with more than 20 different genres to make sure it performs well no matter your style.",
		],
	},
	{
		q: "Do you have case studies?",
		a: [
			"Yes, we’ve helped artists grow from around 5,000 streams a day to over 30,000 streams a day.",
			"Our best case reached 100M streams in a single year, doubling results compared to the previous year. And we have many more success stories we can share.",
		],
	},
	{
		q: "Do i need Marketing or Meta ads Experience.",
		a: [
			"No, that’s exactly why we built this platform. Most artists don’t know how to promote their music or themselves.",
			"Our software is designed to help artists, producers, and record labels promote their songs without needing any marketing knowledge. Everything is made to be simple and easy to use.",
			"That’s why we call it an “all-in-one music marketing platform.”",
		],
	},
];
const Faqs = () => {
	const [openFaq, setOpenFaq] = useState<number | null>(0);
	return (
		<section className="py-20 lg:py-[120px]">
			<div className="container">
				<FadeInUp>
					<h2 className="text-3xl lg:text-5xl text-center mb-12">
						Frequently Asked Questions
					</h2>
				</FadeInUp>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-14 xl:gap-24">
					<div>
						<div className="relative mt-4">
							<div className="absolute top-0 left-0 w-[40%] max-w-[220px]">
								<Parallax speed={3}>
									<FadeInUp>
										<img
											src="/img/v-f-1.jpg"
											className="w-full"
											alt=""
										/>
									</FadeInUp>
								</Parallax>
							</div>
							<div className="px-10 py-20 sm:py-25 sm:px-20 relative">
								<img src="/img/v-f-2.jpg" className="w-full" alt="" />
							</div>
							<div className="absolute bottom-0 right-0 w-[40%] max-w-[220px]">
								<Parallax speed={-3}>
									<FadeInDown>
										<img
											src="/img/v-f-3.jpg"
											className="w-full"
											alt=""
										/>
									</FadeInDown>
								</Parallax>
							</div>
						</div>
					</div>
					<div>
						{FAQ.map((item, i) => (
							<div key={i} className="group">
								<FadeInUp>
									<div className="border-b border-border group-last:border-b-0 py-2">
										<button
											onClick={() =>
												setOpenFaq(openFaq === i ? null : i)
											}
											className="flex w-full justify-between items-center py-4 bg-transparent cursor-pointer text-left gap-4"
										>
											<span className="text-navy font-semibold xl:text-lg">
												{item.q}
											</span>
											<span className="text-lg text-secondary">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													className={cn("size-5", {
														"rotate-180": openFaq === i,
													})}
												>
													<path
														fillRule="evenodd"
														d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
														clipRule="evenodd"
													/>
												</svg>
											</span>
										</button>
										{openFaq === i && (
											<div style={{ padding: "0 1.25rem 1.125rem" }}>
												<ul className="list-disc text-secondary text-sm leading-[1.75] flex flex-col gap-2">
													{item?.a?.map((a, index) => (
														<li key={index}>{a}</li>
													))}
												</ul>
											</div>
										)}
									</div>
								</FadeInUp>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Faqs;
