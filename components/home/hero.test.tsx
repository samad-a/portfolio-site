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

  it("offers the CV as a download when there is one", () => {
    render(<Hero cvHref="/cv.pdf" />);

    const link = screen.getByRole("link", { name: "save file (CV)" });
    expect(link).toHaveAttribute("href", "/cv.pdf");
    expect(link).toHaveAttribute("download", "Samad-Ali-CV.pdf");
  });

  it("hides the CV button when there is no CV", () => {
    render(<Hero />);

    expect(screen.queryByRole("link", { name: /CV/ })).not.toBeInTheDocument();
  });

  it("points press start at the first section", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: "press start" })).toHaveAttribute(
      "href",
      "#experience",
    );
  });

  it("introduces Samad", () => {
    render(<Hero />);

    expect(
      screen.getByText(/4th year computer science student/),
    ).toBeInTheDocument();
  });
});
