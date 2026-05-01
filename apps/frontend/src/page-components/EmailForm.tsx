import { cn } from "@/lib/utils";
import { useState } from "react";

const EmailForm = () => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState(false);

	function submit() {
		if (!email || !email.includes("@")) {
			setError(true);
			return;
		}
		// Fire Meta Lead event
		if (
			typeof window !== "undefined" &&
			(window as Window & { fbq?: (...args: unknown[]) => void }).fbq
		) {
			(window as Window & { fbq?: (...args: unknown[]) => void }).fbq!(
				"track",
				"Lead",
			);
		}
		window.location.href = `/signup?email=${encodeURIComponent(email)}`;
	}

	return (
		<div className="flex justify-center flex-wrap gap-4">
			<input
				type="email"
				value={email}
				placeholder="your@email.com"
				className={cn(
					"w-[120px] grow max-w-[280px] h-12 border border-white/20 rounded-md px-6 outline-0! shadow-none! ring-0 bg-white/5 bg-transparent",
					{
						"border-red-500": error,
					},
				)}
				onChange={(e) => {
					setEmail(e.target.value);
					setError(false);
				}}
				onKeyDown={(e) => e.key === "Enter" && submit()}
			/>
			<button
				className="btnShiny rounded-md px-5 font-normal!"
				onClick={submit}
			>
				Get early access →
			</button>
		</div>
	);
};

export default EmailForm;
