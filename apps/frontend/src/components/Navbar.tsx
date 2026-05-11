"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<nav
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0.625rem 2.5rem",
					position: "fixed",
					top: 20,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 50,
					background: "rgba(255,255,255,0.85)",
					backdropFilter: "blur(20px)",
					border: "1px solid rgba(255,255,255,0.2)",
					borderRadius: 50,
					boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
					width: "calc(100% - 3rem)",
					maxWidth: 850,
				}}
				className="max-md:px-3!"
			>
				<div className="gap-2 flex items-center justify-between w-full">
					{/* Logo */}
					<Link
						href="/"
						style={{
							textDecoration: "none",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/logo.png"
							alt="Escalium"
							width={30}
							height={30}
							style={{ borderRadius: 6 }}
						/>
						<span
							style={{
								letterSpacing: "-0.02em",
							}}
							className="font-black sm:text-[1.43rem]"
						>
							ESCALIUM
						</span>
					</Link>

					{/* Desktop links */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "2rem",
							position: "absolute",
							left: "50%",
							transform: "translateX(-50%)",
						}}
						className="nav-links"
					>
						<Link
							href="/features/music-marketing"
							className="nav-link"
							style={{
								color: "var(--text-secondary)",
								textDecoration: "none",
								fontSize: "0.9375rem",
								fontWeight: 500,
							}}
						>
							Features
						</Link>
						<Link
							href="/pricing"
							className="nav-link"
							style={{
								color: "var(--text-secondary)",
								textDecoration: "none",
								fontSize: "0.9375rem",
								fontWeight: 500,
							}}
						>
							Pricing
						</Link>
						<Link
							href="/alternatives"
							className="nav-link"
							style={{
								color: "var(--text-secondary)",
								textDecoration: "none",
								fontSize: "0.9375rem",
								fontWeight: 500,
							}}
						>
							Alternatives
						</Link>
						<Link
							href="/article/how-to-promote-your-song"
							className="nav-link"
							style={{
								color: "var(--text-secondary)",
								textDecoration: "none",
								fontSize: "0.9375rem",
								fontWeight: 500,
							}}
						>
							Blog
						</Link>
					</div>

					{/* CTA + hamburger */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "0.75rem",
						}}
					>
						<button
							onClick={() => setOpen(!open)}
							style={{
								display: "none",
								background: "none",
								border: "none",
								cursor: "pointer",
								color: "var(--text-secondary)",
								fontSize: "1.25rem",
								padding: "0.25rem",
							}}
							className="nav-hamburger"
							aria-label="Menu"
						>
							{open ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18 18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									/>
								</svg>
							)}
						</button>
						<Link
							href="/signup"
							style={{
								boxShadow: "0 4px 15px rgba(58,96,231,0.35)",
							}}
							className="whitespace-nowrap font-semibold text-sm rounded-full py-2 px-4 sm:px-5 text-white bg-primary"
						>
							Start for Free
						</Link>
					</div>
				</div>
			</nav>

			{/* Mobile dropdown */}
			{open && (
				<div
					style={{
						position: "fixed",
						top: 80,
						left: "50%",
						transform: "translateX(-50%)",
						width: "calc(95% - 2rem)",
						background: "rgba(255,255,255,0.97)",
						backdropFilter: "blur(20px)",
						borderRadius: 16,
						padding: "1.25rem",
						boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
						border: "1px solid var(--border)",
						zIndex: 49,
						display: "flex",
						flexDirection: "column",
						gap: "0.875rem",
					}}
				>
					{[
						{ label: "Features", href: "/features/music-marketing" },
						{ label: "Pricing", href: "/pricing" },
						{ label: "Alternatives", href: "/alternatives" },
						{ label: "Blog", href: "/article/how-to-promote-your-song" },
					].map((l) => (
						<Link
							key={l.label}
							href={l.href}
							onClick={() => setOpen(false)}
							style={{
								color: "var(--text-secondary)",
								textDecoration: "none",
								fontWeight: 500,
								fontSize: "0.9375rem",
							}}
						>
							{l.label}
						</Link>
					))}
				</div>
			)}

			<style jsx global>{`
				@media (max-width: 768px) {
					nav {
						width: calc(95% - 2rem) !important;
						padding: 0.5rem 1.5rem !important;
					}
					.nav-links {
						display: none !important;
					}
					.nav-hamburger {
						display: block !important;
					}
				}
			`}</style>
		</>
	);
}
