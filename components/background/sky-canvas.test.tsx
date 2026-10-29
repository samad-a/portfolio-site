import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkyCanvas } from "./sky-canvas";

describe("SkyCanvas", () => {
  it("is a decorative canvas behind the page", () => {
    const { container } = render(<SkyCanvas />);

    const canvas = container.querySelector("canvas");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas).toHaveClass("fixed", "-z-10", "pointer-events-none");
  });

  it("renders without a 2D context, as in browsers that block canvas", () => {
    // jsdom has no canvas drawing, so getContext returns null here.
    expect(() => render(<SkyCanvas />)).not.toThrow();
  });
});
