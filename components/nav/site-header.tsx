import { cloudLong, cloudPair, cloudPuffy, cloudTall } from "@/lib/sprites";
import { CloudLink } from "./cloud-link";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav-links";

// Each link gets its own cloud, height, bob speed and start point, so the row
// looks like a sky rather than four copies in a line. Negative delays start
// partway through.
const clouds = [
  { sprite: cloudPair, lift: 4, duration: "9s", delay: "-2s" },
  { sprite: cloudTall, lift: 16, duration: "7.5s", delay: "-5s" },
  { sprite: cloudLong, lift: 0, duration: "10s", delay: "-7s" },
  { sprite: cloudPuffy, lift: 11, duration: "8.5s", delay: "-3s" },
];

export function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-page px-4 pt-4.5">
      <nav aria-label="Main" className="flex flex-wrap items-end gap-x-3.5">
        <CloudLink
          href="/"
          className="mr-auto w-[200px] text-[26px] font-bold [animation-duration:9.5s] sm:w-[260px] sm:text-[34px]"
        >
          samad ali
        </CloudLink>
        <ul className="hidden flex-wrap items-end gap-x-3.5 gap-y-1.5 sm:flex">
          {navLinks.map(({ href, label }, index) => {
            const { sprite, lift, duration, delay } =
              clouds[index % clouds.length];
            return (
              <li key={href} style={{ marginBottom: lift }}>
                <CloudLink
                  href={href}
                  sprite={sprite}
                  sized
                  className="text-xl"
                  style={{ animationDuration: duration, animationDelay: delay }}
                >
                  {label}
                </CloudLink>
              </li>
            );
          })}
        </ul>
        <MobileMenu links={navLinks} className="sm:hidden" />
      </nav>
    </header>
  );
}
