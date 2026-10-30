import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { PixelPanel } from "@/components/ui/pixel-panel";
import type { Post } from "@/lib/blog/posts";
import { PostMeta } from "./post-meta";

// How many of the newest posts the homepage shows.
export const latestPostCount = 3;

// The newest posts, linking on to the full dev log. Pages with
// no posts yet leave the section out.
export function DevLogSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section
      id="dev-log"
      aria-labelledby="dev-log-heading"
      className="mx-auto max-w-page scroll-mt-4 px-4 py-14"
    >
      <SectionHeading id="dev-log-heading">dev log</SectionHeading>
      <ul
        role="list"
        className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4"
      >
        {posts.slice(0, latestPostCount).map((post) => (
          <li key={post.slug}>
            <PixelPanel
              as="article"
              outerClassName="h-full"
              className="grid h-full content-start gap-2 bg-ink px-4.5 py-4 text-paper [&_p:first-child]:text-gold"
            >
              <PostMeta post={post} />
              <h3 className="text-[21px] leading-tight font-bold">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-paper underline decoration-transparent decoration-[3px] underline-offset-[5px] hover:decoration-current focus-visible:outline-paper"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="text-[17px]">{post.summary}</p>
            </PixelPanel>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-right">
        <Link href="/blog" className="font-label text-sm tracking-wider">
          all posts <span aria-hidden="true">→</span>
        </Link>
      </p>
    </section>
  );
}
