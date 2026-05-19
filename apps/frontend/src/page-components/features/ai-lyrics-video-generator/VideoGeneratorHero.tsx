import FadeInUp from "@/components/animations/FadeInUp";
import TextAnimation from "@/components/animations/TextAnimation";
import { DotGrid } from "@/page-components/pricing/DotGrid";
import { Parallax } from "react-scroll-parallax";
import AudioWave from "./AudioWave";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";

const VideoGeneratorHero = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = (session as { accessToken?: string } | null)?.accessToken;
    router.push(token ? "/dashboard/creative" : "/signup");
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div
        style={{
          background:
            "radial-gradient(circle, rgba(58,96,231,0.1) 0%, transparent 70%)",
        }}
        className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
      />
      <DotGrid id="dots-pr1" />
      <Parallax speed={-10}>
        <FadeInUp>
          <div className="pt-32 pb-28 px-2 text-center relative">
            <h1 className="text-4xl lg:text-6xl lg:leading-[1.3] tracking-wide mb-4">
              <span className="text-primary block">
                <TextAnimation text="AI Lyric" />{" "}
              </span>
              <TextAnimation text="Video Generator" delay={0.4} />
            </h1>

            <p className="text-gray-400 mb-10 mx-auto max-w-[560px]">
              Create viral lyric videos for social media in seconds
            </p>
            <div className="max-w-[650px] mx-auto">
              <input
                type="file"
                className="hidden"
                id="audio"
                accept="audio/*"
                onChange={handleUploadChange}
              />
              <label
                className="border border-border bg-white shadow-card p-10 rounded-xl block cursor-pointer"
                htmlFor="audio"
              >
                <p className="md:text-lg font-semibold">
                  Upload your song to get an instant preview
                </p>
                <div className="my-6">
                  <div className="flex items-center justify-center gap-1">
                    <AudioWave />
                  </div>
                </div>
                <span className="btnShiny rounded-md px-5 md:px-7 h-12 inline-flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  Upload your song
                </span>
                <div className="mt-3 text-xs text-muted">
                  Max 100MB · <span className="hidden sm:inline">Formats:</span>{" "}
                  MP3, WAV, FLAC, AAC, OGG, M4A
                </div>
              </label>
            </div>
          </div>
        </FadeInUp>
      </Parallax>
    </section>
  );
};

export default VideoGeneratorHero;
