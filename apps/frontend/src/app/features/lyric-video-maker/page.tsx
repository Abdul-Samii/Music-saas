import LyricVideoMakerClient from "@/page-components/features/lyric-video-maker";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://escalium.io"),

  title: "Lyric Video Maker - Escalium",

  description:
    "Use Escalium to make lyric videos and get more views & streams than ever before. Transcribe your lyrics automatically in seconds and use viral lyrics templates.",

  alternates: {
    canonical: "/features/lyric-video-maker",
  },

  openGraph: {
    title: "Lyric Video Maker - Escalium",
    description:
      "Use Escalium to make lyric videos and get more views & streams than ever before. Transcribe your lyrics automatically in seconds and use viral lyrics templates.",
    url: "/features/lyric-video-maker",
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
    title: "Lyric Video Maker - Escalium",
    description:
      "Use Escalium to make lyric videos and get more views & streams than ever before. Transcribe your lyrics automatically in seconds and use viral lyrics templates.",
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
  return <LyricVideoMakerClient />;
}
