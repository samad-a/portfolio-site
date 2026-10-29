import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Post } from "@/lib/blog/posts";
import BlogPage from "./page";

const { getPosts } = vi.hoisted(() => ({ getPosts: vi.fn<() => Post[]>() }));
vi.mock("@/lib/blog/posts", () => ({ getPosts }));

const post: Post = {
  slug: "first-post",
  title: "First post",
  summary: "What I learned.",
  published: "2026-10-29",
  draft: false,
  body: "Hello.",
};

describe("BlogPage", () => {
  it("lists each post with a link to it", () => {
    getPosts.mockReturnValue([post, { ...post, slug: "second", title: "Two" }]);
    render(<BlogPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /dev log/ }),
    ).toBeInTheDocument();
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(2);
    expect(
      within(articles[0]).getByRole("link", { name: "First post" }),
    ).toHaveAttribute("href", "/blog/first-post");
    expect(articles[0]).toHaveTextContent("What I learned.");
    expect(within(articles[0]).getByText("29 Oct 2026")).toHaveAttribute(
      "datetime",
      "2026-10-29",
    );
    expect(articles[0]).toHaveTextContent("1 min read");
  });

  it("says so when there are no posts yet", () => {
    getPosts.mockReturnValue([]);
    render(<BlogPage />);

    expect(screen.getByText(/No posts yet/)).toBeInTheDocument();
  });
});
