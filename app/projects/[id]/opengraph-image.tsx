import { projects } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";
import { sprites } from "@/lib/sprites";

export const alt = "A project from Samad Ali's portfolio";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map(({ id }) => ({ id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((candidate) => candidate.id === id);

  return ogImage({
    eyebrow: "project",
    title: project?.name ?? "Projects",
    subtitle: project?.summary,
    sprite: sprites[project?.sprite ?? "coin"],
  });
}
