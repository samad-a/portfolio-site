import { describe, expect, it } from "vitest";
import { nightAmount, skyBackground, skyGradient, skyLayout } from "./sky";

const colours = {
  skyTop: "#8fd0ea",
  sky: "#a9dbee",
  skyLate: "#c6cbee",
  blush: "#f0c3c8",
  sunset: "#f4ab84",
  mauve: "#c495b8",
  duskLight: "#8b7fd3",
  dusk: "#7b6fc9",
  duskDeep: "#4a3f8f",
  night: "#121238",
};

describe("skyLayout", () => {
  it("fades from well above the contact section to past its text", () => {
    expect(skyLayout(3000)).toEqual({
      contactTop: 3000,
      dayEnd: 2440,
      nightStart: 3520,
    });
  });
});

describe("nightAmount", () => {
  const layout = skyLayout(3000);

  it.each([
    [0, 0],
    [2440, 0],
    [2980, 0],
    [3250, 0.5],
    [3520, 1],
    [9000, 1],
  ])("is %s at page position %s", (pageY, amount) => {
    expect(nightAmount(pageY, layout)).toBe(amount);
  });

  it("is always day on pages without a contact section", () => {
    expect(nightAmount(5000, undefined)).toBe(0);
  });
});

describe("skyBackground", () => {
  it("is the same gradient in page pixels, for CSS", () => {
    expect(skyBackground(skyLayout(3000), colours)).toBe(
      "linear-gradient(#8fd0ea 0px, #a9dbee 400px, #a9dbee 610px, #c6cbee 1220px, #f0c3c8 1854px, #f4ab84 2440px, #c495b8 2700px, #8b7fd3 2940px, #7b6fc9 3120px, #4a3f8f 3300px, #121238 3520px)",
    );
  });
});

describe("skyGradient", () => {
  it("warms slowly through the day, then darkens slowly into night", () => {
    const { end, stops } = skyGradient(skyLayout(3000), colours);
    expect(end).toBe(3520);
    expect(stops.map(([offset, colour]) => [offset * end, colour])).toEqual([
      [0, "#8fd0ea"],
      [400, "#a9dbee"],
      [610, "#a9dbee"],
      [1220, "#c6cbee"],
      [expect.closeTo(1854.4), "#f0c3c8"],
      [2440, "#f4ab84"],
      [2700, "#c495b8"],
      [2940, "#8b7fd3"],
      [3120, "#7b6fc9"],
      [3300, "#4a3f8f"],
      [3520, "#121238"],
    ]);
  });

  it("keeps the stops in order on a short page", () => {
    const { end, stops } = skyGradient(skyLayout(1200), colours);
    const offsets = stops.map(([offset]) => Math.round(offset * end));
    expect(offsets).toEqual([
      0, 400, 400, 400, 486, 640, 900, 1140, 1320, 1500, 1720,
    ]);
  });

  it("is only the day sky without a contact section", () => {
    expect(skyGradient(undefined, colours)).toEqual({
      end: 400,
      stops: [
        [0, "#8fd0ea"],
        [1, "#a9dbee"],
      ],
    });
  });
});
