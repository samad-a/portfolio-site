import type { Post } from "./posts";

function escapeXml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

// RSS wants dates like "Thu, 29 Oct 2026 00:00:00 GMT".
function rssDate(day: string) {
  return new Date(`${day}T00:00:00Z`).toUTCString();
}

type Feed = {
  siteUrl: string;
  title: string;
  description: string;
  posts: Post[];
};

// An RSS 2.0 feed of the given posts, newest first as they're passed in.
export function rssFeed({ siteUrl, title, description, posts }: Feed) {
  const items = posts.map((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${rssDate(post.published)}</pubDate>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(description)}</description>
    <language>en-gb</language>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
${[
  posts[0] &&
    `    <lastBuildDate>${rssDate(posts[0].published)}</lastBuildDate>`,
  ...items,
]
  .filter(Boolean)
  .join("\n")}
  </channel>
</rss>
`;
}
