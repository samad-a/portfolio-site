import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge, validators } from "tailwind-merge";

const twMerge = extendTailwindMerge<"pixel-corner-size">({
  extend: {
    // Teach tailwind-merge that only one corner size can apply at a time.
    classGroups: {
      "pixel-corner-size": [{ "pixel-corners": [validators.isInteger] }],
    },
  },
});

// Joins class names, letting later Tailwind classes replace earlier conflicting ones.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
