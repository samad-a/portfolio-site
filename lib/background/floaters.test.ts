import { describe, expect, it } from "vitest";
import {
  bobOffset,
  daySprites,
  floaterCount,
  floaterScale,
  isOffScreen,
  spawnFloater,
} from "./floaters";

const phone = { width: 375, height: 800 };
const desktop = { width: 1280, height: 800 };

// Always returns the same value, so spawns are predictable.
const always = (value: number) => () => value;

describe("floaters", () => {
  it("uses fewer, smaller floaters on phones", () => {
    expect(floaterCount(phone)).toBe(5);
    expect(floaterCount(desktop)).toBe(9);
    expect(floaterScale(phone)).toBe(3);
    expect(floaterScale(desktop)).toBe(4);
  });

  it("scatters the first floaters across the screen", () => {
    const floater = spawnFloater(always(0.5), desktop, daySprites, true);

    expect(floater.x).toBe(640);
    expect(floater.y).toBe(400);
    expect(daySprites).toContain(floater.sprite);
  });

  it("brings later floaters in from the edge they drift away from", () => {
    const rightward = spawnFloater(always(0.9), desktop, daySprites, false);
    const leftward = spawnFloater(always(0.1), desktop, daySprites, false);

    expect(rightward.speed).toBeGreaterThan(0);
    expect(rightward.x).toBeLessThan(0);
    expect(leftward.speed).toBeLessThan(0);
    expect(leftward.x).toBeGreaterThan(desktop.width);
  });

  it("drifts slowly, between 9 and 24 pixels a second", () => {
    for (const value of [0, 0.25, 0.75, 0.999]) {
      const { speed } = spawnFloater(always(value), desktop, daySprites, true);
      expect(Math.abs(speed)).toBeGreaterThanOrEqual(9);
      expect(Math.abs(speed)).toBeLessThan(24);
    }
  });

  it("only counts as off screen once fully past an edge", () => {
    const floater = spawnFloater(always(0.5), desktop, daySprites, true);

    expect(isOffScreen({ ...floater, x: -10 }, desktop)).toBe(false);
    expect(isOffScreen({ ...floater, x: -81 }, desktop)).toBe(true);
    expect(isOffScreen({ ...floater, x: 1361 }, desktop)).toBe(true);
  });

  it("bobs in whole 2px steps, at most 6px either way", () => {
    const floater = spawnFloater(always(0.3), desktop, daySprites, true);

    for (let seconds = 0; seconds < 10; seconds += 0.37) {
      const offset = bobOffset(floater, seconds);
      expect(Math.abs(offset % 2)).toBe(0);
      expect(Math.abs(offset)).toBeLessThanOrEqual(6);
    }
  });
});
