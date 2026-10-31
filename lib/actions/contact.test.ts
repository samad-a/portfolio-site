import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contact } from "@/lib/contact";
import { sendContactMessage } from "./contact";

const { send, Resend } = vi.hoisted(() => {
  const send = vi.fn();
  // A class, since the action calls it with `new`.
  const Resend = vi.fn(
    class {
      emails = { send };
    },
  );
  return { send, Resend };
});

vi.mock("resend", () => ({ Resend }));

const idle = { status: "idle" } as const;

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
}

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I'd like to chat about an internship.",
};

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("CONTACT_FROM_EMAIL", "");
  send.mockResolvedValue({ data: { id: "email_1" }, error: null });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("sendContactMessage", () => {
  it("emails a valid message to me, with the visitor as the reply-to", async () => {
    const state = await sendContactMessage(idle, form(valid));

    expect(state).toEqual({ status: "sent" });
    expect(Resend).toHaveBeenCalledWith("re_test_key");
    expect(send).toHaveBeenCalledWith({
      from: "Portfolio contact form <onboarding@resend.dev>",
      to: contact.email,
      replyTo: "ada@example.com",
      subject: "New message from Ada Lovelace",
      text: "I'd like to chat about an internship.\n\nFrom: Ada Lovelace <ada@example.com>",
    });
  });

  it("trims spaces and uses the configured sender", async () => {
    vi.stubEnv("CONTACT_FROM_EMAIL", "Portfolio <contact@samadali.dev>");

    await sendContactMessage(
      idle,
      form({ ...valid, name: "  Ada  ", email: " ada@example.com " }),
    );

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Portfolio <contact@samadali.dev>",
        replyTo: "ada@example.com",
        subject: "New message from Ada",
      }),
    );
  });

  it.each([
    ["a trailing line break", "Portfolio <contact@samadali.dev>\n"],
    ["surrounding spaces", "  Portfolio <contact@samadali.dev> "],
    ["quotes", '"Portfolio <contact@samadali.dev>"'],
  ])("cleans %s off the configured sender", async (_case, configured) => {
    vi.stubEnv("CONTACT_FROM_EMAIL", configured);

    await sendContactMessage(idle, form(valid));

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ from: "Portfolio <contact@samadali.dev>" }),
    );
  });

  it.each([
    ["an empty name", { name: "" }, "name", "Enter your name."],
    [
      "a name over two lines",
      { name: "Ada\nBcc: someone" },
      "name",
      "Keep your name on one line.",
    ],
    ["an empty email", { email: "" }, "email", "Enter your email address."],
    [
      "an invalid email",
      { email: "not-an-email" },
      "email",
      "Enter a valid email address, like name@example.com.",
    ],
    ["a blank message", { message: "   " }, "message", "Write a message."],
    [
      "a message that's too long",
      { message: "a".repeat(5001) },
      "message",
      "Keep your message under 5000 characters.",
    ],
  ])("rejects %s without sending", async (_case, change, field, error) => {
    const fields = { ...valid, ...change };

    const state = await sendContactMessage(idle, form(fields));

    expect(state).toEqual({
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: { [field]: error },
      values: fields,
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports every invalid field at once", async () => {
    const state = await sendContactMessage(
      idle,
      form({ name: "", email: "", message: "" }),
    );

    expect(state.status === "error" && state.fieldErrors).toEqual({
      name: "Enter your name.",
      email: "Enter your email address.",
      message: "Write a message.",
    });
  });

  it("pretends to send when the honeypot is filled in", async () => {
    const state = await sendContactMessage(
      idle,
      form({ ...valid, website: "https://spam.example" }),
    );

    expect(state).toEqual({ status: "sent" });
    expect(send).not.toHaveBeenCalled();
  });

  it("asks people to email instead when there's no API key", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const state = await sendContactMessage(idle, form(valid));

    expect(state).toEqual({
      status: "error",
      message:
        "Sorry, the form isn't working right now. Please email me instead.",
      values: valid,
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("keeps the message when Resend fails", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "Invalid sender" },
    });

    const state = await sendContactMessage(idle, form(valid));

    expect(state).toMatchObject({ status: "error", values: valid });
    expect(console.error).toHaveBeenCalled();
  });
});
