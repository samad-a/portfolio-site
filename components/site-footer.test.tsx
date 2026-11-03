import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("is the page's content info with this year's copyright", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      `© ${new Date().getFullYear()} Samad Ali`,
    );
  });

  it("links to the site's source in a new tab", () => {
    render(<SiteFooter />);

    const link = screen.getByRole("link", {
      name: "view source (opens in a new tab)",
    });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/samad-a/portfolio-site",
    );
    expect(link).toHaveAttribute("target", "_blank");
  });
});
