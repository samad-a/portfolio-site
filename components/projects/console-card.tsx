import { useId } from "react";
import { Sprite } from "@/components/sprite";
import { PixelPanel } from "@/components/ui/pixel-panel";
import type { Project } from "@/lib/content";
import { sprites } from "@/lib/sprites";

// A plus-shaped D-pad, cut from a square.
const dpadShape =
  "[clip-path:polygon(33%_0,67%_0,67%_33%,100%_33%,100%_67%,67%_67%,67%_100%,33%_100%,33%_67%,0_67%,0_33%,33%_33%)]";

const controlClass =
  "grid justify-items-center gap-1.5 font-label text-[11px] tracking-wider text-paper no-underline";

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
          <span className={`bg-black/40 size-14.5 ${dpadShape}`} />
          code
        </a>
      )}
      {play && (
        <a
          href={play}
          aria-label={`Play ${project.name}`}
          className={`ml-auto ${controlClass}`}
        >
          <span className="bg-black/40 grid size-13 place-items-center text-lg pixel-corners-2">
            A
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
      outerClassName="h-full"
      className="grid h-full grid-rows-[auto_auto_1fr_auto] gap-3.5 px-5 pt-5 pb-6 text-paper pixel-corners-2"
      style={{ backgroundColor: project.colour }}
    >
      <div className="bg-screen-bezel p-2.5 pixel-corners">
        <div className="grid aspect-4/3 place-items-center bg-screen pixel-corners">
          <Sprite grid={sprites[project.sprite]} className="w-16" />
        </div>
      </div>
      <div>
        <h3 id={titleId} className="text-2xl leading-tight font-bold">
          {project.name}
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
