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
  const { code, play } = project.links;

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto grid w-full max-w-page gap-8 px-4 pt-10 pb-16"
    >
      <Link
        href="/#projects"
        className="justify-self-start font-label text-sm tracking-wider text-ink"
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
          {(code || play) && (
            <div className="mt-6 flex flex-wrap gap-4.5">
              {play && <PixelButton href={play}>play</PixelButton>}
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

      <PixelPanel as="article" className="px-6 py-7 sm:px-9 sm:py-9">
        <div className="max-w-[65ch]">
          <CaseStudy />
        </div>
      </PixelPanel>
    </main>
  );
}
