import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PixelButton } from "./pixel-button";

describe("PixelButton", () => {
  it("renders a button that doesn't submit forms by default", () => {
    render(<PixelButton>press start</PixelButton>);

    const button = screen.getByRole("button", { name: "press start" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("lets a form button submit", () => {
    render(<PixelButton type="submit">send</PixelButton>);

    expect(screen.getByRole("button", { name: "send" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("calls onClick when pressed", () => {
    const onClick = vi.fn();
    render(<PixelButton onClick={onClick}>press start</PixelButton>);

    fireEvent.click(screen.getByRole("button", { name: "press start" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders a plain link for a download, so it isn't prefetched as a page", () => {
    render(
      <PixelButton href="/cv.pdf" download="cv.pdf">
        save file
      </PixelButton>,
    );

    const link = screen.getByRole("link", { name: "save file" });
    expect(link).toHaveAttribute("href", "/cv.pdf");
    expect(link).toHaveAttribute("download", "cv.pdf");
  });

  it("renders a link when given an href", () => {
    render(<PixelButton href="/cv.pdf">save file</PixelButton>);

    const link = screen.getByRole("link", { name: "save file" });
    expect(link).toHaveAttribute("href", "/cv.pdf");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("lets className replace the default colours", () => {
    render(<PixelButton className="bg-ink text-paper">dark</PixelButton>);

    const button = screen.getByRole("button", { name: "dark" });
    expect(button).toHaveClass("bg-ink", "text-paper", "pixel-corners");
    expect(button).not.toHaveClass("bg-gold", "text-ink");
  });

  it("draws the outline on a wrapper outside the clipped face", () => {
    render(<PixelButton>press start</PixelButton>);

    const button = screen.getByRole("button", { name: "press start" });
    expect(button.parentElement).toHaveClass("pixel-outline");
    expect(button).not.toHaveClass("pixel-outline");
  });
});
