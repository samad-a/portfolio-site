import type { Viewport } from "./floaters";
import type { SkyLayout } from "./sky";

// The sun and moon, which move with the scroll along curved paths: the sun
// sets off to the right as the page heads to dusk, and the moon rises from
// the left.

export type Point = { x: number; y: number };

function clamp(amount: number) {
  return Math.min(1, Math.max(0, amount));
}

// How far along its path each one is, from 0 to 1. `centre` is the page
// position of the middle of the screen, which runs from `firstCentre` at the
// top of the page to `lastCentre` at the bottom. The sun sets from the top of
// the page to dusk, and the moon rises from the start of the sunset to the
// bottom of the page.
export function celestialProgress(
  centre: number,
  layout: SkyLayout | undefined,
  firstCentre: number,
  lastCentre: number,
) {
  if (!layout) return { sun: 0, moon: 0 };
  const dusk = (layout.dayEnd + layout.nightStart) / 2;
  const set = Math.max(1, dusk - firstCentre);
  const rise = Math.max(1, lastCentre - layout.dayEnd);
  return {
    sun: clamp((centre - firstCentre) / set),
    moon: clamp((centre - layout.dayEnd) / rise),
  };
}

// Part of an oval, with its centre and radii as fractions of the screen. The
// angles are in degrees, anticlockwise from the right, so 90 is the top.
type Arc = {
  centre: Point;
  radius: Point;
  from: number;
  to: number;
};

function onArc(arc: Arc, progress: number, { width, height }: Viewport) {
  const angle = ((arc.from + (arc.to - arc.from) * progress) * Math.PI) / 180;
  return {
    x: width * (arc.centre.x + arc.radius.x * Math.cos(angle)),
    y: height * (arc.centre.y - arc.radius.y * Math.sin(angle)),
  };
}

// The sun starts between the intro and the avatar, climbs a little to peak
// just under the navigation, then sinks in a curve below the bottom right
// corner.
export const sunArc: Arc = {
  centre: { x: 0.7, y: 1.12 },
  radius: { x: 0.36, y: 0.87 },
  from: 108,
  to: -14,
};

// The moon mirrors it, coming up from below the bottom left and curving
// over towards the middle.
export const moonArc: Arc = {
  centre: { x: 0.36, y: 1.12 },
  radius: { x: 0.36, y: 0.98 },
  from: 200,
  to: 110,
};

// Where the middle of the sun is on screen.
export function sunPosition(progress: number, viewport: Viewport) {
  return onArc(sunArc, progress, viewport);
}

// Where the middle of the moon is on screen.
export function moonPosition(progress: number, viewport: Viewport) {
  return onArc(moonArc, progress, viewport);
}

// How red the sun has turned, from 0 at midday to 1 as it sets.
export function sunsetAmount(progress: number) {
  return clamp((progress - 0.4) / 0.6);
}
