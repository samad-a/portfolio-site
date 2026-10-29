import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

export type PixelPanelProps<T extends ElementType = "div"> = {
  as?: T;
  // Classes for the outlined wrapper, such as grid placement or hover lift.
  outerClassName?: string;
} & ComponentProps<T>;

// A stepped-corner box with an ink outline and hard shadow. Pass `className`
// to change its background, text colour or padding.
export function PixelPanel<T extends ElementType = "div">({
  as,
  outerClassName,
  className,
  ...props
}: PixelPanelProps<T>) {
  const Element: ElementType = as ?? "div";

  return (
    <div className={cn("pixel-outline", outerClassName)}>
      <Element
        className={cn("bg-paper p-5 text-ink pixel-corners", className)}
        {...props}
      />
    </div>
  );
}
