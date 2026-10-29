import { describe, expect, it } from "vitest";
import { formatDay, formatMonth } from "./dates";

describe("formatMonth", () => {
  it.each([
    ["2024-01", "Jan 2024"],
    ["2025-05", "May 2025"],
    ["2026-12", "Dec 2026"],
  ])("formats %s as %s", (month, expected) => {
    expect(formatMonth(month)).toBe(expected);
  });
});

describe("formatDay", () => {
  it.each([
    ["2026-10-29", "29 Oct 2026"],
    ["2027-01-05", "5 Jan 2027"],
  ])("formats %s as %s", (day, expected) => {
    expect(formatDay(day)).toBe(expected);
  });
});
