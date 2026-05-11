import { motion } from "framer-motion";
import React from "react";

const FadeInLeft = ({ children }: { children: React.ReactNode }) => {
	const container = {
		hidden: { opacity: 0, x: -50 },
		show: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 1,
			},
		},
	};

	return (
		<motion.div
			initial="hidden"
			whileInView="show"
			variants={container}
			viewport={{ once: true }}
		>
			{children}
		</motion.div>
	);
};

export default FadeInLeft;
