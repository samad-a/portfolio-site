import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("links home and to each homepage section", () => {
    render(<SiteHeader />);

    const nav = screen.getByRole("navigation", { name: "Main" });
    const links = within(nav)
      .getAllByRole("link")
      .map((link) => [link.textContent, link.getAttribute("href")]);

    expect(links).toEqual([
      ["samad ali", "/"],
      ["experience", "/#experience"],
      ["skills", "/#skills"],
      ["projects", "/#projects"],
      ["contact", "/#contact"],
    ]);
  });

  it("hides the cloud drawings from screen readers", () => {
    render(<SiteHeader />);

    for (const link of screen.getAllByRole("link")) {
      expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
  });
});
