export const DotGrid = ({ id = "dots" }: { id?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="opacity-30 inset-0 absolute pointer-events-none w-full h-full"
	>
		<defs>
			<pattern
				id={id}
				x="0"
				y="0"
				width="24"
				height="24"
				patternUnits="userSpaceOnUse"
			>
				<circle
					cx="1.5"
					cy="1.5"
					r="1.5"
					fill="#CBD5E1"
					fillOpacity={0.4}
				/>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill={`url(#${id})`} />
	</svg>
);
