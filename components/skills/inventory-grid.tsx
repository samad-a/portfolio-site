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

// Each kind of skill gets its own pocket of the bag, in this order.
const pockets: Record<Skill["category"], string> = {
  language: "languages",
  framework: "frameworks & libraries",
  tool: "tools",
};
const categories = Object.keys(pockets) as Skill["category"][];

export function InventoryGrid({ items }: { items: InventoryItem[] }) {
  const [activeName, setActiveName] = useState<string>();
  const active = items.find((item) => item.name === activeName);
  const id = useId();

  return (
    <PixelPanel className="bg-inventory">
      {categories.map((category) => {
        const pocket = items.filter((item) => item.category === category);
        if (pocket.length === 0) return null;

        return (
          <div key={category} className="mb-5">
            <h3
              id={`${id}-${category}`}
              className="mb-3 flex items-center gap-3 font-label text-sm tracking-wide text-gold"
            >
              {pockets[category]}
              <span className="text-[11px] text-paper/70">{pocket.length}</span>
              <span aria-hidden="true" className="h-0.75 flex-1 bg-slot" />
            </h3>
            {/* role="list" keeps list semantics in Safari, which drops them without bullets. */}
            <ul
              role="list"
              aria-labelledby={`${id}-${category}`}
              className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(104px,1fr))] sm:gap-3"
            >
              {pocket.map((item, index) => (
                <li key={item.name}>
                  <InventorySlot
                    skill={item}
                    active={item === active}
                    aria-describedby={`${id}-${category}-${index}`}
                    onPointerEnter={() => setActiveName(item.name)}
                    onFocus={() => setActiveName(item.name)}
                    onClick={() => setActiveName(item.name)}
                  />
                  <span id={`${id}-${category}-${index}`} hidden>
                    {describe(item)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {/*
        Each slot already carries its details as a description, so screen
        readers skip this box. It stays put instead of floating over the
        grid, so it never hides anything and needs no way to dismiss it.
      */}
      <div
        aria-hidden="true"
        className="flex min-h-20 items-center gap-4 bg-ink px-4 py-3 font-label text-[13px] tracking-wide text-paper pixel-corners"
      >
        {active ? (
          <>
            <span className="grid w-16 shrink-0 place-items-center">
              <ItemSprite item={active.item} scale={4} />
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
