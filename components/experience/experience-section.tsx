import { SectionHeading } from "@/components/ui/section-heading";
import type { Experience } from "@/lib/content";
import { ExperienceList } from "./experience-list";

export function ExperienceSection({ roles }: { roles: Experience[] }) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="mx-auto max-w-page scroll-mt-4 px-4 py-14"
    >
      <SectionHeading id="experience-heading">experience</SectionHeading>
      <ExperienceList roles={roles} />
    </section>
  );
}
