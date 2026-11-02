"use client";

import { useId, useState } from "react";
import { PixelButton } from "@/components/ui/pixel-button";
import type { Experience } from "@/lib/content";
import { ExperienceCard } from "./experience-card";

// How many roles show before the rest are folded away.
const shownAtFirst = 2;

export function ExperienceList({ roles }: { roles: Experience[] }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const hiddenCount = roles.length - shownAtFirst;

  return (
    <>
      {/* role="list" keeps list semantics in Safari, which drops them without bullets. */}
      <ul id={id} role="list" className="mt-7 grid gap-6.5">
        {roles.map((role, index) => (
          // Folded roles stay in the page, so they're still there for search
          // engines and for find-in-page once shown.
          <li key={role.id} hidden={!expanded && index >= shownAtFirst}>
            <ExperienceCard role={role} />
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <div className="mt-6.5 flex justify-center">
          <PixelButton
            type="button"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded
              ? "show less"
              : `show ${hiddenCount} more ${hiddenCount === 1 ? "role" : "roles"}`}
          </PixelButton>
        </div>
      )}
    </>
  );
}
