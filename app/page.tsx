import { PixelButton } from "@/components/ui/pixel-button";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-12">
      <PixelButton href="#main">press start</PixelButton>
    </main>
  );
}
