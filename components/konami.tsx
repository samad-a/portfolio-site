"use client";

import { useEffect, useState } from "react";
import { konamiCode, konamiEvent, konamiProgress } from "@/lib/konami";

// How long the reward message stays up, in milliseconds.
const messageDuration = 3000;

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

// Listens for the Konami code anywhere on the page, except while typing in a
// form. Entering it shows a message and fires an event the sky canvas answers
// with a shower of coins.
export function Konami() {
  const [found, setFound] = useState(false);

  useEffect(() => {
    let progress = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    function onKeyDown(event: KeyboardEvent) {
      if (isTyping(event.target)) return;
      progress = konamiProgress(progress, event.key);
      if (progress < konamiCode.length) return;

      progress = 0;
      setFound(true);
      dispatchEvent(new Event(konamiEvent));
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setFound(false), messageDuration);
    }

    addEventListener("keydown", onKeyDown);
    return () => {
      removeEventListener("keydown", onKeyDown);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      role="status"
      className="pointer-events-none fixed top-6 left-1/2 z-40 -translate-x-1/2"
    >
      {found && (
        <p className="bg-ink px-4.5 py-3 font-label text-base whitespace-nowrap text-gold">
          +1000 · secret found!
        </p>
      )}
    </div>
  );
}
