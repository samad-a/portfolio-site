import { describe, expect, it } from "vitest";
import type { Post } from "./posts";
import { rssFeed } from "./rss";

const post: Post = {
  slug: "first-post",
  title: "Tips & tricks for <canvas>",
  summary: 'What "pixelated" means.',
  published: "2026-10-29",
  draft: false,
  body: "",
};

const feed = (posts: Post[]) =>
  rssFeed({
    siteUrl: "https://samadali.dev",
    title: "Samad Ali's dev log",
    description: "Notes.",
    posts,
  });

describe("rssFeed", () => {
  it("lists each post with an absolute link and an RSS date", () => {
    const xml = feed([post]);

    expect(xml).toContain("<link>https://samadali.dev/blog/first-post</link>");
    expect(xml).toContain(
      '<guid isPermaLink="true">https://samadali.dev/blog/first-post</guid>',
    );
    expect(xml).toContain("<pubDate>Thu, 29 Oct 2026 00:00:00 GMT</pubDate>");
    expect(xml).toContain(
      "<lastBuildDate>Thu, 29 Oct 2026 00:00:00 GMT</lastBuildDate>",
    );
  });

  it("escapes text so titles can't break the XML", () => {
    const xml = feed([post]);

    expect(xml).toContain(
      "<title>Tips &amp; tricks for &lt;canvas&gt;</title>",
    );
    expect(xml).toContain(
      "<description>What &quot;pixelated&quot; means.</description>",
    );
    expect(xml).toContain("<title>Samad Ali&apos;s dev log</title>");
  });

  it("is a valid, empty feed with no posts", () => {
    const xml = feed([]);
    const document = new DOMParser().parseFromString(xml, "application/xml");

    expect(document.querySelector("parsererror")).toBeNull();
    expect(document.querySelectorAll("item")).toHaveLength(0);
    expect(xml).not.toContain("lastBuildDate");
  });

  it("parses as XML with one item per post", () => {
    const xml = feed([post, { ...post, slug: "second" }]);
    const document = new DOMParser().parseFromString(xml, "application/xml");

    expect(document.querySelector("parsererror")).toBeNull();
    expect(document.querySelectorAll("item")).toHaveLength(2);
  });
});
