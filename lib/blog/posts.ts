import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

// Blog posts are MDX files in content/blog/, named after their URL slug, each
// starting with YAML frontmatter between two "---" lines.
export const postsDirectory = path.join(process.cwd(), "content", "blog");

// A real calendar day, written like "2026-10-29".
const day = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date like "2026-10-29"')
  // Date.parse rolls 30 February over to March, so check the day survives.
  .refine(
    (value) => {
      const date = new Date(`${value}T00:00:00Z`);
      return (
        !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
      );
    },
    { message: "Isn't a real date" },
  );

export const frontmatterSchema = z.strictObject({
  title: z.string().trim().min(1),
  // One or two sentences, shown on the blog index and in the RSS feed.
  summary: z.string().trim().min(1),
  published: day,
  // Leave a post out of the blog until it's ready.
  draft: z.boolean().default(false),
});

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type Post = z.output<typeof frontmatterSchema> & {
  slug: string;
  // The post's MDX without its frontmatter.
  body: string;
};

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

// Reads one post's source. Throws with the file name and every problem, so a
// typo stops the build instead of reaching the live site.
export function parsePost(fileName: string, source: string): Post {
  const slug = fileName.replace(/\.mdx$/, "");
  if (!slugPattern.test(slug)) {
    throw new Error(
      `${fileName}: name posts with lowercase words joined by "-", like my-post.mdx`,
    );
  }

  const match = frontmatterPattern.exec(source);
  if (!match) {
    throw new Error(`${fileName}: start the post with --- frontmatter ---`);
  }

  const result = frontmatterSchema.safeParse(parseYaml(match[1]));
  if (!result.success) {
    throw new Error(
      `${fileName} has invalid frontmatter:\n${z.prettifyError(result.error)}`,
    );
  }

  return { ...result.data, slug, body: source.slice(match[0].length) };
}

// Every published post, newest first. Posts are read while the site builds,
// never at runtime, so the reads are marked for Turbopack not to trace.
export function getPosts(directory = postsDirectory): Post[] {
  let fileNames: string[];
  try {
    fileNames = readdirSync(/* turbopackIgnore: true */ directory).filter(
      (name) => name.endsWith(".mdx"),
    );
  } catch {
    return [];
  }

  return fileNames
    .map((name) =>
      parsePost(
        name,
        readFileSync(
          path.join(/* turbopackIgnore: true */ directory, name),
          "utf8",
        ),
      ),
    )
    .filter((post) => !post.draft)
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function getPost(slug: string, directory = postsDirectory) {
  return getPosts(directory).find((post) => post.slug === slug);
}
