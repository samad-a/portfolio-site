import { z } from "zod";
import { contrastRatio, hexColourPattern } from "@/lib/colour";
import { spriteNames } from "@/lib/sprites";
import { itemNames } from "@/lib/sprites/items";

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
    // Optional, since not every role has one worth showing.
    location: text.optional(),
    start: month,
    // Leave out for a role that's still going.
    end: month.optional(),
    // A short summary, not the whole CV: a few bullets that each fit on one
    // line of a desktop card.
    highlights: z
      .array(text.max(90, "Keep it to one line, 90 characters at most"))
      .min(1)
      .max(3, "Keep it to 3 highlights at most"),
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

// White text sits on a project's console, so its colour must keep the WCAG AA
// ratio for normal text.
const consoleColour = z
  .string()
  .regex(hexColourPattern, 'Use a colour like "#43308f"')
  .refine((colour) => contrastRatio(colour, "#ffffff") >= 4.5, {
    error: (issue) =>
      `White text on ${issue.input} is ${contrastRatio(String(issue.input), "#ffffff").toFixed(2)}:1, below 4.5:1. Try a darker shade.`,
  });

export const projectSchema = z.strictObject({
  id: slug,
  name: text,
  summary: text,
  stack: z.array(text).min(1),
  highlights: z.array(text).min(1),
  // The console's body colour, ideally taken from the project's own branding.
  colour: consoleColour,
  // A few words on the console's top edge, such as "team of 8" or "solo".
  tag: text.optional(),
  // Where it was made or shown, such as "Hack the Burgh 2025", printed on the
  // screen's border.
  event: text.optional(),
  // A prize, shown as a gold sticker on the console.
  award: text.optional(),
  // Drawn on the console's screen when there's no screenshot.
  sprite: z.enum(spriteNames),
  // A 4:3 image in public/projects/, shown on the console's screen.
  screenshot: z
    .strictObject({
      src: z
        .string()
        .regex(
          /^\/projects\/[a-z0-9-]+\.(png|jpg|webp|svg)$/,
          'Use a path like "/projects/blockr.png"',
        ),
      alt: text,
    })
    .optional(),
  // Photos, screenshots and short videos for projects without a live demo,
  // shown on the project's page. Each lives in public/projects/<id>/.
  gallery: z
    .array(
      z.strictObject({
        src: z
          .string()
          .regex(
            /^\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.(png|jpg|webp|mp4)$/,
            'Use a path like "/projects/blockr/popup.png"',
          ),
        // What it shows, read out for images and printed under each one.
        caption: text,
        // A still shown before a video plays.
        poster: z
          .string()
          .regex(/^\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.(png|jpg|webp)$/)
          .optional(),
      }),
    )
    .min(1)
    .optional(),
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
  // The inventory sprite shown for this skill.
  item: z.enum(itemNames),
});

export const skillListSchema = z
  .array(skillSchema)
  .min(1)
  .superRefine(uniqueBy((skill) => skill.name.toLowerCase(), "skill"));

export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Skill = z.infer<typeof skillSchema>;
