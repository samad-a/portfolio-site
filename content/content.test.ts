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

describe("content files", () => {
  it("has a schema for every data file", () => {
    expect(files.toSorted()).toEqual(Object.keys(schemas).toSorted());
  });

  it.each(
    projectListSchema
      .parse(
        JSON.parse(readFileSync(path.join(__dirname, "projects.json"), "utf8")),
      )
      .flatMap((project) =>
        project.screenshot ? [project.screenshot.src] : [],
      ),
  )("%s exists in public/", (src) => {
    expect(existsSync(path.join(__dirname, "..", "public", src))).toBe(true);
  });

  it.each(files)("%s matches its schema", (file) => {
    const data: unknown = JSON.parse(
      readFileSync(path.join(__dirname, file), "utf8"),
    );
    const result = schemas[file].safeParse(data);

    // Prettified so a failure reads as a list of fixes, not a stack of objects.
    expect(result.success ? "" : z.prettifyError(result.error)).toBe("");
  });
});
