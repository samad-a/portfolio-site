import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GrassBlock } from "./grass-block";

describe("GrassBlock", () => {
  it("is an article named by its title", () => {
    render(<GrassBlock title="web intern">details</GrassBlock>);

    const article = screen.getByRole("article", { name: "web intern" });
    expect(article).toHaveTextContent("details");
    expect(
      screen.getByRole("heading", { level: 3, name: "web intern" }),
    ).toBeInTheDocument();
  });

  it("shows the aside next to the title", () => {
    render(
      <GrassBlock title="web intern" aside="May 2024 – Dec 2024">
        details
      </GrassBlock>,
    );

    const header = screen.getByRole("heading").parentElement;
    expect(header).toHaveTextContent("May 2024 – Dec 2024");
  });

  it("leaves the aside out when there isn't one", () => {
    render(<GrassBlock title="web intern">details</GrassBlock>);

    expect(screen.getByRole("heading").parentElement?.children).toHaveLength(1);
  });
});
