const LandingFooter = () => {
	return (
		<footer className="py-5 border-t border-gray-200">
			<div className="container flex flex-wrap justify-evenly md:justify-between items-center gap-4">
				<div
					className="font-display text-lg text-dark-bg"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "0.5rem",
					}}
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
				</div>
				<p className="text-[13px] text-gray-400">
					&copy; 2025 Escalium. All rights reserved.
				</p>
				<p className="text-[13px] text-gray-400">escalium.io</p>
			</div>
		</footer>
	);
};

export default LandingFooter;
