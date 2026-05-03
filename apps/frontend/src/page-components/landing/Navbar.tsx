"use client";
import { arrow_right } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const Navbar = () => {
	const [scrollPosition, setScrollPosition] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollPosition(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 w-full z-100 py-4 transition-all duration-300 border-b border-gray-100",
				{
					"bg-white": scrollPosition > 0,
				},
			)}
		>
			<div className="container mx-auto">
				<nav className="flex items-center justify-between">
					<a
						href="#"
						className={cn(
							"text-[22px] text-dark flex items-center gap-3 duration-300 transition-all font-display",
						)}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/logo.png"
							alt="Escalium"
							width={28}
							height={28}
							style={{ borderRadius: 6 }}
						/>
						<p>
							Escal<span className="text-primary">ium</span>
						</p>
					</a>
					<button
						onClick={() =>
							document
								.getElementById("early-access")
								?.scrollIntoView({ behavior: "smooth" })
						}
						className="btnShiny rounded-md px-5 font-normal! h-12"
					>
						<span>Get early access</span> {arrow_right}
					</button>
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
