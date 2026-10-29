// Shared by the contact form and the action that sends it.

export type ContactField = "name" | "email" | "message";

export type ContactValues = Record<ContactField, string>;

export type ContactFormState =
  | { status: "idle" }
  | { status: "sent" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
      // Sent back so the form can refill itself instead of losing the message.
      values?: ContactValues;
    };

export type ContactAction = (
  state: ContactFormState,
  formData: FormData,
) => Promise<ContactFormState>;

export const maxLengths: Record<ContactField, number> = {
  name: 100,
  email: 254,
  message: 5000,
};
