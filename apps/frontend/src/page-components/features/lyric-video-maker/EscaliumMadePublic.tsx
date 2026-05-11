import FadeInUp from "@/components/animations/FadeInUp";

const VIDEOS = [
	{
		id: "01",
		url: "/img/what-we-can-create/1.mp4",
		name: "hardstyle",
	},
	{
		id: "02",
		url: "/img/what-we-can-create/2.mp4",
		name: "HyperTechno",
	},
	{
		id: "03",
		url: "/img/what-we-can-create/3.mp4",
		name: "K-pop",
	},
	{
		id: "04",
		url: "/img/what-we-can-create/4.mp4",
		name: "Afrohouse",
	},
	{
		id: "05",
		url: "/img/what-we-can-create/5.mp4",
		name: "Techno",
	},
];

const EscaliumMadePublic = () => {
	return (
		<section className="relative z-10 py-20">
			<div className="container">
				<FadeInUp>
					<div className="text-center mb-8 md:mb-12">
						<h2 className="text-3xl lg:text-5xl mb-10 mx-auto max-w-[720px]">
							Escalium Was Made Public only After We achieved These
							Results
						</h2>
						<div className="w-fit mx-auto">
							<h3 className="text-lg m-0 text-secondary mt-2 flex items-start gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="size-5 shrink-0"
								>
									<path
										fillRule="evenodd"
										d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
										clipRule="evenodd"
									/>
								</svg>
								100.000.000+ Streams generated
							</h3>
							<h3 className="text-lg m-0 text-secondary mt-2 flex items-start gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="size-5 shrink-0"
								>
									<path
										fillRule="evenodd"
										d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
										clipRule="evenodd"
									/>
								</svg>
								5.000+ Lyric Videos generated
							</h3>
							<h3 className="text-lg m-0 text-secondary mt-2 flex items-start gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="size-5 shrink-0"
								>
									<path
										fillRule="evenodd"
										d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
										clipRule="evenodd"
									/>
								</svg>
								10+ Professional Artists
							</h3>
						</div>
					</div>
				</FadeInUp>
			</div>
		</section>
	);
};

export default EscaliumMadePublic;
