import { z } from "zod";
import { maxLengths } from "./contact-form";

// Checked on the server, so it holds however the form is submitted.
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(maxLengths.name, `Keep your name under ${maxLengths.name} characters.`)
    // It goes in the email's subject line, which must stay on one line.
    .regex(/^[^\r\n]*$/, "Keep your name on one line."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(maxLengths.email, "That email address is too long.")
    .pipe(z.email("Enter a valid email address, like name@example.com.")),
  message: z
    .string()
    .trim()
    .min(1, "Write a message.")
    .max(
      maxLengths.message,
      `Keep your message under ${maxLengths.message} characters.`,
    ),
});
