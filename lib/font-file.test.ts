import { describe, expect, it } from "vitest";
import { isFontFile } from "./font-file";

function bytes(...values: number[]) {
  return new Uint8Array(values).buffer;
}

function text(value: string) {
  return new TextEncoder().encode(value).buffer;
}

describe("isFontFile", () => {
  it.each([
    ["TrueType", bytes(0, 1, 0, 0, 0, 12)],
    ["OpenType", text("OTTO....")],
    ["WOFF", text("wOFF....")],
  ])("accepts a %s font", (_kind, data) => {
    expect(isFontFile(data)).toBe(true);
  });

  it.each([
    ["an error page", text("<!DOCTYPE html><title>Error</title>")],
    ["rate limit text", text("Too Many Requests")],
    ["an empty body", bytes()],
  ])("rejects %s", (_kind, data) => {
    expect(isFontFile(data)).toBe(false);
  });
});
