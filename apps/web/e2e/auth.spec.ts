import { test, expect } from "@playwright/test";
import { register, login, uniqueEmail } from "./helpers";

test.describe("Authentication", () => {
  test("register a new user", async ({ page }) => {
    const creds = await register(page);

    // Should be on the home page after registration
    await expect(page).toHaveURL("/");
  });

  test("login with registered user", async ({ page }) => {
    // First register
    const creds = await register(page);

    // Logout by navigating to logout
    await page.goto("/logout");
    await page.waitForURL(/\/login/);

    // Login with the same credentials
    await login(page, creds.email, creds.password);

    // Should be on home page
    await expect(page).toHaveURL("/");

    // Should see user email in the header menu
    await expect(page.getByText(creds.email).first()).toBeVisible();
  });

  test("show validation errors for invalid input", async ({ page }) => {
    await page.goto("/register");

    // Submit empty form
    await page.locator('button[type="submit"]').click();

    // Should show validation errors
    await expect(page.getByText("Nieprawidłowy email")).toBeVisible();
    await expect(page.getByText("Hasło jest wymagane")).toBeVisible();
  });
});
