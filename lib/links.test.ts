import { describe, expect, it } from "vitest";
import { isExternal } from "./links";

describe("isExternal", () => {
  it.each([
    ["https://github.com/samad-a", true],
    ["http://example.com", true],
    ["https://samadali.dev/blog", false],
    ["/projects/zen", false],
    ["#demo", false],
    ["mailto:hello@samadali.dev", false],
  ])("says %s leaves the site: %s", (href, external) => {
    expect(isExternal(href)).toBe(external);
  });
});
