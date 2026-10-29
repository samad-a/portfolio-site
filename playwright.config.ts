import { defineConfig, devices } from "@playwright/test";

const port = 3000;

// Set in CI to test a deployed site, such as a Vercel preview, instead of a local build.
const deployedUrl = process.env.PLAYWRIGHT_BASE_URL;

// Vercel previews require sign-in. This header lets automated tests through.
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: deployedUrl ?? `http://localhost:${port}`,
    extraHTTPHeaders: bypassSecret
      ? {
          "x-vercel-protection-bypass": bypassSecret,
          "x-vercel-set-bypass-cookie": "true",
        }
      : undefined,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Without a deployed URL, tests run against a local production build,
  // the same as what Vercel serves.
  webServer: deployedUrl
    ? undefined
    : {
        command: `npm run build && npm run start -- --port ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
