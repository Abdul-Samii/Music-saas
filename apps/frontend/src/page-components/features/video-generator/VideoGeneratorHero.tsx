import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { DotGrid } from "@/page-components/pricing/DotGrid";
import Link from "next/link";
import { Parallax } from "react-scroll-parallax";

const VideoGeneratorHero = () => {
	return (
		<section className="relative overflow-hidden pb-24 bg-white">
			<div
				style={{
					background:
						"radial-gradient(circle, rgba(58,96,231,0.1) 0%, transparent 70%)",
				}}
				className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
			/>
			<DotGrid id="dots-pr1" />
			<Parallax speed={-10}>
				<FadeInUp>
					<div className="pt-32 pb-28 px-2 text-center relative">
						<h1 className="text-[clamp(2rem,5vw,3rem)] leading-[1.15] mb-4 tracking-tight font-black">
							<TextAnimation text="AI Lyric Video Generator" />
						</h1>

						<p className="text-gray-400 mb-10 mx-auto max-w-[560px]">
							Create viral lyric videos for social media in seconds
						</p>
						<div className="max-w-[650px] mx-auto">
							<div className="border border-border bg-white shadow-card p-10 rounded-xl">
								<p className="md:text-lg font-semibold">
									Upload your song to get an instant preview
								</p>
								<div className="my-6">
									<div className="flex items-center justify-center gap-1">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width={115.2}
											height={38.4}
											viewBox="0 0 72 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											{[
												{
													d: "M2 10v3",
													delay: "0s",
													color: "#4c1aea",
												},
												{
													d: "M6 6v11",
													delay: "0.222s",
													color: "#4a28ec",
												},
												{
													d: "M10 3v18",
													delay: "0.444s",
													color: "#4635ee",
												},
												{
													d: "M14 8v7",
													delay: "0.667s",
													color: "#4242f0",
												},
												{
													d: "M18 5v13",
													delay: "0.889s",
													color: "#3f4ff2",
												},
												{
													d: "M22 10v3",
													delay: "1.111s",
													color: "#3d10d6",
												},
												{
													d: "M26 10v3",
													delay: "1.333s",
													color: "#3b24de",
												},
												{
													d: "M30 6v11",
													delay: "1.556s",
													color: "#3a38e6",
												},
												{
													d: "M34 3v18",
													delay: "1.778s",
													color: "#3a60e7",
												},
												{
													d: "M38 8v7",
													delay: "2s",
													color: "#3f6ff0",
												},
												{
													d: "M42 5v13",
													delay: "2.222s",
													color: "#447ef8",
												},
												{
													d: "M46 10v3",
													delay: "2.444s",
													color: "#3d10d6",
												},
												{
													d: "M50 10v3",
													delay: "2.667s",
													color: "#4c1aea",
												},
												{
													d: "M54 6v11",
													delay: "2.889s",
													color: "#3a60e7",
												},
												{
													d: "M58 3v18",
													delay: "3.111s",
													color: "#3f6ff0",
												},
												{
													d: "M62 8v7",
													delay: "3.333s",
													color: "#447ef8",
												},
												{
													d: "M66 5v13",
													delay: "3.556s",
													color: "#4c1aea",
												},
												{
													d: "M70 10v3",
													delay: "3.778s",
													color: "#3d10d6",
												},
											].map((bar, index) => (
												<path
													key={index}
													d={bar.d}
													className="bar"
													style={{
														stroke: bar.color,
														animationDelay: bar.delay,
													}}
												/>
											))}
										</svg>
									</div>
								</div>
								<Link
									href="/signup"
									className="btnShiny rounded-md px-5 md:px-7 h-12 inline-flex items-center justify-center"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="size-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
										/>
									</svg>
									Upload your song
								</Link>
								<div class="mt-3 text-xs text-muted-color">
									Max 100MB ·{" "}
									<span class="hidden sm:inline">Formats:</span> MP3,
									WAV, FLAC, AAC, OGG, M4A
								</div>
							</div>
						</div>
					</div>
				</FadeInUp>
			</Parallax>
		</section>
	);
};

export default VideoGeneratorHero;
