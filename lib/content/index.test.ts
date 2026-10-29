import { describe, expect, it } from "vitest";
import { experience, parseContent } from ".";
import { skillListSchema } from "./schemas";

describe("parseContent", () => {
  it("returns the parsed data when it's valid", () => {
    const data = [{ name: "Git", category: "tool" }];
    expect(parseContent("skills.json", skillListSchema, data)).toEqual(data);
  });

  it("names the file and the problem when it isn't", () => {
    expect(() =>
      parseContent("skills.json", skillListSchema, [
        { name: "Git", category: "tools" },
      ]),
    ).toThrow(/^skills\.json is invalid:\n[\s\S]*\[0\]\.category/);
  });
});

describe("experience", () => {
  it("lists the newest role first", () => {
    const starts = experience.map((role) => role.start);
    expect(starts).toEqual(starts.toSorted().reverse());
  });
});
