import { JetBrains_Mono, Pixelify_Sans, Silkscreen } from "next/font/google";

// Headings and body text. A variable font, so every weight comes from one file.
export const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify-sans",
});

// Longer reading, such as write-ups and experience bullets, and code. Easier
// to read at length than the pixel font, while still looking like a terminal.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

// Small all-caps labels such as dates, tags and buttons.
export const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-silkscreen",
});
