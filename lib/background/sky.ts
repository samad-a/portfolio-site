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
  dusk: string;
  night: string;
};

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

  const end = layout.nightStart;
  return {
    end,
    stops: [
      [0, colours.skyTop],
      [topGlowHeight / end, colours.sky],
      [layout.dayEnd / end, colours.sky],
      [(layout.dayEnd + layout.nightStart) / 2 / end, colours.dusk],
      [1, colours.night],
    ],
  };
}
