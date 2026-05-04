import { cn } from "@/lib/utils";

const ROWS = [
	{
		label: "Pricing",
		marketingAgencies: "$500+/mo",
		adsManager: "Pay per ads + learning cost",
		escalium: "From 0$ + adspend",
	},
	{
		label: "Ease of use",
		marketingAgencies: "Hard to communicate",
		adsManager: "Complex dashboards",
		escalium: "Built for artists",
	},
	{
		label: "Setup time",
		marketingAgencies: "Days / weeks onboarding",
		adsManager: "Days / weeks  to learn",
		escalium: "minutes",
	},
	{
		label: "All-in-one dashboard",
		marketingAgencies:
			'<div class="flex gap-1 items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" class="text-red-500"> <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /> </svg> No unified dashboard</div>',
		adsManager:
			'<div class="flex gap-1 items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" class="text-red-500"> <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /> </svg> Multiple platforms</div>',
		escalium:
			'<div class="flex gap-1 items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" class="text-green-500"> <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg> Everything in one place</div>',
	},
	{
		label: "Ad creation",
		marketingAgencies: "Days or weeks + changes + low volume",
		adsManager: "Manual creation",
		escalium: "Seconds away + Lyrics generator",
	},
	{
		label: "Campaign management",
		marketingAgencies: "Managed externally",
		adsManager: "Fragmented per platform",
		escalium: "Simple & centralized",
	},
	{
		label: "Automation",
		marketingAgencies: "Depends on agency",
		adsManager: "Manual",
		escalium: "100% automated",
	},
	{
		label: "Analytics",
		marketingAgencies: "Limited transparency",
		adsManager: "Overwhelming data",
		escalium: "Clear insights about streams growth and real cost per stream",
	},
	{
		label: "Music-specific tools",
		marketingAgencies: "Not specialized",
		adsManager: "Generic tools",
		escalium: "Built for artists",
	},
	{
		label: "Fan growth",
		marketingAgencies: "Varies",
		adsManager: "No music focus",
		escalium: "Designed for real fans",
	},
];
const BestAlternatives = () => {
	return (
		<section className="relative overflow-hidden py-20 lg:py-[120px] bg-white">
			<div className="container">
				<div className="max-w-[1060px] mx-auto">
					<div className="text-center relative mb-12">
						<p className="sectionLabel mb-3">Feature Comparison</p>
						<h2 className="text-3xl lg:text-5xl mb-6">
							Escalium vs{" "}
							<span className="text-primary">the competition</span>
						</h2>
					</div>
					<div className="relative overflow-x-auto border border-border rounded-[20px]">
						<table className="w-full border border-border bg-white rounded-[20px] overflow-hidden border-collapse">
							<colgroup>
								<col style={{ width: "110px" }} />
								<col style={{ width: "120px" }} />
								<col style={{ width: "120px" }} />
								<col style={{ width: "120px" }} />
							</colgroup>
							<thead>
								<tr style={{ background: "#F8F9FC" }}>
									<th className="py-4 px-5 text-start text-[0.75rem] font-bold uppercase tracking-[0.06em] border-b border-border text-muted"></th>
									{[
										{ name: "Marketing Agencies" },
										{
											name: "Ads manager yourself <br /> <span class='font-normal text-xs'>(meta ads, tiktok ads)</span> ",
										},
										{ name: "Escalium.io" },
									].map((col) => (
										<th
											key={col.name}
											className={cn(
												"py-2 px-5 text-center text-sm font-bold border border-border min-w-[120px]",
											)}
											dangerouslySetInnerHTML={{
												__html: col.name,
											}}
										></th>
									))}
								</tr>
							</thead>
							<tbody>
								{ROWS.map((row, i) => (
									<tr
										key={row.label}
										className={cn("", {
											"border-b border-border": i < ROWS.length - 1,
										})}
									>
										<td
											className="text-secondary font-medium text-sm py-3.5 px-5 border-l border-border"
											dangerouslySetInnerHTML={{
												__html: row.label,
											}}
										></td>
										<td
											className="text-secondary font-medium text-sm py-3.5 px-5 text-center border-l border-border"
											dangerouslySetInnerHTML={{
												__html: row.marketingAgencies,
											}}
										></td>
										<td
											className="text-center text-sm py-3.5 px-5 border-l border-border"
											dangerouslySetInnerHTML={{
												__html: row.adsManager,
											}}
										></td>
										<td
											className="bg-bg-card text-center text-sm py-3.5 px-5 border-l border-border"
											dangerouslySetInnerHTML={{
												__html: row.escalium,
											}}
										></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BestAlternatives;
