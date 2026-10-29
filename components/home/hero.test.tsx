import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./hero";

describe("Hero", () => {
  it("greets the visitor in the page's only top-level heading", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "hi there!",
    );
  });

  it("is a region named by its heading", () => {
    render(<Hero />);

    const region = screen.getByRole("region", { name: "hi there!" });
    expect(region).toHaveAttribute("id", "top");
  });

  it("introduces Samad", () => {
    render(<Hero />);

    expect(
      screen.getByText(/3rd year computer science student/),
    ).toBeInTheDocument();
  });
});
