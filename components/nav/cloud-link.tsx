import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Sprite } from "@/components/sprite";
import { cn } from "@/lib/cn";
import { cloud } from "@/lib/sprites";

// Shared by cloud links and the mobile menu's cloud button.
// The cloud keeps its 24×11 shape at any width.
export const cloudClassName =
  "group relative grid aspect-[24/11] w-[150px] cursor-pointer place-items-center pt-1 text-xl font-medium text-ink no-underline";

export function CloudArt({ children }: { children: ReactNode }) {
  return (
    <>
      <Sprite
        grid={cloud}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      />
      <span className="relative decoration-[3px] underline-offset-[5px] group-hover:underline">
        {children}
      </span>
    </>
  );
}

type CloudLinkProps = ComponentProps<typeof Link>;

// A nav link drawn on a pixel cloud.
export function CloudLink({ className, children, ...props }: CloudLinkProps) {
  return (
    <Link className={cn(cloudClassName, className)} {...props}>
      <CloudArt>{children}</CloudArt>
    </Link>
  );
}
