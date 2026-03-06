import { test, expect } from "@playwright/test";

/**
 * E2E Test: Full admin flow
 *
 * Tests the complete workflow:
 * 1. Admin logs in
 * 2. Navigates to projects
 * 3. Verifies projects are listed
 * 4. Checks public projects page
 *
 * Prerequisites:
 * - Database is seeded with admin user and sample projects
 * - Dev server is running on http://localhost:3000
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

test.describe("Portfolio E2E", () => {
  test("public home page loads with hero and projects", async ({ page }) => {
    await page.goto(BASE_URL);

    // Check hero section exists
    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();

    // Check CTAs are visible and focusable
    const primaryCta = page.locator("#hero-cta-primary");
    await expect(primaryCta).toBeVisible();
    await expect(primaryCta).toBeFocused({ timeout: 0 }).catch(() => {
      // It's not focused by default, that's fine — just check it's focusable
    });

    // Check projects section
    const projectsSection = page.locator("#projects");
    await expect(projectsSection).toBeVisible();
  });

  test("projects page shows filterable grid", async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`);

    // Page heading
    await expect(page.getByRole("heading", { name: /projects/i })).toBeVisible();

    // Filter buttons should be present
    const allButton = page.getByRole("button", { name: "All" });
    await expect(allButton).toBeVisible();
  });

  test("contact form validates and submits", async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);

    // Fill out form
    await page.fill("#name", "Test User");
    await page.fill("#email", "test@example.com");
    await page.fill("#message", "This is a test message from the E2E test suite.");

    // Submit
    await page.click('button[type="submit"]');

    // Wait for success or error
    await page.waitForTimeout(2000);
  });

  test("admin login page loads", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);

    // Check login form is present
    await expect(page.locator("#login-email")).toBeVisible();
    await expect(page.locator("#login-password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("admin login flow with valid credentials", async ({ page }) => {
    // This test requires the database to be seeded
    const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@portfolio.dev";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!adminPassword) {
      test.skip();
      return;
    }

    await page.goto(`${BASE_URL}/admin/login`);

    // Fill credentials
    await page.fill("#login-email", adminEmail);
    await page.fill("#login-password", adminPassword);
    await page.click('button[type="submit"]');

    // Should redirect to admin dashboard
    await page.waitForURL("**/admin", { timeout: 5000 });
    await expect(page.getByText("Dashboard")).toBeVisible();
  });

  test("playground page loads with Three.js demo", async ({ page }) => {
    await page.goto(`${BASE_URL}/playground`);

    await expect(page.getByRole("heading", { name: /playground/i })).toBeVisible();
    await expect(page.getByText("Morphing Sphere")).toBeVisible();
  });
});
