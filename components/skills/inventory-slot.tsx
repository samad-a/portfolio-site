import { Sprite } from "@/components/sprite";
import type { Skill } from "@/lib/content";
import { items } from "@/lib/sprites/items";

// Each sprite pixel is drawn this many CSS pixels wide, so every item shares
// one pixel size however many pixels it has.
const pixelSize = 4;

export function ItemSprite({ item }: { item: Skill["item"] }) {
  const grid = items[item];

  return (
    <Sprite
      grid={grid}
      width={grid[0].length * pixelSize}
      height={grid.length * pixelSize}
    />
  );
}

// One square of the inventory: the skill's item with its name underneath.
export function InventorySlot({ skill }: { skill: Skill }) {
  return (
    <div className="grid h-full justify-items-center gap-2 bg-slot px-1.5 pt-3.5 pb-2.5 text-center font-label text-xs tracking-wide text-paper pixel-corners">
      <div className="grid h-8 place-items-end">
        <ItemSprite item={skill.item} />
      </div>
      <span>{skill.name}</span>
    </div>
  );
}
