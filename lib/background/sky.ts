// Where on the page the sky turns from day to night. Positions are in page
// pixels from the top of the document, so the sky scrolls with the content.

export type SkyLayout = {
  // The top of the contact section, which the evening is placed around.
  contactTop: number;
  // The sky is daytime, warming towards sunset, above this.
  dayEnd: number;
  // And full night from here down.
  nightStart: number;
};

// The day sky lightens towards the top of the page over this distance.
export const topGlowHeight = 400;

type EveningColour =
  "sunset" | "mauve" | "duskLight" | "dusk" | "duskDeep" | "night";

// The evening, in pixels from the top of the contact section. It fades over a
// long stretch rather than all in the gap between the sections, so it holds a
// mid lavender across that gap: light enough for the dark "all posts" link
// above it, and dark enough for the light contact heading below. It's deep
// dusk by the contact text and full night once past it.
const evening: readonly (readonly [number, EveningColour])[] = [
  [-560, "sunset"],
  [-300, "mauve"],
  [-60, "duskLight"],
  [150, "dusk"],
  [220, "duskDeep"],
  [420, "night"],
];

export function skyLayout(contactTop: number): SkyLayout {
  return {
    contactTop,
    dayEnd: contactTop + evening[0][0],
    nightStart: contactTop + evening[evening.length - 1][0],
  };
}

// How night it is at a point on the page: 0 for day, 1 for night. It stays 0
// through the dusk half of the fade, so day sprites linger into dusk.
export function nightAmount(pageY: number, layout: SkyLayout | undefined) {
  if (!layout) return 0;
  const dusk = (layout.dayEnd + layout.nightStart) / 2;
  const amount = (pageY - dusk) / (layout.nightStart - dusk);
  return Math.min(1, Math.max(0, amount));
}

export type SkyColours = {
  skyTop: string;
  sky: string;
  // The afternoon sky warms through these on the way to dusk.
  skyLate: string;
  blush: string;
  sunset: string;
  // And darkens through these into night.
  mauve: string;
  duskLight: string;
  dusk: string;
  duskDeep: string;
  night: string;
};

// How far down the day the sky starts to warm, and where each warmer colour
// is fully in, as fractions of the way to `dayEnd`. Spread over most of the
// page, so the light changes a little with every screen you scroll.
const warming = { start: 0.25, skyLate: 0.5, blush: 0.76 } as const;

// The same sky as a CSS background for the page, in page pixels. It sits
// behind the canvas, so it's what tools like axe measure text against, and
// what shows if the canvas ever stops drawing.
export function skyBackground(
  layout: SkyLayout | undefined,
  colours: SkyColours,
) {
  const { end, stops } = skyGradient(layout, colours);
  const parts = stops.map(
    ([offset, colour]) => `${colour} ${Math.round(offset * end)}px`,
  );
  return `linear-gradient(${parts.join(", ")})`;
}

// Colour stops for one gradient running from the top of the page to full
// night, as [offset from 0 to 1, colour]. `end` is where the gradient stops.
export function skyGradient(
  layout: SkyLayout | undefined,
  colours: SkyColours,
): { end: number; stops: [number, string][] } {
  if (!layout || layout.dayEnd <= topGlowHeight) {
    return {
      end: topGlowHeight,
      stops: [
        [0, colours.skyTop],
        [1, colours.sky],
      ],
    };
  }

  const { contactTop, dayEnd, nightStart } = layout;
  const pixels: [number, string][] = [
    [0, colours.skyTop],
    [topGlowHeight, colours.sky],
    [dayEnd * warming.start, colours.sky],
    [dayEnd * warming.skyLate, colours.skyLate],
    [dayEnd * warming.blush, colours.blush],
    ...evening.map(([offset, colour]): [number, string] => [
      contactTop + offset,
      colours[colour],
    ]),
  ];
  // On a short page the warming would start inside the top glow, so no stop
  // is allowed above the one before it.
  let previous = 0;
  const stops = pixels.map(([y, colour]): [number, string] => {
    previous = Math.max(previous, y);
    return [previous / nightStart, colour];
  });
  return { end: nightStart, stops };
}
