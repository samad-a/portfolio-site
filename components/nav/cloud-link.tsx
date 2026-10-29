import Link from "next/link";
import type { ComponentProps } from "react";
import { Sprite } from "@/components/sprite";
import { cn } from "@/lib/cn";
import { cloud } from "@/lib/sprites";

type CloudLinkProps = ComponentProps<typeof Link>;

// A nav link drawn on a pixel cloud. The cloud keeps its 24×11 shape at any width.
export function CloudLink({ className, children, ...props }: CloudLinkProps) {
  return (
    <Link
      className={cn(
        "group relative grid aspect-[24/11] w-[150px] place-items-center pt-1 text-xl font-medium text-ink no-underline",
        className,
      )}
      {...props}
    >
      <Sprite
        grid={cloud}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      />
      <span className="relative decoration-[3px] underline-offset-[5px] group-hover:underline">
        {children}
      </span>
    </Link>
  );
}
