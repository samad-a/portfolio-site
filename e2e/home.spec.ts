import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle("Samad Ali");
  await expect(page.getByRole("main")).toBeAttached();
});

test("the CV button downloads a PDF", async ({ page }) => {
  await page.goto("/");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "save file (CV)" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("Samad-Ali-CV.pdf");
  const response = await page.request.get("/Samad-Ali-CV.pdf");
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();

  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("the homepage makes no failing or wasted requests", async ({ page }) => {
  const problems: string[] = [];
  page.on("request", (request) => {
    // A page prefetch of a file, such as the CV, which isn't a page.
    const { pathname } = new URL(request.url());
    if (request.headers()["rsc"] && /\.\w+$/.test(pathname)) {
      problems.push(`prefetched ${pathname} as a page`);
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      problems.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });
  // Links prefetch their pages once they've been on screen for a moment.
  await page.waitForTimeout(1500);

  expect(problems).toEqual([]);
});
