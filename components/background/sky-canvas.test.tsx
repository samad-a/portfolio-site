import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SkyCanvas } from "./sky-canvas";

// A 2D context whose every method does nothing, since jsdom can't draw.
function stubCanvas() {
  const context = new Proxy(
    {},
    {
      get: (target: Record<string, unknown>, key: string) =>
        (target[key] ??=
          key === "createLinearGradient"
            ? () => ({ addColorStop: () => {} })
            : () => {}),
      set: () => true,
    },
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
}

function setHidden(hidden: boolean) {
  vi.spyOn(document, "hidden", "get").mockReturnValue(hidden);
  document.dispatchEvent(new Event("visibilitychange"));
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("SkyCanvas", () => {
  it("is a decorative canvas behind the page", () => {
    const { container } = render(<SkyCanvas />);

    const canvas = container.querySelector("canvas");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas).toHaveClass("fixed", "-z-10", "pointer-events-none");
  });

  it("renders without a 2D context, as in browsers that block canvas", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(() => render(<SkyCanvas />)).not.toThrow();
    expect(document.documentElement.dataset.sky).toBeUndefined();
  });

  it("takes over the night sky while it's running", () => {
    stubCanvas();
    const { unmount } = render(<SkyCanvas />);

    expect(document.documentElement.dataset.sky).toBe("canvas");
    unmount();
    expect(document.documentElement.dataset.sky).toBeUndefined();
  });

  it("stops drawing while the tab is hidden and resumes after", () => {
    stubCanvas();
    const request = vi.fn(() => 1);
    const cancel = vi.fn();
    vi.stubGlobal("requestAnimationFrame", request);
    vi.stubGlobal("cancelAnimationFrame", cancel);
    render(<SkyCanvas />);
    expect(request).toHaveBeenCalledTimes(1);

    setHidden(true);
    expect(cancel).toHaveBeenCalled();
    expect(request).toHaveBeenCalledTimes(1);

    setHidden(false);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("draws one still frame with reduced motion, and again on scroll", () => {
    stubCanvas();
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: query === "(prefers-reduced-motion: reduce)",
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      frames.push(callback),
    );
    vi.stubGlobal("cancelAnimationFrame", () => {});
    render(<SkyCanvas />);

    // Drawing the frames that are waiting asks for no more.
    const waiting = frames.splice(0);
    expect(waiting.length).toBeGreaterThan(0);
    waiting.forEach((callback) => callback(16));
    expect(frames).toHaveLength(0);

    dispatchEvent(new Event("scroll"));
    expect(frames).toHaveLength(1);
  });
});
