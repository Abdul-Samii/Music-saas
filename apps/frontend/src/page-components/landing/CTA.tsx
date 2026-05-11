import FadeIn from "@/components/animations/FadeIn";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import EmailForm from "../EmailForm";
import GoogleButton from "../GoogleButton";

const CTA = () => {
	return (
		<section
			id="early-access"
			className="pb-8 relative overflow-hidden bg-primary/2"
		>
			<div className="container">
				<div className="absolute bottom-0 left-1/2 w-full max-w-[650px] aspect-square bg-primary/5 opacity-30 rounded-full translate-y-1/2 -translate-x-1/2" />
				<div className="bg-primary-light px-8 py-16 rounded-2xl">
					<div className="relative flex flex-col z-10">
						<FadeIn>
							<div className="text-center mb-12">
								<h2 className="text-3xl lg:text-5xl mb-6">
									<TextAnimation text="Be the first to promote smarter." />
								</h2>
								<p className="text-[17px] font-light max-w-[440px] mx-auto text-gray-500">
									Join the waitlist and get exclusive early access
									before the public launch.
								</p>
							</div>
						</FadeIn>
						<FadeIn>
							<GoogleButton />
							<span
								className={cn(
									"or w-[220px] my-7! after:bg-gray-300! before:bg-gray-300!",
								)}
							>
								<span>or</span>
							</span>
							<EmailForm
								{...{
									inputClass: "border-gray-300 bg-white",
								}}
							/>
						</FadeIn>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CTA;
