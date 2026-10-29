import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// Lets pages import .mdx files as components, such as the project case studies.
const withMDX = createMDX();

export default withMDX(nextConfig);
