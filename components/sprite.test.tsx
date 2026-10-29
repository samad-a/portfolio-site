import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { palette } from "@/lib/sprites/grid";
import { Sprite } from "./sprite";

const grid = ["KK.Y", "..YY"];

describe("Sprite", () => {
  it("sizes the view box to the grid", () => {
    const { container } = render(<Sprite grid={grid} />);

    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 0 4 2",
    );
  });

  it("merges same-coloured neighbours and skips transparent pixels", () => {
    const { container } = render(<Sprite grid={grid} />);

    const rects = [...container.querySelectorAll("rect")].map((rect) => ({
      x: rect.getAttribute("x"),
      y: rect.getAttribute("y"),
      width: rect.getAttribute("width"),
      fill: rect.getAttribute("fill"),
    }));
    expect(rects).toEqual([
      { x: "0", y: "0", width: "2", fill: palette.K },
      { x: "3", y: "0", width: "1", fill: palette.Y },
      { x: "2", y: "1", width: "2", fill: palette.Y },
    ]);
  });

  it("is hidden from screen readers without a label", () => {
    const { container } = render(<Sprite grid={grid} />);

    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("is an image with a name when labelled", () => {
    render(<Sprite grid={grid} label="gold coin" />);

    expect(screen.getByRole("img", { name: "gold coin" })).toBeInTheDocument();
  });
});
