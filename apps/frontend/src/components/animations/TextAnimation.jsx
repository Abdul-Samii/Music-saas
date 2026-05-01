import { motion } from "framer-motion";

const TextAnimation = ({ text }) => {
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.04,
			},
		},
	};

	const item = {
		hidden: { y: 20, opacity: 0 },
		show: { y: 0, opacity: 1 },
	};

	return (
		<motion.div
			initial="hidden"
			whileInView="show"
			variants={container}
			viewport={{ once: true }}
			className="inline"
		>
			{text.split("").map((char, index) => (
				<motion.span key={index} variants={item}>
					{char}
				</motion.span>
			))}
		</motion.div>
	);
};

export default TextAnimation;
