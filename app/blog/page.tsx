import type { Metadata } from "next";
import Link from "next/link";
import { PostMeta } from "@/components/blog/post-meta";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { getPosts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Dev log",
  description: "Notes on what I'm building and what I'm learning.",
  // Lets feed readers find the RSS feed from this page.
  alternates: { types: { "application/rss+xml": "/blog/rss.xml" } },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto grid max-w-page gap-8 px-4 pt-10 pb-16"
    >
      <header className="grid gap-3">
        <h1 className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-[clamp(40px,7vw,64px)] leading-[1.1] font-bold">
          dev log
          <span className="bg-ink px-2 py-1 font-label text-[13px] font-normal tracking-wider text-paper">
            save points
          </span>
        </h1>
        <p className="max-w-[44ch] text-[19px] sm:text-[22px]">
          Notes on what I&apos;m building and what I&apos;m learning.
        </p>
      </header>

      {posts.length > 0 ? (
        <ul role="list" className="grid gap-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <PixelPanel as="article" className="grid gap-2 px-6 py-5">
                <h2 className="text-2xl leading-tight font-bold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="underline decoration-transparent decoration-[3px] underline-offset-[5px] hover:decoration-current"
                  >
                    {post.title}
                  </Link>
                </h2>
                <PostMeta post={post} />
                <p>{post.summary}</p>
              </PixelPanel>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-label text-sm tracking-wider">
          No posts yet. Check back soon!
        </p>
      )}
    </main>
  );
}
