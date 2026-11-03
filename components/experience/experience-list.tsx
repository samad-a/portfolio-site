import type { Experience } from "@/lib/content";
import { EarlierRole } from "./earlier-role";
import { ExperienceCard } from "./experience-card";

// Only the newest role shows in full. Older ones are thin slabs that open one
// at a time, so each new role adds a line rather than a whole card.
const shownInFull = 1;

export function ExperienceList({ roles }: { roles: Experience[] }) {
  const recent = roles.slice(0, shownInFull);
  const earlier = roles.slice(shownInFull);

  return (
    // role="list" keeps list semantics in Safari, which drops them without bullets.
    <ul role="list" className="mt-7 grid gap-6.5">
      {recent.map((role) => (
        <li key={role.id}>
          <ExperienceCard role={role} />
        </li>
      ))}
      {earlier.length > 0 && (
        <li>
          <ul role="list" className="grid gap-4">
            {earlier.map((role) => (
              <li key={role.id}>
                <EarlierRole role={role} />
              </li>
            ))}
          </ul>
        </li>
      )}
    </ul>
  );
}
