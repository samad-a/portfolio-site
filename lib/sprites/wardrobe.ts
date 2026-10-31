import { defineSprite, type SpriteGrid } from "./grid";
import { avatar } from "./index";

// The avatar's rows for each part it can swap: the face is rows 7 to 14 and
// the outfit, down to the shoes, is rows 17 to 26.
const faceRows = { from: 7, to: 15 };
const outfitRows = { from: 17, to: 27 };

// Rows of empty sky above the head, so hats have room without the avatar
// changing size when one goes on.
export const headroom = 3;

// Object.keys, keeping the key names as types.
const names = <T extends object>(record: T) =>
  Object.keys(record) as (keyof T & string)[];

const smile = avatar.slice(faceRows.from, faceRows.to);

export const faces = {
  smile,
  grin: defineSprite([
    "KHHFFFFFFFFFFHHK",
    ".KHFKKFFFFKKFHK.",
    ".KFFFFFFFFFFFFK.",
    ".KFFFKFFFFKFFFK.",
    ".KFFKFKFFKFKFFK.",
    ".KFNFFFFFFFFNFK.",
    "..KFFMWWWWMFFK..",
    "..KFFFMRRMFFFK..",
  ]),
  wink: defineSprite([
    "KHHFFFFFFFFFFHHK",
    ".KHFKKFFFFKKFHK.",
    ".KFFFFFFFFFFFFK.",
    ".KFFFKFFFFFFFFK.",
    ".KFFFKFFFKKKFFK.",
    ".KFNFFFFFFFFNFK.",
    "..KFFFFFFFFMFK..",
    "..KFFFFMMMMFFK..",
  ]),
  surprised: defineSprite([
    "KHHFKKFFFFKKFHHK",
    ".KHFFFFFFFFFFHK.",
    ".KFFFFFFFFFFFFK.",
    ".KFFKKFFFFKKFFK.",
    ".KFFKKFFFFKKFFK.",
    ".KFNFFFFFFFFNFK.",
    "..KFFFFMMFFFFK..",
    "..KFFFFMMFFFFK..",
  ]),
  // The smile behind a pair of sunglasses.
  cool: [
    ...smile.slice(0, 3),
    ...defineSprite([
      ".KFKKKKKKKKKKFK.",
      ".KFKWPKFFKWPKFK.",
      ".KFNKKFFFFKKNFK.",
    ]),
    ...smile.slice(6),
  ],
} satisfies Record<string, SpriteGrid>;

export const outfits = {
  polo: avatar.slice(outfitRows.from, outfitRows.to),
  hoodie: defineSprite([
    "..KKAAAFFAAAKK..",
    ".KffffAAAAffffK.",
    "KfffffWffWfffffK",
    "KfffffWffWfffffK",
    "KFKffAAAAAAffKFK",
    ".KKfAffffffAfKK.",
    "..KJJJJJJJJJJK..",
    "..KJJJIKKJJJIK..",
    "..KJJJIKKJJJIK..",
    "..KooooKKooooK..",
  ]),
  suit: defineSprite([
    "..KKcWWFFWWcKK..",
    ".KcccUWRRWUcccK.",
    "KccccUWRRWUccccK",
    "KcccccURRUcccccK",
    "KFKccccUUccccKFK",
    ".KKccccYUccccKK.",
    "..KUUUUUUUUUUK..",
    "..KUUUdKKUUUdK..",
    "..KUUUdKKUUUdK..",
    "..KooooKKooooK..",
  ]),
  "grad gown": defineSprite([
    "..KKPYYFFYYPKK..",
    ".KPPPYYPPYYPPPK.",
    "KPPPPYYPPYYPPPPK",
    "KPPPPYYPPYYPPPPK",
    "KFKPPYYPPYYPPKFK",
    ".KKPPOOPPOOPPKK.",
    "..KPPPPPPPPPPK..",
    "..KPPPPPPPPPPK..",
    ".KPPPPPPPPPPPPK.",
    "..KooooKKooooK..",
  ]),
} satisfies Record<string, SpriteGrid>;

// Drawn over the hair. `top` is the row the hat starts on, counting from the
// top of the head, so a negative one pokes up into the headroom.
export const hats = {
  curls: { top: 0, rows: [] },
  cap: {
    top: -1,
    rows: defineSprite([
      "....KKKKKKKK....",
      "..KKRRRRRRRRKK..",
      ".KRRRRRRWWRRRRK.",
      ".KRRRRRRRRRRRRK.",
      "KRRRRRRRRRRRRRRK",
      "KrrrrrrrrrrrrrrK",
    ]),
  },
  mortarboard: {
    top: -3,
    rows: defineSprite([
      ".....KKKKKK.....",
      "..KKKPPYYPPKKK..",
      "KKPPPPPYYPPPPPKK",
      "..KKKPPPPPPKKKY.",
      "...KPPPPPPPPK.Y.",
      "...KKKKKKKKKK.O.",
    ]),
  },
} satisfies Record<string, { top: number; rows: SpriteGrid }>;

export type Look = {
  hair: keyof typeof hats;
  face: keyof typeof faces;
  outfit: keyof typeof outfits;
};

export const defaultLook: Look = {
  hair: "curls",
  face: "smile",
  outfit: "polo",
};

// The parts the visitor can change, each with its options and the rows it
// covers in a dressed avatar, so the page knows where to put its buttons.
export const parts = [
  {
    name: "hair",
    prompt: "pick a hat",
    options: names(hats),
    from: 0,
    to: headroom + 7,
  },
  {
    name: "face",
    prompt: "pick a face",
    options: names(faces),
    from: headroom + 7,
    to: headroom + 17,
  },
  {
    name: "outfit",
    prompt: "pick an outfit",
    options: names(outfits),
    from: headroom + 17,
    to: headroom + avatar.length,
  },
] as const satisfies readonly {
  name: keyof Look;
  prompt: string;
  options: readonly string[];
  from: number;
  to: number;
}[];

// The avatar wearing a look, with the headroom on top.
export function dressAvatar(look: Look): SpriteGrid {
  const rows = [...avatar];
  rows.splice(faceRows.from, faces[look.face].length, ...faces[look.face]);
  rows.splice(
    outfitRows.from,
    outfits[look.outfit].length,
    ...outfits[look.outfit],
  );

  const width = avatar[0].length;
  const dressed = [
    ...Array.from({ length: headroom }, () => ".".repeat(width)),
    ...rows,
  ];
  const hat = hats[look.hair];
  hat.rows.forEach((hatRow, index) => {
    const y = headroom + hat.top + index;
    dressed[y] = [...dressed[y]]
      .map((pixel, x) => (hatRow[x] === "." ? pixel : hatRow[x]))
      .join("");
  });
  return dressed;
}

// Reads a look saved earlier, keeping only the parts that still exist, so an
// old or edited save falls back to the default instead of breaking the page.
export function parseLook(saved: string | null): Look {
  let data: unknown;
  try {
    data = saved ? JSON.parse(saved) : undefined;
  } catch {
    data = undefined;
  }
  const record = (typeof data === "object" && data ? data : {}) as Record<
    string,
    unknown
  >;
  const pick = <T extends string>(
    value: unknown,
    options: readonly T[],
    fallback: T,
  ) => (options.includes(value as T) ? (value as T) : fallback);

  return {
    hair: pick(record.hair, parts[0].options, defaultLook.hair),
    face: pick(record.face, parts[1].options, defaultLook.face),
    outfit: pick(record.outfit, parts[2].options, defaultLook.outfit),
  };
}
