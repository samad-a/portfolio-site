import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { SkyCanvas } from "@/components/background/sky-canvas";
import { SiteHeader } from "@/components/nav/site-header";
import { Konami } from "@/components/konami";
import { SiteFooter } from "@/components/site-footer";
import { pixelifySans, silkscreen } from "./fonts";
import "./globals.css";
import { pageMetadata, siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  // Lets pages give relative URLs for canonical links and preview images.
  metadataBase: new URL(siteUrl),
  ...pageMetadata({ description: siteDescription, path: "/" }),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pixelifySans.variable} ${silkscreen.variable}`}
    >
      {/* A column at least as tall as the screen, so the footer sits at the bottom of short pages. */}
      <body className="flex min-h-dvh flex-col bg-sky text-[17px] text-ink sm:text-[19px]">
        {/* Hidden until focused, so keyboard users can jump past the navigation. */}
        <a
          href="#main"
          className="sr-only z-50 bg-gold px-4 py-2 font-label text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          skip to content
        </a>
        <SkyCanvas />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Konami />
        {/* Cookieless page view counts and real-visitor speed scores, on Vercel. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
