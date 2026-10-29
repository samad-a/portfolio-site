import { describe, expect, it } from "vitest";
import { formatMonth } from "./dates";

describe("formatMonth", () => {
  it.each([
    ["2024-01", "Jan 2024"],
    ["2025-05", "May 2025"],
    ["2026-12", "Dec 2026"],
  ])("formats %s as %s", (month, expected) => {
    expect(formatMonth(month)).toBe(expected);
  });
});
