import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Project, Skill } from "@/lib/content";
import { type InventoryItem, InventoryGrid } from "./inventory-grid";
import { InventorySlot } from "./inventory-slot";
import { SkillsSection } from "./skills-section";

const git: InventoryItem = {
  name: "Git",
  category: "tool",
  item: "key",
  usedIn: [],
};
const react: InventoryItem = {
  name: "React",
  category: "framework",
  item: "heart",
  usedIn: ["Blockr"],
};

// The box under the grid is hidden from screen readers, so find it by its hint.
function detailsBox() {
  return screen.getByText(/inspect it/).closest("[aria-hidden]") as HTMLElement;
}

describe("InventorySlot", () => {
  it("is a button named after the skill, with its item drawn", () => {
    render(<InventorySlot skill={git} />);

    const slot = screen.getByRole("button", { name: "Git" });
    expect(slot).toHaveAttribute("type", "button");
    expect(slot.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("marks itself active only when told to", () => {
    const { rerender } = render(<InventorySlot skill={git} />);
    expect(screen.getByRole("button")).not.toHaveAttribute("data-active");

    rerender(<InventorySlot skill={git} active />);
    expect(screen.getByRole("button")).toHaveAttribute("data-active");
  });
});

describe("InventoryGrid", () => {
  it("lists a slot for each skill", () => {
    render(<InventoryGrid items={[git, react]} />);

    const list = screen.getByRole("list", { name: "Skills" });
    expect(
      within(list)
        .getAllByRole("button")
        .map((b) => b.textContent),
    ).toEqual(["Git", "React"]);
  });

  it("gives each slot its details as a description", () => {
    render(<InventoryGrid items={[git, react]} />);

    expect(
      screen.getByRole("button", { name: "Git" }),
    ).toHaveAccessibleDescription("tool");
    expect(
      screen.getByRole("button", { name: "React" }),
    ).toHaveAccessibleDescription("framework · used in Blockr");
  });

  it("asks the visitor to pick an item until they do", () => {
    render(<InventoryGrid items={[git, react]} />);

    expect(detailsBox()).toHaveTextContent("select an item to inspect it");
    expect(screen.getByRole("button", { name: "Git" })).not.toHaveAttribute(
      "data-active",
    );
  });

  it.each([
    ["pointing at", fireEvent.pointerEnter],
    ["focusing", fireEvent.focus],
    ["clicking", fireEvent.click],
  ])("shows a skill's details on %s its slot", (_action, fire) => {
    render(<InventoryGrid items={[git, react]} />);
    const box = detailsBox();

    fire(screen.getByRole("button", { name: "React" }));

    expect(box).toHaveTextContent("React");
    expect(box).toHaveTextContent("framework · used in Blockr");
    expect(screen.getByRole("button", { name: "React" })).toHaveAttribute(
      "data-active",
    );
  });

  it("keeps the last item's details when the pointer leaves", () => {
    render(<InventoryGrid items={[git, react]} />);
    const box = detailsBox();
    const slot = screen.getByRole("button", { name: "Git" });

    fireEvent.pointerEnter(slot);
    fireEvent.pointerLeave(slot);

    expect(box).toHaveTextContent("Git");
  });
});

describe("SkillsSection", () => {
  const skills: Skill[] = [
    { name: "TypeScript", category: "language", item: "shield" },
    { name: "Haskell", category: "language", item: "gem" },
  ];
  const projects = [
    { name: "Blockr", stack: ["typescript", "React"] },
    { name: "Site", stack: ["TypeScript"] },
  ] as Project[];

  it("lists the projects that use each skill, ignoring case", () => {
    render(<SkillsSection skills={skills} projects={projects} />);

    expect(
      screen.getByRole("button", { name: "TypeScript" }),
    ).toHaveAccessibleDescription("language · used in Blockr, Site");
    expect(
      screen.getByRole("button", { name: "Haskell" }),
    ).toHaveAccessibleDescription("language");
  });

  it("is a region named by its heading", () => {
    render(<SkillsSection skills={skills} projects={projects} />);

    expect(screen.getByRole("region", { name: /skills/ })).toHaveAttribute(
      "id",
      "skills",
    );
  });
});
