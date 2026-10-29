import type { Metadata } from "next";
import Link from "next/link";
import { Sprite } from "@/components/sprite";
import { PixelButton } from "@/components/ui/pixel-button";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { coin } from "@/lib/sprites";

export const metadata: Metadata = { title: "Game over" };

// Shown for any address that doesn't exist, as an arcade game over screen.
export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto grid w-full max-w-page place-items-center px-4 py-16"
    >
      <PixelPanel
        className="grid max-w-xl justify-items-center gap-5 bg-ink px-6 py-10 text-center text-paper pixel-corners-2 sm:px-12"
        outerClassName="w-full max-w-xl"
      >
        <p className="font-label text-sm tracking-widest text-gold">
          error 404
        </p>
        <h1 className="text-[clamp(44px,11vw,80px)] leading-none font-bold">
          GAME OVER
        </h1>
        <p className="max-w-[34ch] text-[19px]">
          The page you were looking for isn&apos;t here. It may have moved, or
          the link might have a typo.
        </p>
        <p className="flex animate-blink items-center gap-2 font-label text-sm tracking-widest text-gold motion-reduce:animate-none">
          <Sprite grid={coin} className="w-5" />
          continue?
        </p>
        <div className="flex flex-wrap justify-center gap-4.5">
          <PixelButton href="/">
            <span aria-hidden="true">▶</span> yes, go home
          </PixelButton>
        </div>
        <Link
          href="/blog"
          className="font-label text-xs tracking-wide text-paper"
        >
          or read the dev log
        </Link>
      </PixelPanel>
    </main>
  );
}
