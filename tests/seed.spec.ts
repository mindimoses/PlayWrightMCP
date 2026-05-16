import { test, expect } from '@playwright/test';

test.describe('Setup', () => {
  test('seed - Login and verify inventory page', async ({ page }) => {
    // Navigate to SauceDemo login page
    await page.goto('https://www.saucedemo.com');

    // Enter username in the username field
    await page.locator('input[data-test="username"]').fill('standard_user');

    // Enter password in the password field
    await page.locator('input[data-test="password"]').fill('secret_sauce');

    // Click the Login button to sign in
    await page.locator('input[data-test="login-button"]').click();

    // Verify logged in and on inventory page
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
  });
});
