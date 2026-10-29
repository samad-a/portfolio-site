import { SectionHeading } from "@/components/ui/section-heading";
import type { Skill } from "@/lib/content";
import { InventoryGrid } from "./inventory-grid";

export function SkillsSection({ skills }: { skills: Skill[] }) {
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
        <InventoryGrid skills={skills} />
      </div>
    </section>
  );
}
