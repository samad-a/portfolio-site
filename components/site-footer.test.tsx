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

  it("links to the site's source", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "view source" })).toHaveAttribute(
      "href",
      "https://github.com/samad-a/portfolio-site",
    );
  });
});
