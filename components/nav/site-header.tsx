import { cloudLong, cloudPair, cloudPuffy, cloudTall } from "@/lib/sprites";
import { CloudLink } from "./cloud-link";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav-links";

// Each link gets its own cloud, bob speed and start point, so the row looks
// like a sky rather than four copies. Negative delays start partway through.
const clouds = [
  { sprite: cloudPair, duration: "4.4s", delay: "-1s" },
  { sprite: cloudTall, duration: "3.6s", delay: "-2.2s" },
  { sprite: cloudLong, duration: "4.8s", delay: "-3s" },
  { sprite: cloudPuffy, duration: "4s", delay: "-1.6s" },
];

export function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-page px-4 pt-4.5">
      <nav aria-label="Main" className="flex flex-wrap items-end gap-x-3.5">
        <CloudLink
          href="/"
          className="mr-auto w-[200px] text-[26px] font-bold [animation-duration:5s] sm:w-[260px] sm:text-[34px]"
        >
          samad ali
        </CloudLink>
        <ul className="hidden flex-wrap items-end gap-x-3.5 gap-y-1.5 sm:flex">
          {navLinks.map(({ href, label }, index) => (
            <li key={href}>
              <CloudLink
                href={href}
                sprite={clouds[index % clouds.length].sprite}
                sized
                className="text-lg"
                style={{
                  animationDuration: clouds[index % clouds.length].duration,
                  animationDelay: clouds[index % clouds.length].delay,
                }}
              >
                {label}
              </CloudLink>
            </li>
          ))}
        </ul>
        <MobileMenu links={navLinks} className="sm:hidden" />
      </nav>
    </header>
  );
}
