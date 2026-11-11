import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { projects } from "@/lib/content";
import { pageMetadata } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

// Only the projects in content/projects.json have pages; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ id }) => ({ id }));
}

function findProject(id: string) {
  return projects.find((project) => project.id === id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = findProject((await params).id);
  return project
    ? pageMetadata({
        title: project.name,
        description: project.summary,
        path: `/projects/${project.id}`,
      })
    : {};
}

export default async function CaseStudyPage({ params }: Props) {
  const { id } = await params;
  const project = findProject(id);
  if (!project) notFound();

  const { default: CaseStudy } = await import(`@/content/projects/${id}.mdx`);
  // The next project in the carousel's order, wrapping round to the first.
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const { code, play } = project.links;

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto grid w-full max-w-page gap-8 px-4 pt-10 pb-16"
    >
      <Link
        href="/#projects"
        className="justify-self-start font-label text-sm tracking-wider text-on-sky"
      >
        <span aria-hidden="true">← </span>back to projects
      </Link>

      <header className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div>
          <h1 className="text-[clamp(40px,7vw,64px)] leading-[1.1] font-bold">
            {project.name}
          </h1>
          <p className="mt-3 max-w-[40ch] text-[19px] sm:text-[22px]">
            {project.summary}
          </p>
          <p className="mt-3 font-label text-xs tracking-wide">
            {project.stack.join(" · ")}
          </p>
          {(code || play || project.gallery) && (
            <div className="mt-6 flex flex-wrap gap-4.5">
              {play && <PixelButton href={play}>play</PixelButton>}
              {!play && project.gallery && (
                <PixelButton href="#demo">watch the demo</PixelButton>
              )}
              {code && <PixelButton href={code}>view code</PixelButton>}
            </div>
          )}
        </div>
        {project.screenshot && (
          <PixelPanel
            className="p-3 pixel-corners-2"
            style={{ backgroundColor: project.colour }}
          >
            <div className="bg-screen-bezel p-2.5 pixel-corners">
              <div className="relative aspect-4/3 overflow-hidden pixel-corners">
                <Image
                  src={project.screenshot.src}
                  alt={project.screenshot.alt}
                  fill
                  priority
                  sizes="(min-width: 768px) 384px, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </PixelPanel>
        )}
      </header>

      {project.gallery && (
        <section
          id="demo"
          aria-labelledby="demo-heading"
          className="grid scroll-mt-4 gap-5"
        >
          <h2 id="demo-heading" className="text-[32px] leading-tight font-bold">
            demo
          </h2>
          {/* role="list" keeps list semantics in Safari, which drops them without bullets. */}
          <ul role="list" className="grid gap-6 sm:grid-cols-2">
            {project.gallery.map(({ src, caption, poster }) => (
              <li key={src}>
                <PixelPanel
                  as="figure"
                  className="grid gap-3 p-3 pixel-corners-2"
                  style={{ backgroundColor: project.colour }}
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-screen-bezel pixel-corners">
                    {src.endsWith(".mp4") ? (
                      // Silent clips, so they need no captions track.
                      <video
                        src={src}
                        poster={poster}
                        // Named by its caption, as images are by their alt text.
                        aria-label={caption}
                        controls
                        muted
                        loop
                        playsInline
                        preload="none"
                        className="size-full object-contain"
                      />
                    ) : (
                      <Image
                        src={src}
                        alt={caption}
                        fill
                        sizes="(min-width: 640px) 480px, 90vw"
                        className="object-contain"
                      />
                    )}
                  </div>
                  <figcaption className="px-1 pb-1 font-mono text-[15px] leading-snug text-paper">
                    {caption}
                  </figcaption>
                </PixelPanel>
              </li>
            ))}
          </ul>
        </section>
      )}

      <PixelPanel as="article" className="px-6 py-7 sm:px-9 sm:py-9">
        {/* Long reading is in the monospace font; headings stay pixel. */}
        <div className="max-w-[65ch] font-mono text-[15px] leading-[1.7] sm:text-[17px]">
          <CaseStudy />
        </div>
      </PixelPanel>

      {next !== project && (
        <Link
          href={`/projects/${next.id}`}
          className="justify-self-end font-label text-sm tracking-wider text-on-sky"
        >
          next project: {next.name}
          <span aria-hidden="true"> →</span>
        </Link>
      )}
    </main>
  );
}
