import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  experienceListSchema,
  projectListSchema,
  skillListSchema,
} from "@/lib/content/schemas";

const schemas: Record<string, z.ZodType> = {
  "experience.json": experienceListSchema,
  "projects.json": projectListSchema,
  "skills.json": skillListSchema,
};

const files = readdirSync(__dirname).filter((file) => file.endsWith(".json"));

const readJson = (file: string): unknown =>
  JSON.parse(readFileSync(path.join(__dirname, file), "utf8"));

// Falls back to no projects if the file is invalid; its schema test reports why.
const projects =
  projectListSchema.safeParse(readJson("projects.json")).data ?? [];

// The sections every case study needs, in order.
const caseStudySections = ["The problem", "My approach", "What I learned"];

describe("content files", () => {
  it("has a schema for every data file", () => {
    expect(files.toSorted()).toEqual(Object.keys(schemas).toSorted());
  });

  it.each(projects.flatMap((project) => project.screenshot?.src ?? []))(
    "%s exists in public/",
    (src) => {
      expect(existsSync(path.join(__dirname, "..", "public", src))).toBe(true);
    },
  );

  it.each(files)("%s matches its schema", (file) => {
    const result = schemas[file].safeParse(readJson(file));

    // Prettified so a failure reads as a list of fixes, not a stack of objects.
    expect(result.success ? "" : z.prettifyError(result.error)).toBe("");
  });

  it.each(projects.map((project) => project.id))(
    "projects/%s.mdx has every case study section",
    (id) => {
      const file = path.join(__dirname, "projects", `${id}.mdx`);
      expect(existsSync(file)).toBe(true);

      const headings = readFileSync(file, "utf8")
        .split("\n")
        .filter((line) => line.startsWith("## "))
        .map((line) => line.slice(3).trim());
      expect(headings).toEqual(caseStudySections);
    },
  );
});
