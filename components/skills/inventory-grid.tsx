import { PixelPanel } from "@/components/ui/pixel-panel";
import type { Skill } from "@/lib/content";
import { InventorySlot } from "./inventory-slot";

export function InventoryGrid({ skills }: { skills: Skill[] }) {
  return (
    <PixelPanel className="bg-inventory">
      {/* role="list" keeps list semantics in Safari, which drops them without bullets. */}
      <ul
        role="list"
        aria-label="Skills"
        className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-3"
      >
        {skills.map((skill) => (
          <li key={skill.name}>
            <InventorySlot skill={skill} />
          </li>
        ))}
      </ul>
    </PixelPanel>
  );
}
