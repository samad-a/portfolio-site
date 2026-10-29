import { describe, expect, it } from "vitest";
import { spriteProblems } from "./grid";
import { sprites } from "./index";

describe("sprites", () => {
  it.each(Object.entries(sprites))("%s has no problems", (_name, grid) => {
    expect(spriteProblems(grid)).toEqual([]);
  });
});

describe("spriteProblems", () => {
  it("accepts rows of equal width using known colours", () => {
    expect(spriteProblems(["..KK..", ".KYYK.", "..KK.."])).toEqual([]);
  });

  it("reports a row of the wrong width", () => {
    expect(spriteProblems(["KKK", "KK", "KKK"])).toEqual([
      "row 1 is 2 wide, expected 3",
    ]);
  });

  it("reports an unknown colour with its position", () => {
    expect(spriteProblems(["KK", "KX"])).toEqual(['unknown colour "X" at 1,1']);
  });

  it("reports an empty grid", () => {
    expect(spriteProblems([])).toEqual(["has no rows"]);
    expect(spriteProblems([""])).toEqual(["has an empty first row"]);
  });
});
