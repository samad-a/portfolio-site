import { Sprite } from "@/components/sprite";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { sendContactMessage } from "@/lib/actions/contact";
import { contact } from "@/lib/contact";
import { badge } from "@/lib/sprites";
import { items } from "@/lib/sprites/items";
import { ContactForm } from "./contact-form";
import { CopyEmail } from "./copy-email";

const links = [
  { label: "email", href: `mailto:${contact.email}`, sprite: items.mail },
  { label: "github", href: contact.github, sprite: items.github },
  { label: "linkedin", href: contact.linkedin, sprite: badge },
];

// The night sky at the bottom of the page. The gradient at the top fades the
// day sky above into dusk and then night. Once the sky canvas is running, it
// paints the same sky with stars, so this background steps aside.
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-[linear-gradient(var(--color-sky),var(--color-dusk)_80px,var(--color-night)_160px)] px-4 pt-40 pb-30 text-center text-moon [[data-sky=canvas]_&]:bg-none"
    >
      <div className="mx-auto grid max-w-page justify-items-center gap-7.5">
        <h2
          id="contact-heading"
          className="text-[clamp(34px,6vw,48px)] leading-[1.1] font-bold"
        >
          get in touch!
        </h2>
        <p className="max-w-[44ch] text-[19px] sm:text-[21px]">
          If you have feedback on the site, an opportunity, or you just want to
          say hi, I&apos;d love to hear from you.
        </p>
        <ul role="list" className="flex flex-wrap justify-center gap-5.5">
          {links.map(({ label, href, sprite }) => (
            <li key={label}>
              <PixelPanel
                as="a"
                href={href}
                outerClassName="transition-transform duration-100 ease-[steps(2)] hover:-translate-x-[3px] hover:-translate-y-[3px] has-focus-visible:-translate-x-[3px] has-focus-visible:-translate-y-[3px] motion-reduce:transition-none"
                className="grid min-w-32.5 justify-items-center gap-2 px-5.5 py-4 font-label text-[13px] tracking-wide no-underline focus-visible:outline-offset-[-7px] focus-visible:outline-ink"
              >
                <Sprite grid={sprite} className="h-8 w-auto" />
                {label}
              </PixelPanel>
            </li>
          ))}
        </ul>
        <CopyEmail email={contact.email} />
        <div className="w-full max-w-xl pt-4">
          <ContactForm action={sendContactMessage} />
        </div>
      </div>
    </section>
  );
}
