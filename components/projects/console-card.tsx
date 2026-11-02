import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { Sprite } from "@/components/sprite";
import { PixelPanel } from "@/components/ui/pixel-panel";
import type { Project } from "@/lib/content";
import { sprites } from "@/lib/sprites";

// A plus-shaped D-pad, cut from a square.
const dpadShape =
  "[clip-path:polygon(33%_0,67%_0,67%_33%,100%_33%,100%_67%,67%_67%,67%_100%,33%_100%,33%_67%,0_67%,0_33%,33%_33%)]";

// The gold focus outline would be too faint on some console colours, so the
// controls use white, which every console colour is checked against.
const controlClass =
  "group grid justify-items-center font-label text-paper no-underline focus-visible:outline-paper";

// A round button with its label printed on it, pushed down while pressed.
const roundClass =
  "grid size-12 place-items-center rounded-full text-[10px] tracking-wide shadow-[inset_0_-4px_0_rgb(0_0_0/0.3)] group-active:translate-y-[3px] group-active:shadow-none motion-reduce:group-active:translate-y-0";

// B opens the code and A the demo. A is gold, as the main button; both light
// up when pointed at or focused. With no demo, A is greyed out and inert.
function FaceButtons({ project }: { project: Project }) {
  const { code, play } = project.links;

  return (
    <div className="flex -rotate-[18deg] items-end gap-2">
      {code ? (
        <a
          href={code}
          aria-label={`View code for ${project.name}`}
          className={controlClass}
        >
          <span
            className={`${roundClass} bg-[rgb(0_0_0/0.4)] group-hover:bg-gold group-hover:text-ink group-focus-visible:bg-gold group-focus-visible:text-ink`}
          >
            code
          </span>
        </a>
      ) : (
        <span
          aria-hidden="true"
          className={`${roundClass} bg-[rgb(0_0_0/0.18)]`}
        />
      )}
      {play ? (
        <a
          href={play}
          aria-label={`Play ${project.name}`}
          className={`mb-4 ${controlClass}`}
        >
          <span
            className={`${roundClass} bg-gold text-ink group-hover:bg-paper group-focus-visible:bg-paper`}
          >
            play
          </span>
        </a>
      ) : (
        <span
          className={`mb-4 ${roundClass} bg-[rgb(0_0_0/0.18)] text-center text-[8px] leading-tight text-[rgb(255_255_255/0.6)] shadow-none`}
        >
          no
          <br />
          demo
        </span>
      )}
    </div>
  );
}

// A handheld games console: a power light and tag along the top, the project
// on its screen, then its name, stack and summary. START opens the write-up,
// B the code and A the demo.
export function ConsoleCard({ project }: { project: Project }) {
  const titleId = useId();
  const hasDemo = Boolean(project.links.play);

  return (
    // Lifts towards its shadow when pointed at or when a control has focus.
    <div className="relative h-full transition-transform duration-100 ease-[steps(2)] hover:-translate-x-[3px] hover:-translate-y-[3px] has-focus-visible:-translate-x-[3px] has-focus-visible:-translate-y-[3px] motion-reduce:transition-none">
      {project.award && (
        <p className="absolute top-[36%] -right-2 z-10 rotate-[5deg] border-2 border-ink bg-gold px-2 py-1 font-label text-[10px] tracking-wide text-ink shadow-[3px_3px_0_var(--color-ink)]">
          <span aria-hidden="true">★ </span>
          {project.award}
        </p>
      )}
      <PixelPanel
        as="article"
        aria-labelledby={titleId}
        outerClassName="h-full"
        className="relative grid h-full grid-rows-[auto_auto_auto_1fr_auto] gap-3 console-bevel px-5 pt-4 pb-5 text-paper pixel-corners-2"
        style={{ backgroundColor: project.colour }}
      >
        <p className="flex items-center gap-2 font-label text-[10px] tracking-wide">
          <span
            aria-hidden="true"
            className={
              hasDemo
                ? "size-2 bg-[#ff5a5a] shadow-[0_0_6px_#ff5a5a]"
                : "size-2 bg-[rgb(0_0_0/0.35)]"
            }
          />
          <span aria-hidden="true">power</span>
          {project.tag && <span className="ml-auto">{project.tag}</span>}
        </p>
        <div className="bg-screen-bezel px-2.5 pt-2 pb-2.5 pixel-corners">
          {/* The two stripes either side of the label, as on the original. */}
          <p className="mb-1.5 flex items-center gap-2 font-label text-[9px] tracking-wide whitespace-nowrap text-[#9aa6b8] before:h-0.5 before:flex-1 before:bg-[#6b3f8f] after:h-0.5 after:flex-1 after:bg-[#2f5aa8]">
            {project.event}
          </p>
          <div className="relative grid aspect-4/3 place-items-center overflow-hidden bg-screen">
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
          <p className="mt-1.5 font-label text-[11px] tracking-wide">
            {project.stack.join(" · ")}
          </p>
        </div>
        <p className="text-[17px] leading-snug">{project.summary}</p>
        <div className="grid grid-cols-[auto_1fr_auto] items-center pt-1">
          <span
            aria-hidden="true"
            className={`size-12.5 bg-[rgb(0_0_0/0.4)] ${dpadShape}`}
          />
          <Link
            href={`/projects/${project.id}`}
            aria-label={`Start reading about ${project.name}`}
            className={`gap-1 justify-self-center text-[9px] tracking-wide ${controlClass}`}
          >
            <span className="h-2 w-7.5 -rotate-[18deg] rounded-full bg-[rgb(0_0_0/0.4)] group-hover:bg-gold group-focus-visible:bg-gold" />
            start
          </Link>
          <FaceButtons project={project} />
        </div>
        {/* Speaker slots in the corner. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 bottom-2.5 flex -rotate-[30deg] gap-1.25"
        >
          {[0, 1, 2, 3].map((slot) => (
            <span key={slot} className="h-5 w-1 bg-[rgb(0_0_0/0.25)]" />
          ))}
        </span>
      </PixelPanel>
    </div>
  );
}
