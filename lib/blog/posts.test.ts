import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getPost, getPosts, parsePost } from "./posts";

function post(frontmatter: string, body = "Hello.\n") {
  return `---\n${frontmatter}\n---\n\n${body}`;
}

const valid = `title: First post
summary: What I learned.
published: 2026-10-29`;

describe("parsePost", () => {
  it("reads the frontmatter, slug and body", () => {
    expect(parsePost("first-post.mdx", post(valid))).toEqual({
      slug: "first-post",
      title: "First post",
      summary: "What I learned.",
      published: "2026-10-29",
      draft: false,
      body: "\nHello.\n",
    });
  });

  it("accepts Windows line endings", () => {
    const source = post(valid).replaceAll("\n", "\r\n");
    expect(parsePost("first-post.mdx", source).title).toBe("First post");
  });

  it("rejects a file name that isn't a slug", () => {
    expect(() => parsePost("First Post.mdx", post(valid))).toThrow(
      /lowercase words joined by "-"/,
    );
  });

  it("rejects a post without frontmatter", () => {
    expect(() => parsePost("first-post.mdx", "# Hello")).toThrow(
      /start the post with --- frontmatter ---/,
    );
  });

  it.each([
    ["a missing title", valid.replace("title: First post\n", "")],
    ["a misspelt field", valid.replace("summary", "sumary")],
    ["a badly written date", valid.replace("2026-10-29", "29/10/2026")],
    ["a date that doesn't exist", valid.replace("2026-10-29", "2026-02-30")],
  ])("rejects %s, naming the file", (_case, frontmatter) => {
    expect(() => parsePost("first-post.mdx", post(frontmatter))).toThrow(
      /^first-post\.mdx has invalid frontmatter/,
    );
  });
});

describe("getPosts", () => {
  let directory: string;

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  function write(files: Record<string, string>) {
    directory = mkdtempSync(path.join(tmpdir(), "posts-"));
    mkdirSync(directory, { recursive: true });
    for (const [name, source] of Object.entries(files)) {
      writeFileSync(path.join(directory, name), source);
    }
  }

  it("lists published posts newest first, leaving out drafts", () => {
    write({
      "older.mdx": post(valid.replace("2026-10-29", "2026-01-05")),
      "newer.mdx": post(valid),
      "draft.mdx": post(`${valid}\ndraft: true`),
      "notes.txt": "not a post",
    });

    expect(getPosts(directory).map((p) => p.slug)).toEqual(["newer", "older"]);
    expect(getPost("draft", directory)).toBeUndefined();
    expect(getPost("older", directory)?.published).toBe("2026-01-05");
  });

  it("has no posts when the folder doesn't exist", () => {
    directory = path.join(tmpdir(), "no-such-posts-folder");
    expect(getPosts(directory)).toEqual([]);
  });
});
