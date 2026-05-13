"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Parallax } from "react-scroll-parallax";
import EmailForm from "../EmailForm";
import GoogleButton from "../GoogleButton";
import { DotGrid } from "../pricing/DotGrid";
import BuiltFor from "./BuiltFor";

const Hero = () => {
  // const [daysRemaining, setDaysRemaining] = useState(0);

  // useEffect(() => {
  //   const launchDate = new Date("2026-05-11");
  //   const today = new Date();
  //   const diffTime = launchDate.getTime() - today.getTime();
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   setDaysRemaining(diffDays);
  // }, []);

  return (
    <section>
      <div className="py-20 min-h-screen relative overflow-hidden flex flex-col justify-center bg-primary/2">
        <div
          style={{
            background:
              "radial-gradient(circle, rgba(58,96,231,0.1) 0%, transparent 70%)",
          }}
          className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
        />
        <DotGrid id="dots-hero" />
        <div className="mx-auto max-w-5xl px-6 text-center relative z-20 max-lg:pt-16">
          <Parallax speed={-5}>
            <div>
              {/* <FadeInUp> */}
              {/* {daysRemaining > 0 && (
                <button className="sectionLabel mx-auto mb-4">
                  {daysRemaining} {daysRemaining > 1 ? "days" : "day"} left from
                  launching
                </button>
              )} */}
              <h1 className="text-4xl lg:text-6xl lg:leading-[1.3] tracking-wide">
                {/* <TextAnimation text="" /> */}
                You make the music
                <span className="text-primary block">
                  {/* <TextAnimation text="" delay={0.8} /> */}
                  Escalium Scales it.
                </span>
              </h1>

              <p className="max-w-2xl mx-auto md:text-lg lg:text-xl mt-6 mb-8 text-secondary">
                Escalium is your all in one music platform, we integrate
                everything you need to create content, make campaigns, and
                achieve success.
              </p>
              <GoogleButton />
              <span className={cn("or w-[220px] my-7!")}>
                <span>or</span>
              </span>
              <EmailForm
                {...{
                  inputClass: "border-gray-300 bg-white",
                }}
              />
              {/* </FadeInUp> */}
            </div>
          </Parallax>
        </div>
      </div>
      <BuiltFor />
    </section>
  );
};

export default Hero;
