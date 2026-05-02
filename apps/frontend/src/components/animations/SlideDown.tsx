import { motion } from "framer-motion";
import React from "react";

const SlideDown = ({ children }: { children: React.ReactNode }) => {
	const container = {
		hidden: { transform: "translateY(-50px)" },
		show: {
			transform: "translateY(0)",
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

export default SlideDown;
