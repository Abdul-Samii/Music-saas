import FadeIn from "@/components/animations/FadeIn";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import EmailForm from "../EmailForm";
import GoogleButton from "../GoogleButton";

const CTA = () => {
	return (
		<section
			id="early-access"
			className="py-[120px] relative overflow-hidden"
			style={{
				background:
					"radial-gradient(ellipse 70% 60% at 50% 50%,#eff6ff, transparent)",
			}}
		>
			<div className="container">
				<div className="absolute bottom-0 left-1/2 w-full max-w-[650px] aspect-square bg-primary/5 opacity-30 rounded-full translate-y-1/2 -translate-x-1/2" />
				<div className="relative flex flex-col z-10">
					<FadeIn>
						<div className="text-center mb-12">
							<h2 className="text-3xl lg:text-5xl mb-6">
								<TextAnimation text="Be the first to promote smarter." />
							</h2>
							<p className="text-[17px] font-light max-w-[440px] mx-auto text-gray-500">
								Join the waitlist and get exclusive early access before
								the public launch.
							</p>
						</div>
					</FadeIn>
					<FadeIn>
						<GoogleButton />
						<span className={cn("or w-[220px] my-7!")}>
							<span>or</span>
						</span>
						<EmailForm
							{...{
								inputClass: "border-gray-300",
							}}
						/>
					</FadeIn>
				</div>
			</div>
		</section>
	);
};

export default CTA;
