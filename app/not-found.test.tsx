import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("says game over in the page's only top-level heading", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "GAME OVER",
    );
  });

  it("offers a way home and to the dev log", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: /go home/ })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", { name: "or read the dev log" }),
    ).toHaveAttribute("href", "/blog");
  });

  it("is the main landmark, so the skip link still works", () => {
    render(<NotFound />);

    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });
});
