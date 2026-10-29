"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Sprite } from "@/components/sprite";
import { PixelButton } from "@/components/ui/pixel-button";
import type { Project } from "@/lib/content";
import { arrow } from "@/lib/sprites";
import { ConsoleCard } from "./console-card";

// Allows for sub-pixel rounding when checking whether the row is at an end.
const slack = 2;

// A row of consoles that scrolls sideways. Arrows step one console at a time,
// wrapping round at either end, and only appear when the row doesn't fit.
export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const trackId = useId();
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () =>
      setOverflows(track.scrollWidth > track.clientWidth + slack);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  function step(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !(card instanceof HTMLElement)) return;

    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    const atStart = track.scrollLeft <= slack;
    const atEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - slack;

    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior });
    } else if (direction === -1 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior });
    } else {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior });
    }
  }

  const arrowClass = overflows ? "" : "hidden";

  return (
    <div className="grid grid-cols-2 items-center gap-x-4 gap-y-5 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
      <div className={`justify-self-end ${arrowClass}`}>
        <PixelButton
          aria-label="Previous project"
          aria-controls={trackId}
          onClick={() => step(-1)}
          className="px-3"
        >
          <Sprite grid={arrow} className="w-5 -scale-x-100" />
        </PixelButton>
      </div>
      {/* role="list" keeps list semantics in Safari, which drops them without bullets. */}
      <ul
        ref={trackRef}
        id={trackId}
        role="list"
        className="order-first col-span-2 grid snap-x snap-mandatory scroll-px-2 auto-cols-[85%] grid-flow-col gap-7.5 overflow-x-auto px-2 pt-2 pb-4 [scrollbar-width:none] sm:order-none sm:col-span-1 sm:auto-cols-[calc((100%-1.875rem)/2)] lg:auto-cols-[calc((100%-3.75rem)/3)] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <li key={project.id} className="snap-start">
            <ConsoleCard project={project} />
          </li>
        ))}
      </ul>
      <div className={`justify-self-start ${arrowClass}`}>
        <PixelButton
          aria-label="Next project"
          aria-controls={trackId}
          onClick={() => step(1)}
          className="px-3"
        >
          <Sprite grid={arrow} className="w-5" />
        </PixelButton>
      </div>
    </div>
  );
}
