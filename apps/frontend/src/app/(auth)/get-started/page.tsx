"use client";

import { cn } from "@/lib/utils";
import EmailForm from "@/page-components/EmailForm";
import GoogleButton from "@/page-components/GoogleButton";
import { DotGrid } from "@/page-components/pricing/DotGrid";

export default function CreateAccount() {
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
          <div>
            <h1 className="text-4xl lg:text-6xl lg:leading-[1.3] tracking-wide mb-12">
              Get Started with
              <span className="text-primary block">Escalium</span>
            </h1>
            <GoogleButton />
            <span className={cn("or w-[220px] my-7!")}>
              <span>or</span>
            </span>
            <EmailForm
              {...{
                inputClass: "border-gray-300 bg-white",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
