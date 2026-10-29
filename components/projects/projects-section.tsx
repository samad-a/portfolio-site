import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/lib/content";
import { ConsoleCard } from "./console-card";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="mx-auto max-w-page scroll-mt-4 px-4 py-14"
    >
      <SectionHeading id="projects-heading" tag="cartridges">
        projects
      </SectionHeading>
      {/* role="list" keeps list semantics in Safari, which drops them without bullets. */}
      <ul
        role="list"
        className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-7.5"
      >
        {projects.map((project) => (
          <li key={project.id}>
            <ConsoleCard project={project} />
          </li>
        ))}
      </ul>
      <p className="mt-8.5 text-center font-label text-sm tracking-wider">
        and much more to come!
      </p>
    </section>
  );
}
