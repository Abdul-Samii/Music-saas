import FadeInDown from "@/components/animations/FadeInDown";
import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import Image from "next/image";
import { Parallax } from "react-scroll-parallax";

const VideoGeneratorFeatures = () => {
  return (
    <section className="pt-6 pb-[120px]">
      <div className="container">
        <div className="mx-auto max-w-[1200px]">
          <FadeInUp>
            <div className="mb-12 lg:mb-16 text-center">
              <span className="sectionLabel mb-3">What&apos;s included</span>
              <h2 className="text-3xl lg:text-4xl font-black mb-3">
                <TextAnimation text="From upload to live campaign in minutes." />
              </h2>
              <p className="text-secondary">
                Everything you need to create and deploy lyric video ads.
              </p>
            </div>
          </FadeInUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            <div>
              <div className="relative mt-4">
                <div className="absolute top-0 left-0 w-[40%] max-w-[220px]">
                  <Parallax speed={3}>
                    <FadeInUp>
                      <Image
                        width={700}
                        height={700}
                        src="/img/v-f-1.webp"
                        className="w-full"
                        alt=""
                      />
                    </FadeInUp>
                  </Parallax>
                </div>
                <div className="px-10 py-20 sm:py-25 sm:px-20 relative">
                  <Image
                    width={700}
                    height={700}
                    src="/img/v-f-2.webp"
                    className="w-full"
                    alt=""
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-[40%] max-w-[220px]">
                  <Parallax speed={-3}>
                    <FadeInDown>
                      <Image
                        width={700}
                        height={700}
                        src="/img/v-f-3.webp"
                        className="w-full"
                        alt=""
                      />
                    </FadeInDown>
                  </Parallax>
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-5 max-w-[460px]">
                {[
                  {
                    title: "AI Transcription",
                    desc: "Whisper AI syncs lyrics to exact timestamps — accurate even for fast rap verses.",
                    color: "#3A60E7",
                  },
                  {
                    title: "Animated Lyrics",
                    desc: "Word-by-word or line-by-line karaoke-style animations. Multiple font and colour options.",
                    color: "#4C1AEA",
                  },
                  {
                    title: "Background Library",
                    desc: "Choose from abstract loops, concert footage, gradient animations, and more.",
                    // color: "#1DB954",
                    color: "#3A60E7",
                  },
                  {
                    title: "1080p MP4 Export",
                    desc: "Broadcast-quality renders via FFmpeg. Download instantly or push to Meta Ads.",
                    // color: "#F59E0B",
                    color: "#4C1AEA",
                  },
                  {
                    title: "Direct Meta Ads Push",
                    desc: "Export your creative straight into your Escalium campaign — no file transfer needed.",
                    color: "#3A60E7",
                  },
                  {
                    title: "Multiple Formats",
                    desc: "Export for Instagram Reels (9:16), Facebook Feed (1:1), or YouTube (16:9).",
                    color: "#4C1AEA",
                  },
                ].map((f) => (
                  <FadeInUp key={f.title}>
                    <div className="flex items-start gap-4">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          background: f.color + "18",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            color: f.color,
                            fontWeight: 700,
                            fontSize: "1rem",
                          }}
                        >
                          ✦
                        </span>
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "var(--text-primary)",
                            marginBottom: "0.35rem",
                          }}
                        >
                          {f.title}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                            lineHeight: 1.6,
                          }}
                        >
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  </FadeInUp>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoGeneratorFeatures;
