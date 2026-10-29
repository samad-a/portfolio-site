import { getPost, getPosts } from "@/lib/blog/posts";
import { ogImage, ogSize } from "@/lib/og";
import { spark } from "@/lib/sprites";

export const alt = "A post from Samad Ali's dev log";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getPost((await params).slug);

  return ogImage({
    eyebrow: "dev log",
    title: post?.title ?? "Dev log",
    subtitle: post?.summary,
    sprite: spark,
  });
}
