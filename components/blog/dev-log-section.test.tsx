import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Post } from "@/lib/blog/posts";
import { DevLogSection } from "./dev-log-section";

const post = (slug: string): Post => ({
  slug,
  title: `Post ${slug}`,
  summary: "A summary.",
  published: "2026-10-29",
  draft: false,
  body: "Hello.",
});

describe("DevLogSection", () => {
  it("shows the three newest posts and links to the rest", () => {
    render(<DevLogSection posts={["a", "b", "c", "d"].map(post)} />);

    const section = screen.getByRole("region", { name: /dev log/ });
    const titles = within(section)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(titles).toEqual(["Post a", "Post b", "Post c"]);
    expect(
      within(section).getByRole("link", { name: "Post a" }),
    ).toHaveAttribute("href", "/blog/a");
    expect(
      within(section).getByRole("link", { name: /all posts/ }),
    ).toHaveAttribute("href", "/blog");
  });

  it("is left out when there are no posts", () => {
    const { container } = render(<DevLogSection posts={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
