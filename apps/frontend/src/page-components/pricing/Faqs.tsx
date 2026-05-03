import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { useState } from "react";
const FAQ = [
	{
		q: "Is there a free trial?",
		a: "Even better, our Free plan is available forever, so you can use it as long as you want.",
	},
	{
		q: "How does the ad spend fee work on the Free plan?",
		a: "On the Free plan, a 12% fee applies only to the ad spend you run through your campaigns. All paid plans include 0% ad spend fees.",
	},
	{
		q: "Do you take a percentage on paid plans?",
		a: "No. Once you upgrade, you keep 100% control of your ad budget with 0% fees. ",
	},
	{
		q: "Do I pay for ads separately?",
		a: "Yes. Your ad spend goes directly to Meta (Facebook & Instagram).",
	},
	{
		q: "Do I need marketing experience to use this?",
		a: "No. The platform is built specifically for artists that don’t know about marketing but want to market their music. We help you with pre-optimized campaign structures and automated workflows.",
	},
	{
		q: "What kind of results can I expect?",
		a: "Results depend on your music, audience, and budget, but the platform is designed to maximize streams, engagement, and fan acquisition through optimized campaigns.",
	},
	{
		q: "What are the landing pages for?",
		a: "Landing pages help you convert traffic into streams, followers, or fans, rather than sending users straight to Spotify, where conversions are lower and you have less control over audience quality. ",
	},
	{
		q: "Can I cancel anytime?",
		a: "Yes, you can cancel from your setting at any time and you keep access until the end of the billing period.",
	},
	{
		q: "How Does The Automatic Optimisation Work?",
		a: "We help you turn off ads that aren’t performing as good as they should so you don’t burn money on low performing ads. We also notify you when you have great performing ads to increase your budget and increase your streams.",
	},
	{
		q: "How does video generation work?",
		a: "You can instantly create short-form videos with lyrics, visuals, and formats optimized for ads and social media.",
	},
	{
		q: "Can I use my own videos?",
		a: "Yes. You can upload your own creatives or choose from our ready-to-use library of clips.",
	},
	{
		q: "Is this only for individual artists?",
		a: "No. Managers and labels can manage multiple artists, campaigns, and assets from one account.",
	},
	{
		q: "What happens if I hit my limits?",
		a: "You can upgrade your plan or contact us for a custom solution tailored to your needs.",
	},
	{
		q: "Do you have access to my ad account?",
		a: "You stay in control of your ad account. We connect securely and never take ownership of your funds. ",
	},
	{
		q: "What’s Cost Per Stream (CPS)?",
		a: "The CPS is basically the real cost of how much it costs you to acquire a new stream. Think of it as the Customer Acquisition Cost (CAC) of any business, but adapted to music.",
	},
	{
		q: "How Do You Calculate The Cost Per Stream? ",
		a: "This is calculated via the adspend / streams you have received on your spotify. ",
	},
	{
		q: "Is it The “Real” Cost Per Stream? ",
		a: "Yes, we calculate the real Cost Per Stream up to the day, we don’t do the math based on the landing page analytics, instead we get the analytics specifically from spotify and do the math from there.",
	},
	{
		q: "Do I need a Meta Ads Account?",
		a: "Yes, to launch live campaigns. If you don’t know how to or don’t have a meta ads account you can watch this easy step-by-step tutorial",
	},
	{
		q: "Is Spotify Connection Required?",
		a: "Only if you want to have the real analytics of your campaigns and streams growth up-to-date.",
	},
];
const Faqs = () => {
	const [openFaq, setOpenFaq] = useState<number | null>(null);
	return (
		<section className="overflow-hidden pb-20 lg:pb-24 relative">
			<div className="container">
				<div className="max-w-[720px] mx-auto">
					<FadeInUp>
						<div className="mb-12 text-center">
							<h2 className="text-3xl lg:text-5xl mb-6">
								<TextAnimation text="FAQ" />
							</h2>
						</div>
					</FadeInUp>
					<div className="flex flex-col gap-2.5">
						{FAQ.map((item, i) => (
							<FadeInUp key={i}>
								<div className="overflow-hidden bg-white rounded-[14px] border border-border">
									<button
										onClick={() =>
											setOpenFaq(openFaq === i ? null : i)
										}
										style={{
											width: "100%",
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											padding: "1.125rem 1.25rem",
											background: "none",
											border: "none",
											cursor: "pointer",
											textAlign: "left",
											gap: "1rem",
										}}
									>
										<span
											style={{
												fontWeight: 600,
												fontSize: "0.9rem",
											}}
											className="text-navy"
										>
											{item.q}
										</span>
										<span
											style={{
												fontSize: "1.25rem",
												flexShrink: 0,
												fontWeight: 300,
												transform:
													openFaq === i ? "rotate(45deg)" : "none",
												transition: "transform 0.2s",
												display: "inline-block",
											}}
											className="text-blue"
										>
											+
										</span>
									</button>
									{openFaq === i && (
										<div style={{ padding: "0 1.25rem 1.125rem" }}>
											<p
												style={{
													fontSize: "0.875rem",
													color: "#4A5370",
													lineHeight: 1.75,
												}}
											>
												{item.a}
											</p>
										</div>
									)}
								</div>
							</FadeInUp>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Faqs;
