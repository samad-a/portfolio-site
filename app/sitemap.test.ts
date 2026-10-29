import { describe, expect, it } from "vitest";
import { getPosts } from "@/lib/blog/posts";
import { projects } from "@/lib/content";
import robots from "./robots";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists the homepage, the blog, every project and every post", () => {
    expect(urls).toContain("https://samadali.dev");
    expect(urls).toContain("https://samadali.dev/blog");
    for (const project of projects) {
      expect(urls).toContain(`https://samadali.dev/projects/${project.id}`);
    }
    for (const post of getPosts()) {
      expect(urls).toContain(`https://samadali.dev/blog/${post.slug}`);
    }
  });

  it("lists each page once", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("robots", () => {
  it("lets every crawler in and points to the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://samadali.dev/sitemap.xml",
    });
  });
});
