import { expect, test } from "@playwright/test";

test("the homepage's dev log leads to a post", async ({ page }) => {
  await page.goto("/");

  const devLog = page.getByRole("region", { name: /dev log/ });
  const firstPost = devLog.getByRole("article").first();
  const title = await firstPost.getByRole("heading").textContent();
  await firstPost.getByRole("link").click();

  await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title!);
  await expect(page.locator("article time").first()).toHaveAttribute(
    "datetime",
    /^\d{4}-\d{2}-\d{2}$/,
  );
  await expect(page.getByText(/\d+ min read/).first()).toBeVisible();
});

test("the dev log lists every post and links to the feed", async ({ page }) => {
  await page.goto("/blog");

  await expect(
    page.getByRole("heading", { level: 1, name: /dev log/ }),
  ).toBeVisible();
  await expect(page.getByRole("article").first()).toBeVisible();
  await expect(
    page.locator('link[rel="alternate"][type="application/rss+xml"]'),
  ).toHaveAttribute("href", /\/blog\/rss\.xml$/);
});

test("the RSS feed is valid XML with an item per post", async ({ page }) => {
  const response = await page.request.get("/blog/rss.xml");

  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  const xml = await response.text();
  expect(xml).toMatch(/^<\?xml/);
  expect(xml).toContain("<item>");
});

test("an unknown post is a 404", async ({ page }) => {
  const response = await page.goto("/blog/not-a-post");
  expect(response?.status()).toBe(404);
});
