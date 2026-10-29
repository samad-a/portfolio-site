"use server";

import { Resend } from "resend";
import { z } from "zod";
import { contact } from "@/lib/contact";
import {
  type ContactField,
  type ContactFormState,
  type ContactValues,
  honeypotField,
} from "@/lib/contact-form";
import { contactSchema } from "@/lib/contact-schema";

// Resend's shared test sender works without a verified domain, but can only
// deliver to the address that owns the Resend account.
const defaultFrom = "Portfolio contact form <onboarding@resend.dev>";

const unavailable =
  "Sorry, the form isn't working right now. Please email me instead.";

function readValues(formData: FormData): ContactValues {
  const read = (name: string) => String(formData.get(name) ?? "");
  return {
    name: read("name"),
    email: read("email"),
    message: read("message"),
  };
}

// Emails a message from the contact form to me, with the visitor's address as
// the reply-to.
export async function sendContactMessage(
  _state: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Only bots fill in the honeypot. Tell them it worked so they move on.
  if (String(formData.get(honeypotField) ?? "") !== "") {
    return { status: "sent" };
  }

  const values = readValues(formData);
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      // The first problem with each field is enough to act on.
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([field, messages]) => [
          field as ContactField,
          messages?.[0],
        ]),
      ),
      values,
    };
  }
  const { name, email, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY isn't set.");
    return { status: "error", message: unavailable, values };
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL || defaultFrom,
    to: contact.email,
    replyTo: email,
    subject: `New message from ${name}`,
    text: `${message}\n\nFrom: ${name} <${email}>`,
  });

  if (error) {
    console.error("Contact form: Resend couldn't send the message.", error);
    return { status: "error", message: unavailable, values };
  }

  return { status: "sent" };
}
