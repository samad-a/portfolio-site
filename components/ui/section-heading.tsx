type SectionHeadingProps = {
  id: string;
  children: string;
  // The game-style name shown in a small ink badge, such as "quest log".
  tag: string;
};

export function SectionHeading({ id, children, tag }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-[clamp(34px,6vw,48px)] leading-[1.1] font-bold"
    >
      {children}
      <span className="bg-ink px-2 py-1 font-label text-[13px] font-normal tracking-wider text-paper">
        {tag}
      </span>
    </h2>
  );
}
