type SectionHeadingProps = {
  id: string;
  children: string;
};

export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <h2 id={id} className="text-[clamp(34px,6vw,48px)] leading-[1.1] font-bold">
      {children}
    </h2>
  );
}
