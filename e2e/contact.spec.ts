import { expect, test } from "@playwright/test";

// Only checks validation, so previews never send real email.
test("the contact form points out what's missing", async ({ page }) => {
  await page.goto("/#contact");
  const contact = page.getByRole("region", { name: "get in touch!" });

  await contact.getByLabel("your name").fill("Playwright");
  await contact.getByLabel("your email").fill("not-an-email");
  await contact.getByRole("button", { name: "send" }).click();

  await expect(contact.getByRole("alert")).toHaveText(
    "Please fix the highlighted fields.",
  );
  const email = contact.getByLabel("your email");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription(
    "Enter a valid email address, like name@example.com.",
  );
  await expect(email).toHaveValue("not-an-email");
  await expect(contact.getByLabel("your name")).toHaveValue("Playwright");
  await expect(contact.getByLabel("message")).toHaveAccessibleDescription(
    "Write a message.",
  );
});

test("the footer sits at the bottom of every page", async ({ page }) => {
  for (const path of ["/", "/projects/blockr"]) {
    await page.goto(path);
    await expect(page.getByRole("contentinfo")).toContainText("Samad Ali");
  }
});
