import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerCard } from "./player-card";

describe("PlayerCard", () => {
  it("shows a labelled avatar", () => {
    render(<PlayerCard />);

    expect(
      screen.getByRole("img", { name: "Pixel avatar of Samad" }),
    ).toBeInTheDocument();
  });

  it("pairs each stat name with its value", () => {
    render(<PlayerCard />);

    const stats = screen.getByLabelText("Player stats");
    const names = within(stats).getAllByRole("term");
    const values = within(stats).getAllByRole("definition");

    expect(names.map((name) => name.textContent)).toEqual([
      "class",
      "level",
      "base",
      "status",
    ]);
    expect(values).toHaveLength(names.length);
  });
});
