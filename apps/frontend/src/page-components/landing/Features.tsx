import FadeIn from "@/components/animations/FadeIn";
import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";

import { Parallax } from "react-scroll-parallax";

import { VIDEOS } from "../features/video-generator/WhatWeCanGenerate";
import Marquee from "react-fast-marquee";
import SlideDown from "@/components/animations/SlideDown";
const Features = () => {
  return (
    <section className="py-20 lg:py-[120px] overflow-hidden bg-bg-card">
      <div className="container">
        <FadeInUp>
          <div className="text-center mb-16">
            <button className="sectionLabel mx-auto mb-3">Features</button>
            <h2 className="text-3xl lg:text-5xl mx-auto mb-6 max-w-[880px]">
              <TextAnimation text="All you need," />
              <span className="text-primary block">
                <TextAnimation text="in one platform" />
              </span>
            </h2>
            {/* <p className="md:text-lg">
							We built the tools music marketing agencies charge
							thousands for — and made them simple.
						</p> */}
          </div>
        </FadeInUp>
        <FadeInUp>
          <Parallax speed={5}>
            <FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 gap-y-20 lg:gap-y-[120px] lg:gap-x-20 mb-20 lg:mb-[120px]">
                <div className="card bg-white! flex flex-col">
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold leading-[1.3]">
                      <TextAnimation text="Dashboard: your REAL cost per stream updated every minute" />
                    </h3>
                    <p className="text-sm text-muted mt-2 mb-6">
                      We show you the most important cost for your artist. Not
                      CPM, NOT CPC. The CPs (Cost per Stream)
                    </p>
                  </div>
                  <img
                    src="/img/chart.png"
                    alt=""
                    className="border border-border rounded w-full max-w-[400px] mt-auto"
                  />
                </div>
                <div className="flex flex-col">
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold leading-[1.3]">
                      <TextAnimation text="Campaigns: Launch winning campaigns with our secret strategy in just 60 seconds" />
                    </h3>
                    <p className="text-sm text-muted mt-2 mb-6">
                      After investing +200.000$ on ads we found a similarity
                      across all our campaigns, the structure. Now we give it to
                      you so you can start making winning campaigns at the best
                      costs
                    </p>
                  </div>
                  <img
                    src="/img/music-campaign.jpg"
                    alt=""
                    className="border border-border rounded w-full max-w-[370px] mt-auto"
                  />
                </div>
              </div>
              <div>
                <div className="max-w-[720px] mb-10 text-center mx-auto">
                  <h3 className="text-xl md:text-3xl font-bold leading-[1.3]">
                    <TextAnimation text="Create lyric ads within seconds" />
                  </h3>
                  <p className="text-muted mt-2">
                    Stop editing videos for hours just to get no results on ads
                    and 200 views on tiktok. After creating more than 3.000
                    music ads, we found the best videos and we’ve added them to
                    our template library so you can use it by just dragging your
                    song. And yes, you will get this viral tiktok lyrics so you
                    can go viral as well!
                  </p>
                </div>

                <Marquee pauseOnHover>
                  {VIDEOS.map((s) => (
                    <SlideDown key={s.id}>
                      <div className="relative rounded-[10px] overflow-hidden mr-6">
                        <video
                          src={s.url}
                          controls={false}
                          disablePictureInPicture
                          className="rounded-[10px] w-[300px] h-[533.33px] object-cover"
                          autoPlay
                          muted
                        />
                        <div className="absolute w-full left-0 bottom-0 p-3 py-5 bg-linear-to-t from-primary to-transparent">
                          <h3 className="mt-3 font-bold text-xl text-center text-white mb-2">
                            {s.name}
                          </h3>
                          <span className="text-center text-xs text-muted block">
                            this video has generated over {s.views} views
                          </span>
                        </div>
                      </div>
                    </SlideDown>
                  ))}
                </Marquee>
              </div>
            </FadeIn>
          </Parallax>
        </FadeInUp>
      </div>
    </section>
  );
};

export default Features;
