const BuiltFor = () => {
	return (
		<section>
			<div className="py-8 border-b border-gray-200 flex gap-3 justify-center flex-wrap items-center">
				<span className="text-[11px]  uppercase mr-2 font-semibold">
					Built for
				</span>
				{[
					"Independent Artists",
					"Music Producers",
					"Record Labels",
					"Artist Managers",
				].map((l) => (
					<span
						key={l}
						className="px-4.5 py-2 rounded-full bg-gray-50 text-xs hover:bg-primary/10 hover:text-primary"
					>
						{l}
					</span>
				))}
			</div>
		</section>
	);
};

export default BuiltFor;
