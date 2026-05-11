import SlideDown from "@/components/animations/SlideDown";
import { Parallax } from "react-scroll-parallax";
import {
  pricing_basic,
  pricing_manager,
  PricingCard,
} from "../landing/PricingPlan";

const PricingPlan = ({ annual }: { annual?: boolean }) => {
  return (
    <section>
      <div className="relative z-10 -translate-y-20 overflow-visible px-6 lg:px-8">
        <div className="container">
          <div className="max-w-[1320px] mx-auto">
            <Parallax speed={-2}>
              <SlideDown>
                <div className="">
                  <div className="flex items-center gap-4 mx-auto max-w-[600px] mb-10">
                    <span className="h-px grow bg-current opacity-20"></span>
                    <h3 className="text-center text-xl md:text-3xl font-semibold">
                      For Independent Artists
                    </h3>
                    <span className="h-px grow bg-current opacity-20"></span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-6 max-w-[1320px] mx-auto">
                    {pricing_basic.map((plan, i) => (
                      <PricingCard plan={plan} key={i} />
                    ))}
                  </div>
                </div>
                <div className="mt-20">
                  <div className="flex items-center gap-4 mx-auto max-w-[600px] mb-10">
                    <span className="h-px grow bg-current opacity-20"></span>
                    <h3 className="text-center text-xl md:text-3xl font-semibold">
                      For Managers & Labels
                    </h3>
                    <span className="h-px grow bg-current opacity-20"></span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-6 max-w-[1320px] mx-auto">
                    {pricing_manager.map((plan, i) => (
                      <PricingCard plan={plan} key={i} />
                    ))}
                  </div>
                </div>
              </SlideDown>
            </Parallax>
            <div className="bg-white px-8 py-6 border border-border relative rounded-2xl flex justify-evenly flex-wrap mt-10 gap-x-12 gap-y-6">
              {[
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                      />
                    </svg>
                  ),
                  label: "No credit card to start",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-4.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20.239 3.749a.75.75 0 0 0-.75.75V15H5.549l2.47-2.47a.75.75 0 0 0-1.06-1.06l-3.75 3.75a.75.75 0 0 0 0 1.06l3.75 3.75a.75.75 0 1 0 1.06-1.06L5.55 16.5h14.69a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-.75-.751Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                  label: "Cancel anytime",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                      />
                    </svg>
                  ),
                  label: "Setup in under 5 minutes",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-4.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
                      />
                    </svg>
                  ),
                  label: "Built for independent artists",
                },
              ].map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-2 text-[0.8125rem] text-secondary font-medium"
                >
                  <span className="-translate-y-px">{t.icon}</span>
                  {t.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PricingPlan;
