import { SectionHeading } from "@/components/ui/section-heading";
import type { Project, Skill } from "@/lib/content";
import { InventoryGrid } from "./inventory-grid";

type SkillsSectionProps = {
  skills: Skill[];
  projects: Project[];
};

export function SkillsSection({ skills, projects }: SkillsSectionProps) {
  const items = skills.map((skill) => ({
    ...skill,
    usedIn: projects
      .filter((project) =>
        project.stack.some(
          (tech) => tech.toLowerCase() === skill.name.toLowerCase(),
        ),
      )
      .map((project) => project.name),
  }));

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="mx-auto max-w-page scroll-mt-4 px-4 py-14"
    >
      <SectionHeading id="skills-heading" tag="inventory">
        skills
      </SectionHeading>
      <div className="mt-7">
        <InventoryGrid items={items} />
      </div>
    </section>
  );
}
