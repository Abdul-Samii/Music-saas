import PricingPageClient from "@/page-components/pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://escalium.io"),

  title: "Escalium Pricing & Plans - All In One Music Marketing Platform",

  description:
    "Start music marketing with 0$/mo. You can now have it all inside one dashboard: data, campaigns, landing pages, creative studio",

  alternates: {
    canonical: "/pricing",
  },

  openGraph: {
    title: "Escalium Pricing & Plans - All In One Music Marketing Platform",
    description:
      "Start music marketing with 0$/mo. You can now have it all inside one dashboard: data, campaigns, landing pages, creative studio",
    url: "/pricing",
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
    title: "Escalium Pricing & Plans - All In One Music Marketing Platform",
    description:
      "Start music marketing with 0$/mo. You can now have it all inside one dashboard: data, campaigns, landing pages, creative studio",
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
export default function PricingPage() {
  return <PricingPageClient />;
}
