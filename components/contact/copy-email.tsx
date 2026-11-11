"use client";

import { useRef, useState } from "react";

// The keys that copy on this device: ⌘C on Apple devices, ctrl+c elsewhere.
function copyKeys() {
  return /Mac|iPhone|iPad/.test(navigator.userAgent ?? "") ? "⌘C" : "ctrl+c";
}

// The address as text, with a button that copies it. If the clipboard isn't
// available, it selects the address so the visitor can copy it themselves.
export function CopyEmail({ email }: { email: string }) {
  const addressRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied!");
    } catch {
      const address = addressRef.current;
      if (address) getSelection()?.selectAllChildren(address);
      setStatus(`selected, press ${copyKeys()} to copy`);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-xl">
      <code
        ref={addressRef}
        className="bg-[rgb(255_255_255/0.1)] px-2.5 py-1 font-sans select-all"
      >
        {email}
      </code>
      <button
        type="button"
        onClick={copy}
        // Dark text on gold, but the focus ring falls on the night sky around it.
        className="cursor-pointer bg-gold px-3 py-2 font-label text-xs tracking-wide text-ink focus-visible:outline-on-night"
      >
        copy
      </button>
      <span
        role="status"
        className="min-h-5 basis-full font-label text-sm text-gold"
      >
        {status}
      </span>
    </div>
  );
}
