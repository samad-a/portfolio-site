import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav-links";

function openMenu() {
  render(<MobileMenu links={navLinks} />);
  fireEvent.click(screen.getByRole("button", { name: "menu" }));
}

describe("MobileMenu", () => {
  it("starts closed", () => {
    render(<MobileMenu links={navLinks} />);

    expect(screen.getByRole("button", { name: "menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("opens to show every section link", () => {
    openMenu();

    const button = screen.getByRole("button", { name: "close" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(
      document.getElementById(button.getAttribute("aria-controls")!),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(
      navLinks.map(({ label }) => label),
    );
  });

  it("closes on Escape and returns focus to the button", () => {
    openMenu();

    fireEvent.keyDown(document, { key: "Escape" });

    const button = screen.getByRole("button", { name: "menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  it("closes when a link is chosen", () => {
    openMenu();

    fireEvent.click(screen.getByRole("link", { name: "projects" }));

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("closes on a tap outside, but not inside", () => {
    openMenu();

    fireEvent.pointerDown(screen.getByRole("link", { name: "skills" }));
    expect(screen.getByRole("link", { name: "skills" })).toBeInTheDocument();

    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
