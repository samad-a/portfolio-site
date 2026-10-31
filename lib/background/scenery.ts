import type { SpriteName } from "@/lib/sprites";

// Sprites placed by hand in the sky beside each section, which stay put and
// scroll with the page. Each one fits the part of the day it's in: coins by
// the start screen, a balloon through the day, birds heading home
// at sunset and a rocket and squid out in the night.

export type Scenery = {
  sprite: SpriteName;
  // The id of the section it sits beside.
  section: string;
  // How far down that section, from 0 at its top to 1 at its bottom.
  at: number;
  side: "left" | "right";
  // Shown only where the page has room for it beside the content, so the
  // smaller screens keep a few rather than covering the text with them.
  wideOnly?: boolean;
  // Night sprites show on the night sky, and day ones on the day sky.
  night?: boolean;
};

export const scenery: Scenery[] = [
  { sprite: "coin", section: "top", at: 0.62, side: "left", wideOnly: true },
  { sprite: "spark", section: "top", at: 0.95, side: "right" },
  { sprite: "balloon", section: "experience", at: 0.18, side: "right" },
  {
    sprite: "heart",
    section: "experience",
    at: 0.62,
    side: "left",
    wideOnly: true,
  },
  {
    sprite: "spark",
    section: "skills",
    at: 0.28,
    side: "left",
    wideOnly: true,
  },
  {
    sprite: "coin",
    section: "skills",
    at: 0.78,
    side: "right",
    wideOnly: true,
  },
  { sprite: "birds", section: "projects", at: 0.12, side: "right" },
  {
    sprite: "birds",
    section: "projects",
    at: 0.82,
    side: "left",
    wideOnly: true,
  },
  {
    sprite: "birds",
    section: "dev-log",
    at: 0.3,
    side: "right",
    wideOnly: true,
  },
  {
    sprite: "rocket",
    section: "contact",
    at: 0.42,
    side: "right",
    night: true,
  },
  {
    sprite: "squid",
    section: "contact",
    at: 0.72,
    side: "left",
    night: true,
    wideOnly: true,
  },
];

// The width of the page's content column, matching --container-page.
const pageWidth = 1040;
// Space kept between a sprite and the content, or the edge of the screen.
const gap = 16;

// Where a sprite's top-left corner goes, in page pixels: in the margin beside
// the content when there's room, otherwise tucked against the screen's edge.
// Returns nothing for a wide-only sprite on a screen without that room.
export function sceneryPosition(
  item: Scenery,
  section: { top: number; height: number },
  sprite: { width: number; height: number },
  screenWidth: number,
) {
  const margin = (screenWidth - pageWidth) / 2;
  const roomy = margin >= sprite.width + gap * 2;
  if (item.wideOnly && !roomy) return undefined;

  const inMargin = Math.max(gap, margin - gap - sprite.width);
  const x =
    item.side === "left" ? inMargin : screenWidth - inMargin - sprite.width;
  const y = section.top + section.height * item.at - sprite.height / 2;
  return { x: Math.round(x), y: Math.round(y) };
}
