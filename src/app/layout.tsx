import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const GA_ID = "G-HTZ25MF02H";
export const SITE_URL = "https://haenggung-parking.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "행궁동 지금",
    template: "%s | 행궁동 지금",
  },
  description: "행궁동 가기 전에 여기 먼저. 실시간 주차 현황부터 오늘의 핫스팟까지 한눈에.",
  keywords: ["행궁동", "행궁동 주차", "행궁동 주차장", "행리단길", "수원 행궁동", "행궁동 맛집", "행궁동 카페", "수원 여행"],
  openGraph: {
    title: "행궁동 지금",
    description: "행궁동 가기 전에 여기 먼저. 실시간 주차 현황부터 오늘의 핫스팟까지 한눈에.",
    url: SITE_URL,
    siteName: "행궁동 지금",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "행궁동 지금",
    description: "행궁동 가기 전에 여기 먼저.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-full bg-bg-primary text-text-primary">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
