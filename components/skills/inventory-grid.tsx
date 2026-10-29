"use client";

import { useId, useState } from "react";
import { PixelPanel } from "@/components/ui/pixel-panel";
import type { Skill } from "@/lib/content";
import { InventorySlot, ItemSprite } from "./inventory-slot";

export type InventoryItem = Skill & {
  // Names of the projects that list this skill in their stack.
  usedIn: string[];
};

function describe(item: InventoryItem) {
  return item.usedIn.length > 0
    ? `${item.category} · used in ${item.usedIn.join(", ")}`
    : item.category;
}

export function InventoryGrid({ items }: { items: InventoryItem[] }) {
  const [activeName, setActiveName] = useState<string>();
  const active = items.find((item) => item.name === activeName);
  const id = useId();

  return (
    <PixelPanel className="bg-inventory">
      {/* role="list" keeps list semantics in Safari, which drops them without bullets. */}
      <ul
        role="list"
        aria-label="Skills"
        className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(104px,1fr))] sm:gap-3"
      >
        {items.map((item, index) => (
          <li key={item.name}>
            <InventorySlot
              skill={item}
              active={item === active}
              aria-describedby={`${id}-${index}`}
              onPointerEnter={() => setActiveName(item.name)}
              onFocus={() => setActiveName(item.name)}
              onClick={() => setActiveName(item.name)}
            />
            <span id={`${id}-${index}`} hidden>
              {describe(item)}
            </span>
          </li>
        ))}
      </ul>
      {/*
        Each slot already carries its details as a description, so screen
        readers skip this box. It stays put instead of floating over the
        grid, so it never hides anything and needs no way to dismiss it.
      */}
      <div
        aria-hidden="true"
        className="mt-4 flex min-h-20 items-center gap-4 bg-ink px-4 py-3 font-label text-[13px] tracking-wide text-paper pixel-corners"
      >
        {active ? (
          <>
            <span className="grid w-15 shrink-0 place-items-center">
              <ItemSprite item={active.item} scale={6} />
            </span>
            <span>
              <span className="block text-[15px] text-gold">{active.name}</span>
              {describe(active)}
            </span>
          </>
        ) : (
          "select an item to inspect it"
        )}
      </div>
    </PixelPanel>
  );
}
