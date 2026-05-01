import { motion } from "framer-motion";

const HeroImageAnimation = ({ children }) => {
	const container = {
		hidden: { opacity: 0.5, y: 50 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
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

export default HeroImageAnimation;
