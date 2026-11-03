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

test("the keyboard can swap day and night, and it's remembered", async ({
  page,
}) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const swap = page.getByRole("button", { name: "swap day and night" });
  await expect(swap).toBeFocused();
  await expect(swap).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(swap).toHaveAttribute("aria-pressed", "true");

  // Set before the page draws, so the night sky doesn't flash day first.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-sky-swap", "");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(243, 239, 255)");
});
