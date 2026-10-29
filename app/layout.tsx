import type { Metadata } from "next";
import { pixelifySans, silkscreen } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio",
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
      <body>{children}</body>
    </html>
  );
}
