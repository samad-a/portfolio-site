import type { ComponentProps } from "react";
import { Sprite } from "@/components/sprite";
import type { Skill } from "@/lib/content";
import { items } from "@/lib/sprites/items";

type ItemSpriteProps = {
  item: Skill["item"];
  // CSS pixels per sprite pixel, so every item shares one pixel size however
  // many pixels it has.
  scale?: number;
};

export function ItemSprite({ item, scale = 3 }: ItemSpriteProps) {
  const grid = items[item];

  return (
    <Sprite
      grid={grid}
      width={grid[0].length * scale}
      height={grid.length * scale}
    />
  );
}

type InventorySlotProps = Omit<ComponentProps<"button">, "children"> & {
  skill: Skill;
  active?: boolean;
};

// One square of the inventory: the skill's item with its name underneath.
// Pointing at it or focusing it shows its details.
export function InventorySlot({ skill, active, ...props }: InventorySlotProps) {
  return (
    <button
      type="button"
      data-active={active || undefined}
      className="grid h-full w-full cursor-pointer justify-items-center gap-2 bg-slot px-1.5 pt-3.5 pb-2.5 text-center font-label text-[11px] tracking-wide text-paper pixel-corners focus-visible:outline-offset-[-6px] focus-visible:outline-gold data-active:shadow-[inset_0_0_0_3px_var(--color-gold)] sm:text-xs"
      {...props}
    >
      <span className="grid h-12 place-items-end">
        <ItemSprite item={skill.item} />
      </span>
      <span>{skill.name}</span>
    </button>
  );
}
