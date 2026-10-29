import type { Random } from "./floaters";

export type Star = {
  // Position on the page, in CSS pixels, so stars scroll with the night sky.
  x: number;
  y: number;
  // Side length of the square star.
  size: 2 | 3;
  // Offsets the twinkle so stars don't pulse together.
  phase: number;
};

// About one star per 10px of width for every 800px of night sky.
const starsPerArea = 1 / (10 * 800);

// Scatters stars over the page from `top` to `bottom`.
export function makeStars(
  random: Random,
  width: number,
  top: number,
  bottom: number,
): Star[] {
  const count = Math.round(width * Math.max(0, bottom - top) * starsPerArea);
  return Array.from({ length: count }, () => ({
    x: Math.floor(random() * width),
    y: top + Math.floor(random() * (bottom - top)),
    size: random() < 0.15 ? 3 : 2,
    phase: random() * Math.PI * 2,
  }));
}

// From 0.1 to 1, scaled by how night the sky is where the star sits.
export function starOpacity(star: Star, seconds: number, night: number) {
  return night * (0.55 + 0.45 * Math.sin(seconds * 2 + star.phase));
}
