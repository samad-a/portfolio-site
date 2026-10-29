"use server";

import { Resend } from "resend";
import { contact } from "@/lib/contact";
import type { ContactFormState, ContactValues } from "@/lib/contact-form";

// Resend's shared test sender works without a verified domain, but can only
// deliver to the address that owns the Resend account.
const defaultFrom = "Portfolio contact form <onboarding@resend.dev>";

const unavailable =
  "Sorry, the form isn't working right now. Please email me instead.";

function readValues(formData: FormData): ContactValues {
  const read = (name: string) => String(formData.get(name) ?? "").trim();
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
  const values = readValues(formData);
  if (!values.name || !values.email || !values.message) {
    return { status: "error", message: "Please fill in every field.", values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY isn't set.");
    return { status: "error", message: unavailable, values };
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL || defaultFrom,
    to: contact.email,
    replyTo: values.email,
    subject: `New message from ${values.name}`,
    text: `${values.message}\n\nFrom: ${values.name} <${values.email}>`,
  });

  if (error) {
    console.error("Contact form: Resend couldn't send the message.", error);
    return { status: "error", message: unavailable, values };
  }

  return { status: "sent" };
}
