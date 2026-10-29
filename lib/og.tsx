import { ImageResponse } from "next/og";
import { toRuns } from "@/components/sprite";
import type { SpriteGrid } from "@/lib/sprites/grid";

// The size social sites expect for a large link preview.
export const ogSize = { width: 1200, height: 630 };

// The theme's colours, written out because preview images can't read CSS.
const colours = {
  sky: "#a9dbee",
  ink: "#1b1b2f",
  paper: "#ffffff",
  grass: "#2b7d35",
  grassHigh: "#4caf50",
  dirt: "#83502f",
};

// A sprite as an SVG data URL, which the image renderer draws like a picture.
function spriteUrl(grid: SpriteGrid) {
  const width = Math.max(...grid.map((row) => row.length));
  const rects = toRuns(grid)
    .map(
      ({ x, y, width, colour }) =>
        `<rect x="${x}" y="${y}" width="${width}" height="1" fill="${colour}"/>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${grid.length}" shape-rendering="crispEdges">${rects}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// Fetches Pixelify Sans from Google Fonts while the image is built, trimmed to
// just the letters it needs. The renderer can't use the site's web font file,
// so on any failure the image falls back to the renderer's own font.
async function pixelFont(text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&text=${encodeURIComponent(text)}`,
    ).then((response) => response.text());
    const url = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(
      css,
    )?.[1];
    if (!url) return undefined;
    return await fetch(url).then((response) => response.arrayBuffer());
  } catch {
    return undefined;
  }
}

type OgImage = {
  // A small tag above the title, such as "dev log".
  eyebrow: string;
  title: string;
  subtitle?: string;
  sprite: SpriteGrid;
  // Pixels per sprite pixel.
  spriteScale?: number;
};

// A pixel-art link preview: the title on the day sky with a sprite beside it,
// standing on a strip of grass and dirt.
export async function ogImage({
  eyebrow,
  title,
  subtitle = "",
  sprite,
  spriteScale = 16,
}: OgImage) {
  const font = await pixelFont(`${eyebrow}${title}${subtitle}samadali.dev`);
  const spriteWidth = Math.max(...sprite.map((row) => row.length));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: colours.sky,
        color: colours.ink,
        fontFamily: font ? "Pixelify Sans" : undefined,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 80px",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: colours.ink,
              color: colours.paper,
              fontSize: 28,
              padding: "6px 16px",
              letterSpacing: 2,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: title.length > 32 ? 64 : 84,
              lineHeight: 1.05,
              marginTop: 24,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 32,
                lineHeight: 1.35,
                marginTop: 24,
                maxWidth: 760,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- the image renderer has no next/image */}
        <img
          src={spriteUrl(sprite)}
          width={spriteWidth * spriteScale}
          height={sprite.length * spriteScale}
          alt=""
        />
      </div>
      <div style={{ height: 12, background: colours.grassHigh }} />
      <div
        style={{
          height: 84,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 80px",
          background: colours.dirt,
          borderTop: `24px solid ${colours.grass}`,
          color: colours.paper,
          fontSize: 30,
        }}
      >
        samadali.dev
      </div>
    </div>,
    {
      ...ogSize,
      fonts: font
        ? [{ name: "Pixelify Sans", data: font, weight: 700, style: "normal" }]
        : undefined,
    },
  );
}
