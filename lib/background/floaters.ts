import type { SpriteName } from "@/lib/sprites";

// Sprites that drift sideways across the sky, behind the page.

export type Floater = {
  sprite: SpriteName;
  // Position in the viewport, in CSS pixels.
  x: number;
  y: number;
  // Pixels per second; negative drifts left.
  speed: number;
  // Offsets the bob so floaters don't move in step.
  phase: number;
  // Night floaters show on the night sky, and day ones on the day sky.
  night: boolean;
};

export type Viewport = { width: number; height: number };

// Returns a number from 0 up to (not including) 1, like Math.random.
export type Random = () => number;

export const daySprites: SpriteName[] = ["coin", "spark", "heart"];
export const nightSprites: SpriteName[] = ["squid", "rocket", "spark"];

// How far past either edge a floater goes before it respawns.
const margin = 80;

export function floaterCount({ width }: Viewport) {
  return width < 640 ? 5 : 9;
}

// Drawn bigger on wide screens. Whole numbers keep the pixels crisp.
export function floaterScale({ width }: Viewport) {
  return width < 640 ? 3 : 4;
}

// `night` picks from the night sprites. `scatter` places it anywhere across
// the screen, for the first frame; otherwise it starts just off the edge it
// drifts in from.
export function spawnFloater(
  random: Random,
  viewport: Viewport,
  night: boolean,
  scatter: boolean,
): Floater {
  const sprites = night ? nightSprites : daySprites;
  const direction = random() < 0.5 ? -1 : 1;
  const speed = direction * (9 + random() * 15);
  const sprite = sprites[Math.floor(random() * sprites.length)];
  const x = scatter
    ? random() * viewport.width
    : direction > 0
      ? -margin
      : viewport.width + margin;

  return {
    sprite,
    x,
    y: random() * viewport.height,
    speed,
    phase: random() * Math.PI * 2,
    night,
  };
}

export function isOffScreen({ x }: Floater, { width }: Viewport) {
  return x < -margin || x > width + margin;
}

// A gentle up-and-down, in whole steps of 2px so it looks like sprite animation.
export function bobOffset({ phase }: Floater, seconds: number) {
  return Math.round(Math.sin(seconds * 1.5 + phase) * 3) * 2;
}
