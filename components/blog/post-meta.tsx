import type { Post } from "@/lib/blog/posts";
import { readingMinutes } from "@/lib/blog/reading-time";
import { formatDay } from "@/lib/dates";

// The date a post was published and how long it takes to read.
export function PostMeta({ post }: { post: Post }) {
  return (
    <p className="font-label text-xs tracking-wide">
      <time dateTime={post.published}>{formatDay(post.published)}</time>
      {" · "}
      {readingMinutes(post.body)} min read
    </p>
  );
}
