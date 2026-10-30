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
  // The middle of the screen runs from 400 to 3600. Day ends at 2440 and
  // dusk is at 2930.
  const layout = skyLayout(3000);

  it.each([
    [400, 0, 0],
    [1665, 0.5, 0],
    [2440, 2040 / 2530, 0],
    [2930, 1, 490 / 1160],
    [3600, 1, 1],
  ])("at %s the sun is %s along and the moon %s", (centre, sun, moon) => {
    const progress = celestialProgress(centre, layout, 400, 3600);
    expect(progress.sun).toBeCloseTo(sun);
    expect(progress.moon).toBeCloseTo(moon);
  });

  it("keeps the sun up on pages without a night sky", () => {
    expect(celestialProgress(5000, undefined, 400, 9000)).toEqual({
      sun: 0,
      moon: 0,
    });
  });
});

describe("sunPosition", () => {
  it("starts beside the intro, clear of the navigation", () => {
    const { x, y } = sunPosition(0, viewport);
    expect(x).toBeCloseTo(589, 0);
    expect(y).toBeCloseTo(234, 0);
  });

  it("peaks below the navigation", () => {
    const highest = Math.min(
      ...Array.from({ length: 21 }, (_, i) => sunPosition(i / 20, viewport).y),
    );
    expect(highest).toBeGreaterThan(0.24 * viewport.height);
  });

  it("climbs before it sinks, so it moves in an arc", () => {
    const heights = [0, 0.07, 0.14, 0.5, 0.8].map(
      (progress) => sunPosition(progress, viewport).y,
    );
    expect(heights[1]).toBeLessThan(heights[0]);
    expect(heights[2]).toBeLessThan(heights[1]);
    expect(heights[3]).toBeGreaterThan(heights[2]);
    expect(heights[4]).toBeGreaterThan(heights[3]);
  });

  it("has set past the bottom right corner by the end", () => {
    const { x, y } = sunPosition(1, viewport);
    expect(x).toBeGreaterThan(viewport.width + 40);
    expect(y).toBeGreaterThan(viewport.height + 40);
  });
});

describe("moonPosition", () => {
  it("starts below the bottom left", () => {
    const { x, y } = moonPosition(0, viewport);
    expect(x).toBeLessThan(viewport.width * 0.1);
    expect(y).toBeGreaterThan(viewport.height + 40);
  });

  it("ends high on the left", () => {
    const { x, y } = moonPosition(1, viewport);
    expect(x).toBeCloseTo(237, 0);
    expect(y).toBeCloseTo(159, 0);
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
