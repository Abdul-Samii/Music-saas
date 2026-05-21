"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { CircleQuestionMark, User } from "lucide-react";
import Image from "next/image";

export interface Author {
	name: string;
	avatar: string;
	avg_read_in_minutes: number;
}

export interface Blog {
	uuid: string;
	slug: string;
	title: string;
	description: string;
	image: string;
	category: string;
	isFeatured: boolean;
	author: Author;
}

const blogs = [
	{
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
	},
	{
		uuid: "7c9e8d1a-4b92-4e5c-bd81-3f4a7c8e9b02",
		slug: "demystifying-the-circle-of-fifths-for-producers",
		title: "Demystifying the Circle of Fifths for Electronic Producers",
		description:
			"Stop clicking random notes in your MIDI roll. Learn how to use this classic music theory tool to write better chord progressions instantly.",
		image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0",
		category: "Music Theory",
		isFeatured: false,
		author: {
			name: "Sarah Jenkins",
			avatar: "https://randomuser.me/api/portraits/women/44.jpg",
			avg_read_in_minutes: 5,
		},
	},
	{
		uuid: "e1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o",
		slug: "how-streaming-algorithms-shape-modern-song-structures",
		title: "The 30-Second Rule: How Streaming Algorithms Altered Songwriting",
		description:
			"An in-depth look at why modern intros are getting shorter, choruses are hitting faster, and the traditional bridge might be dead.",
		image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
		category: "Industry News",
		isFeatured: true,
		author: {
			name: "Elena Rostova",
			avatar: "https://randomuser.me/api/portraits/women/65.jpg",
			avg_read_in_minutes: 6,
		},
	},
	{
		uuid: "a8f3e2d1-0b9c-4d8e-7f6a-5b4c3d2e1f0a",
		slug: "mixing-low-end-tips-for-a-punchy-kick-and-bass",
		title: "Mixing Low End: How to Get Your Kick and Bass to Sit Perfectly",
		description:
			"Tired of muddy mixes? Master the art of sidechaining, phase alignment, and dynamic EQ to give your tracks club-ready low-end clarity.",
		image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625",
		category: "Production & Engineering",
		isFeatured: false,
		author: {
			name: "Alex Rivera",
			avatar: "https://randomuser.me/api/portraits/men/32.jpg",
			avg_read_in_minutes: 8,
		},
	},
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

const ArticlesIndex = () => {
	const featuredBlogs = blogs.filter((blog) => blog.isFeatured);
	const nonFeaturedBlogs = blogs.filter((blog) => !blog.isFeatured);

	return (
		<main className="bg-body-2">
			<Navbar />

			<div className="py-10 lg:py-30 flex gap-5 lg:gap-10 container ">
				<aside className="hidden lg:flex flex-col max-w-xs shrink-0 space-y-3.5">
					<label className="flex flex-col">
						<span className="block font-medium text-secondary mb-1">
							Label
						</span>

						<div className="flex items-center justify-center rounded-full h-9 border py-0.5 px-1.5">
							<User className="size-4 shrink-0" />
							<input
								className="grow focus:ring-0 focus:outline-none px-1.5"
								type="text"
								name=""
								id=""
								placeholder="Search articles..."
							/>
							<CircleQuestionMark className="size-4 text-secondary/50 shrink-0" />
						</div>
					</label>
				</aside>
				<section className="flex-1 grow space-y-3.5 lg:space-y-5">
					<div className="flex flex-col items-center justify-center w-fit">
						<Chip label="read our blog" className="font-medium" />

						<h1 className="text-2xl lg:text-4xl my-3.5 lg:my-5 font-semibold">
							Browse Our Resources
						</h1>
						<p className="text-secondary">
							We provide tips resources from industry leaders. For real.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
						{featuredBlogs.map((blog) => (
							<FeaturedBlog key={blog.uuid} blog={blog} />
						))}

						{nonFeaturedBlogs.map((blog) => (
							<NonFeaturedBlog key={blog.uuid} blog={blog} />
						))}
					</div>
				</section>
			</div>

			<Footer />
		</main>
	);
};

const Chip = ({ label, className }: { label: string; className?: string }) => {
	return (
		<span
			className={cn(
				"rounded-full bg-accent/10 text-accent py-0.5 px-2 text-sm capitalize",
				className,
			)}
		>
			{label}
		</span>
	);
};

const FeaturedBlog = ({ blog }: { blog: Blog }) => {
	return (
		<div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-7.5 md:items-center">
			<div className="relative aspect-square md:aspect-video rounded-xl overflow-hidden">
				<Image
					src={blog.image}
					alt={blog.title}
					fill
					className="object-cover"
					loading="lazy"
				/>
			</div>
			<div className="flex flex-col gap-3.5 md:gap-5">
				<Chip label="Featured" className="w-fit" />
				<h2 className="font-semibold text-xl md:text-3xl">{blog.title}</h2>
				<p className="text-secondary text-sm line-clamp-2">
					{blog.description}
				</p>
				<div className="flex items-center gap-2">
					<Image
						src={blog.author.avatar}
						alt={blog.author.name}
						width={40}
						height={40}
						className="rounded-full object-cover size-10"
					/>
					<div className="flex flex-col">
						<p className="text-sm font-medium">{blog.author.name}</p>
						<p className="text-sm text-secondary">
							{blog.author.avg_read_in_minutes}min read
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const NonFeaturedBlog = ({ blog }: { blog: Blog }) => {
	return (
		<div className="flex flex-col gap-5">
			<div className="relative aspect-square md:aspect-video rounded-xl overflow-hidden">
				<Image
					src={blog.image}
					alt={blog.title}
					fill
					className="object-cover"
					loading="lazy"
				/>
			</div>
			<div className="flex flex-col gap-3.5 md:gap-5">
				<Chip label={blog.category} className="w-fit" />
				<h2 className="font-semibold text-xl md:text-3xl">{blog.title}</h2>
				<p className="text-secondary text-sm line-clamp-2">
					{blog.description}
				</p>
				<div className="flex items-center gap-2">
					<Image
						src={blog.author.avatar}
						alt={blog.author.name}
						width={40}
						height={40}
						className="rounded-full object-cover size-10"
					/>
					<div className="flex flex-col">
						<p className="text-sm font-medium">{blog.author.name}</p>
						<p className="text-sm text-secondary">
							{blog.author.avg_read_in_minutes}min read
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ArticlesIndex;
