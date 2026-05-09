import FadeInUp from "@/components/animations/FadeInUp";
import SlideDown from "@/components/animations/SlideDown";
import TextAnimation from "@/components/animations/TextAnimation";
import Marquee from "react-fast-marquee";

export const VIDEOS = [
  {
    id: "01",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/Afro+House+(Show+me+love)+5.mp4",
    name: "Afro house",
    views: "1M",
  },
  {
    id: "02",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/AFRO+HOUSE+MIX+NEW+7.6.mp4",
    name: "Afro house",
    views: "300K",
  },
  {
    id: "03",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/Fire-Fire+7.2.mp4",
    name: "Afro house",
    views: "650K",
  },
  {
    id: "04",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/All+night+17.mp4",
    name: "Deep house",
    views: "4.5M",
  },
  {
    id: "05",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/All+night+18.mp4",
    name: "Deep house",
    views: "200K",
  },
  {
    id: "06",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/ONE+MORE+NIGHT+DEEPHOUSE+4.mp4",
    name: "Deep house",
    views: "1M",
  },
  {
    id: "07",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/Candy+lyrics+11+UPDATED.mp4",
    name: "Techno",
    views: "300K",
  },
  {
    id: "08",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/Candy+lyrics+7+UPDATED.mp4",
    name: "Techno",
    views: "650K",
  },
  {
    id: "09",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/Payphone+3.mp4",
    name: "Techno",
    views: "4.5M",
  },
  {
    id: "10",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/Suavemente+1.mp4",
    name: "Techno",
    views: "200K",
  },
  {
    id: "11",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/Cold+Heart+(Drone+5).mp4",
    name: "Drill",
    views: "300K",
  },
  {
    id: "12",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/Cold+Heart+(Drone+6).mp4",
    name: "Drill",
    views: "650K",
  },
  {
    id: "13",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/GYM+TECHNO+WA+004.mp4",
    name: "HyperTechno",
    views: "4.5M",
  },
  {
    id: "14",
    url: "https://escaliumio.s3.eu-north-1.amazonaws.com/Web-landing/RYB+2.mp4",
    name: "HyperTechno",
    views: "200K",
  },
];

const WhatWeCanGenerate = () => {
  return (
    <section className="relative z-10 py-20 lg:py-[120px]">
      <div className="container">
        <FadeInUp>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl lg:text-5xl mb-6 max-w-[600px] mx-auto">
              <TextAnimation text="See what you can create" />
            </h2>
            <p className="text-secondary">Real videos made with Escalium</p>
          </div>
        </FadeInUp>

        <Marquee>
          {VIDEOS.map((s) => (
            <SlideDown key={s.id}>
              <div className="relative rounded-[12px] overflow-hidden mr-4 md:mr-6 border border-primary">
                <video
                  src={s.url}
                  controls={false}
                  disablePictureInPicture
                  // className="rounded-[10px] w-[300px] h-[533.33px] object-cover"
                  className="rounded-[10px] w-[200px] md:w-[300px] aspect-[300/533.33] object-cover"
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
    </section>
  );
};

export default WhatWeCanGenerate;
