import { test, expect } from "@playwright/test";
import { register, login, createItem } from "./helpers";

test.describe("Happy Path", () => {
  test("register → login → create item → view details → logout", async ({
    page,
  }) => {
    // 1. Register
    const creds = await register(page);

    // 2. Logout and login again (to test both flows)
    await page.goto("/logout");
    await page.waitForURL(/\/login/);
    await login(page, creds.email, creds.password);

    // 3. Verify authenticated — user email visible
    await expect(page.getByText(creds.email)).toBeVisible();

    // 4. Create an item
    const { title } = await createItem(page);

    // 5. Verify on item detail page
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.getByText("Zgubione")).toBeVisible();

    // 6. Navigate to items list and find the item
    await page.goto("/items?type=lost&view=list&page=1");
    await expect(page.getByText(title)).toBeVisible();

    // 7. Logout
    await page.goto("/logout");
    await page.waitForURL(/\/login/);

    // 8. Verify logged out — should see login button
    await expect(
      page.getByRole("link", { name: "Zaloguj się" }),
    ).toBeVisible();
  });
});
