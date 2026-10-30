import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// WCAG 2.2 A and AA, plus axe's best practices.
const tags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

async function violations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(tags)
    // The toolbar Vercel adds to preview deployments isn't part of the site.
    .exclude("vercel-live-feedback")
    .analyze();
  // Rule ids and the elements they flag, so a failure says what to fix.
  return violations.map(
    ({ id, nodes }) => `${id}: ${nodes.map((node) => node.target).join(", ")}`,
  );
}

const pages = [
  "/",
  "/projects/blockr",
  "/blog",
  "/blog/coming-soon",
  "/not-a-page",
];

// Animations stopped, so axe checks the page as it finally looks.
test.use({ reducedMotion: "reduce" });

for (const path of pages) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    expect(await violations(page)).toEqual([]);
  });
}

test("the contact form's errors have no violations", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "send" }).click();
  await expect(
    page.getByText("Please fix the highlighted fields."),
  ).toBeVisible();

  expect(await violations(page)).toEqual([]);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("the open menu has no violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "menu" }).click();

    expect(await violations(page)).toEqual([]);
  });
});
