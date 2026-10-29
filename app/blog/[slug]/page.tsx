import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostMeta } from "@/components/blog/post-meta";
import { PixelPanel } from "@/components/ui/pixel-panel";
import { getPost, getPosts } from "@/lib/blog/posts";

type Props = { params: Promise<{ slug: string }> };

// Only published posts have pages; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.summary } : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Content } = await import(`@/content/blog/${slug}.mdx`);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto grid w-full max-w-page gap-8 px-4 pt-10 pb-16"
    >
      <Link
        href="/blog"
        className="justify-self-start font-label text-sm tracking-wider text-ink"
      >
        <span aria-hidden="true">← </span>back to dev log
      </Link>

      <PixelPanel as="article" className="px-6 py-7 sm:px-9 sm:py-9">
        <header className="mb-8 grid max-w-[65ch] gap-3">
          <h1 className="text-[clamp(32px,6vw,52px)] leading-[1.1] font-bold">
            {post.title}
          </h1>
          <PostMeta post={post} />
        </header>
        <div className="max-w-[65ch]">
          <Content />
        </div>
      </PixelPanel>
    </main>
  );
}
