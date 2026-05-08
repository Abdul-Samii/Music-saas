import FadeInDown from "@/components/animations/FadeInDown";
import FadeInUp from "@/components/animations/FadeInUp";
import { Parallax } from "react-scroll-parallax";

const WhyWeExists = () => {
	return (
		<section className="py-20 bg-white">
			<div className="container">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-14 xl:gap-24">
					<div>
						<div className="relative mt-4 max-w-[700px]">
							<div className="absolute top-0 left-0 w-[40%] max-w-[220px]">
								<Parallax speed={3}>
									<FadeInUp>
										<img
											src="/img/v-f-1.jpg"
											className="w-full"
											alt=""
										/>
									</FadeInUp>
								</Parallax>
							</div>
							<div className="px-10 py-20 sm:py-25 sm:px-20 relative">
								<img src="/img/v-f-2.jpg" className="w-full" alt="" />
							</div>
							<div className="absolute bottom-0 right-0 w-[40%] max-w-[220px]">
								<Parallax speed={-3}>
									<FadeInDown>
										<img
											src="/img/v-f-3.jpg"
											className="w-full"
											alt=""
										/>
									</FadeInDown>
								</Parallax>
							</div>
						</div>
					</div>
					<div>
						<div className="max-w-[600px]">
							<h3 className="text-2xl md:text-3xl mb-2">
								Escalium Exists Because we understand Artists Struggles
							</h3>
							<div className="text-secondary">
								<p className="mb-4 max-w-[560px]">
									we know you want to create music, create content,
									upload, go viral, get streams. But creating the
									content is the hard part
								</p>
								<p className="mb-3">Either you:</p>
								<ul className="list-disc pl-4 mb-4">
									<li>Don’t know how to edit</li>
									<li>Don’t have time to edit</li>
									<li>Don’t want to put yourself out there</li>
								</ul>
								<p className="mb-4">
									That’s why we created this video lyrics generator
								</p>
								<p className="mb-4">
									This was built for artists, singers, producers and
									record labels/managers.
								</p>
								<p>Our Platform helps bring your vision to life</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhyWeExists;
