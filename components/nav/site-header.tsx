import { CloudLink } from "./cloud-link";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav-links";

// Negative delays start each cloud partway through its bob, so they drift out of step.
const bobDelays = ["-1s", "-2.2s", "-3s", "-1.6s"];

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
                style={{ animationDelay: bobDelays[index % bobDelays.length] }}
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
