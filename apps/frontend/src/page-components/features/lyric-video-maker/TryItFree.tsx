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

const TryItFree = () => {
	return (
		<section className="relative z-10 py-20 bg-white">
			<div className="container">
				<FadeInUp>
					<div className="text-center mb-8 md:mb-12">
						<h2 className="text-3xl lg:text-5xl mb-10">
							Try it for free
						</h2>
						<div className="grid grid-cols-2 max-w-[500px] mx-auto gap-3">
							<div className="text-center border shadow-card border-border rounded-[12px] p-5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="size-5 mx-auto text-secondary"
								>
									<path
										fillRule="evenodd"
										d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
										clipRule="evenodd"
									/>
								</svg>

								<h3 className="text-lg m-0 text-secondary mt-2">
									Create 5 Free Videos
								</h3>
							</div>
							<div className="text-center border shadow-card border-border rounded-[12px] p-5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="size-5 mx-auto text-secondary"
								>
									<path
										fillRule="evenodd"
										d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z"
										clipRule="evenodd"
									/>
									<path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
								</svg>

								<h3 className="text-lg m-0 text-secondary mt-2">
									No Watermakrs
								</h3>
							</div>
						</div>
					</div>
				</FadeInUp>
			</div>
		</section>
	);
};

export default TryItFree;
