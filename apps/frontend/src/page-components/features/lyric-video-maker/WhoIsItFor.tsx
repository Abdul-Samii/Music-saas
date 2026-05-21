import FadeInUp from "@/components/animations/FadeInUp";
import SlideDown from "@/components/animations/SlideDown";
import TextAnimation from "@/components/animations/TextAnimation";
import { Building, MicVocal, SlidersVertical } from "lucide-react";

const VideoEditors = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M14.5 3.00293C17.2939 3.02331 18.8237 3.16641 19.8284 4.17112C21 5.34269 21 7.22831 21 10.9995V12.9995C21 16.7708 21 18.6564 19.8284 19.828C18.8237 20.8327 17.2939 20.9758 14.5 20.9962M9.49991 20.9962C6.70609 20.9758 5.17627 20.8327 4.17157 19.828C3 18.6564 3 16.7708 3 12.9995V10.9995C3 7.22831 3 5.34269 4.17157 4.17112C5.17627 3.16642 6.70609 3.02331 9.49991 3.00293"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M17 4V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M12 2V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 3"
      ></path>
      <path
        d="M7 4V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M3.5 8.5H7M20.5 8.5H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M3.5 15.5H7M20.5 15.5H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
    </g>
  </svg>
);

const ContentCreators = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    imageRendering="optimizeQuality"
    fillRule="evenodd"
    clipRule="evenodd"
    viewBox="0 0 512 445.97"
    fill="currentColor"
  >
    <path d="m76.83 122.53-20.86-20.01H8.46c-2.3 0-4.42-.96-5.96-2.48A8.42 8.42 0 0 1 0 94.06V29.13c0-2.33.97-4.44 2.49-5.97l.21-.19c1.52-1.43 3.57-2.31 5.76-2.31h85.18c2.3 0 4.43.97 5.96 2.5 1.53 1.53 2.5 3.66 2.5 5.97v64.93c0 2.31-.95 4.43-2.49 5.97l-.21.19a8.418 8.418 0 0 1-5.76 2.3H82.6v17.82c0 1.83-1.48 3.31-3.3 3.31-.99 0-1.87-.43-2.47-1.12zm325.96-10.13 17.14-16.43c.66-.64 1.52-.95 2.38-.95l50.87-.02c.53 0 1.03-.22 1.37-.56.34-.35.57-.85.57-1.38V34.44c0-.52-.23-1.02-.58-1.36-.35-.35-.84-.58-1.36-.58h-88.76c-.51 0-1.01.23-1.36.58-.35.35-.58.84-.58 1.36v58.62c0 .52.22 1.02.58 1.37.34.34.84.57 1.36.57h14.94c1.89 0 3.43 1.55 3.43 3.44v13.96zM255.64 393.17c11.22 0 20.32 9.1 20.32 20.32s-9.1 20.31-20.32 20.31-20.31-9.09-20.31-20.31c0-11.22 9.09-20.32 20.31-20.32zm-52.16-115.82c26.42 29.69 86.25 24.46 108.37.15-5.14-5.74-10.61-13.78-15.32-20.68-1.06-1.55-2.07-3.04-3.04-4.44-9.98 6.72-21.86 10.85-36.76 10.81-16.59-.04-29.5-5.73-40.23-14.43-3.02 8.99-7.43 21.37-11.69 27.27-.38.53-.83.97-1.33 1.32zm102.84 52.62H92.33c-8.14 0-14.75 7.62-13.53 16.93l12.82 99.07H59.03c.02-52.91-18.75-117.82 36.61-148.69 20.62-11.5 78.61-15.4 101.79-30.59 3.55-6.65 7.48-18.59 9.82-25.71.27-.8-.16.52.24-.69-8.52-9.15-15.48-19.96-22.17-30.59l-19.09-30.35c-6.98-10.42-10.61-19.94-10.84-27.74-.1-3.68.52-7.02 1.88-9.94 1.42-3.07 3.61-5.64 6.57-7.63 1.37-.93 2.92-1.71 4.62-2.36-1.24-16.46-1.7-37.22-.9-54.58.41-4.13 1.2-8.25 2.35-12.37 6.99-24.98 28.46-42.97 52.98-51.44 11.89-4.11 7.3-13.91 19.33-13.26 28.5 1.56 72.47 19.92 89.37 39.41 23.68 27.3 17.57 60.91 16.77 94.21 5.3 1.61 8.69 4.97 10.08 10.4 1.54 6.02-.13 14.51-5.24 26.08h-.01c-.1.21-.2.42-.32.62l-21.76 35.84c-8.39 13.81-16.91 27.66-28.27 38.3l-.56.51c1.09 1.57 2.27 3.29 3.5 5.1 3.78 5.54 8.08 11.85 12.07 16.78 23.64 14.7 80.55 18.66 100.88 30 50.9 28.37 33.5 98.44 36.46 148.69h-32.44l12.82-99.07c1.21-9.32-5.39-16.93-13.53-16.93H306.32zM179.47 140.49c-4.23.17-7.43 1.05-9.63 2.52-1.25.84-2.17 1.91-2.76 3.18-.65 1.42-.95 3.14-.9 5.12.17 5.81 3.21 13.4 9.1 22.15l.08.13 19.1 30.36c7.66 12.18 15.68 24.59 25.66 33.71 9.59 8.77 21.23 14.71 36.61 14.75 16.67.04 28.86-6.14 38.75-15.4 10.29-9.62 18.41-22.83 26.41-36l21.51-35.43c4.01-9.15 5.47-15.27 4.55-18.86-.54-2.14-2.91-3.18-6.93-3.39-.85-.04-1.73-.05-2.62-.03-.96.03-1.96.1-3 .19-.58.06-1.13.02-1.67-.1-1.91.1-3.88-.03-5.89-.33l7.37-32.6c-54.66 8.62-95.54-31.98-153.32-8.11l4.16 38.42c-2.33.11-4.54.03-6.58-.28zm249.61 33.4c4.09 0 7.41 3.32 7.41 7.42 0 4.09-3.32 7.42-7.41 7.42-4.1 0-7.43-3.33-7.43-7.42 0-4.1 3.33-7.42 7.43-7.42zm30.69 31.85 14.85-25.67 19.79 25.53v14.35h-84.92v-4.94l13.49-.31 6.18-15.15 3.09 10.82h9.28l8.04-20.72 10.2 16.09zm-55.47-55.26h95.3c3.4 0 6.51 1.4 8.76 3.64l.2.23c2.13 2.23 3.44 5.26 3.44 8.54v61.14c0 3.39-1.4 6.5-3.65 8.75-2.27 2.26-5.35 3.66-8.75 3.66h-95.3c-3.39 0-6.5-1.41-8.75-3.66a12.327 12.327 0 0 1-3.65-8.75v-61.14c0-3.41 1.4-6.52 3.65-8.77a12.36 12.36 0 0 1 8.75-3.64zm95.3 7.83h-95.3c-1.25 0-2.4.52-3.23 1.34-.82.83-1.34 1.98-1.34 3.24v61.14c0 1.26.52 2.41 1.34 3.23a4.5 4.5 0 0 0 3.23 1.35h95.3c1.25 0 2.4-.51 3.22-1.34a4.54 4.54 0 0 0 1.35-3.24v-61.14c0-1.2-.47-2.3-1.21-3.12l-.13-.12a4.61 4.61 0 0 0-3.23-1.34zm-98.87-81c-1.9 0-3.45-1.54-3.45-3.44s1.55-3.44 3.45-3.44h47.56a3.44 3.44 0 1 1 0 6.88h-47.56zm0-21.1c-1.9 0-3.45-1.54-3.45-3.44s1.55-3.45 3.45-3.45h58.32c1.9 0 3.44 1.55 3.44 3.45 0 1.9-1.54 3.44-3.44 3.44h-58.32zm22.95 45.67-21.8 20.9c-.63.68-1.53 1.11-2.52 1.11-1.9 0-3.44-1.55-3.44-3.44v-18.57h-11.5c-2.42 0-4.64-1-6.23-2.59a8.843 8.843 0 0 1-2.59-6.23V34.44c0-2.41 1.01-4.63 2.6-6.22 1.6-1.6 3.81-2.6 6.22-2.6h88.76c2.41 0 4.63 1 6.22 2.6a8.783 8.783 0 0 1 2.59 6.22v58.62c0 2.42-.99 4.62-2.58 6.22-1.61 1.6-3.81 2.6-6.23 2.6h-49.5zM21.51 156.72h94.58c3.24 0 6.21 1.34 8.34 3.49 2.16 2.13 3.49 5.1 3.49 8.34v61.49c0 3.23-1.34 6.19-3.48 8.33-2.16 2.16-5.12 3.5-8.35 3.5H21.51c-3.24 0-6.2-1.34-8.35-3.48l-.24-.27c-2-2.12-3.23-4.97-3.23-8.08v-61.49c0-3.24 1.33-6.2 3.47-8.34 2.16-2.15 5.12-3.49 8.35-3.49zm38.98 32.42 19.88 13.87c.35.21.66.49.9.85.94 1.35.6 3.21-.75 4.14l-19.84 13.71c-.52.43-1.18.68-1.89.68-1.65 0-2.99-1.34-2.99-2.99v-27.83c.02-.59.19-1.19.56-1.7a2.957 2.957 0 0 1 4.13-.73zm59.62-13.08H17.49v53.98c0 1.03.39 1.98 1.02 2.68l.17.16c.73.72 1.74 1.18 2.83 1.18h94.58c1.1 0 2.12-.45 2.83-1.17.74-.74 1.19-1.75 1.19-2.85v-53.98zM77.98 67.73c2.4 0 4.35 1.94 4.35 4.34 0 2.39-1.95 4.34-4.35 4.34H32.35c-2.39 0-4.34-1.95-4.34-4.34 0-2.4 1.95-4.34 4.34-4.34h45.63zm0-23.16c2.4 0 4.35 1.95 4.35 4.34 0 2.4-1.95 4.35-4.35 4.35H22.03c-2.4 0-4.35-1.95-4.35-4.35 0-2.39 1.95-4.34 4.35-4.34h55.95z" />
  </svg>
);

const targetAudience = [
  {
    icon: MicVocal,
    header: "Singers",
    description:
      "Independent artists, vocalists, bands, and performers who want to turn their songs into viral videos for YouTube, Instagram & TikTok.",
  },
  {
    icon: SlidersVertical,
    header: "Producers",
    description:
      "Music producers and beat makers who want videos to showcase their work, collaborations, and client projects without needing advanced editing skills.",
  },
  {
    icon: ContentCreators,
    header: "Content Creators",
    description:
      "YouTubers, streamers, influencers, and social media creators who post music videos and want lyric visuals to get more views and followers.",
  },
  {
    icon: VideoEditors,
    header: "Video Editors",
    description:
      "Freelance editors, creative studios, marketing agencies, and post-production professionals who need a faster way to create lyric videos for clients.",
  },
  {
    icon: Building,
    header: "Record Labels",
    description:
      "Independent and major labels managing multiple artists and releases that need scalable lyric video production for marketing campaigns, social media, releases, audience promotion and test songs.",
  },
];

const WhoIsItFor = () => {
  return (
    <section className="relative z-10 pb-20 lg:pb-[120px]">
      <div className="container">
        <FadeInUp>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl lg:text-5xl mb-6 max-w-[600px] mx-auto">
              <TextAnimation text="The Lyric Video Maker" />{" "}
              <span className="text-primary">
                <TextAnimation text="for Everyone" delay={0.8} />
              </span>
            </h2>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {targetAudience.map((item, index) => (
            <SlideDown key={index}>
              <div className="card flex flex-col gap-4 bg-white! shadow-none! duration-300 transition-all hover:-translate-y-2 h-full border! border-border-light!">
                <span className="size-12 rounded-[14px] flex-center shrink-0 bg-bg-card">
                  <item.icon className="size-6 text-primary" />
                </span>
                <h3 className="font-bold text-base text-text-primary mb-2">
                  {item.header}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </SlideDown>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;
