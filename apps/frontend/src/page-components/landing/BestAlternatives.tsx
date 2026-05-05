import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";

const ROWS = [
  {
    label: "Pricing",
    marketingAgencies: "$$$",
    adsManager: "$$+",
    escalium: "$",
  },
  {
    label: "Ease of use",
    marketingAgencies: false,
    adsManager: false,
    escalium: true,
  },
  {
    label: "Setup time",
    marketingAgencies: "Slow",
    adsManager: "Slow",
    escalium: "Fast",
  },
  {
    label: "All-in-one",
    marketingAgencies: false,
    adsManager: false,
    escalium: true,
  },
  {
    label: "Ad creation",
    marketingAgencies: "Slow",
    adsManager: "Manual",
    escalium: "Instant",
  },
  {
    label: "Automation",
    marketingAgencies: null,
    adsManager: false,
    escalium: true,
  },
  {
    label: "Analytics",
    marketingAgencies: "Limited",
    adsManager: "Complex",
    escalium: "Clear",
  },
  {
    label: "Music-specific",
    marketingAgencies: false,
    adsManager: false,
    escalium: true,
  },
  {
    label: "Fan growth",
    marketingAgencies: "Varies",
    adsManager: "Weak",
    escalium: "Strong",
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
              <span className="text-primary">
                <TextAnimation text="Escalium" />{" "}
              </span>
              <TextAnimation delay={0.4} text="vs the competition" />
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
                  <th className="py-6 px-5 text-start text-[0.75rem] font-bold uppercase tracking-[0.06em] border-b border-border text-muted"></th>
                  {[
                    { name: "Agency" },
                    {
                      name: "DIY Ads",
                    },
                    { name: "Escalium" },
                  ].map((col) => (
                    <th
                      key={col.name}
                      className={cn(
                        "py-2 px-5 text-center text-sm font-bold border border-border min-w-[120px]",
                      )}
                    >
                      {col.name}
                    </th>
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
                    <td className="text-secondary font-medium text-sm py-3.5 px-5 border-l border-border">
                      {row.label}
                    </td>
                    <td className="text-secondary font-medium text-sm py-3.5 px-5 text-center border-l border-border">
                      <div className="flex justify-center">
                        {typeof row?.marketingAgencies === "string"
                          ? row.marketingAgencies
                          : checkIcon(row?.marketingAgencies)}
                      </div>
                    </td>
                    <td className="text-center text-sm py-3.5 px-5 border-l border-border">
                      <div className="flex justify-center">
                        {typeof row?.adsManager === "string"
                          ? row.adsManager
                          : checkIcon(row?.adsManager)}
                      </div>
                    </td>
                    <td className="bg-bg-card text-center text-sm py-3.5 px-5 border-l border-border">
                      <div className="flex justify-center">
                        {typeof row?.escalium === "string"
                          ? row.escalium
                          : checkIcon(row?.escalium)}
                      </div>
                    </td>
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
const checkIcon = (status: boolean | null) => {
  if (status === false) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 text-danger"
      >
        <path
          fillRule="evenodd"
          d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (status === true) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#22c55e" />
        <path
          fillRule="evenodd"
          d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
          clipRule="evenodd"
          className="scale-[0.75] translate-y-[2px] translate-x-[2px] fill-white"
        />
      </svg>
    );
  }
  if (status === null) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5 text-warning"
      >
        <path
          fillRule="evenodd"
          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
};
export default BestAlternatives;
