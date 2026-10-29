import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog/posts";
import { projects } from "@/lib/content";
import { siteUrl } from "@/lib/site";

// Every page search engines should know about, built with the site.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();

  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteUrl}/blog`,
      ...(posts[0] && { lastModified: posts[0].published }),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.published,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
