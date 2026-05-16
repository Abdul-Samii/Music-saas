"use client";

import { animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

type CounterProps = {
	from?: number;
	to: number;
	duration?: number;
	className?: string;
	suffix?: string;
	prefix?: string;

	// separator options
	separator?: string;
};

export default function Counter({
	from = 0,
	to,
	duration = 2,
	className = "",
	suffix = "",
	prefix = "",
	separator,
}: CounterProps) {
	const ref = useRef<HTMLSpanElement>(null);

	const motionValue = useMotionValue(from);

	const isInView = useInView(ref, {
		once: true,
	});

	// reusable formatter
	const formatNumber = (value: number) => {
		const rounded = Math.round(value).toString();

		// no separator
		if (!separator) return rounded;

		return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	};

	useEffect(() => {
		if (!isInView) return;

		const controls = animate(motionValue, to, {
			duration,
			ease: "easeOut",

			onUpdate(value) {
				if (ref.current) {
					ref.current.textContent = prefix + formatNumber(value) + suffix;
				}
			},
		});

		return () => controls.stop();
	}, [motionValue, to, duration, isInView, prefix, suffix, separator]);

	return (
		<span ref={ref} className={className}>
			{prefix}
			{formatNumber(from)}
			{suffix}
		</span>
	);
}
