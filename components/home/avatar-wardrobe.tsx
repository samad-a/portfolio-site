"use client";

import {
  type CSSProperties,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Sprite } from "@/components/sprite";
import { cn } from "@/lib/cn";
import { bubbleTail } from "@/lib/sprites";
import {
  dressAvatar,
  headroom,
  type Look,
  parseLook,
  parts,
} from "@/lib/sprites/wardrobe";

// The visitor's last look lives in this browser's storage. Reading it through
// useSyncExternalStore keeps the server and first render on the default look,
// then switches to the saved one without a hydration mismatch.
const storageKey = "avatar-look";
const listeners = new Set<() => void>();
// Used when storage is blocked, such as in some private windows, so changes
// still show for this visit.
let unsaved: string | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function savedLook() {
  try {
    return window.localStorage.getItem(storageKey) ?? unsaved;
  } catch {
    return unsaved;
  }
}

function saveLook(look: Look) {
  unsaved = JSON.stringify(look);
  try {
    window.localStorage.setItem(storageKey, unsaved);
  } catch {
    // Storage is blocked; the look still changes until the page reloads.
  }
  listeners.forEach((listener) => listener());
}

const rows = dressAvatar(parseLook(null)).length;
// The bubble's tail points at the mouth, the avatar's 17th row down. Its
// middle sits 18.5px below the bubble's top: the 3px border, then 8px, then
// half of the tail.
const bubbleTop = `calc(${((headroom + 14) / rows) * 100}% - 18.5px)`;

// Whites out one part of the avatar, to show which part a click would change.
function highlight(grid: readonly string[], from: number, to: number) {
  return grid.map((row, y) =>
    y >= from && y < to ? row.replace(/[^.]/g, "W") : ".".repeat(row.length),
  );
}

// The avatar, whose hair, face and outfit can each be clicked to pick a new
// one from a speech bubble. The last look is remembered in this browser.
export function AvatarWardrobe() {
  const look = parseLook(
    useSyncExternalStore(subscribe, savedLook, () => null),
  );
  const [open, setOpen] = useState<keyof Look>();
  const [hovered, setHovered] = useState<keyof Look>();
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  const dressed = dressAvatar(look);
  const shown = parts.find((part) => part.name === (hovered ?? open));
  const openPart = parts.find((part) => part.name === open);

  function close() {
    const button = root.current?.querySelector<HTMLElement>(
      `[data-part="${open}"]`,
    );
    setOpen(undefined);
    button?.focus();
  }

  // Clicking anywhere else closes the bubble.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(undefined);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Opening a part moves focus to its current option.
  useEffect(() => {
    if (!open) return;
    root.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(id)} [aria-pressed="true"]`)
      ?.focus();
  }, [open, id]);

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) close();
      }}
    >
      <div
        id={id}
        role={openPart ? "group" : undefined}
        aria-label={openPart ? `${openPart.name} options` : undefined}
        aria-hidden={openPart ? undefined : true}
        style={{ "--bubble-top": bubbleTop } as CSSProperties}
        className={cn(
          "absolute z-20 w-max border-3 border-ink bg-paper px-3 py-2 font-label text-sm tracking-wide text-ink md:top-(--bubble-top) md:right-full md:left-auto md:mr-5 md:max-w-85",
          // On phones the open bubble sits above the avatar, where it has the
          // page's full width, rather than squeezing in beside it.
          openPart
            ? "bottom-full left-0 mb-6 max-w-[calc(100vw-32px)] md:bottom-auto md:mb-0"
            : "top-(--bubble-top) left-full ml-5 md:ml-0",
        )}
      >
        {openPart ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <span>{openPart.prompt}</span>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="cursor-pointer px-1 text-base"
              >
                ×
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {openPart.options.map((option) => {
                const chosen = look[openPart.name] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={chosen}
                    onClick={() =>
                      saveLook({ ...look, [openPart.name]: option })
                    }
                    className="grid w-16 cursor-pointer justify-items-center gap-1 bg-sky px-1 pt-2 pb-1 text-[11px] aria-pressed:shadow-[inset_0_0_0_3px_var(--color-gold-dark)]"
                  >
                    <Sprite
                      grid={dressAvatar({ ...look, [openPart.name]: option })}
                      className="w-8"
                    />
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          "Click on me!"
        )}
        <Sprite
          grid={bubbleTail}
          className={cn(
            "absolute w-4.5 md:top-2 md:right-[-16.5px] md:left-auto md:-rotate-90",
            openPart ? "top-full left-6" : "top-2 left-[-16.5px] rotate-90",
          )}
        />
      </div>

      <div className="relative w-24 animate-hop motion-reduce:animate-none md:w-36">
        <Sprite
          grid={dressed}
          label="Pixel avatar of Samad"
          className="w-full"
        />
        {shown && (
          <Sprite
            grid={highlight(dressed, shown.from, shown.to)}
            className="pointer-events-none absolute inset-0 w-full opacity-40"
          />
        )}
        {parts.map((part) => (
          <button
            key={part.name}
            type="button"
            data-part={part.name}
            aria-label={`Change ${part.name}`}
            aria-expanded={open === part.name}
            aria-controls={id}
            onClick={() => setOpen(open === part.name ? undefined : part.name)}
            onPointerEnter={() => setHovered(part.name)}
            onPointerLeave={() => setHovered(undefined)}
            onFocus={() => setHovered(part.name)}
            onBlur={() => setHovered(undefined)}
            className="absolute inset-x-0 cursor-pointer"
            style={{
              top: `${(part.from / rows) * 100}%`,
              height: `${((part.to - part.from) / rows) * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
