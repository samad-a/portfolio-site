import { useId, type ReactNode } from "react";
import { PixelPanel } from "@/components/ui/pixel-panel";

type GrassBlockProps = {
  title: string;
  // Shown opposite the title on the grass, such as the dates of a role.
  aside?: ReactNode;
  children: ReactNode;
};

// A card that looks like a block of ground: a strip of grass holding the
// title, over dirt holding the details.
export function GrassBlock({ title, aside, children }: GrassBlockProps) {
  const titleId = useId();

  return (
    <PixelPanel
      as="article"
      aria-labelledby={titleId}
      className="bg-dirt dirt-texture p-0 text-paper"
    >
      <header className="grass-edge flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-grass px-5.5 pt-3.5 pb-2.5">
        <h3 id={titleId} className="text-2xl leading-tight font-bold">
          {title}
        </h3>
        {aside && (
          <div className="font-label text-[13px] tracking-wide">{aside}</div>
        )}
      </header>
      <div className="px-5.5 pt-5.5 pb-6">{children}</div>
    </PixelPanel>
  );
}
