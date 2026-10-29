import type { ComponentProps } from "react";
import {
  palette,
  type PaletteKey,
  type SpriteGrid,
  TRANSPARENT,
} from "@/lib/sprites/grid";

type Run = { x: number; y: number; width: number; colour: string };

// Joins neighbouring pixels of the same colour in a row into one rectangle.
function toRuns(grid: SpriteGrid): Run[] {
  const runs: Run[] = [];

  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const pixel = row[x];
      let end = x + 1;
      while (row[end] === pixel) end++;
      if (pixel !== TRANSPARENT) {
        runs.push({
          x,
          y,
          width: end - x,
          colour: palette[pixel as PaletteKey],
        });
      }
      x = end;
    }
  });

  return runs;
}

export type SpriteProps = Omit<ComponentProps<"svg">, "children"> & {
  grid: SpriteGrid;
  // Describes the sprite for screen readers. Leave it out for decoration.
  label?: string;
};

// Draws a sprite grid as an SVG that stays sharp at any size. Set its size with className.
export function Sprite({ grid, label, ...props }: SpriteProps) {
  const width = Math.max(...grid.map((row) => row.length));
  const height = grid.length;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
      {...props}
    >
      {toRuns(grid).map(({ x, y, width, colour }) => (
        <rect
          key={`${x},${y}`}
          x={x}
          y={y}
          width={width}
          height={1}
          fill={colour}
        />
      ))}
    </svg>
  );
}
