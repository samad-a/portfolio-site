import { AvatarWardrobe } from "./avatar-wardrobe";

const stats = [
  ["class", "CS student"],
  ["level", "4th year"],
  ["base", "Edinburgh"],
  ["status", "open to work"],
] as const;

// The avatar, which visitors can dress up, with an RPG-style stats box, shown beside the intro.
export function PlayerCard() {
  return (
    <div className="grid grid-cols-[auto_auto] items-end justify-start gap-2.5 md:grid-cols-1 md:justify-items-center">
      <AvatarWardrobe />
      <dl
        aria-label="Player stats"
        className="grid grid-cols-[auto_auto] gap-x-3.5 gap-y-1 bg-ink px-3.5 py-3 font-label text-xs tracking-wide text-paper"
      >
        {stats.map(([name, value]) => (
          <div key={name} className="contents">
            <dt>{name}</dt>
            <dd className="text-gold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
