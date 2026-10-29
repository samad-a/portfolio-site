import { Sprite } from "@/components/sprite";
import { avatar } from "@/lib/sprites";

const stats = [
  ["class", "CS student"],
  ["level", "3rd year"],
  ["base", "Edinburgh"],
  ["status", "open to work"],
] as const;

// The avatar with an RPG-style stats box, shown beside the intro.
export function PlayerCard() {
  return (
    <div className="grid grid-cols-[auto_auto] items-end justify-start gap-2.5 md:grid-cols-1 md:justify-items-center">
      <Sprite
        grid={avatar}
        label="Pixel avatar of Samad"
        className="w-24 animate-hop motion-reduce:animate-none md:w-36"
      />
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
