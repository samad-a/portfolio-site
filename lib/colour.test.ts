import { describe, expect, it } from "vitest";
import { contrastRatio } from "./colour";

describe("contrastRatio", () => {
  it("is 21 for black and white, either way round", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21);
  });

  it("is 1 for the same colour", () => {
    expect(contrastRatio("#43308f", "#43308f")).toBe(1);
  });

  it.each([
    ["#e5484d", 3.91],
    ["#ce4145", 4.7],
    ["#2d601c", 7.5],
  ])("matches known ratios for %s on white", (colour, ratio) => {
    expect(contrastRatio(colour, "#ffffff")).toBeCloseTo(ratio, 1);
  });
});
