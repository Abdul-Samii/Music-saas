import FadeInUp from "@/components/animations/FadeInUp";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Parallax } from "react-scroll-parallax";
import { DotGrid } from "./DotGrid";
import PricingPlan from "./PricingPlan";
import TextAnimation from "@/components/animations/TextAnimation";

const PricingHero = () => {
  const [annual, setAnnual] = useState(false);
  return (
    <>
      {/* Hero */}
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
            <div className="max-w-[680px] mx-auto pt-32 pb-28 px-2 text-center relative">
              <div className="sectionLabel mb-6">
                Simple, transparent pricing
              </div>
              {/* <h1 className="text-white text-[clamp(2rem,5vw,3rem)] leading-[1.15] mb-4 tracking-tight font-black"> */}
              <h1 className="text-4xl lg:text-6xl lg:leading-[1.15] tracking-wide mb-4">
                <span className="text-primary">
                  <TextAnimation text="Start free." />{" "}
                </span>
                <TextAnimation text="Scale when you grow." delay={0.4} />
              </h1>
              <p className="text-gray-400 md:text-lg mb-10">
                No hidden fees. No long-term contracts. Cancel anytime.
              </p>
              {/* Toggle */}
              <div className="bg-white inline-flex items-center gap-3 rounded-full px-7 py-2">
                <span
                  className={cn("text-sm font-semibold", {
                    "text-gray-400": annual,
                    "text-navy": !annual,
                  })}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setAnnual(!annual)}
                  className={cn(
                    "transition-all duration-200 relative border-0 cursor-pointer w-11 h-6 rounded-full",
                    {
                      "bg-blue": annual,
                      "bg-gray-300": !annual,
                    },
                  )}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 3,
                      left: annual ? 23 : 3,
                      transition: "left 0.2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
                <span
                  className={cn("text-sm font-semibold", {
                    "text-navy": annual,
                    "text-gray-400": !annual,
                  })}
                >
                  Annual{" "}
                  <span
                    style={{
                      marginLeft: "0.3rem",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      background: "#F0FDF4",
                      color: "#12B76A",
                      padding: "0.1rem 0.45rem",
                      borderRadius: 99,
                    }}
                  >
                    −20%
                  </span>
                </span>
              </div>
            </div>
          </FadeInUp>
        </Parallax>
      </section>

      <PricingPlan annual={annual} />
    </>
  );
};

export default PricingHero;
