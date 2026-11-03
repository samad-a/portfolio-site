import type { Experience } from "@/lib/content";
import { formatMonth } from "@/lib/dates";
import { GrassBlock } from "./grass-block";

export function ExperienceCard({ role }: { role: Experience }) {
  return (
    <GrassBlock
      title={role.role}
      aside={
        <>
          <time dateTime={role.start}>{formatMonth(role.start)}</time>
          {" – "}
          {role.end ? (
            <time dateTime={role.end}>{formatMonth(role.end)}</time>
          ) : (
            "now"
          )}
        </>
      }
    >
      <p className="mb-3 font-label text-base tracking-wide text-gold sm:text-lg">
        {[role.org, role.location].filter(Boolean).join(" · ")}
      </p>
      <Highlights role={role} />
    </GrassBlock>
  );
}

// A role's highlights, each with a gold square for a bullet.
export function Highlights({ role }: { role: Experience }) {
  return (
    <ul className="grid gap-2.5 font-mono text-[15px] leading-relaxed sm:text-base">
      {role.highlights.map((highlight) => (
        <li
          key={highlight}
          className="grid grid-cols-[14px_1fr] gap-2.5 before:mt-2 before:size-2 before:bg-gold sm:before:mt-2.25"
        >
          {highlight}
        </li>
      ))}
    </ul>
  );
}
