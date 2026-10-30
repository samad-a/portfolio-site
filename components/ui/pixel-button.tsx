import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type LinkProps = ComponentProps<typeof Link> & { href: string };
type ButtonProps = ComponentProps<"button"> & { href?: undefined };

export type PixelButtonProps = LinkProps | ButtonProps;

// The outline sits on the wrapper, since the face's clip-path would cut it off.
// Hovering lifts the button towards its shadow; pressing pushes it back down.
const wrapperClass =
  "pixel-outline inline-block transition-transform duration-100 ease-[steps(2)] hover:-translate-x-[3px] hover:-translate-y-[3px] has-focus-visible:-translate-x-[3px] has-focus-visible:-translate-y-[3px] has-active:translate-x-0 has-active:translate-y-0 motion-reduce:transition-none";

// The focus outline is drawn inside the face, because clip-path would hide one outside it.
const faceClass =
  "pixel-corners inline-flex cursor-pointer items-center gap-2.5 bg-gold px-4.5 py-3 font-label text-[15px] tracking-wide text-ink no-underline focus-visible:outline-ink focus-visible:outline-offset-[-7px]";

export function PixelButton({ className, ...props }: PixelButtonProps) {
  const face = cn(faceClass, className);

  return (
    <span className={wrapperClass}>
      {props.href === undefined ? (
        <button type="button" {...props} className={face} />
      ) : props.download !== undefined ? (
        // A file to save, not a page: Link would prefetch it as a route,
        // which fails with a 404 on every visit.
        <a {...props} className={face} />
      ) : (
        <Link {...props} className={face} />
      )}
    </span>
  );
}
