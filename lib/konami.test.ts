import { describe, expect, it } from "vitest";
import { konamiCode, konamiProgress } from "./konami";

const enter = (keys: readonly string[]) => keys.reduce(konamiProgress, 0);

describe("konamiProgress", () => {
  it("completes on the full code", () => {
    expect(enter(konamiCode)).toBe(konamiCode.length);
  });

  it("accepts capital B and A", () => {
    expect(enter([...konamiCode.slice(0, 8), "B", "A"])).toBe(10);
  });

  it("starts over on a wrong key", () => {
    expect(enter(["ArrowUp", "ArrowUp", "ArrowDown", "x"])).toBe(0);
  });

  it("restarts from a wrong key that begins the code", () => {
    expect(enter(["ArrowUp", "ArrowDown", "ArrowUp"])).toBe(1);
  });

  it("allows extra ups before the downs", () => {
    expect(
      enter(["ArrowUp", "ArrowUp", "ArrowUp", ...konamiCode.slice(2)]),
    ).toBe(10);
  });
});
