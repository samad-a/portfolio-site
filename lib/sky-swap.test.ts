import { afterEach, describe, expect, it, vi } from "vitest";
import { isSkySwapped, subscribeSkySwap, toggleSkySwap } from "./sky-swap";

describe("toggleSkySwap", () => {
  afterEach(() => {
    delete document.documentElement.dataset.skySwap;
    localStorage.clear();
  });

  it("swaps the sky, remembers it and tells listeners", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeSkySwap(listener);

    toggleSkySwap();
    expect(isSkySwapped()).toBe(true);
    expect(localStorage.getItem("sky-swapped")).toBe("1");
    expect(listener).toHaveBeenCalledTimes(1);

    toggleSkySwap();
    expect(isSkySwapped()).toBe(false);
    expect(localStorage.getItem("sky-swapped")).toBe("0");
    unsubscribe();
  });
});
