// One letter per colour. Several match the theme tokens in app/globals.css,
// such as K (ink), W (paper), Y (gold) and D (dirt).
export const palette = {
  K: "#1b1b2f",
  W: "#ffffff",
  L: "#c9d6ea",
  Y: "#ffd43b",
  O: "#e8a317",
  G: "#6ccf7a",
  g: "#2f8a3a",
  R: "#e63946",
  B: "#3a5bd9",
  H: "#2b1d14",
  S: "#c68e5e",
  M: "#8a4b2e",
  P: "#2f2f4f",
  C: "#5fd3e8",
  V: "#9b6bff",
  D: "#83502f",
  E: "#bbbbbb",
} as const;

export type PaletteKey = keyof typeof palette;

// A full stop leaves that pixel see-through.
export const TRANSPARENT = ".";

type Pixel = PaletteKey | typeof TRANSPARENT;

// Each string is one row of pixels, top to bottom.
export type SpriteGrid = readonly string[];

type IsValidRow<Row extends string> = Row extends ""
  ? true
  : Row extends `${Pixel}${infer Rest}`
    ? IsValidRow<Rest>
    : false;

type CheckedRows<Rows extends readonly string[]> = {
  [I in keyof Rows]: IsValidRow<Rows[I]> extends true
    ? Rows[I]
    : `Unknown colour letter in row "${Rows[I]}"`;
};

// Declares a sprite. A letter missing from the palette is a type error.
export function defineSprite<const Rows extends readonly string[]>(
  rows: CheckedRows<Rows>,
): SpriteGrid {
  return rows as SpriteGrid;
}

// Things the type checker can't catch, such as rows of different widths.
export function spriteProblems(grid: SpriteGrid): string[] {
  const problems: string[] = [];

  if (grid.length === 0) {
    return ["has no rows"];
  }

  const width = grid[0]?.length ?? 0;
  if (width === 0) {
    problems.push("has an empty first row");
  }

  grid.forEach((row, y) => {
    if (row.length !== width) {
      problems.push(`row ${y} is ${row.length} wide, expected ${width}`);
    }
    [...row].forEach((pixel, x) => {
      if (pixel !== TRANSPARENT && !(pixel in palette)) {
        problems.push(`unknown colour "${pixel}" at ${x},${y}`);
      }
    });
  });

  return problems;
}
