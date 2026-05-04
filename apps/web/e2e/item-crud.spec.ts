import { test, expect } from "@playwright/test";
import { register, createItem } from "./helpers";

test.describe("Item CRUD", () => {
  test("create and view an item", async ({ page }) => {
    await register(page);
    const { title } = await createItem(page);

    // Should be on the item detail page
    await expect(page.getByRole("heading", { name: title })).toBeVisible();

    // Should show the "Zgubione" badge (lost type)
    await expect(page.getByRole("main").getByText("Zgubione", { exact: true })).toBeVisible();
  });

  test("delete own item", async ({ page }) => {
    await register(page);
    const { title } = await createItem(page);

    // Should be on item detail page — click delete
    await page.getByRole("button", { name: "Usuń" }).click();

    // Confirm in the modal dialog
    await expect(page.getByText("Czy na pewno chcesz usunąć to ogłoszenie?")).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "Usuń" }).click();

    // Should redirect to account items page
    await page.waitForURL(/\/account\/items/);

    // The item should not be in the list
    await expect(page.getByText(title)).not.toBeVisible();
  });
});
