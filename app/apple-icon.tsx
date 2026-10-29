import { ImageResponse } from "next/og";
import { toRuns } from "@/components/sprite";
import { avatar } from "@/lib/sprites";

// iPhones use this for home screen shortcuts, which don't support SVG icons.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// The avatar drawn 12px per sprite pixel on the day sky, like the favicon.
const scale = 12;

export default function AppleIcon() {
  const width = Math.max(...avatar.map((row) => row.length)) * scale;
  const height = avatar.length * scale;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#a9dbee",
      }}
    >
      <div style={{ position: "relative", display: "flex", width, height }}>
        {toRuns(avatar).map(({ x, y, width, colour }) => (
          <div
            key={`${x},${y}`}
            style={{
              position: "absolute",
              left: x * scale,
              top: y * scale,
              width: width * scale,
              height: scale,
              background: colour,
            }}
          />
        ))}
      </div>
    </div>,
    size,
  );
}
