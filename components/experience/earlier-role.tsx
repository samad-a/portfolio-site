"use client";

import { useId, useState } from "react";
import { PixelPanel } from "@/components/ui/pixel-panel";
import type { Experience } from "@/lib/content";
import { formatMonth } from "@/lib/dates";
import { Highlights } from "./experience-card";

// An older role as a thin slab of ground: one line of grass with the role,
// where it was and when, over a strip of dirt. Clicking it digs out the
// highlights below.
export function EarlierRole({ role }: { role: Experience }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const detailsId = useId();

  return (
    <PixelPanel
      as="article"
      aria-labelledby={titleId}
      className="bg-dirt dirt-texture p-0 text-paper"
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen(!open)}
          className="grass-edge grid w-full cursor-pointer grid-cols-[auto_1fr] items-baseline gap-x-3 bg-grass px-5.5 pt-2.5 pb-1 text-left focus-visible:outline-offset-[-7px] focus-visible:outline-paper"
        >
          {/* The arrow keeps its own column, so on a phone the details wrap beside it. */}
          <span aria-hidden="true" className="font-label text-sm">
            {open ? "▼" : "▶"}
          </span>
          <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span id={titleId} className="text-[21px] leading-tight font-bold">
              {role.role}
            </span>
            <span className="font-label text-[13px] tracking-wide">
              {role.org}
            </span>
            <span className="font-label text-[13px] tracking-wide sm:ml-auto">
              <time dateTime={role.start}>{formatMonth(role.start)}</time>
              {" – "}
              {role.end ? (
                <time dateTime={role.end}>{formatMonth(role.end)}</time>
              ) : (
                "now"
              )}
            </span>
          </span>
        </button>
      </h3>
      {/* A strip of dirt while closed. Open, the highlights fill it. */}
      <div id={detailsId} className={open ? "px-5.5 pt-9 pb-6" : "h-8"}>
        <div hidden={!open}>
          <Highlights role={role} />
        </div>
      </div>
    </PixelPanel>
  );
}
