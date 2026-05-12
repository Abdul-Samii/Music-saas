"use client";

import FadeInUp from "@/components/animations/FadeInUp";
import SlideDown from "@/components/animations/SlideDown";
import TextAnimation from "@/components/animations/TextAnimation";
import Marquee from "react-fast-marquee";
import { useEffect, useRef, useState } from "react";

export const VIDEOS = [
  {
    id: "01",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/ssstik.io_%40discover.xyz_1778512585262.mp4",
    name: "on Tiktok",
    views: "+1.1 Million Views",
  },
  {
    id: "02",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/ssstik.io_%40discover.xyz_1778512637934.mp4",
    name: "on Tiktok",
    views: "+700.000 Views",
  },
  {
    id: "03",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/ssstik.io_%40discover.xyz_1778512752728.mp4",
    name: "on Tiktok",
    views: "51.000 Views",
  },
  {
    id: "04",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/ssstik.io_%40discover.xyz_1778512710693.mp4",
    name: "on Tiktok",
    views: "40.000 Views",
  },
  {
    id: "05",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/ssstik.io_%40discover.xyz_1778512673023.mp4",
    name: "on Tiktok",
    views: "10.000 Views",
  },
];

const WhatWeCanGenerate = () => {
  return (
    <section className="relative z-10 py-20 lg:py-[120px] bg-white">
      <div className="container">
        <FadeInUp>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl lg:text-5xl mb-6 max-w-[600px] mx-auto">
              <TextAnimation text="Make viral videos" />
              <br />
              <span className="text-primary">
                <TextAnimation text="for any song" />
              </span>
            </h2>
            <p className="text-secondary mx-auto max-w-[820px]">
              After analysing and making thousands of lyric videos for our users
              and for our clients we’ve seen that the videos we make, actually
              go viral on social media. One viral video can change an artist's
              or a producer's life.
            </p>
          </div>

          <h3 className="text-2xl lg:text-3xl mb-6 max-w-[600px] mx-auto text-center">
            <span className="text-primary">Create Videos</span> Like These
          </h3>
        </FadeInUp>
      </div>
      <Marquee>
        {[...VIDEOS, ...VIDEOS].map((s, i) => (
          <SlideDown key={`${s.id}-${i}`}>
            <LazyVideoCard url={s.url} name={s.name} views={s.views} />
          </SlideDown>
        ))}
      </Marquee>
    </section>
  );
};

function LazyVideoCard({
  url,
  name,
  views,
}: {
  url: string;
  name: string;
  views: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-[12px] overflow-hidden mr-4 md:mr-6"
    >
      <div className="rounded-[12px] border border-primary">
        <video
          src={shouldLoad ? url : undefined}
          controls={false}
          disablePictureInPicture
          className="rounded-[10px] w-[200px] md:w-[300px] aspect-[300/533.33] object-cover"
          autoPlay={shouldLoad}
          muted
          loop
          playsInline
          preload="none"
        />
      </div>
      {/* <div className="absolute w-full left-0 bottom-0 p-3 py-5 bg-linear-to-t from-primary to-transparent"> */}
      <div className="p-3 py-5">
        {/* <h4 className="text-center text-xs text-muted block"> */}
        <h4 className="text-center text-lg font-semibold text-muted block text-secondary">
          <span className="text-primary">{views}</span> {name}
        </h4>
      </div>
    </div>
  );
}

export default WhatWeCanGenerate;
