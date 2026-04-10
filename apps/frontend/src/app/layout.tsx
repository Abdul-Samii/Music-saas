import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});


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

  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1390337178858770');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1390337178858770&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={`${dmSans.variable} ${dmSerifDisplay.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
