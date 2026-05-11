import { Metadata } from "next";
import LandingPageClient from "@/page-components/landing";

export const metadata: Metadata = {
  metadataBase: new URL("https://escalium.io"),

  title: "All in One Music Marketing Platform - Escalium",

  description:
    "Escalium has everything a singer, producer, manager or a label needs. Review analytics, create ad campaigns, landing pages or generate lyric videos for social media",

  alternates: {
    canonical: "/landing",
  },

  openGraph: {
    title: "All in One Music Marketing Platform - Escalium",
    description:
      "Escalium has everything a singer, producer, manager or a label needs. Review analytics, create ad campaigns, landing pages or generate lyric videos for social media",
    url: "/landing",
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
    title: "All in One Music Marketing Platform - Escalium",
    description:
      "Escalium has everything a singer, producer, manager or a label needs. Review analytics, create ad campaigns, landing pages or generate lyric videos for social media",
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

export default function LandingPage() {
  return <LandingPageClient />;
}
