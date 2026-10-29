import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Experience } from "@/lib/content";
import { ExperienceCard } from "./experience-card";
import { ExperienceSection } from "./experience-section";

const role: Experience = {
  id: "web-intern",
  role: "Web Intern",
  org: "Somewhere",
  location: "Edinburgh",
  start: "2024-05",
  end: "2024-12",
  highlights: ["Rebuilt pages.", "Mentored interns."],
};

describe("ExperienceCard", () => {
  it("shows the role, organisation and highlights", () => {
    render(<ExperienceCard role={role} />);

    const card = screen.getByRole("article", { name: "Web Intern" });
    expect(card).toHaveTextContent("Somewhere · Edinburgh");
    expect(
      within(card)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Rebuilt pages.", "Mentored interns."]);
  });

  it("shows the dates readably with machine-readable values", () => {
    render(<ExperienceCard role={role} />);

    expect(screen.getByText("May 2024")).toHaveAttribute("datetime", "2024-05");
    expect(screen.getByText("Dec 2024")).toHaveAttribute("datetime", "2024-12");
  });

  it("says now for a role that hasn't ended", () => {
    render(<ExperienceCard role={{ ...role, end: undefined }} />);

    expect(screen.getByRole("heading").parentElement).toHaveTextContent(
      "May 2024 – now",
    );
  });

  it("leaves out a missing location", () => {
    render(<ExperienceCard role={{ ...role, location: undefined }} />);

    expect(screen.getByText("Somewhere")).toBeInTheDocument();
    expect(screen.queryByText(/·/)).not.toBeInTheDocument();
  });
});

describe("ExperienceSection", () => {
  it("lists a card for each role under a labelled section", () => {
    render(
      <ExperienceSection
        roles={[role, { ...role, id: "second", role: "Second Role" }]}
      />,
    );

    const section = screen.getByRole("region", { name: /experience/ });
    expect(within(section).getAllByRole("article")).toHaveLength(2);
    expect(
      within(section).getByRole("article", { name: "Second Role" }),
    ).toBeInTheDocument();
  });
});
