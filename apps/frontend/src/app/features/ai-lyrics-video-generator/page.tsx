import AiLyricsVideoGeneratorClient from "@/page-components/features/ai-lyrics-video-generator";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://escalium.io"),

  title: "AI Lyric Video Generator - Escalium",

  description:
    "Create viral lyric videos for TikTok, Instagram Reels, and YouTube Shorts using hundreds of ready-to-use video clips from our library.",

  alternates: {
    canonical: "/features/ai-lyric-video-generator",
  },

  openGraph: {
    title: "AI Lyric Video Generator - Escalium",
    description:
      "Create viral lyric videos for TikTok, Instagram Reels, and YouTube Shorts using hundreds of ready-to-use video clips from our library.",
    url: "/features/ai-lyric-video-generator",
    siteName: "Escalium",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Escalium Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Lyric Video Generator - Escalium",
    description:
      "Create viral lyric videos for TikTok, Instagram Reels, and YouTube Shorts using hundreds of ready-to-use video clips from our library.",
    images: ["/logo.webp"],
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "technology",

  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};
export default function Page() {
  return <AiLyricsVideoGeneratorClient />;
}
