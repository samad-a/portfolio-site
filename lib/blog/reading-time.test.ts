import { describe, expect, it } from "vitest";
import { readingMinutes } from "./reading-time";

const words = (count: number) => Array(count).fill("word").join(" ");

describe("readingMinutes", () => {
  it.each([
    [0, 1],
    [50, 1],
    [299, 1],
    [300, 2],
    [1000, 5],
  ])("%s words take %s min", (count, minutes) => {
    expect(readingMinutes(words(count))).toBe(minutes);
  });

  it("counts words across lines and extra spaces", () => {
    expect(readingMinutes(`  ${words(200)}\n\n${words(200)}  `)).toBe(2);
  });
});
