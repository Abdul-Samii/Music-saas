import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import SongUploader from "./SongUploader";

const faqData = [
  {
    q: "What is a Lyric Video?",
    ans: "A lyric video is a music video that shows lyrics of a song on screen while the track plays. Artists, producers, and labels use lyric videos to promote new releases, increase engagement on social media, and get more streams on platforms like Spotify and YouTube.",
  },
  {
    q: "How to Make a Lyric Video Online?",
    ans: "With Escalium, you can make a lyric video online by uploading your song, generating the lyrics automatically, syncing the lyrics with the audio, customizing the video style, and exporting the final video in minutes.",
  },
  {
    q: "Can I Make a Lyric Video for TikTok?",
    ans: "Yes. Escalium helps you create vertical lyric videos optimized for TikTok, Instagram Reels, and YouTube Shorts using viral video templates designed to increase views and retention.",
  },
  {
    q: "Can I Automatically Generate Lyrics from a Song?",
    ans: "Yes. Escalium automatically transcribes your song lyrics in seconds using AI, allowing you to edit and sync the lyrics before rendering the video.",
  },
  {
    q: "What is the Best Lyric Video Maker for Artists?",
    ans: "Escalium is built specifically for singers, artists, producers, and record labels who want to create viral lyric videos, promote songs, and grow their Spotify streams from one platform.",
  },
  {
    q: "Can I Use My Own Video Backgrounds?",
    ans: "Yes. You can upload your own videos, visuals, animations, or clips, or choose from more than 250 viral video templates available inside the Creative Studio.",
  },
  {
    q: "How Do I Sync Lyrics with Music?",
    ans: "Escalium lets you sync lyrics with your audio automatically by pressing the space bar or using the “Start Sync” feature to match the lyrics to the song timing.",
  },
  {
    q: "What Platforms Can I Post My Lyric Videos On?",
    ans: "You can export and upload your lyric videos to TikTok, Instagram Reels, YouTube Shorts, Spotify promotions, Facebook, and other social media platforms.",
  },
  {
    q: "Can I Customize the Lyrics Style?",
    ans: "Yes. You can customize the lyric animation, text color, font, text position, overlays, video style, and subtitle effects to match your brand or music aesthetic.",
  },
  {
    q: "Is Escalium Good for Spotify Marketing?",
    ans: "Yes. Escalium helps artists create viral music videos, launch paid ads campaigns, build landing pages, and track Spotify-related analytics to help increase streams and discoverability.",
  },
  {
    q: "Can Record Labels and Agencies Use Escalium?",
    ans: "Yes. Escalium is designed for independent artists, record labels, music marketing agencies, and video editors who need scalable lyric video creation and music promotion tools.",
  },
  {
    q: "Does Escalium Include Music Marketing Analytics?",
    ans: "Yes. Escalium includes analytics tools that track page visits, Spotify clicks, impressions, reach, CTR, ad spend, and other key music marketing metrics.",
  },
  {
    q: "Can I Create Lyric Videos for Free?",
    ans: "Yes. You can start creating lyric videos for free with Escalium and upgrade later for additional features, exports, and advanced marketing tools.",
  },
  {
    q: "Why Are Lyric Videos Important for Music Promotion?",
    ans: "Lyric videos help artists increase engagement, improve song discoverability, grow social media reach, and turn short-form content into more Spotify streams and fans.",
  },
  {
    q: "What Makes Escalium Different from Other Lyric Video Makers?",
    ans: "Unlike traditional lyric video makers, Escalium combines AI lyric generation, viral video templates, paid ads campaigns, landing pages, and music marketing analytics in one platform built specifically for artists.",
  },
];

const FAQs = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const container = {
    hidden: { opacity: 0, y: 7 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="pb-20 lg:pb-30">
      <div className="container">
        <FadeInUp>
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl lg:text-5xl mb-6 max-w-150 mx-auto">
              <TextAnimation text="Frequently Asked" />{" "}
              <span className="text-primary">
                <TextAnimation text="Questions" delay={0.8} />
              </span>
            </h2>
          </div>
        </FadeInUp>

        <div className="mx-auto w-full max-w-4xl mb-12 md:mb-20">
          {faqData.map((item, i) => (
            <div key={i} className="group">
              <FadeInUp>
                <div className="border-b border-border group-last:border-b-0 py-2">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full justify-between items-center py-4 bg-transparent cursor-pointer text-left gap-4"
                  >
                    <h3 className="text-navy font-semibold xl:text-lg">
                      {item.q}
                    </h3>
                    <span className="text-lg text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={cn("size-5 transition-all duration-300", {
                          "-rotate-180": openFaq === i,
                        })}
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial="hidden"
                      whileInView="show"
                      variants={container}
                      viewport={{ once: true }}
                    >
                      <p className="text-secondary text-sm leading-[1.75] flex flex-col gap-2">
                        {item.ans}
                      </p>
                    </motion.div>
                  )}
                </div>
              </FadeInUp>
            </div>
          ))}
        </div>

        <SongUploader />
      </div>
    </section>
  );
};

export default FAQs;
