"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { cn } from "@/lib/cn";
import { CloudArt, cloudClassName } from "./cloud-link";

type MobileMenuProps = {
  links: readonly { href: string; label: string }[];
  className?: string;
};

export function MobileMenu({ links, className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className={cn(cloudClassName, "w-[118px] text-base")}
      >
        <CloudArt>{open ? "close" : "menu"}</CloudArt>
      </button>
      {open && (
        <PixelPanel
          id={menuId}
          outerClassName="absolute top-full right-0 z-40 mt-2 w-48"
          className="p-2"
        >
          <ul className="grid">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 font-label text-sm tracking-wide text-ink no-underline hover:bg-sky focus-visible:outline-offset-[-3px]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </PixelPanel>
      )}
    </div>
  );
}
