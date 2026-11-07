import { expect, test } from "@playwright/test";

// Production builds never enable demo auth, so protected routes redirect to sign-in.
test("unauthenticated users are sent to sign-in", async ({ page }) => {
  await page.goto("/orders");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
