import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });


// already optimised for SEO and made the template for further pages, you can add more metadata fields if needed, but this should cover the basics for now.
export const metadata: Metadata = {
  metadataBase: new URL("https://escalium.io"),

  title: {
    default: "Escalium — The All in one Music Marketing Platform",
    template: "%s | Escalium",
  },

  description:
    "Simplify your music marketing with Escalium. Create, manage, and optimize lyric video ads and ad campaigns across multiple platforms from one intuitive dashboard.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Escalium — The All in one Music Marketing Platform",
    description:
      "Simplify your music marketing with Escalium. Create, manage, and optimize lyric video ads and ad campaigns across multiple platforms from one intuitive dashboard.",
    url: "/",
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
    title: "Escalium — The All in one Music Marketing Platform",
    description:
      "Simplify your music marketing with Escalium. Create, manage, and optimize lyric video ads and ad campaigns across multiple platforms from one intuitive dashboard.",
    images: ["/logo.webp"],
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "technology",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={dmSans.variable} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
