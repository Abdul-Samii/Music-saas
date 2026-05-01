import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";

const DesignedForYou = () => {
	return (
		<section className="py-[120px] overflow-hidden">
			<div className="container">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
					<div>
						<FadeInUp>
							<div className="mb-8 md:mb-12">
								<span className="sectionLabel mb-3">
									DESIGNED FOR YOU
								</span>
								<h2 className="text-3xl lg:text-5xl mb-6 max-w-[600px]">
									<TextAnimation text="Made for everyone in the music industry" />
								</h2>
							</div>
							<div className="flex flex-col gap-8">
								{[
									{
										emoji: (
											<svg
												width="16"
												height="16"
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z"
													fill="currentColor"
												/>
											</svg>
										),
										title: "Artists",
										desc: "Stop spending hours on Meta Ads. Upload your song, pick your clips, and promote — with no agency fees eating your budget.",
									},
									{
										emoji: (
											<svg
												width="16"
												height="16"
												viewBox="0 0 16 16"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M0 16V8H4V16H0ZM6 16V0H10V16H6ZM12 16V5H16V16H12Z"
													fill="currentColor"
												/>
											</svg>
										),
										title: "Producers",
										desc: "Promote your beats with ad creatives that sound and look professional. Stand out where your buyers are scrolling.",
									},
									{
										emoji: (
											<svg
												width="20"
												height="20"
												viewBox="0 0 20 20"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M10 14.5C11.25 14.5 12.3125 14.0625 13.1875 13.1875C14.0625 12.3125 14.5 11.25 14.5 10C14.5 8.75 14.0625 7.6875 13.1875 6.8125C12.3125 5.9375 11.25 5.5 10 5.5C8.75 5.5 7.6875 5.9375 6.8125 6.8125C5.9375 7.6875 5.5 8.75 5.5 10C5.5 11.25 5.9375 12.3125 6.8125 13.1875C7.6875 14.0625 8.75 14.5 10 14.5ZM10 11C9.71667 11 9.47917 10.9042 9.2875 10.7125C9.09583 10.5208 9 10.2833 9 10C9 9.71667 9.09583 9.47917 9.2875 9.2875C9.47917 9.09583 9.71667 9 10 9C10.2833 9 10.5208 9.09583 10.7125 9.2875C10.9042 9.47917 11 9.71667 11 10C11 10.2833 10.9042 10.5208 10.7125 10.7125C10.5208 10.9042 10.2833 11 10 11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
													fill="currentColor"
												/>
											</svg>
										),
										title: "Record labels",
										desc: "Manage campaigns across your entire roster from one dashboard. Scale what works, cut what doesn't — fast.",
									},
								].map((c) => (
									<div key={c.title} className="flex gap-6">
										<div className="bg-primary/10 text-primary w-12 h-12 rounded-md flex-center">
											{c.emoji}
										</div>
										<div className="w-0 grow">
											<h3 className="text-lg font-semibold mb-1">
												{c.title}
											</h3>
											<p className="text-sm m-0">{c.desc}</p>
										</div>
									</div>
								))}
							</div>
						</FadeInUp>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-4 justify-end">
							<FadeInUp>
								<img
									className="w-full rounded-2xl"
									src="/img/designed-for-you-1.png"
									alt=""
								/>
							</FadeInUp>
							<FadeInUp>
								<div className="bg-primary text-white p-6 sm:p-8 rounded-2xl">
									<h5 className="text-2xl font-italic mb-2">
										Scalable
									</h5>
									<p>Ready for any stage of your career.</p>
								</div>
							</FadeInUp>
						</div>
						<div className="flex flex-col gap-4 justify-start">
							<FadeInUp>
								<div className="shadow-sm p-6 sm:p-8 rounded-2xl">
									<h5 className="text-base text-primary uppercase mb-2">
										AUDIENCE DATA
									</h5>
									<p className="font-semibold">12M+ Data Points</p>
								</div>
							</FadeInUp>
							<FadeInUp>
								<img
									className="w-full rounded-2xl"
									src="/img/designed-for-you-2.png"
									alt=""
								/>
							</FadeInUp>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default DesignedForYou;
