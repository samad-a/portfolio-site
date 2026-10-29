import { useId } from "react";
import { Sprite } from "@/components/sprite";
import { PixelPanel } from "@/components/ui/pixel-panel";
import type { Project } from "@/lib/content";
import { sprites } from "@/lib/sprites";

// A handheld games console: the project on its screen, then its name, stack
// and summary on the body.
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
    </PixelPanel>
  );
}
