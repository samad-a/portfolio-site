import { contact } from "@/lib/contact";

// The ground the whole page stands on: a strip of grass over dirt.
export function SiteFooter() {
  return (
    <footer className="bg-dirt dirt-texture text-paper">
      <div aria-hidden="true" className="grass-edge h-6 bg-grass" />
      <div className="mx-auto flex max-w-page flex-wrap justify-between gap-x-6 gap-y-2.5 px-4 pt-7 pb-8 font-label text-[13px] tracking-wide">
        <span>© {new Date().getFullYear()} Samad Ali</span>
        <a href={`${contact.github}/portfolio-site`} className="text-paper">
          view source
        </a>
      </div>
    </footer>
  );
}
