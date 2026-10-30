import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { Sprite } from "@/components/sprite";
import { PixelPanel } from "@/components/ui/pixel-panel";
import type { Project } from "@/lib/content";
import { sprites } from "@/lib/sprites";

// The "A" on the console's button, drawn in pixels rather than as text so the
// link's visible label is just "play", matching its name. It takes the text
// colour, so it turns ink when the button lights up gold.
const letterA = [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"];

function ButtonLetter() {
  return (
    <svg
      viewBox="0 0 5 7"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className="h-3.5 w-2.5"
    >
      {letterA.flatMap((row, y) =>
        [...row].map((pixel, x) =>
          pixel === "#" ? (
            <rect
              key={`${x},${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill="currentColor"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

// A plus-shaped D-pad, cut from a square.
const dpadShape =
  "[clip-path:polygon(33%_0,67%_0,67%_33%,100%_33%,100%_67%,67%_67%,67%_100%,33%_100%,33%_67%,0_67%,0_33%,33%_33%)]";

// The gold focus outline would be too faint on some console colours, so the
// controls use white, which every console colour is checked against.
const controlClass =
  "group grid justify-items-center gap-1.5 font-label text-[11px] tracking-wider text-paper no-underline focus-visible:outline-paper";

// Lit up gold when pointed at or focused, and pushed down while pressed.
const buttonClass =
  "bg-[rgb(0_0_0/0.4)] group-hover:bg-gold group-hover:text-ink group-focus-visible:bg-gold group-focus-visible:text-ink group-active:translate-y-[3px] motion-reduce:group-active:translate-y-0";

function ConsoleControls({ project }: { project: Project }) {
  const { code, play } = project.links;
  if (!code && !play) return null;

  return (
    <div className="flex items-end justify-between pt-1.5">
      {code && (
        <a
          href={code}
          aria-label={`View code for ${project.name}`}
          className={controlClass}
        >
          <span className={`size-14.5 ${buttonClass} ${dpadShape}`} />
          code
        </a>
      )}
      {play && (
        <a
          href={play}
          aria-label={`Play ${project.name}`}
          className={`ml-auto ${controlClass}`}
        >
          <span
            className={`grid size-13 place-items-center pixel-corners-2 ${buttonClass}`}
          >
            <ButtonLetter />
          </span>
          play
        </a>
      )}
    </div>
  );
}

// A handheld games console: the project on its screen, then its name, stack
// and summary on the body, with controls that link to its code and demo.
export function ConsoleCard({ project }: { project: Project }) {
  const titleId = useId();

  return (
    <PixelPanel
      as="article"
      aria-labelledby={titleId}
      // Lifts towards its shadow when pointed at or when a control has focus.
      outerClassName="h-full transition-transform duration-100 ease-[steps(2)] hover:-translate-x-[3px] hover:-translate-y-[3px] has-focus-visible:-translate-x-[3px] has-focus-visible:-translate-y-[3px] motion-reduce:transition-none"
      className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-3.5 px-5 pt-5 pb-6 text-paper pixel-corners-2"
      style={{ backgroundColor: project.colour }}
    >
      <div className="bg-screen-bezel p-2.5 pixel-corners">
        <div className="relative grid aspect-4/3 place-items-center overflow-hidden bg-screen pixel-corners">
          {project.screenshot ? (
            <Image
              src={project.screenshot.src}
              alt={project.screenshot.alt}
              fill
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 85vw"
              className="object-cover"
            />
          ) : (
            <Sprite grid={sprites[project.sprite]} className="w-16" />
          )}
        </div>
      </div>
      <div>
        <h3 id={titleId} className="text-2xl leading-tight font-bold">
          <Link
            href={`/projects/${project.id}`}
            className="text-paper underline decoration-transparent decoration-[3px] underline-offset-[5px] hover:decoration-current focus-visible:outline-paper"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-1.5 font-label text-xs tracking-wide">
          {project.stack.join(" · ")}
        </p>
      </div>
      <p className="text-[17px]">{project.summary}</p>
      <ConsoleControls project={project} />
    </PixelPanel>
  );
}
