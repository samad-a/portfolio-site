"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Sprite } from "@/components/sprite";
import { PixelButton } from "@/components/ui/pixel-button";
import type { Project } from "@/lib/content";
import { arrow } from "@/lib/sprites";
import { ConsoleCard } from "./console-card";

// Allows for sub-pixel rounding when checking whether the row is at an end.
const slack = 2;

// Which consoles are fully in view: the first one's index and how many.
function visibleRange(track: HTMLElement) {
  const cards = [...track.children];
  const { left, right } = track.getBoundingClientRect();
  const shown = cards.flatMap((card, index) => {
    const box = card.getBoundingClientRect();
    return box.left >= left - slack && box.right <= right + slack
      ? [index]
      : [];
  });
  return { first: shown[0] ?? 0, count: Math.max(1, shown.length) };
}

// A row of consoles that scrolls sideways. Arrows step one console at a time,
// wrapping round at either end, and a dot per project shows which are in view
// and jumps straight to one.
export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const trackId = useId();
  const [view, setView] = useState({ first: 0, count: 1 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const next = visibleRange(track);
      setView((current) =>
        current.first === next.first && current.count === next.count
          ? current
          : next,
      );
    };
    measure();

    // The cards settle their size after the first paint, so watch them too.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    for (const card of track.children) observer.observe(card);
    track.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", measure);
    };
  }, []);

  function behavior(): ScrollBehavior {
    return matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
  }

  function step(direction: 1 | -1) {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !(card instanceof HTMLElement)) return;

    const atStart = track.scrollLeft <= slack;
    const atEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - slack;

    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: behavior() });
    } else if (direction === -1 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: behavior() });
    } else {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({
        left: direction * (card.offsetWidth + gap),
        behavior: behavior(),
      });
    }
  }

  function goTo(index: number) {
    const track = trackRef.current;
    const card = track?.children[index];
    if (!track || !(card instanceof HTMLElement)) return;
    // The track's own padding sits before the first card.
    const start = (track.firstElementChild as HTMLElement).offsetLeft;
    track.scrollTo({ left: card.offsetLeft - start, behavior: behavior() });
  }

  return (
    <div className="grid gap-5">
      {/* role="list" keeps list semantics in Safari, which drops them without bullets. */}
      <ul
        ref={trackRef}
        id={trackId}
        role="list"
        className="grid snap-x snap-mandatory scroll-px-2 auto-cols-[85%] grid-flow-col gap-7.5 overflow-x-auto px-2 pt-4 pb-4 [scrollbar-width:none] sm:auto-cols-[calc((100%-1.875rem)/2)] lg:auto-cols-[calc((100%-3.75rem)/3)] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <li key={project.id} className="snap-start">
            <ConsoleCard project={project} />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center gap-4">
        <PixelButton
          aria-label="Previous project"
          aria-controls={trackId}
          onClick={() => step(-1)}
          className="px-3"
        >
          <Sprite grid={arrow} className="w-5 -scale-x-100" />
        </PixelButton>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {projects.map((project, index) => {
            const shown =
              index >= view.first && index < view.first + view.count;
            return (
              <button
                key={project.id}
                type="button"
                aria-label={`Show ${project.name}`}
                aria-controls={trackId}
                aria-current={index === view.first ? "true" : undefined}
                onClick={() => goTo(index)}
                className="group grid h-8 cursor-pointer place-items-center px-1"
              >
                <span
                  // On the sky, so dark by day and light once it's swapped to night.
                  className={`block h-3 ${shown ? "w-7 bg-on-sky" : "w-3 bg-on-sky/30 group-hover:bg-on-sky/60"}`}
                />
              </button>
            );
          })}
        </div>
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
