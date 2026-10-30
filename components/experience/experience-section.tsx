import { SectionHeading } from "@/components/ui/section-heading";
import type { Experience } from "@/lib/content";
import { ExperienceCard } from "./experience-card";

export function ExperienceSection({ roles }: { roles: Experience[] }) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="mx-auto max-w-page scroll-mt-4 px-4 py-14"
    >
      <SectionHeading id="experience-heading">experience</SectionHeading>
      {/* role="list" keeps list semantics in Safari, which drops them without bullets. */}
      <ul role="list" className="mt-7 grid gap-6.5">
        {roles.map((role) => (
          <li key={role.id}>
            <ExperienceCard role={role} />
          </li>
        ))}
      </ul>
    </section>
  );
}
