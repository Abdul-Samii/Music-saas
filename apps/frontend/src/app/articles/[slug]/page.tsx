import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

const data = {
	uuid: "b3f71c4c-7b0a-4a61-9f93-5bf3b76e0a81",
	slug: "analog-vs-digital-synths-in-2026",
	title: "Analog vs. Digital Synths: Has the Gap Finally Closed?",
	description:
		"With the latest advancements in component-level modeling, we look at whether modern digital hardware can truly match the warmth of classic analog circuitry.",
	image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04",
	category: "Gear Reviews",
	isFeatured: true,
	author: {
		name: "Marcus Vance",
		avatar: "https://randomuser.me/api/portraits/men/81.jpg",
		avg_read_in_minutes: 7,
	},
};

const popular = [
	{
		uuid: "f4e3d2c1-b0a9-4e8d-7c6b-5a4f3e2d1c0b",
		slug: "why-vinyl-sales-continue-to-defy-digital-dominance",
		title: "Spinning On: Why Vinyl Sales Are Outlasting the Digital Hype",
		description:
			"Despite convenience being at an all-time high, physical record sales are booming. We talk to collectors about the ritual of physical music.",
		image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3",
		category: "Vinyl & Culture",
		isFeatured: false,
		author: {
			name: "Liam O'Connor",
			avatar: "https://randomuser.me/api/portraits/men/12.jpg",
			avg_read_in_minutes: 5,
		},
	},
	{
		uuid: "3d2c1b0a-9e8d-7c6b-5a4f-3e2d1c0b9a8f",
		slug: "artist-spotlight-the-underground-ambient-scene-in-tokyo",
		title: "Artist Spotlight: Inside Tokyo's Underground Ambient Renaissance",
		description:
			"We sit down with three rising modular synth artists who are reshaping the Japanese experimental music landscape.",
		image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
		category: "Artist Spotlights",
		isFeatured: false,
		author: {
			name: "David Chen",
			avatar: "https://randomuser.me/api/portraits/men/52.jpg",
			avg_read_in_minutes: 6,
		},
	},
	{
		uuid: "9e8d7c6b-5a4f-3e2d-1c0b-9a8f7e6d5c4b",
		slug: "best-budget-studio-monitors-under-500",
		title: "The 5 Best Budget Studio Monitors for Your Home Setup",
		description:
			"You don't need a million-dollar studio to get an accurate mix. These budget-friendly monitors offer flat frequency responses without breaking the bank.",
		image: "https://images.unsplash.com/photo-1545048702-79362596cdc9",
		category: "Gear Reviews",
		isFeatured: false,
		author: {
			name: "Marcus Vance",
			avatar: "https://randomuser.me/api/portraits/men/81.jpg",
			avg_read_in_minutes: 4,
		},
	},
	{
		uuid: "5a4f3e2d-1c0b-9a8f-7e6d-5c4b3a2f1e0d",
		slug: "creative-block-5-ways-to-spark-new-song-ideas",
		title: "Beating Creative Block: 5 Production Exercises to Try Today",
		description:
			"Staring at a blank DAW screen? Break out of your comfort zone with sampling limitations, random generative tools, and oblique strategies.",
		image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
		category: "Production & Engineering",
		isFeatured: false,
		author: {
			name: "Alex Rivera",
			avatar: "https://randomuser.me/api/portraits/men/32.jpg",
			avg_read_in_minutes: 4,
		},
	},
	{
		uuid: "1c0b9a8f-7e6d-5c4b-3a2f-1e0d9c8b7a6f",
		slug: "the-renaissance-of-shoegaze-in-the-indie-scene",
		title: "Wall of Sound: The Unstoppable Renaissance of Modern Shoegaze",
		description:
			"How a new generation of bedroom guitarists is blending 90s dream-pop textures with aggressive modern trap and electronic production.",
		image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629",
		category: "Artist Spotlights",
		isFeatured: false,
		author: {
			name: "Chloe Bennett",
			avatar: "https://randomuser.me/api/portraits/women/17.jpg",
			avg_read_in_minutes: 5,
		},
	},
	{
		uuid: "7e6d5c4b-3a2f-1e0d-9c8b-7a6f5e4d3c2b",
		slug: "vocal-production-guide-pro-level-chains",
		title: "Vocal Production Secrets: Building a Pro-Level Effects Chain",
		description:
			"From subtle pitch correction to multi-stage compression, learn the exact step-by-step processing order used by top pop and hip-hop engineers.",
		image: "https://images.unsplash.com/photo-1559519529-05066f7312f5",
		category: "Production & Engineering",
		isFeatured: false,
		author: {
			name: "Sarah Jenkins",
			avatar: "https://randomuser.me/api/portraits/women/44.jpg",
			avg_read_in_minutes: 9,
		},
	},
];

const page = () => {
	return (
		<main className="bg-bg">
			<Navbar />
			<div className="container flex flex-col lg:flex-row gap-10 py-24 md:py-30">
				<article className="grow">
					<p className="">
						<Link href="/" className="font-semibold">
							Home
						</Link>
						{" / "}
						<Link href="/articles" className="font-semibold">
							Articles
						</Link>
						{" / "}
						<span className="text-secondary">{data.title}</span>
					</p>
				</article>
				<aside className="shrink-0 w-full lg:w-xs">
					<h3 className="text-lg md:text-xl font-semibold mb-4">
						Popular
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-5">
						{popular.map((p) => (
							<Link
								key={p.uuid}
								href={`/articles/${p.slug}`}
								className="block h-full"
							>
								<div className="relative aspect-3/2 mb-4">
									<Image
										src={p.image}
										alt={p.title}
										fill
										className="object-cover rounded-2xl"
									/>
								</div>

								<h4 className="text-base font-semibold">{p.title}</h4>
							</Link>
						))}
					</div>
				</aside>
			</div>

			<Footer />
		</main>
	);
};

export default page;
