import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Everything is public, so every crawler may visit every page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
