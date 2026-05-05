import FadeInUp from "@/components/animations/FadeInUp";
import SlideDown from "@/components/animations/SlideDown";
import TextAnimation from "@/components/animations/TextAnimation";
import Marquee from "react-fast-marquee";

export const VIDEOS = [
  {
    id: "01",
    url: "/img/what-we-can-create/1.mp4",
    name: "hardstyle",
  },
  {
    id: "02",
    url: "/img/what-we-can-create/2.mp4",
    name: "HyperTechno",
  },
  {
    id: "03",
    url: "/img/what-we-can-create/3.mp4",
    name: "K-pop",
  },
  {
    id: "04",
    url: "/img/what-we-can-create/4.mp4",
    name: "Afrohouse",
  },
  {
    id: "05",
    url: "/img/what-we-can-create/5.mp4",
    name: "Techno",
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

        <Marquee pauseOnHover>
          {VIDEOS.map((s) => (
            <SlideDown key={s.id}>
              <video
                src={s.url}
                controls
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                playsInline
                className="rounded-[10px] w-[300px] h-[533.33px] object-cover mr-6"
              />
              <h3 className="mt-3 font-bold text-xl text-center">{s.name}</h3>
            </SlideDown>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default WhatWeCanGenerate;
