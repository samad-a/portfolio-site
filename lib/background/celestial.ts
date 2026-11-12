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

// The lowest the sun may start, in pixels from the top. The arc scales with
// the screen but the page doesn't, so on a tall screen the sun would start
// level with the avatar's mouth, behind its speech bubble.
export const sunLowestStart = 230;

// Where the middle of the sun is on screen. On a tall screen the whole arc
// lifts, so the sun starts no lower than sunLowestStart. With `start`, the
// whole arc moves instead so the sun starts there, such as beside a phone's
// heading, where the arc's own start would be behind the text below it.
export function sunPosition(
  progress: number,
  viewport: Viewport,
  start?: Point,
) {
  const first = onArc(sunArc, 0, viewport);
  const shift = start
    ? { x: start.x - first.x, y: start.y - first.y }
    : { x: 0, y: -Math.max(0, first.y - sunLowestStart) };
  const { x, y } = onArc(sunArc, progress, viewport);
  return { x: x + shift.x, y: y + shift.y };
}

type Box = { left: number; top: number; right: number; bottom: number };

// Whether a square of `size` centred on a point overlaps any of the boxes.
export function overlapsAny({ x, y }: Point, size: number, boxes: Box[]) {
  const half = size / 2;
  return boxes.some(
    (box) =>
      x + half > box.left &&
      x - half < box.right &&
      y + half > box.top &&
      y - half < box.bottom,
  );
}

// Where the middle of the moon is on screen.
export function moonPosition(progress: number, viewport: Viewport) {
  return onArc(moonArc, progress, viewport);
}

// How red the sun has turned, from 0 at midday to 1 as it sets.
export function sunsetAmount(progress: number) {
  return clamp((progress - 0.4) / 0.6);
}
