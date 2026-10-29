import { PlayerCard } from "./player-card";

export function Hero() {
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
          I&apos;m Samad, a 3rd year computer science student at the University
          of Edinburgh. I build web tools and Android apps, and I like making
          things feel playful. Below you&apos;ll find where I&apos;ve worked and
          what I&apos;ve made.
        </p>
      </div>
      <PlayerCard />
    </section>
  );
}
