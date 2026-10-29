import type { Metadata } from "next";
import { pixelifySans, silkscreen } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Samad Ali",
    template: "%s · Samad Ali",
  },
  description:
    "Samad Ali, a computer science student at the University of Edinburgh. Experience, projects and a dev log, in retro pixel art.",
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
      <body className="bg-sky text-ink">
        {/* Hidden until focused, so keyboard users can jump past the navigation. */}
        <a
          href="#main"
          className="sr-only z-50 bg-gold px-4 py-2 font-label text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
