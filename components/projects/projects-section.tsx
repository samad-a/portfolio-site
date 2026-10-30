import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/lib/content";
import { ProjectCarousel } from "./project-carousel";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="mx-auto max-w-page scroll-mt-4 px-4 py-14"
    >
      <SectionHeading id="projects-heading">projects</SectionHeading>
      <div className="mt-7">
        <ProjectCarousel projects={projects} />
      </div>
      <p className="mt-8.5 text-center font-label text-sm tracking-wider">
        and much more to come!
      </p>
    </section>
  );
}
