import type { Metadata } from "next";

// The live site's address, for links that must be absolute, like in the feed.
export const siteUrl = "https://samadali.dev";

export const siteName = "Samad Ali";

export const siteDescription =
  "Samad Ali, a computer science student at the University of Edinburgh. Experience, projects and a dev log, in retro pixel art.";

type PageMetadata = {
  // Leave out for the homepage, which is titled with the site name alone.
  title?: string;
  description: string;
  // The page's path, such as "/blog", for its canonical URL.
  path: string;
  // When set, the page is shared as an article published on this day.
  published?: string;
};

// Everything a page tells search engines and link previews about itself.
// Pages build theirs with this because Next.js replaces, rather than merges, a
// parent's openGraph settings.
export function pageMetadata({
  title,
  description,
  path,
  published,
}: PageMetadata): Metadata {
  const fullTitle = title ? `${title} · ${siteName}` : siteName;

  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName,
      locale: "en_GB",
      ...(published
        ? { type: "article", publishedTime: published }
        : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
