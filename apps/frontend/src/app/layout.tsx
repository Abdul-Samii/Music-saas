import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import ParallaxWrapper from "@/page-components/ParallaxWrapper";
import type { Metadata } from "next";
import {
	DM_Sans,
	DM_Serif_Display,
	Geist,
	Instrument_Serif,
} from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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

export const metadata: Metadata = {
	metadataBase: new URL("https://escalium.io"),

	title: "All in One Music Marketing Platform - Escalium",

	description:
		"Escalium has everything a singer, producer, manager or a label needs. Review analytics, create ad campaigns, landing pages or generate lyric videos for social media",

	alternates: {
		canonical: "/",
	},

	openGraph: {
		title: "All in One Music Marketing Platform - Escalium",
		description:
			"Escalium has everything a singer, producer, manager or a label needs. Review analytics, create ad campaigns, landing pages or generate lyric videos for social media",
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

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			data-theme="light"
			suppressHydrationWarning
			className={cn("font-sans", geist.variable)}
		>
			<head>
				{/* Preconnect (optional but good for performance) */}
				<link rel="preconnect" href="https://www.googletagmanager.com" />
				<link rel="preconnect" href="https://connect.facebook.net" />
			</head>

			<body
				className={`${dmSans.variable} ${dmSerifDisplay.variable} ${instrumentSerif.variable}`}
				suppressHydrationWarning
			>
				{/* Google Analytics - optimized */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-5YEWG0088W"
					strategy="afterInteractive"
				/>

				<Script id="google-analytics" strategy="afterInteractive">
					{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5YEWG0088W', {
              page_path: window.location.pathname,
            });
          `}
				</Script>

				{/* Meta Pixel - optimized */}
				<Script id="meta-pixel" strategy="afterInteractive">
					{`
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
          `}
				</Script>

				{/* Fallback for users without JS */}
				<noscript>
					<img
						height="1"
						width="1"
						style={{ display: "none" }}
						src="https://www.facebook.com/tr?id=1390337178858770&ev=PageView&noscript=1"
						alt=""
					/>
				</noscript>
				<NuqsAdapter>
					<Providers>
						<ParallaxWrapper>{children}</ParallaxWrapper>
					</Providers>
				</NuqsAdapter>
			</body>
		</html>
	);
}
