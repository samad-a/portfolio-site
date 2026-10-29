import { PixelButton } from "@/components/ui/pixel-button";
import { PixelPanel } from "@/components/ui/pixel-panel";

export default function Home() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto grid max-w-5xl justify-items-start gap-8 px-4 py-12"
    >
      <PixelPanel as="section" className="max-w-prose">
        <h1 className="text-4xl font-bold">hi there!</h1>
        <p className="mt-3">
          The design system is in place. The real homepage arrives in the next
          phase.
        </p>
      </PixelPanel>
      <PixelButton href="#main">press start</PixelButton>
    </main>
  );
}
