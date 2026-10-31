import { describe, expect, it } from "vitest";
import { sprites } from "@/lib/sprites";
import { type Scenery, scenery, sceneryPosition } from "./scenery";

const section = { top: 1000, height: 400 };
const sprite = { width: 40, height: 20 };
const left: Scenery = {
  sprite: "coin",
  section: "skills",
  at: 0.5,
  side: "left",
};

describe("sceneryPosition", () => {
  it("sits in the margin beside the content on a wide screen", () => {
    // 1280 wide leaves a 120px margin each side of the 1040px content.
    expect(sceneryPosition(left, section, sprite, 1280)).toEqual({
      x: 64,
      y: 1190,
    });
    expect(
      sceneryPosition({ ...left, side: "right" }, section, sprite, 1280),
    ).toEqual({ x: 1176, y: 1190 });
  });

  it("tucks against the screen's edge on a narrow screen", () => {
    expect(sceneryPosition(left, section, sprite, 375)).toEqual({
      x: 16,
      y: 1190,
    });
    expect(
      sceneryPosition({ ...left, side: "right" }, section, sprite, 375),
    ).toEqual({ x: 319, y: 1190 });
  });

  it("leaves wide-only sprites out without room beside the content", () => {
    const wide = { ...left, wideOnly: true };
    expect(sceneryPosition(wide, section, sprite, 1024)).toBeUndefined();
    expect(sceneryPosition(wide, section, sprite, 1280)).toBeDefined();
  });
});

describe("scenery", () => {
  it("only uses sprites that exist", () => {
    for (const item of scenery) expect(sprites).toHaveProperty(item.sprite);
  });

  it("keeps each sprite within its section", () => {
    for (const item of scenery) {
      expect(item.at).toBeGreaterThanOrEqual(0);
      expect(item.at).toBeLessThanOrEqual(1);
    }
  });
});
