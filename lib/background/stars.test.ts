import { describe, expect, it } from "vitest";
import { makeStars, starOpacity } from "./stars";

describe("makeStars", () => {
  it("fills the night sky in proportion to its size", () => {
    expect(makeStars(Math.random, 1280, 3000, 3800)).toHaveLength(128);
    expect(makeStars(Math.random, 375, 3000, 4600)).toHaveLength(75);
  });

  it("makes none when there's no night sky", () => {
    expect(makeStars(Math.random, 1280, 3000, 3000)).toEqual([]);
    expect(makeStars(Math.random, 1280, 3000, 2000)).toEqual([]);
  });

  it("keeps every star inside the night sky, on whole pixels", () => {
    for (const star of makeStars(Math.random, 1280, 3000, 4000)) {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThan(1280);
      expect(star.y).toBeGreaterThanOrEqual(3000);
      expect(star.y).toBeLessThan(4000);
      expect(Number.isInteger(star.x) && Number.isInteger(star.y)).toBe(true);
      expect([2, 3]).toContain(star.size);
    }
  });
});

describe("starOpacity", () => {
  const star = { x: 0, y: 0, size: 2, phase: 0 } as const;

  it("twinkles between 0.1 and 1 at full night", () => {
    expect(starOpacity(star, Math.PI / 4, 1)).toBeCloseTo(1);
    expect(starOpacity(star, (3 * Math.PI) / 4, 1)).toBeCloseTo(0.1);
  });

  it("is hidden on the day sky", () => {
    expect(starOpacity(star, 1, 0)).toBe(0);
  });
});
