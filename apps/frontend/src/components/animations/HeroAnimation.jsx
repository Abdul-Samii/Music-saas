import { motion } from "framer-motion";

const HeroAnimation = ({ children }) => {
	const container = {
		hidden: { opacity: 0.5, scale: 0.9 },
		show: {
			opacity: 1,
			scale: 1,
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

export default HeroAnimation;
