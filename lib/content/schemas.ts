import { z } from "zod";

// Months are written as "2026-05" so they sort as plain strings.
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
const month = z.string().regex(monthPattern, 'Use a month like "2026-05"');

const text = z.string().trim().min(1, "Can't be empty");

// Each entry needs an id that's unique within its file, used for keys and anchors.
const slug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase words joined by "-"');

function uniqueBy<T>(key: (item: T) => string, label: string) {
  return (items: T[], ctx: z.RefinementCtx) => {
    const seen = new Set<string>();
    items.forEach((item, index) => {
      const value = key(item);
      if (seen.has(value)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate ${label} "${value}"`,
          path: [index],
        });
      }
      seen.add(value);
    });
  };
}

export const experienceSchema = z
  .strictObject({
    id: slug,
    role: text,
    org: text,
    location: text,
    start: month,
    // Leave out for a role that's still going.
    end: month.optional(),
    highlights: z.array(text).min(1),
  })
  .refine((role) => !role.end || role.end >= role.start, {
    message: "Ends before it starts",
    path: ["end"],
    // Only compare once both dates are valid, so a bad month gives one error.
    when: ({ value }) => {
      const { start, end } = value as { start?: unknown; end?: unknown };
      return [start, end ?? start].every(
        (date) => typeof date === "string" && monthPattern.test(date),
      );
    },
  });

export const experienceListSchema = z
  .array(experienceSchema)
  .min(1)
  .superRefine(uniqueBy((role) => role.id, "id"));

// Matches the console colours in the theme.
export const consoleColours = ["purple", "red", "green"] as const;

export const projectSchema = z.strictObject({
  id: slug,
  name: text,
  summary: text,
  stack: z.array(text).min(1),
  highlights: z.array(text).min(1),
  colour: z.enum(consoleColours),
  links: z
    .strictObject({
      code: z.url().optional(),
      play: z.url().optional(),
    })
    .default({}),
});

export const projectListSchema = z
  .array(projectSchema)
  .min(1)
  .superRefine(uniqueBy((project) => project.id, "id"));

export const skillCategories = ["language", "framework", "tool"] as const;

export const skillSchema = z.strictObject({
  name: text,
  category: z.enum(skillCategories),
});

export const skillListSchema = z
  .array(skillSchema)
  .min(1)
  .superRefine(uniqueBy((skill) => skill.name.toLowerCase(), "skill"));

export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Skill = z.infer<typeof skillSchema>;
