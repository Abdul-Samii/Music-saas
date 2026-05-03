const AudioWave = () => {
	const colors = [
		"#3d10d6",
		"#3f18dc",
		"#4120e2",
		"#4328e8",
		"#4530ee",
		"#4738f4",
		"#4940fa",
		"#4b48ff",
		"#4d52fb",
		"#4f5cf7",
		"#5166f3",
		"#5370ef",
		"#557aeb",
		"#5784e7",
		"#598ee3",
		"#5b98df",
		"#5da2db",
		"#5facd7",
	];

	const bars = [
		{ x: 2, h: 3 },
		{ x: 6, h: 11 },
		{ x: 10, h: 18 },
		{ x: 14, h: 7 },
		{ x: 18, h: 13 },
		{ x: 22, h: 3 },
		{ x: 26, h: 3 },
		{ x: 30, h: 11 },
		{ x: 34, h: 18 },
		{ x: 38, h: 7 },
		{ x: 42, h: 13 },
		{ x: 46, h: 3 },
		{ x: 50, h: 3 },
		{ x: 54, h: 11 },
		{ x: 58, h: 18 },
		{ x: 62, h: 7 },
		{ x: 66, h: 13 },
		{ x: 70, h: 3 },
	];

	return (
		<>
			<svg
				width={115.2}
				height={38.4}
				viewBox="0 0 72 24"
				fill="none"
				strokeWidth={2}
				strokeLinecap="round"
			>
				{bars.map((bar, i) => (
					<path
						key={i}
						d={`M${bar.x} ${12 - bar.h / 2} v${bar.h}`}
						className="wave-bar"
						style={{
							stroke: colors[i],
							animationDelay: `${i * 0.12}s`,
						}}
					/>
				))}
			</svg>

			<style jsx>{`
				.wave-bar {
					transform-origin: center;
					animation: wave 1.4s ease-in-out infinite;
				}

				@keyframes wave {
					0% {
						transform: scaleY(0.4);
						opacity: 0.6;
					}
					50% {
						transform: scaleY(1.2);
						opacity: 1;
					}
					100% {
						transform: scaleY(0.4);
						opacity: 0.6;
					}
				}
			`}</style>
		</>
	);
};

export default AudioWave;
