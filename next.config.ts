import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// Lets pages import .mdx files as components, such as the case studies and
// blog posts. Plugins are named as strings so Turbopack can load them.
const withMDX = createMDX({
  options: {
    // Blog posts start with YAML frontmatter, which the post loader reads and
    // this keeps out of the rendered page.
    remarkPlugins: ["remark-frontmatter"],
  },
});

export default withMDX(nextConfig);
