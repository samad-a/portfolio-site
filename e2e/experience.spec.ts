import { expect, test } from "@playwright/test";

test("press start scrolls to the experience cards", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "press start" }).click();

  const section = page.getByRole("region", { name: /experience/ });
  await expect(page).toHaveURL(/#experience$/);
  await expect(section).toBeInViewport();
  await expect(section.getByRole("article").first()).toBeVisible();
});
