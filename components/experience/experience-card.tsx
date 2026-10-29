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
      <p className="mb-2 font-label text-[13px] tracking-wide text-gold">
        {[role.org, role.location].filter(Boolean).join(" · ")}
      </p>
      <ul className="grid gap-2 text-[17px] sm:text-lg">
        {role.highlights.map((highlight) => (
          <li
            key={highlight}
            className="grid grid-cols-[14px_1fr] gap-2.5 before:mt-2.5 before:size-2 before:bg-gold"
          >
            {highlight}
          </li>
        ))}
      </ul>
    </GrassBlock>
  );
}
