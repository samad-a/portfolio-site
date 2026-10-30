import { describe, expect, it } from "vitest";
import { nightAmount, skyBackground, skyGradient, skyLayout } from "./sky";

const colours = {
  skyTop: "#8fd0ea",
  sky: "#a9dbee",
  skyLate: "#c6cbee",
  blush: "#f0c3c8",
  sunset: "#f4ab84",
  dusk: "#7b6fc9",
  night: "#121238",
};

describe("skyLayout", () => {
  it("turns night by the time the contact text starts", () => {
    expect(skyLayout(3000)).toEqual({ dayEnd: 2800, nightStart: 3160 });
  });
});

describe("nightAmount", () => {
  const layout = skyLayout(3000);

  it.each([
    [0, 0],
    [2800, 0],
    [2980, 0],
    [3070, 0.5],
    [3160, 1],
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
      "linear-gradient(#8fd0ea 0px, #a9dbee 400px, #a9dbee 700px, #c6cbee 1400px, #f0c3c8 2128px, #f4ab84 2800px, #7b6fc9 2980px, #121238 3160px)",
    );
  });
});

describe("skyGradient", () => {
  it("warms slowly through the day, then turns through dusk to night", () => {
    expect(skyGradient(skyLayout(3000), colours)).toEqual({
      end: 3160,
      stops: [
        [0, "#8fd0ea"],
        [400 / 3160, "#a9dbee"],
        [700 / 3160, "#a9dbee"],
        [1400 / 3160, "#c6cbee"],
        [2128 / 3160, "#f0c3c8"],
        [2800 / 3160, "#f4ab84"],
        [2980 / 3160, "#7b6fc9"],
        [1, "#121238"],
      ],
    });
  });

  it("keeps the stops in order on a short page", () => {
    const offsets = skyGradient(skyLayout(800), colours).stops.map(
      ([offset]) => offset * 960,
    );
    expect(offsets).toEqual([0, 400, 400, 400, 456, 600, 780, 960]);
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
