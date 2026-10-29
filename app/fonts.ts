import { Pixelify_Sans, Silkscreen } from "next/font/google";

// Headings and body text. A variable font, so every weight comes from one file.
export const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify-sans",
});

// Small all-caps labels such as dates, tags and buttons.
export const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-silkscreen",
});
