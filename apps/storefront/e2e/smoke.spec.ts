import { expect, test } from "@playwright/test";

test("storefront home renders the shell and catalog", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Gifts made for them" })).toBeVisible();
});

test("unknown routes show the not-found state", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
