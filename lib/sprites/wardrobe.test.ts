import { describe, expect, it } from "vitest";
import { spriteProblems } from "./grid";
import { avatar } from "./index";
import {
  defaultLook,
  dressAvatar,
  faces,
  hats,
  headroom,
  type Look,
  outfits,
  parseLook,
  parts,
} from "./wardrobe";

const looks: Look[] = Object.keys(hats).flatMap((hair) =>
  Object.keys(faces).flatMap((face) =>
    Object.keys(outfits).map((outfit) => ({ hair, face, outfit }) as Look),
  ),
);

describe("dressAvatar", () => {
  it.each(looks.map((look) => [Object.values(look).join(", "), look]))(
    "draws %s at the avatar's size, plus headroom",
    (_name, look) => {
      const dressed = dressAvatar(look as Look);

      expect(spriteProblems(dressed)).toEqual([]);
      expect(dressed).toHaveLength(avatar.length + headroom);
    },
  );

  it("draws the default look as the plain avatar", () => {
    expect(dressAvatar(defaultLook).slice(headroom)).toEqual([...avatar]);
  });
});

describe("parts", () => {
  it("cover every row of a dressed avatar once, top to bottom", () => {
    expect(parts[0].from).toBe(0);
    parts.slice(1).forEach((part, index) => {
      expect(part.from).toBe(parts[index].to);
    });
    expect(parts.at(-1)?.to).toBe(avatar.length + headroom);
  });
});

describe("parseLook", () => {
  it("reads a saved look", () => {
    const look = { hair: "cap", face: "wink", outfit: "hoodie" };

    expect(parseLook(JSON.stringify(look))).toEqual(look);
  });

  it.each([
    ["nothing saved", null],
    ["broken JSON", "{oops"],
    ["a number", "4"],
  ])("falls back to the default look for %s", (_case, saved) => {
    expect(parseLook(saved)).toEqual(defaultLook);
  });

  it("keeps the parts that still exist and resets the rest", () => {
    expect(
      parseLook(JSON.stringify({ hair: "mortarboard", face: "angry" })),
    ).toEqual({ ...defaultLook, hair: "mortarboard" });
  });
});
