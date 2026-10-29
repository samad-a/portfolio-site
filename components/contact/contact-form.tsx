"use client";

import { useActionState, useId } from "react";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelPanel } from "@/components/ui/pixel-panel";
import {
  type ContactAction,
  type ContactField,
  type ContactFormState,
  maxLengths,
} from "@/lib/contact-form";

const fields: { name: ContactField; label: string; type?: string }[] = [
  { name: "name", label: "your name" },
  { name: "email", label: "your email", type: "email" },
  { name: "message", label: "message" },
];

const inputClass =
  "w-full border-[3px] border-ink bg-paper px-3 py-2 text-ink aria-invalid:border-error";

export function ContactForm({ action }: { action: ContactAction }) {
  const [state, formAction, pending] = useActionState<
    ContactFormState,
    FormData
  >(action, { status: "idle" });
  const id = useId();
  const error = state.status === "error" ? state : undefined;

  return (
    <PixelPanel className="grid gap-4 px-5 py-6 text-left sm:px-7">
      <h3 className="text-2xl font-bold">send a message</h3>
      {state.status === "sent" && (
        <p role="status" className="bg-grass px-3 py-2 text-paper">
          Message sent! I&apos;ll get back to you soon.
        </p>
      )}
      {error && (
        <p role="alert" className="bg-ink px-3 py-2 text-paper">
          {error.message}
        </p>
      )}
      <form action={formAction} noValidate className="grid gap-4">
        {fields.map(({ name, label, type }) => {
          const inputId = `${id}-${name}`;
          const errorId = `${inputId}-error`;
          const fieldError = error?.fieldErrors?.[name];
          const props = {
            id: inputId,
            name,
            required: true,
            maxLength: maxLengths[name],
            defaultValue: error?.values?.[name],
            "aria-invalid": fieldError ? true : undefined,
            "aria-describedby": fieldError ? errorId : undefined,
            className: inputClass,
          };

          return (
            <div key={name} className="grid gap-1.5">
              <label
                htmlFor={inputId}
                className="font-label text-[13px] tracking-wide"
              >
                {label}
              </label>
              {name === "message" ? (
                <textarea rows={5} {...props} />
              ) : (
                <input type={type ?? "text"} autoComplete={name} {...props} />
              )}
              {fieldError && (
                <p id={errorId} className="text-[15px] font-medium text-error">
                  {fieldError}
                </p>
              )}
            </div>
          );
        })}
        <div>
          <PixelButton type="submit" disabled={pending}>
            {pending ? "sending..." : "send"}
          </PixelButton>
        </div>
      </form>
    </PixelPanel>
  );
}
