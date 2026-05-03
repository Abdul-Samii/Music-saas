import FadeIn from "@/components/animations/FadeIn";
import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { Parallax } from "react-scroll-parallax";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

const Features = () => {
	return (
		<section className="py-20 lg:py-[120px] overflow-hidden bg-bg-card">
			<div className="container">
				<FadeInUp>
					<div className="text-center mb-16">
						<span className="sectionLabel mb-3">Features</span>
						<h2 className="text-3xl lg:text-5xl mx-auto mb-6 max-w-[880px]">
							<TextAnimation text="Simplify your marketing and scale your music with advanced features" />
						</h2>
						{/* <p className="md:text-lg">
							We built the tools music marketing agencies charge
							thousands for — and made them simple.
						</p> */}
					</div>
				</FadeInUp>
				<FadeInUp>
					<Parallax speed={-5}>
						<FadeIn>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">
								<div className="card bg-white! flex flex-col">
									<div>
										<h3 className="md:text-lg font-bold leading-[1.3]">
											<TextAnimation text="Dashboard: your REAL cost per stream updated every minute" />
										</h3>
										<p className="text-sm text-muted mt-2 mb-4">
											We show you the most important cost for your
											artist. Not CPM, NOT CPC. The CPs (Cost per
											Stream)
										</p>
									</div>
									<img
										src="/img/chart.png"
										alt=""
										className="border border-border rounded w-full max-w-[400px] mt-auto"
									/>
								</div>
								<div className="flex flex-col">
									<div>
										<h3 className="md:text-lg font-bold leading-[1.3]">
											<TextAnimation text="Campaigns: Launch winning campaigns with our secret strategy in just 60 seconds" />
										</h3>
										<p className="text-sm text-muted mt-2 mb-4">
											After investing +200.000$ on ads we found a
											similarity across all our campaigns, the
											structure. Now we give it to you so you can
											start making winning campaigns at the best
											costs
										</p>
									</div>
									<img
										src="/img/music-campaign.jpg"
										alt=""
										className="border border-border rounded w-full max-w-[370px] mt-auto"
									/>
								</div>
							</div>
							<div>
								<div className="max-w-[720px] mb-6">
									<h3 className="md:text-lg font-bold leading-[1.3]">
										<TextAnimation text="Create lyric ads within seconds" />
									</h3>
									<p className="text-sm text-muted mt-2 mb-4">
										Stop editing videos for hours just to get no
										results on ads and 200 views on tiktok. After
										creating more than 3.000 music ads, we found the
										best videos and we’ve added them to our template
										library so you can use it by just dragging your
										song. And yes, you will get this viral tiktok
										lyrics so you can go viral as well!
									</p>
								</div>
								<Swiper slidesPerView="auto" spaceBetween={20}>
									<SwiperSlide className="w-[280px]!">
										<iframe
											src="https://www.tiktok.com/embed/v2/7559596143911406870"
											className="w-full bg-transparent aspect-9/16 rounded border border-border"
											allowFullScreen={false}
										></iframe>
									</SwiperSlide>
									<SwiperSlide className="w-[280px]!">
										<iframe
											src="https://www.tiktok.com/embed/v2/7484287745712524590"
											className="w-full bg-transparent aspect-9/16 rounded border border-border"
											allowFullScreen={false}
										></iframe>
									</SwiperSlide>
									<SwiperSlide className="w-[280px]!">
										<iframe
											src="https://www.tiktok.com/embed/v2/7559596143911406870"
											className="w-full bg-transparent aspect-9/16 rounded border border-border"
											allowFullScreen={false}
										></iframe>
									</SwiperSlide>
									<SwiperSlide className="w-[280px]!">
										<iframe
											src="https://www.tiktok.com/embed/v2/7484287745712524590"
											className="w-full bg-transparent aspect-9/16 rounded border border-border"
											allowFullScreen={false}
										></iframe>
									</SwiperSlide>
									<SwiperSlide className="w-[280px]!">
										<iframe
											src="https://www.tiktok.com/embed/v2/7559596143911406870"
											className="w-full bg-transparent aspect-9/16 rounded border border-border"
											allowFullScreen={false}
										></iframe>
									</SwiperSlide>
									<SwiperSlide className="w-[280px]!">
										<iframe
											src="https://www.tiktok.com/embed/v2/7484287745712524590"
											className="w-full bg-transparent aspect-9/16 rounded border border-border"
											allowFullScreen={false}
										></iframe>
									</SwiperSlide>
								</Swiper>
							</div>
						</FadeIn>
					</Parallax>
				</FadeInUp>
			</div>
		</section>
	);
};

export default Features;
