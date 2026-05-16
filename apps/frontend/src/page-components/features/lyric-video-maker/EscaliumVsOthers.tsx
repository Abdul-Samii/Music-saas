import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import Image from "next/image";
import SongUploader from "./SongUploader";

const EscaliumVsOthers = () => {
	const features = [
		"For Artists",
		"No Watermark",
		"Video library ",
		"Offline access",
		"Multiple profiles",
		"24/7 support",
	];

	const plans = [
		{
			img: "/logo.png",
			name: "Escalium",
			price: 0,
			values: [true, true, true, true, true, true],
		},
		{
			img: "/img/capcut-icon.png",
			name: "Capcut",
			price: 9.99,
			values: [false, false, true, true, true, true],
		},
		{
			img: "/img/kashie-icon.webp",
			name: "Kashie",
			price: 20,
			values: [false, true, true, false, false, true],
		},
		{
			img: "/img/kapwing-icon.webp",
			name: "Kapwing",
			price: 16,
			values: [false, false, false, true, true, false],
		},
		{
			img: "/img/veed-icon.png",
			name: "veed",
			price: 27,
			values: [false, true, true, false, false, true],
		},
	];

	const countData = [
		{
			value: "5.000",
			label: "Videos generated",
		},
		{
			value: "100.000.000",
			label: "Streams",
		},
		{
			value: "$200.000",
			label: "Ad Spend for Artists",
		},
	];
	return (
		<section className="py-20 lg:py-30 bg-bg">
			<div className="container">
				<FadeInUp>
					<div className="text-center mb-8 md:mb-12">
						<h2 className="text-3xl lg:text-5xl mb-6 max-w-150 mx-auto">
							<span className="text-primary">
								<TextAnimation text="Escalium" delay={0.8} />
							</span>{" "}
							<TextAnimation text="vs Others" />
						</h2>
					</div>
				</FadeInUp>

				<div className="py-10 relative max-w-5xl w-full mx-auto">
					<div className="w-44 sm:w-52 absolute top-10 left-0 bg-bg shadow-2xl rounded-xl px-4 md:px-8 pb-3.5 z-10">
						<div className="h-15 flex-center font-bold flex items-center gap-1">
							<Image
								className="size-6 md:size-10"
								src={"/logo.png"}
								alt={"Escalium"}
								width={40}
								height={40}
							/>
							Escalium
						</div>
						{features.map((feature) => (
							<div
								key={feature}
								className="flex items-center h-12 text-sm"
							>
								<Check className="size-5 text-green-600 me-2.5" />
								{feature}
							</div>
						))}
						<div className="flex-center gap-0.5 justify-center h-14 text-sm">
							<p>
								From{" "}
								<span className="text-lg font-bold leading-none">
									$0
								</span>
								/mo
							</p>
						</div>
						<button className="cursor-pointer py-2.5 bg-primary rounded-md text-white text-sm w-full">
							Get Now
						</button>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-3xl table-fixed mx-auto w-full">
							<thead>
								<tr>
									{plans.map((plan) => (
										<th key={plan.name}>
											<div className="flex-center h-15 -z-10">
												<Image
													className="h-3.5 w-18 object-contain md:w-25 md:h-5"
													src={plan.img}
													alt={plan.name}
													width={100}
													height={20}
												/>
											</div>
										</th>
									))}
								</tr>
							</thead>

							<tbody>
								{features.map((feature, i) => (
									<tr key={feature}>
										{plans.map((plan, idx) => (
											<td key={`${feature}-${i}-${idx}`}>
												<div
													className={cn(
														"flex-center h-12 border-b border-b-primary/10 bg-bg-card",
														{
															"rounded-tr-xl":
																i === 0 &&
																plans.length === idx + 1,
															"rounded-bl-xl":
																features.length === i + 1 &&
																idx === 0,
														},
													)}
												>
													{plan.values[i] ? (
														<Check className="size-5 text-green-600" />
													) : (
														<X className="size-5 text-red-500" />
													)}
												</div>
											</td>
										))}
									</tr>
								))}
								<tr className="">
									{plans.map((plan, idx) => (
										<td key={`${plan.name}-${idx}`}>
											<div
												className={cn(
													"flex-center gap-0.5 justify-center h-14 text-sm px-4 md:px-8 bg-bg-card",
													{
														"rounded-br-xl":
															plans.length === idx + 1,
													},
												)}
											>
												<p>
													<span className="text-lg font-bold leading-none">
														${plan.price}
													</span>
													/mo
												</p>
											</div>
										</td>
									))}
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div className="mt-20 mb-8 md:mb-12">
					<SongUploader />
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8 mt-20">
					{countData.map((item) => (
						<div
							key={item.label}
							className="flex-center flex-col gap-2.5"
						>
							<p className="text-2xl md:text-5xl font-bold leading-none text-primary">
								{item.value}+
							</p>
							<h4 className="text-center font-semibold text-text-primary">
								{item.label}
							</h4>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default EscaliumVsOthers;
