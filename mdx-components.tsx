import type { MDXComponents } from "mdx/types";

// How Markdown elements look inside MDX content, such as the case studies.
// Next.js looks for this file at the project root.
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-10 mb-3 text-[28px] leading-tight font-bold first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-6 mb-2 text-[22px] leading-tight font-bold" {...props} />
  ),
  p: (props) => <p className="mt-3 first:mt-0" {...props} />,
  ul: (props) => (
    <ul className="mt-3 grid list-[square] gap-1.5 pl-6" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-3 grid list-decimal gap-1.5 pl-6" {...props} />
  ),
  li: (props) => <li className="marker:text-gold-dark" {...props} />,
  a: (props) => (
    <a className="underline decoration-2 underline-offset-4" {...props} />
  ),
  // Code blocks, coloured by rehype-pretty-code while the site builds.
  figure: (props) =>
    "data-rehype-pretty-code-figure" in props ? (
      <figure className="mt-5 grid" {...props} />
    ) : (
      <figure {...props} />
    ),
  figcaption: (props) => (
    <figcaption
      className="justify-self-start bg-ink px-3 pt-1.5 pb-1 font-label text-xs tracking-wide text-paper"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="overflow-x-auto bg-ink px-4 py-3.5 font-mono text-[15px] leading-relaxed text-paper"
      {...props}
    />
  ),
  // Inline code gets a tint. Code inside a block is already coloured, and is
  // marked with the theme it was coloured with.
  code: (props) =>
    "data-theme" in props ? (
      <code {...props} />
    ) : (
      <code className="bg-[rgb(27_27_47/0.08)] px-1 text-[0.9em]" {...props} />
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
