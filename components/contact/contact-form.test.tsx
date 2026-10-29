import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ContactFormState } from "@/lib/contact-form";
import { ContactForm } from "./contact-form";

function fill(values: Record<string, string>) {
  for (const [label, value] of Object.entries(values)) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
}

describe("ContactForm", () => {
  it("labels every field", () => {
    render(<ContactForm action={vi.fn()} />);

    expect(screen.getByLabelText("your name")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("your email")).toHaveAttribute(
      "type",
      "email",
    );
    expect(screen.getByLabelText("message").tagName).toBe("TEXTAREA");
  });

  it("sends what was typed to the action", async () => {
    const action = vi.fn().mockResolvedValue({ status: "sent" });
    render(<ContactForm action={action} />);

    fill({
      "your name": "Ada",
      "your email": "ada@example.com",
      message: "Hello!",
    });
    fireEvent.click(screen.getByRole("button", { name: "send" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Message sent!",
    );
    const formData: FormData = action.mock.calls[0][1];
    expect(Object.fromEntries(formData)).toMatchObject({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello!",
    });
  });

  it("shows errors next to their fields and keeps what was typed", async () => {
    const state: ContactFormState = {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: { email: "Enter a valid email address." },
      values: { name: "Ada", email: "not-an-email", message: "Hello!" },
    };
    render(<ContactForm action={vi.fn().mockResolvedValue(state)} />);

    fireEvent.click(screen.getByRole("button", { name: "send" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please fix the highlighted fields.",
    );
    const email = screen.getByLabelText("your email");
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Enter a valid email address.");
    expect(email).toHaveValue("not-an-email");
    expect(screen.getByLabelText("message")).toHaveValue("Hello!");
    expect(screen.getByLabelText("your name")).not.toHaveAttribute(
      "aria-invalid",
    );
  });
});
