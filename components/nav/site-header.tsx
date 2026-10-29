import { CloudLink } from "./cloud-link";
import { navLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="mx-auto max-w-[1040px] px-4 pt-4.5">
      <nav aria-label="Main">
        <ul className="flex flex-wrap items-end gap-x-3.5 gap-y-1.5">
          <li className="mr-auto">
            <CloudLink href="/" className="w-[260px] text-[34px] font-bold">
              samad ali
            </CloudLink>
          </li>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <CloudLink href={href}>{label}</CloudLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
