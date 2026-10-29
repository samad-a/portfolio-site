import {
  palette,
  type PaletteKey,
  type SpriteGrid,
  TRANSPARENT,
} from "@/lib/sprites/grid";

// Draws a sprite once at one canvas pixel per sprite pixel, so the background
// can stamp it every frame with drawImage instead of redrawing each pixel.
export function spriteImage(grid: SpriteGrid) {
  const image = document.createElement("canvas");
  image.width = Math.max(...grid.map((row) => row.length));
  image.height = grid.length;
  const context = image.getContext("2d");
  if (!context) return image;

  grid.forEach((row, y) => {
    [...row].forEach((pixel, x) => {
      if (pixel === TRANSPARENT) return;
      context.fillStyle = palette[pixel as PaletteKey];
      context.fillRect(x, y, 1, 1);
    });
  });
  return image;
}
