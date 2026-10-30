import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Sprite } from "@/components/sprite";
import { cn } from "@/lib/cn";
import { cloud } from "@/lib/sprites";
import type { SpriteGrid } from "@/lib/sprites/grid";

// Shared by cloud links and the mobile menu's cloud button. The default width
// suits the original 24-pixel cloud; cloudStyle sizes any other cloud.
export const cloudClassName =
  "group relative grid w-[150px] animate-bob cursor-pointer text-xl font-medium text-ink no-underline motion-reduce:animate-none";

// CSS pixels per sprite pixel for the smaller clouds, so their pixels match.
const cloudPixelSize = 6.25;

function spriteSize(grid: SpriteGrid) {
  return { width: grid[0].length, height: grid.length };
}

// Keeps a cloud in its own proportions. With `sized`, it also sets the width
// so the cloud's pixels are the same size as every other nav cloud's.
export function cloudStyle(grid: SpriteGrid, sized = false): CSSProperties {
  const { width, height } = spriteSize(grid);
  return {
    aspectRatio: `${width} / ${height}`,
    ...(sized && { width: width * cloudPixelSize }),
  };
}

// How far down the cloud its label sits, from 0 to 1: the middle of the rows
// whose fill (not outline) spans most of the cloud, so the text lands on its
// body rather than between its puffs or on its outline.
export function labelPosition(grid: SpriteGrid) {
  const width = grid[0].length;
  const broad = grid
    .map((row, y) => ({ y, filled: row.replace(/[.K]/g, "").length }))
    .filter(({ filled }) => filled >= width * 0.6)
    .map(({ y }) => y);
  // Half a row above the middle, since the shaded underside is at the bottom.
  const middle = (broad[0] + broad[broad.length - 1]) / 2;
  return middle / grid.length;
}

type CloudArtProps = { sprite?: SpriteGrid; children: ReactNode };

export function CloudArt({ sprite = cloud, children }: CloudArtProps) {
  return (
    <>
      <Sprite
        grid={sprite}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      />
      <span
        className="absolute inset-x-0 -translate-y-1/2 text-center decoration-[3px] underline-offset-[5px] group-hover:underline"
        style={{ top: `${labelPosition(sprite) * 100}%` }}
      >
        {children}
      </span>
    </>
  );
}

type CloudLinkProps = ComponentProps<typeof Link> & {
  sprite?: SpriteGrid;
  // Size the link from the sprite instead of from its class names.
  sized?: boolean;
};

// A nav link drawn on a pixel cloud.
export function CloudLink({
  sprite = cloud,
  sized = false,
  className,
  style,
  children,
  ...props
}: CloudLinkProps) {
  return (
    <Link
      className={cn(cloudClassName, className)}
      style={{ ...cloudStyle(sprite, sized), ...style }}
      {...props}
    >
      <CloudArt sprite={sprite}>{children}</CloudArt>
    </Link>
  );
}
