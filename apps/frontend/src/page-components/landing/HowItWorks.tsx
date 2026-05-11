import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { arrow_right } from "@/components/icons";
import { Parallax } from "react-scroll-parallax";

const steps = [
  {
    num: (
      <svg
        width="20"
        height="25"
        viewBox="0 0 20 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.75 21.25H11.25V16.0312L13.25 18.0312L15 16.25L10 11.25L5 16.25L6.78125 18L8.75 16.0312V21.25ZM2.5 25C1.8125 25 1.22396 24.7552 0.734375 24.2656C0.244792 23.776 0 23.1875 0 22.5V2.5C0 1.8125 0.244792 1.22396 0.734375 0.734375C1.22396 0.244792 1.8125 0 2.5 0H12.5L20 7.5V22.5C20 23.1875 19.7552 23.776 19.2656 24.2656C18.776 24.7552 18.1875 25 17.5 25H2.5ZM11.25 8.75V2.5H2.5V22.5H17.5V8.75H11.25ZM2.5 2.5V8.75V2.5V8.75V22.5V2.5Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Upload your song",
    desc: "Drag and dropp or select your .mp3 .flac or .wav",
  },
  {
    num: (
      <svg
        width="27"
        height="22"
        viewBox="0 0 27 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.5 17.5V7.5C2.5 7.58333 2.5 7.72917 2.5 7.9375C2.5 8.14583 2.5 8.41667 2.5 8.75V16.375V17.5ZM2.5 20C1.8125 20 1.22396 19.7552 0.734375 19.2656C0.244792 18.776 0 18.1875 0 17.5V2.5C0 1.8125 0.244792 1.22396 0.734375 0.734375C1.22396 0.244792 1.8125 0 2.5 0L5 5H8.75L6.25 0H8.75L11.25 5H15L12.5 0H15L17.5 5H21.25L18.75 0H22.5C23.1875 0 23.776 0.244792 24.2656 0.734375C24.7552 1.22396 25 1.8125 25 2.5V7.5H22.5H2.5V17.5H12.5V20H2.5ZM15 21.25V17.4062L21.9062 10.5312C22.0938 10.3438 22.3021 10.2083 22.5312 10.125C22.7604 10.0417 22.9896 10 23.2188 10C23.4688 10 23.7083 10.0469 23.9375 10.1406C24.1667 10.2344 24.375 10.375 24.5625 10.5625L25.7188 11.7188C25.8854 11.9062 26.0156 12.1146 26.1094 12.3438C26.2031 12.5729 26.25 12.8021 26.25 13.0312C26.25 13.2604 26.2083 13.4948 26.125 13.7344C26.0417 13.974 25.9062 14.1875 25.7188 14.375L18.8438 21.25H15ZM24.375 13.0312L23.2188 11.875L24.375 13.0312ZM16.875 19.375H18.0625L21.8438 15.5625L21.2812 14.9688L20.6875 14.4062L16.875 18.1875V19.375ZM21.2812 14.9688L20.6875 14.4062L21.8438 15.5625L21.2812 14.9688Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Generate ads in seconds",
    desc: "Escalium makes winning ads and pieces of content focused on grabbing attention and turns them into streams in spotify",
  },
  {
    num: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.5 10L20.9375 6.5625L17.5 5L20.9375 3.4375L22.5 0L24.0625 3.4375L27.5 5L24.0625 6.5625L22.5 10ZM22.5 27.5L20.9375 24.0625L17.5 22.5L20.9375 20.9375L22.5 17.5L24.0625 20.9375L27.5 22.5L24.0625 24.0625L22.5 27.5ZM10 23.75L6.875 16.875L0 13.75L6.875 10.625L10 3.75L13.125 10.625L20 13.75L13.125 16.875L10 23.75ZM10 17.6875L11.25 15L13.9375 13.75L11.25 12.5L10 9.8125L8.75 12.5L6.0625 13.75L8.75 15L10 17.6875Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Create campaign",
    desc: "Create campaign with just a few clicks and select your desire budget",
  },
  {
    num: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 9.99446L6.9375 11.0257C7.22917 10.4424 7.53125 9.87987 7.84375 9.33821C8.15625 8.79654 8.5 8.25487 8.875 7.71321L7.125 7.36946L4.5 9.99446ZM8.9375 12.5882L12.5 16.1195C13.375 15.7861 14.3125 15.2757 15.3125 14.5882C16.3125 13.9007 17.25 13.1195 18.125 12.2445C19.5833 10.7861 20.724 9.16633 21.5469 7.38508C22.3698 5.60383 22.7292 3.96321 22.625 2.46321C21.125 2.35904 19.4792 2.71841 17.6875 3.54133C15.8958 4.36425 14.2708 5.50487 12.8125 6.96321C11.9375 7.83821 11.1562 8.77571 10.4688 9.77571C9.78125 10.7757 9.27083 11.7132 8.9375 12.5882ZM14.5 10.557C14.0208 10.0778 13.7812 9.48925 13.7812 8.79133C13.7812 8.09341 14.0208 7.50487 14.5 7.02571C14.9792 6.54654 15.5729 6.30696 16.2812 6.30696C16.9896 6.30696 17.5833 6.54654 18.0625 7.02571C18.5417 7.50487 18.7812 8.09341 18.7812 8.79133C18.7812 9.48925 18.5417 10.0778 18.0625 10.557C17.5833 11.0361 16.9896 11.2757 16.2812 11.2757C15.5729 11.2757 14.9792 11.0361 14.5 10.557ZM15.0938 20.5882L17.7188 17.9632L17.375 16.2132C16.8333 16.5882 16.2917 16.9267 15.75 17.2288C15.2083 17.5309 14.6458 17.8278 14.0625 18.1195L15.0938 20.5882ZM24.875 0.181956C25.2708 2.70279 25.026 5.15591 24.1406 7.54133C23.2552 9.92675 21.7292 12.2028 19.5625 14.3695L20.1875 17.4632C20.2708 17.8799 20.25 18.2861 20.125 18.682C20 19.0778 19.7917 19.4215 19.5 19.7132L14.25 24.9632L11.625 18.807L6.28125 13.4632L0.125 10.8382L5.34375 5.58821C5.63542 5.29654 5.98438 5.08821 6.39062 4.96321C6.79688 4.83821 7.20833 4.81737 7.625 4.90071L10.7188 5.52571C12.8854 3.35904 15.1562 1.82779 17.5312 0.931956C19.9062 0.0361223 22.3542 -0.213878 24.875 0.181956ZM2.34375 17.432C3.07292 16.7028 3.96354 16.333 5.01562 16.3226C6.06771 16.3122 6.95833 16.6715 7.6875 17.4007C8.41667 18.1299 8.77604 19.0205 8.76562 20.0726C8.75521 21.1247 8.38542 22.0153 7.65625 22.7445C7.13542 23.2653 6.26562 23.7132 5.04688 24.0882C3.82812 24.4632 2.14583 24.7965 0 25.0882C0.291667 22.9424 0.625 21.2601 1 20.0413C1.375 18.8226 1.82292 17.9528 2.34375 17.432ZM4.125 19.182C3.91667 19.3903 3.70833 19.7705 3.5 20.3226C3.29167 20.8747 3.14583 21.432 3.0625 21.9945C3.625 21.9111 4.18229 21.7705 4.73438 21.5726C5.28646 21.3747 5.66667 21.1715 5.875 20.9632C6.125 20.7132 6.26042 20.4111 6.28125 20.057C6.30208 19.7028 6.1875 19.4007 5.9375 19.1507C5.6875 18.9007 5.38542 18.7809 5.03125 18.7913C4.67708 18.8017 4.375 18.932 4.125 19.182Z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "Watch your streams grow",
    desc: "Enjoy watching your streams grow while you focus on what you love, creating and producing music",
  },
];
const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-[120px] overflow-hidden">
      <div className="container">
        <FadeInUp>
          <div className="text-center mb-12 md:mb-16">
            <span className="sectionLabel mb-3">How it works</span>
            <h2 className="text-3xl lg:text-5xl mb-6">
              <TextAnimation text="All Built with one goal." />
              <span className="text-primary block">
                <TextAnimation text="Simplicity." delay={0.9} />
              </span>
            </h2>
            {/* <p className="md:text-lg">
							No ad agency. No complicated tools. Just your music and
							results.
						</p> */}
          </div>
        </FadeInUp>
        <Parallax speed={-5}>
          <FadeInUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-y-12 text-center mx-auto max-sm:max-w-[320px]">
              {steps.map((step, i) => (
                <div className="group relative sm:px-4" key={i}>
                  <FadeInUp>
                    <div className="absolute hidden lg:block border-b border-gray-200 top-12 w-full left-1/2 group-first:left-1/2 group-last:hidden"></div>
                    <div className="mx-auto w-20 bg-white relative">
                      <div className="mb-4 md:mb-6 h-20 flex-center shadow-sm bg-primary/20 border-[3px] border-white rounded-full text-primary group-hover:text-white group-hover:bg-primary mx-auto">
                        {step.num}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-semibold">
                        <TextAnimation text={step.title} />
                      </h4>
                      <p className="text-sm text-dark/70 mt-3 mb-0">
                        {step.desc}
                      </p>
                    </div>
                  </FadeInUp>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <button
                onClick={() =>
                  document
                    .getElementById("early-access")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btnShiny rounded-md px-5 font-normal! h-12"
              >
                <span>Get early access</span> {arrow_right}
              </button>
            </div>
          </FadeInUp>
        </Parallax>
      </div>
    </section>
  );
};

export default HowItWorks;
