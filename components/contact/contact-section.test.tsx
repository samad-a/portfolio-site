import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { contact } from "@/lib/contact";
import { ContactSection } from "./contact-section";
import { CopyEmail } from "./copy-email";

describe("ContactSection", () => {
  it("is a region named by its heading", () => {
    render(<ContactSection />);

    expect(
      screen.getByRole("region", { name: "get in touch!" }),
    ).toHaveAttribute("id", "contact");
  });

  it.each([
    ["email", `mailto:${contact.email}`],
    ["github", contact.github],
    ["linkedin", contact.linkedin],
  ])("links %s to %s", (label, href) => {
    render(<ContactSection />);

    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "href",
      href,
    );
  });
});

describe("CopyEmail", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("copies the address and says so", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<CopyEmail email="me@example.com" />);

    fireEvent.click(screen.getByRole("button", { name: "copy" }));

    expect(await screen.findByRole("status")).toHaveTextContent("copied!");
    expect(writeText).toHaveBeenCalledWith("me@example.com");
  });

  it("selects the address when the clipboard isn't available", async () => {
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    render(<CopyEmail email="me@example.com" />);

    fireEvent.click(screen.getByRole("button", { name: "copy" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "selected, press ctrl+c to copy",
    );
    expect(getSelection()?.toString()).toBe("me@example.com");
  });
});
