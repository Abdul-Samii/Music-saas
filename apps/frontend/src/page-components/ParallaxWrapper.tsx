"use client";
import { ParallaxProvider } from "react-scroll-parallax";

const ParallaxWrapper = ({ children }: { children: React.ReactNode }) => {
	return <ParallaxProvider>{children}</ParallaxProvider>;
};

export default ParallaxWrapper;
