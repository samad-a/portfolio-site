import { z } from "zod";
import experienceData from "@/content/experience.json";
import projectsData from "@/content/projects.json";
import skillsData from "@/content/skills.json";
import {
  experienceListSchema,
  projectListSchema,
  skillListSchema,
} from "./schemas";

export type { Experience, Project, Skill } from "./schemas";

// Throws with the file name and every problem in it, so a typo stops the build
// with a readable message rather than reaching the live site.
export function parseContent<T extends z.ZodType>(
  file: string,
  schema: T,
  data: unknown,
): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`${file} is invalid:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Newest first. Months are "YYYY-MM", so string order is date order.
export const experience = parseContent(
  "content/experience.json",
  experienceListSchema,
  experienceData,
).toSorted((a, b) => b.start.localeCompare(a.start));

export const projects = parseContent(
  "content/projects.json",
  projectListSchema,
  projectsData,
);

export const skills = parseContent(
  "content/skills.json",
  skillListSchema,
  skillsData,
);
