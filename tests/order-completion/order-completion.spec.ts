import { test, expect } from '@playwright/test';

test.describe('Order Completion', () => {
  async function completeCheckout(page: any) {
    // Login
    await page.goto('https://www.saucedemo.com');
    await page.locator('input[data-test="username"]').fill('standard_user');
    await page.locator('input[data-test="password"]').fill('secret_sauce');
    await page.locator('input[data-test="login-button"]').click();

    // Add item to cart
    await page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Navigate to checkout
    await page.locator('a[data-test="shopping-cart-link"]').click();
    await page.locator('button[data-test="checkout"]').click();

    // Fill checkout form
    await page.locator('input[data-test="firstName"]').fill('John');
    await page.locator('input[data-test="lastName"]').fill('Doe');
    await page.locator('input[data-test="postalCode"]').fill('12345');

    // Proceed to overview
    await page.locator('input[data-test="continue"]').click();

    // Complete order
    await page.locator('button[data-test="finish"]').click();
    await expect(page).toHaveURL(/.*checkout-complete/);
  }

  test('TC-401: Order completion success message', async ({ page }) => {
    // Complete checkout
    await completeCheckout(page);

    // Verify page title
    await expect(page.locator('span:has-text("Checkout: Complete!")')).toBeVisible();

    // Verify success heading
    await expect(page.locator('h2:has-text("Thank you for your order!")')).toBeVisible();

    // Verify order message
    await expect(page.locator('text=Your order has been dispatched')).toBeVisible();
    await expect(page.locator('text=pony can get there')).toBeVisible();
  });

  test('TC-402: Order completion with pony image', async ({ page }) => {
    // Complete checkout
    await completeCheckout(page);

    // Verify pony image is present
    await expect(page.locator('img[alt="Pony Express"]')).toBeVisible();
  });

  test('TC-403: Back Home button redirects to inventory', async ({ page }) => {
    // Complete checkout
    await completeCheckout(page);

    // Click Back Home button
    await page.locator('button[data-test="back-to-products"]').click();

    // Verify navigate to inventory page
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
  });

  test('TC-404: Cart count resets after order completion', async ({ page }) => {
    // Complete checkout
    await completeCheckout(page);

    // Verify cart badge is reset
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    const badgeExists = await cartBadge.count() > 0;
    
    if (badgeExists) {
      // If badge exists, it should not be visible or show 0
      const isVisible = await cartBadge.isVisible();
      if (isVisible) {
        await expect(cartBadge).toContainText('0');
      }
    }

    // Click Back Home to go to inventory
    await page.locator('button[data-test="back-to-products"]').click();

    // Verify cart is empty
    const cartBadgeAfter = page.locator('[data-test="shopping-cart-badge"]');
    const badgeExistsAfter = await cartBadgeAfter.count() > 0;
    if (badgeExistsAfter) {
      await expect(cartBadgeAfter).not.toBeVisible();
    }
  });

  test('TC-405: User can checkout again after order completion', async ({ page }) => {
    // Complete checkout
    await completeCheckout(page);

    // Click Back Home
    await page.locator('button[data-test="back-to-products"]').click();

    // Add new items to cart
    await page.locator('button[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Verify items added
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');

    // Navigate to checkout
    await page.locator('a[data-test="shopping-cart-link"]').click();
    await page.locator('button[data-test="checkout"]').click();

    // Verify checkout form is fresh (empty)
    await expect(page.locator('input[data-test="firstName"]')).toHaveValue('');
    await expect(page.locator('input[data-test="lastName"]')).toHaveValue('');
    await expect(page.locator('input[data-test="postalCode"]')).toHaveValue('');

    // Complete another order
    await page.locator('input[data-test="firstName"]').fill('Jane');
    await page.locator('input[data-test="lastName"]').fill('Smith');
    await page.locator('input[data-test="postalCode"]').fill('54321');
    await page.locator('input[data-test="continue"]').click();
    await page.locator('button[data-test="finish"]').click();

    // Verify successful completion
    await expect(page).toHaveURL(/.*checkout-complete/);
    await expect(page.locator('h2:has-text("Thank you for your order!")')).toBeVisible();
  });

  test('TC-406: Order completion page elements are displayed', async ({ page }) => {
    // Complete checkout
    await completeCheckout(page);

    // Verify all UI elements are present
    await expect(page.locator('span:has-text("Checkout: Complete!")')).toBeVisible();
    await expect(page.locator('h2:has-text("Thank you for your order!")')).toBeVisible();
    await expect(page.locator('text=Your order has been dispatched')).toBeVisible();
    await expect(page.locator('img[alt="Pony Express"]')).toBeVisible();
    await expect(page.locator('button[data-test="back-to-products"]')).toBeVisible();
  });
});
