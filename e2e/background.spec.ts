import { expect, test } from "@playwright/test";

test("the sky canvas runs behind the page without errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("html")).toHaveAttribute("data-sky", "canvas");
  // The night section lets the canvas's starry sky show through.
  await expect(page.locator("#contact")).toHaveCSS("background-image", "none");

  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  expect(errors).toEqual([]);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing on the page animates", async ({ page }) => {
    await page.goto("/");

    const animated = await page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length,
    );
    expect(animated).toBe(0);
  });
});
