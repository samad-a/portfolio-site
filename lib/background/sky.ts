// Where on the page the sky turns from day to night. Positions are in page
// pixels from the top of the document, so the sky scrolls with the content.

export type SkyLayout = {
  // The sky is plain day above this.
  dayEnd: number;
  // And full night from here down.
  nightStart: number;
};

// The day sky lightens towards the top of the page over this distance.
export const topGlowHeight = 400;

// Starts turning 200px above the contact section and is fully night 160px in,
// where its text begins, so that text is always on the night sky.
export function skyLayout(contactTop: number): SkyLayout {
  return { dayEnd: contactTop - 200, nightStart: contactTop + 160 };
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
  dusk: string;
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

  const { dayEnd, nightStart } = layout;
  const pixels: [number, string][] = [
    [0, colours.skyTop],
    [topGlowHeight, colours.sky],
    [dayEnd * warming.start, colours.sky],
    [dayEnd * warming.skyLate, colours.skyLate],
    [dayEnd * warming.blush, colours.blush],
    [dayEnd, colours.sunset],
    [(dayEnd + nightStart) / 2, colours.dusk],
    [nightStart, colours.night],
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
