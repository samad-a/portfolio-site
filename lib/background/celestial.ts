import type { Viewport } from "./floaters";
import type { SkyLayout } from "./sky";

// The sun and moon, which move with the scroll: the sun sinks off to the
// right as the page heads to dusk, and the moon rises from the left.

export type Point = { x: number; y: number };

function clamp(amount: number) {
  return Math.min(1, Math.max(0, amount));
}

// How far along its path each one is, from 0 to 1. `centre` is the page
// position of the middle of the screen, and `lastCentre` is where it is when
// scrolled right to the bottom. The sun has set by dusk, and the moon rises
// from the start of the sunset to the end of the page.
export function celestialProgress(
  centre: number,
  layout: SkyLayout | undefined,
  lastCentre: number,
) {
  if (!layout) return { sun: 0, moon: 0 };
  const dusk = (layout.dayEnd + layout.nightStart) / 2;
  const rise = Math.max(1, lastCentre - layout.dayEnd);
  return {
    sun: clamp(centre / dusk),
    moon: clamp((centre - layout.dayEnd) / rise),
  };
}

// Top-left corner of the sun on screen. It starts high on the right and
// drops faster as it goes, ending below the bottom right corner.
export function sunPosition(progress: number, { width, height }: Viewport) {
  return {
    x: width * (0.62 + 0.46 * progress),
    y: height * (0.16 + 0.9 * progress ** 2),
  };
}

// Top-left corner of the moon on screen. It comes up from below the bottom
// left corner and slows as it nears the top.
export function moonPosition(progress: number, { width, height }: Viewport) {
  const rise = 1 - (1 - progress) ** 2;
  return {
    x: width * (-0.12 + 0.3 * progress),
    y: height * (1 - 0.86 * rise),
  };
}

// How red the sun has turned, from 0 at midday to 1 as it sets.
export function sunsetAmount(progress: number) {
  return clamp((progress - 0.4) / 0.6);
}
