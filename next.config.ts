import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Projects have no index page of their own; trimming a project's address
  // lands on the row of consoles instead of a 404. Temporary, in case an
  // index page is added later.
  redirects() {
    return [
      { source: "/projects", destination: "/#projects", permanent: false },
    ];
  },
};

// Lets pages import .mdx files as components, such as the case studies and
// blog posts. Plugins are named as strings so Turbopack can load them.
const withMDX = createMDX({
  options: {
    // Blog posts start with YAML frontmatter, which the post loader reads and
    // this keeps out of the rendered page.
    remarkPlugins: ["remark-frontmatter"],
    // Colours code blocks while the site builds, so no highlighter ships to
    // the browser. The theme's background is left out for the site's own.
    rehypePlugins: [
      ["rehype-pretty-code", { theme: "github-dark", keepBackground: false }],
    ],
  },
});

export default withMDX(nextConfig);
