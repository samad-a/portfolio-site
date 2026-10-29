import { expect, test } from "@playwright/test";

test("tabbing to a skill shows its details", async ({ page }) => {
  await page.goto("/");
  const skills = page.getByRole("region", { name: /skills/ });
  const typescript = skills.getByRole("button", { name: "TypeScript" });

  await typescript.focus();

  await expect(typescript).toBeFocused();
  await expect(typescript).toHaveAttribute("data-active", "true");
  await expect(typescript).toHaveAccessibleDescription(/used in Blockr/);
  await expect(
    skills.getByText("language · used in Blockr").filter({ visible: true }),
  ).toBeVisible();
});
