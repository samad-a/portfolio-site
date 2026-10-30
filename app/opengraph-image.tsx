import { ogImage, ogSize } from "@/lib/og";
import { avatar } from "@/lib/sprites";

export const alt =
  "Samad Ali's portfolio: a pixel avatar on a sky-blue background above grass";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "portfolio",
    title: "hi, I'm Samad!",
    subtitle:
      "Computer science student at the University of Edinburgh. Web tools, Android apps and pixel art.",
    sprite: avatar,
    spriteScale: 17,
  });
}
