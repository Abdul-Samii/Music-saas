import ArticlesIndex from "@/page-components/articles";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://escalium.io"),

  title: "Articles - Escalium",

  description:
    "Escalium has everything a singer, producer, manager or a label needs. Review analytics, create ad campaigns, landing pages or generate lyric videos for social media",

  alternates: {
    canonical: "/articles",
  },

  openGraph: {
    title: "Articles - Escalium",
    description:
      "Escalium has everything a singer, producer, manager or a label needs. Review analytics, create ad campaigns, landing pages or generate lyric videos for social media",
    url: "/articles",
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
    title: "Articles - Escalium",
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

const Page = () => {
	return <ArticlesIndex />;
};

export default Page;
