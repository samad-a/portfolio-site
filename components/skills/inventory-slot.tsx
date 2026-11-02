import type { ComponentProps } from "react";
import { Sprite } from "@/components/sprite";
import type { Skill } from "@/lib/content";
import { items } from "@/lib/sprites/items";

type ItemSpriteProps = {
  item: Skill["item"];
  // CSS pixels per sprite pixel, so every item shares one pixel size however
  // many pixels it has. A --sprite-pixel set by a parent overrides it.
  scale?: number;
};

export function ItemSprite({ item, scale = 3 }: ItemSpriteProps) {
  const grid = items[item];
  const pixel = `var(--sprite-pixel, ${scale}px)`;

  return (
    <Sprite
      grid={grid}
      style={{
        width: `calc(${grid[0].length} * ${pixel})`,
        height: `calc(${grid.length} * ${pixel})`,
      }}
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
      className="grid h-full w-full cursor-pointer justify-items-center gap-1.5 bg-slot px-1.5 pt-2.5 pb-2 text-center font-label text-[11px] tracking-wide text-paper pixel-corners focus-visible:outline-offset-[-6px] focus-visible:outline-gold data-active:shadow-[inset_0_0_0_3px_var(--color-gold)] sm:gap-2 sm:pt-3.5 sm:pb-2.5 sm:text-xs"
      {...props}
    >
      {/* Phones draw items at two pixels to the sprite pixel instead of three, so the bag takes less scrolling. */}
      <span className="grid h-8 place-items-end [--sprite-pixel:2px] sm:h-12 sm:[--sprite-pixel:3px]">
        <ItemSprite item={skill.item} />
      </span>
      <span>{skill.name}</span>
    </button>
  );
}
