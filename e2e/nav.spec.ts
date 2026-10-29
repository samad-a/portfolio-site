import { expect, test } from "@playwright/test";

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("the menu replaces the row of clouds", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });

    await expect(nav.getByRole("link", { name: "experience" })).toBeHidden();

    await nav.getByRole("button", { name: "menu" }).click();
    await nav.getByRole("link", { name: "projects" }).click();

    await expect(page).toHaveURL(/#projects$/);
    await expect(nav.getByRole("button", { name: "menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

test("on a desktop the clouds link straight to each section", async ({
  page,
}) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });

  await expect(nav.getByRole("button", { name: "menu" })).toBeHidden();
  for (const label of ["experience", "skills", "projects", "contact"]) {
    await expect(nav.getByRole("link", { name: label })).toBeVisible();
  }
});
