import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LoadingTextAnimation = ({
	text,
	className,
}: {
	text: string;
	className?: string;
}) => {
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
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
			animate="show"
			variants={container}
			className={cn("inline", className)}
			transition={{
				repeat: Infinity,
				repeatType: "loop",
				duration: 2,
			}}
		>
			{text.split("").map((char, index) => (
				<motion.span key={index} variants={item}>
					{char}
				</motion.span>
			))}
		</motion.div>
	);
};

export default LoadingTextAnimation;
