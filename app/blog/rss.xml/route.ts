import { getPosts } from "@/lib/blog/posts";
import { rssFeed } from "@/lib/blog/rss";
import { siteName, siteUrl } from "@/lib/site";

// Built once with the site, like the posts themselves.
export const dynamic = "force-static";

export function GET() {
  const xml = rssFeed({
    siteUrl,
    title: `${siteName}'s dev log`,
    description: "Notes on what I'm building and what I'm learning.",
    posts: getPosts(),
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
