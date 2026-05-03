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

const LyricVideo = () => {
	return (
		<section className="bg-white relative z-10 py-20 lg:py-[120px]">
			<div className="container">
				<FadeInUp>
					<div className="text-center mb-8 md:mb-12">
						<h2 className="text-3xl lg:text-5xl mb-6">
							Make Lyric Videos For Your Music <br /> In seconds
						</h2>
						<p className="text-secondary  max-w-[600px] mx-auto mb-4">
							Escalium is a Platform designed specifically for music.
							Most Lyric platforms aren’t build for artists, or simply
							aren’t designed to make your videos stand out and get the
							streams you should get.
						</p>
						<p className="text-secondary  max-w-[600px] mx-auto">
							You don’t need to know or have experience with video
							editing.
						</p>
					</div>
					<div className="text-center">
						<button className="btnShiny rounded-md px-5 md:px-10 h-12 md:h-14 inline-flex items-center justify-center md:text-lg! min-w-[170px]">
							<span>Create Video</span>
						</button>
					</div>
				</FadeInUp>
			</div>
		</section>
	);
};

export default LyricVideo;
