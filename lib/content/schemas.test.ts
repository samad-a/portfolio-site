import { describe, expect, it } from "vitest";
import {
  experienceListSchema,
  experienceSchema,
  projectSchema,
  skillListSchema,
} from "./schemas";

const role = {
  id: "intern",
  role: "Intern",
  org: "Somewhere",
  location: "Edinburgh",
  start: "2025-05",
  end: "2025-09",
  highlights: ["Built things."],
};

const project = {
  id: "thing",
  name: "Thing",
  summary: "Does a thing.",
  stack: ["TypeScript"],
  highlights: ["Shipped it."],
  colour: "red",
};

function messages(result: { error?: { issues: { message: string }[] } }) {
  return result.error?.issues.map((issue) => issue.message) ?? [];
}

describe("experienceSchema", () => {
  it("accepts a complete role", () => {
    expect(experienceSchema.safeParse(role).success).toBe(true);
  });

  it("accepts a role with no end date", () => {
    expect(
      experienceSchema.safeParse({ ...role, end: undefined }).success,
    ).toBe(true);
  });

  it("rejects a badly written month", () => {
    const result = experienceSchema.safeParse({ ...role, start: "May 2025" });
    expect(messages(result)).toEqual(['Use a month like "2026-05"']);
  });

  it("rejects a role that ends before it starts", () => {
    const result = experienceSchema.safeParse({ ...role, end: "2024-01" });
    expect(messages(result)).toEqual(["Ends before it starts"]);
  });

  it("rejects a misspelt field", () => {
    const { highlights, ...rest } = role;
    const result = experienceSchema.safeParse({
      ...rest,
      higlights: highlights,
    });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate ids in a list", () => {
    const result = experienceListSchema.safeParse([role, role]);
    expect(messages(result)).toEqual(['Duplicate id "intern"']);
  });
});

describe("projectSchema", () => {
  it("accepts a project without links", () => {
    expect(projectSchema.parse(project).links).toEqual({});
  });

  it("rejects a colour the theme doesn't have", () => {
    expect(
      projectSchema.safeParse({ ...project, colour: "blue" }).success,
    ).toBe(false);
  });

  it("rejects a link that isn't a URL", () => {
    const result = projectSchema.safeParse({
      ...project,
      links: { code: "github.com/me/thing" },
    });
    expect(result.success).toBe(false);
  });
});

describe("skillListSchema", () => {
  it("rejects the same skill twice, ignoring case", () => {
    const result = skillListSchema.safeParse([
      { name: "React", category: "framework" },
      { name: "react", category: "framework" },
    ]);
    expect(messages(result)).toEqual(['Duplicate skill "react"']);
  });

  it("rejects an unknown category", () => {
    const result = skillListSchema.safeParse([
      { name: "Git", category: "tools" },
    ]);
    expect(result.success).toBe(false);
  });
});
