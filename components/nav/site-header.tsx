import { CloudLink } from "./cloud-link";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="mx-auto max-w-[1040px] px-4 pt-4.5">
      <nav aria-label="Main" className="flex flex-wrap items-end gap-x-3.5">
        <CloudLink
          href="/"
          className="mr-auto w-[200px] text-[26px] font-bold sm:w-[260px] sm:text-[34px]"
        >
          samad ali
        </CloudLink>
        <ul className="hidden flex-wrap items-end gap-x-3.5 gap-y-1.5 sm:flex">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <CloudLink href={href}>{label}</CloudLink>
            </li>
          ))}
        </ul>
        <MobileMenu links={navLinks} className="sm:hidden" />
      </nav>
    </header>
  );
}
