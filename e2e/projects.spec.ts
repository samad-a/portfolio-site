import { expect, test } from "@playwright/test";

test("a console's title opens its case study", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("region", { name: /projects/ })
    .getByRole("link", { name: "Blockr", exact: true })
    .click();

  await expect(page).toHaveURL(/\/projects\/blockr$/);
  await expect(page).toHaveTitle("Blockr · Samad Ali");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blockr");
  for (const section of ["The problem", "My approach", "What I learned"]) {
    await expect(
      page.getByRole("heading", { level: 2, name: section }),
    ).toBeVisible();
  }
});

test("an unknown project is a 404", async ({ page }) => {
  const response = await page.goto("/projects/not-a-project");
  expect(response?.status()).toBe(404);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("the arrows step through the consoles and wrap round", async ({
    page,
  }) => {
    await page.goto("/");
    const projects = page.getByRole("region", { name: /projects/ });
    const track = projects.getByRole("list");
    const scrollLeft = () => track.evaluate((list) => list.scrollLeft);

    await projects.getByRole("button", { name: "Next project" }).click();
    await expect.poll(scrollLeft).toBeGreaterThan(0);

    await projects.getByRole("button", { name: "Previous project" }).click();
    await expect.poll(scrollLeft).toBe(0);

    await projects.getByRole("button", { name: "Previous project" }).click();
    await expect.poll(scrollLeft).toBeGreaterThan(0);
  });
});
