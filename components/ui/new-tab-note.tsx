import { newTabNote } from "@/lib/links";

// An arrow for people who can see it, and words for screen readers, saying a
// link opens in a new tab. The space sits outside both, so it's kept in the
// link's name.
export function NewTabNote() {
  return (
    <>
      {" "}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">{newTabNote.trim()}</span>
    </>
  );
}
