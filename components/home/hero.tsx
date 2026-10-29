import { PixelButton } from "@/components/ui/pixel-button";
import { PlayerCard } from "./player-card";

type HeroProps = {
  // Leave out to hide the CV button, for example until a CV is uploaded.
  cvHref?: string;
};

export function Hero({ cvHref }: HeroProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="mx-auto grid max-w-page items-center gap-10 px-4 pt-12 pb-6 md:grid-cols-[minmax(0,1fr)_auto]"
    >
      <div>
        <h1
          id="hero-heading"
          className="text-[clamp(48px,9vw,84px)] leading-[1.1] font-bold"
        >
          hi there!
        </h1>
        <p className="mt-4.5 max-w-[34ch] text-[19px] sm:text-[22px]">
          I&apos;m Samad, a 4th year computer science student at the University
          of Edinburgh. I build web tools and Android apps, and I like making
          things feel playful. Below you&apos;ll find where I&apos;ve worked and
          what I&apos;ve made.
        </p>
        <div className="mt-6.5 flex flex-wrap items-center gap-4.5">
          {cvHref && (
            <PixelButton href={cvHref} download="Samad-Ali-CV.pdf">
              <span aria-hidden="true">▼</span> save file (CV)
            </PixelButton>
          )}
          <a
            href="#experience"
            className="animate-blink font-label text-sm tracking-wider text-ink no-underline motion-reduce:animate-none"
          >
            press start <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <PlayerCard />
    </section>
  );
}
