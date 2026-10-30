import { describe, expect, it } from "vitest";
import {
  celestialProgress,
  moonPosition,
  sunPosition,
  sunsetAmount,
} from "./celestial";
import { skyLayout } from "./sky";

const viewport = { width: 1000, height: 800 };

describe("celestialProgress", () => {
  // Day ends at 2800, dusk is at 2980 and the page bottoms out at 3600.
  const layout = skyLayout(3000);

  it.each([
    [0, 0, 0],
    [1490, 0.5, 0],
    [2800, 2800 / 2980, 0],
    [2980, 1, 180 / 800],
    [3600, 1, 1],
  ])("at %s the sun is %s along and the moon %s", (centre, sun, moon) => {
    const progress = celestialProgress(centre, layout, 3600);
    expect(progress.sun).toBeCloseTo(sun);
    expect(progress.moon).toBeCloseTo(moon);
  });

  it("keeps the sun up on pages without a night sky", () => {
    expect(celestialProgress(5000, undefined, 9000)).toEqual({
      sun: 0,
      moon: 0,
    });
  });
});

describe("sunPosition", () => {
  it("starts high on the right", () => {
    expect(sunPosition(0, viewport)).toEqual({ x: 620, y: 128 });
  });

  it("has set off the bottom right by the end", () => {
    const { x, y } = sunPosition(1, viewport);
    expect(x).toBeGreaterThan(viewport.width);
    expect(y).toBeGreaterThan(viewport.height);
  });
});

describe("moonPosition", () => {
  it("starts below the bottom left", () => {
    const { x, y } = moonPosition(0, viewport);
    expect(x).toBeLessThan(0);
    expect(y).toBe(viewport.height);
  });

  it("ends high on the left", () => {
    const { x, y } = moonPosition(1, viewport);
    expect(x).toBeCloseTo(180);
    expect(y).toBeCloseTo(112);
  });
});

describe("sunsetAmount", () => {
  it.each([
    [0, 0],
    [0.4, 0],
    [0.7, 0.5],
    [1, 1],
  ])("at %s along it is %s red", (progress, amount) => {
    expect(sunsetAmount(progress)).toBeCloseTo(amount);
  });
});
