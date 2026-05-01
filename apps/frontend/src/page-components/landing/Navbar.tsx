"use client";
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
				"fixed top-0 left-0 w-full z-100 py-4 transition-all duration-300",
				{
					"bg-white py-4 border-b border-gray-100": scrollPosition > 0,
				},
			)}
		>
			<div className="container mx-auto">
				<nav className="flex items-center justify-between">
					<a
						href="#"
						className={cn(
							"text-[22px] text-white flex items-center gap-3 duration-300 transition-all",
							{
								"text-dark": scrollPosition > 0,
							},
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
						className={cn(
							"link-hover text-white duration-300 transition-all",
							{
								"text-dark": scrollPosition > 0,
							},
						)}
					>
						<span className="unhovered">Get early access</span>
						<span className="hovered">Get early access</span>
					</button>
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
