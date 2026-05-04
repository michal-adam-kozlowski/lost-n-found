import { type Page, expect } from "@playwright/test";

/**
 * Generate a unique email for test isolation.
 */
export function uniqueEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
}

const TEST_PASSWORD = "TestPassword123!";

/**
 * Register a new user and return the credentials.
 */
export async function register(
  page: Page,
): Promise<{ email: string; password: string }> {
  const email = uniqueEmail();

  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Hasło", { exact: true }).fill(TEST_PASSWORD);
  await page.getByLabel("Potwierdź hasło").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Zarejestruj się" }).click();

  // Wait for redirect to home page after successful registration
  await page.waitForURL("/");

  return { email, password: TEST_PASSWORD };
}

/**
 * Log in with existing credentials.
 */
export async function login(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Hasło", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Zaloguj się" }).click();

  // Wait for redirect to home page after successful login
  await page.waitForURL("/");
}

/**
 * Create a lost item via the UI. Assumes user is already logged in.
 * Returns the item title for later assertions.
 */
export async function createItem(
  page: Page,
): Promise<{ title: string }> {
  const title = `Test item ${Date.now()}`;

  await page.goto("/add");

  // Select type: "Zgubiłem rzecz" (lost)
  await page.getByText("Zgubiłem rzecz").click();

  // Fill title
  await page.getByLabel("Tytuł ogłoszenia").fill(title);

  // Select first available category (wait for options to load from API)
  await page.getByLabel("Kategoria").click();
  await page.getByRole("option").first().waitFor({ state: "visible" });
  await page.getByRole("option").first().click();

  // Submit
  await page.getByRole("button", { name: "Dodaj ogłoszenie" }).click();

  // Wait for redirect to the item detail page
  await page.waitForURL(/\/items\/.+/);

  return { title };
}
