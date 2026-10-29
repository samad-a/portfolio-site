import { existsSync } from "node:fs";
import path from "node:path";
import { Hero } from "@/components/home/hero";

// Checked when the page is built, so the button appears once public/cv.pdf is added.
const cvHref = existsSync(path.join(process.cwd(), "public", "cv.pdf"))
  ? "/cv.pdf"
  : undefined;

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero cvHref={cvHref} />
    </main>
  );
}
