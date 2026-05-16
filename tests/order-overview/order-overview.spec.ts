import { test, expect } from '@playwright/test';

test.describe('Order Overview', () => {
  async function proceedToOverview(page: any, items: string[] = ['sauce-labs-backpack']) {
    // Login
    await page.goto('https://www.saucedemo.com');
    await page.locator('input[data-test="username"]').fill('standard_user');
    await page.locator('input[data-test="password"]').fill('secret_sauce');
    await page.locator('input[data-test="login-button"]').click();

    // Add items to cart
    for (const item of items) {
      await page.locator(`button[data-test="add-to-cart-${item}"]`).click();
    }

    // Navigate to checkout
    await page.locator('a[data-test="shopping-cart-link"]').click();
    await page.locator('button[data-test="checkout"]').click();

    // Fill checkout form
    await page.locator('input[data-test="firstName"]').fill('John');
    await page.locator('input[data-test="lastName"]').fill('Doe');
    await page.locator('input[data-test="postalCode"]').fill('12345');

    // Proceed to overview
    await page.locator('input[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two/);
  }

  // test('TC-301: Order overview displays correct item details', async ({ page }) => {
  //   // Add Backpack and Bike Light to cart
  //   await proceedToOverview(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);

  //   // Verify item list section
  //   await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
  //   await expect(page.locator('[data-test="item-4-title-link"]')).toContainText('Sauce Labs Backpack');
    
  //   await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();
  //   await expect(page.locator('[data-test="item-0-title-link"]')).toContainText('Sauce Labs Bike Light');

  //   // Verify item descriptions are shown
  //   await expect(page.locator('[data-test="item-4-desc"]')).toBeVisible();
  //   await expect(page.locator('[data-test="item-0-desc"]')).toBeVisible();

  //   // Verify prices
  //   await expect(page.locator('text=$29.99')).toBeVisible();
  //   await expect(page.locator('text=$9.99')).toBeVisible();
  // });

  // test('TC-302: Order overview displays payment information', async ({ page }) => {
  //   await proceedToOverview(page);

  //   // Locate Payment Information section
  //   await expect(page.locator('text=Payment Information:')).toBeVisible();

  //   // Verify payment details
  //   await expect(page.locator('text=SauceCard #31337')).toBeVisible();
  // });

  test('TC-303: Order overview displays shipping information', async ({ page }) => {
    await proceedToOverview(page);

    // Locate Shipping Information section
    await expect(page.locator('text=Shipping Information:')).toBeVisible();

    // Verify shipping details
    await expect(page.locator('text=Free Pony Express Delivery!')).toBeVisible();
  });

  // test('TC-304: Order overview displays correct totals', async ({ page }) => {
  //   // Add Backpack and Bike Light: $29.99 + $9.99 = $39.98
  //   await proceedToOverview(page, ['sauce-labs-backpack', 'sauce-labs-bike-light']);

  //   // Verify item total
  //   await expect(page.locator('text=Item total: $39.98')).toBeVisible();

  //   // Verify tax calculation (approximately 8%)
  //   await expect(page.locator('text=/Tax: \$[0-9.]+/')).toBeVisible();

  //   // Verify total
  //   await expect(page.locator('text=/Total: \$[0-9.]+/')).toBeVisible();
  // });

  // test('TC-305: Order overview with single item', async ({ page }) => {
  //   // Add only Bolt T-Shirt to cart
  //   await proceedToOverview(page, ['sauce-labs-bolt-t-shirt']);

  //   // Verify single item is displayed
  //   await expect(page.locator('[data-test="item-1-title-link"]')).toBeVisible();
  //   await expect(page.locator('[data-test="item-1-title-link"]')).toContainText('Sauce Labs Bolt T-Shirt');

  //   // Verify price $15.99
  //   await expect(page.locator('text=$15.99')).toBeVisible();

  //   // Verify totals
  //   await expect(page.locator('text=Item total: $15.99')).toBeVisible();
  //   await expect(page.locator('text=/Tax: \$[0-9.]+/')).toBeVisible();
  //   await expect(page.locator('text=/Total: \$[0-9.]+/')).toBeVisible();
  // });

  // test('TC-306: Order overview with multiple items', async ({ page }) => {
  //   // Add 6 items to cart
  //   const items = [
  //     'sauce-labs-backpack',
  //     'sauce-labs-bike-light',
  //     'sauce-labs-bolt-t-shirt',
  //     'sauce-labs-fleece-jacket',
  //     'sauce-labs-onesie',
  //     'test.allthethings()-t-shirt-(red)'
  //   ];
    
  //   await page.goto('https://www.saucedemo.com');
  //   await page.locator('input[data-test="username"]').fill('standard_user');
  //   await page.locator('input[data-test="password"]').fill('secret_sauce');
  //   await page.locator('input[data-test="login-button"]').click();

  //   // Add items
  //   for (const item of items) {
  //     const selector = `button[data-test="add-to-cart-${item}"]`;
  //     const exists = await page.locator(selector).count() > 0;
  //     if (exists) {
  //       await page.locator(selector).click();
  //     }
  //   }

  //   // Navigate to overview
  //   await page.locator('a[data-test="shopping-cart-link"]').click();
  //   await page.locator('button[data-test="checkout"]').click();
  //   await page.locator('input[data-test="firstName"]').fill('John');
  //   await page.locator('input[data-test="lastName"]').fill('Doe');
  //   await page.locator('input[data-test="postalCode"]').fill('12345');
  //   await page.locator('input[data-test="continue"]').click();

  //   // Verify all items listed
  //   await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
  //   await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();

  //   // Verify totals are calculated
  //   await expect(page.locator('text=/Item total: \$[0-9.]+/')).toBeVisible();
  //   await expect(page.locator('text=/Tax: \$[0-9.]+/')).toBeVisible();
  //   await expect(page.locator('text=/Total: \$[0-9.]+/')).toBeVisible();
  // });

  // test('TC-307: Cancel from order overview', async ({ page }) => {
  //   await proceedToOverview(page);

  //   // Click Cancel button
  //   await page.locator('button[data-test="cancel"]').click();

  //   // Verify navigate back to cart page
  //   await expect(page).toHaveURL(/.*cart/);

  //   // Verify cart items remain
  //   await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');
  // });

  // test('TC-308: QTY column displays in overview', async ({ page }) => {
  //   await proceedToOverview(page);

  //   // Verify QTY column header is present
  //   await expect(page.locator('div:has-text("QTY")')).toBeVisible();

  //   // Verify quantity values are displayed
  //   await expect(page.locator('[data-test="item-quantity"]')).toBeVisible();
  // });

  // test('TC-309: Description column displays in overview', async ({ page }) => {
  //   await proceedToOverview(page);

  //   // Verify Description column header
  //   await expect(page.locator('div:has-text("Description")')).toBeVisible();

  //   // Verify item descriptions visible
  //   await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
  //   await expect(page.locator('[data-test="item-4-desc"]')).toBeVisible();
  // });

  test('TC-310: Finish button is enabled and clickable', async ({ page }) => {
    await proceedToOverview(page);

    // Verify Finish button is present
    await expect(page.locator('button[data-test="finish"]')).toBeVisible();

    // Verify Finish button is enabled
    await expect(page.locator('button[data-test="finish"]')).toBeEnabled();

    // Click Finish button
    await page.locator('button[data-test="finish"]').click();

    // Verify navigate to completion page
    await expect(page).toHaveURL(/.*checkout-complete/);
   });
});
