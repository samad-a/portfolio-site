import { describe, expect, it } from "vitest";
import { pageMetadata } from "./site";

describe("pageMetadata", () => {
  it("titles a page after itself and the site, with a canonical URL", () => {
    const metadata = pageMetadata({
      title: "Dev log",
      description: "Notes.",
      path: "/blog",
    });

    expect(metadata).toMatchObject({
      title: "Dev log",
      description: "Notes.",
      alternates: { canonical: "/blog" },
      openGraph: {
        title: "Dev log · Samad Ali",
        url: "/blog",
        siteName: "Samad Ali",
        type: "website",
      },
      twitter: { card: "summary_large_image", title: "Dev log · Samad Ali" },
    });
  });

  it("leaves the homepage titled with the site name", () => {
    const metadata = pageMetadata({ description: "Hi.", path: "/" });

    expect(metadata.title).toBeUndefined();
    expect(metadata.openGraph?.title).toBe("Samad Ali");
  });

  it("shares posts as articles with their publish date", () => {
    const metadata = pageMetadata({
      title: "Post",
      description: "A post.",
      path: "/blog/post",
      published: "2026-10-29",
    });

    expect(metadata.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-10-29",
    });
  });
});
