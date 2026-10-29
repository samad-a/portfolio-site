import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PixelPanel } from "./pixel-panel";

describe("PixelPanel", () => {
  it("renders its children in a div by default", () => {
    render(<PixelPanel>inventory</PixelPanel>);

    const panel = screen.getByText("inventory");
    expect(panel.tagName).toBe("DIV");
    expect(panel).toHaveClass("pixel-corners", "bg-paper", "p-5");
  });

  it("renders as another element", () => {
    render(
      <PixelPanel as="section" aria-label="experience">
        quest log
      </PixelPanel>,
    );

    expect(
      screen.getByRole("region", { name: "experience" }),
    ).toHaveTextContent("quest log");
  });

  it("lets className replace the default background and padding", () => {
    render(<PixelPanel className="bg-dirt p-0">dirt block</PixelPanel>);

    const panel = screen.getByText("dirt block");
    expect(panel).toHaveClass("bg-dirt", "p-0");
    expect(panel).not.toHaveClass("bg-paper", "p-5");
  });

  it("puts the outline and outerClassName on the wrapper", () => {
    render(<PixelPanel outerClassName="h-full">card</PixelPanel>);

    const wrapper = screen.getByText("card").parentElement;
    expect(wrapper).toHaveClass("pixel-outline", "h-full");
  });

  it("lets a bigger corner size replace the default", () => {
    render(<PixelPanel className="pixel-corners-2">console</PixelPanel>);

    expect(screen.getByText("console")).toHaveClass(
      "pixel-corners",
      "pixel-corners-2",
    );
  });
});
