import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AvatarWardrobe } from "./avatar-wardrobe";

afterEach(() => {
  window.localStorage.clear();
});

function options() {
  return within(screen.getByRole("group"))
    .getAllByRole("button")
    .filter((button) => button.hasAttribute("aria-pressed"));
}

describe("AvatarWardrobe", () => {
  it("invites a click until a part is opened", () => {
    render(<AvatarWardrobe />);

    expect(screen.getByText("Click on me!")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("has a button for each part, which opens its options", () => {
    render(<AvatarWardrobe />);
    const outfit = screen.getByRole("button", { name: "Change outfit" });

    fireEvent.click(outfit);

    expect(outfit).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("group", { name: "outfit options" })).toBeVisible();
    expect(options().map((option) => option.textContent)).toEqual([
      "polo",
      "hoodie",
      "suit",
      "grad gown",
    ]);
    expect(screen.getByRole("button", { name: "polo" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "polo" })).toHaveFocus();
  });

  it("wears a picked option and remembers it", () => {
    const { unmount } = render(<AvatarWardrobe />);

    fireEvent.click(screen.getByRole("button", { name: "Change hair" }));
    fireEvent.click(screen.getByRole("button", { name: "cap" }));

    expect(screen.getByRole("button", { name: "cap" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(JSON.parse(window.localStorage.getItem("avatar-look")!)).toEqual({
      hair: "cap",
      face: "smile",
      outfit: "polo",
    });

    unmount();
    render(<AvatarWardrobe />);
    fireEvent.click(screen.getByRole("button", { name: "Change hair" }));
    expect(screen.getByRole("button", { name: "cap" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("closes on Escape, handing focus back to the part", () => {
    render(<AvatarWardrobe />);
    const face = screen.getByRole("button", { name: "Change face" });

    fireEvent.click(face);
    fireEvent.keyDown(screen.getByRole("button", { name: "smile" }), {
      key: "Escape",
    });

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(face).toHaveFocus();
    expect(face).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when the visitor clicks elsewhere", () => {
    render(<AvatarWardrobe />);

    fireEvent.click(screen.getByRole("button", { name: "Change face" }));
    fireEvent.pointerDown(document.body);

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});
