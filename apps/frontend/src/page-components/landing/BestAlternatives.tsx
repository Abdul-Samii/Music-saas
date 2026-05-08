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
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center relative mb-12">
            <p className="sectionLabel mb-3">Feature Comparison</p>
            <h2 className="text-3xl lg:text-5xl mb-6">
              <span className="text-primary">
                <TextAnimation text="Escalium" />{" "}
              </span>
              <TextAnimation delay={0.4} text="vs the competition" />
            </h2>
          </div>
          <div className="relative overflow-x-auto rounded-[20px] shadow-card">
            <table className="w-full border border-white rounded-[20px] bg-white overflow-hidden border-collapse">
              <colgroup>
                <col style={{ width: "160px" }} />
                <col style={{ width: "160px" }} />
                <col style={{ width: "160px" }} />
                <col style={{ width: "160px" }} />
              </colgroup>
              <thead>
                <tr className="bg-[#F8F9FC]">
                  {[
                    { name: "Feature" },
                    { name: "Escalium" },
                    { name: "Agency" },
                    {
                      name: "DIY Ads",
                    },
                  ].map((col) => (
                    <th
                      key={col.name}
                      className={cn(
                        "py-5 px-5 text-center text-xl font-bold first:text-start first:xl:px-10",
                        {
                          "text-primary bg-[#EEF2FF]": col.name === "Escalium",
                        },
                      )}
                    >
                      {col.name}
                      {col.name === "Escalium" && (
                        <div
                          style={{
                            fontSize: "0.62rem",
                            marginTop: "0.2rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                          className="text-primary"
                        >
                          ← You are here
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={cn("", {
                      "border-b border-border/60": i < ROWS.length - 1,
                    })}
                  >
                    <td className="text-secondary font-medium text-xl py-5 px-5 xl:px-10">
                      {row.label}
                    </td>
                    <td className="text-center text-xl py-3.5 px-5 bg-[#3a60e708]">
                      <div className="flex justify-center">
                        {typeof row?.escalium === "string"
                          ? row.escalium
                          : checkIcon(row?.escalium)}
                      </div>
                    </td>
                    <td className="text-secondary font-medium text-xl py-3.5 px-5 text-center">
                      <div className="flex justify-center">
                        {typeof row?.marketingAgencies === "string"
                          ? row.marketingAgencies
                          : checkIcon(row?.marketingAgencies)}
                      </div>
                    </td>
                    <td className="text-center text-xl py-3.5 px-5">
                      <div className="flex justify-center">
                        {typeof row?.adsManager === "string"
                          ? row.adsManager
                          : checkIcon(row?.adsManager)}
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
    // return <img src="/img/cross-icon.svg" width={36} alt="" />;
    return (
      <img
        src="/img/cross-outlined.svg"
        width={20}
        className="opacity-50"
        alt=""
      />
    );
  }
  if (status === true) {
    return <img src="/img/check-icon.svg" width={36} alt="" />;
  }
  if (status === null) {
    return <img src="/img/warning-icon.svg" width={36} alt="" />;
  }
};
export default BestAlternatives;
