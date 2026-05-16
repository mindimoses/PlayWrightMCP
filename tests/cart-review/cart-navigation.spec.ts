import { test, expect } from '@playwright/test';

test.describe('Cart Review and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('https://www.saucedemo.com');
    await page.locator('input[data-test="username"]').fill('standard_user');
    await page.locator('input[data-test="password"]').fill('secret_sauce');
    await page.locator('input[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('TC-101: View single item in cart', async ({ page }) => {
    // Add Sauce Labs Backpack to cart
    await page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Verify cart badge shows 1
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');

    // Click shopping cart icon
    await page.locator('a[data-test="shopping-cart-link"]').click();

    // Verify on cart page
    await expect(page).toHaveURL(/.*cart/);
    await expect(page.locator('span:has-text("Your Cart")')).toBeVisible();

    // Verify Backpack item is displayed
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-4-title-link"]')).toContainText('Sauce Labs Backpack');

    // Verify price
    await expect(page.locator('[data-test="inventory-item-price"]')).toContainText('$29.99');

    // Verify cart columns are present
    await expect(page.locator('[data-test="cart-quantity-label"]')).toBeVisible();
    await expect(page.locator('[data-test="cart-desc-label"]')).toBeVisible();

    // Verify action buttons
    await expect(page.locator('button[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('button[data-test="checkout"]')).toBeVisible();
  });

  test('TC-102: View multiple items in cart', async ({ page }) => {
    // Add 3 items to cart: Backpack, Bike Light, Bolt T-Shirt
    await page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('button[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('button[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    // Verify cart badge shows 3
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('3');

    // Navigate to cart
    await page.locator('a[data-test="shopping-cart-link"]').click();

    // Verify all 3 items displayed
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-1-title-link"]')).toBeVisible();

    // Verify prices
    await expect(page.locator('text=$29.99')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();
    await expect(page.locator('text=$15.99')).toBeVisible();

    // Verify item descriptions are present
    await expect(page.locator('[data-test="item-4-title-link"]')).toContainText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="item-0-title-link"]')).toContainText('Sauce Labs Bike Light');
    await expect(page.locator('[data-test="item-1-title-link"]')).toContainText('Sauce Labs Bolt T-Shirt');
  });

  test('TC-103: Remove item from cart', async ({ page }) => {
    // Add 2 items to cart
    await page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('button[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Verify cart badge shows 2
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('2');

    // Navigate to cart
    await page.locator('a[data-test="shopping-cart-link"]').click();

    // Verify both items are displayed
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();

    // Click Remove button for first item
    await page.locator('button[data-test="remove-sauce-labs-backpack"]').click();

    // Verify only one item remains
    await expect(page.locator('[data-test="item-4-title-link"]')).not.toBeVisible();
    await expect(page.locator('[data-test="item-0-title-link"]')).toBeVisible();

    // Verify cart badge updates to 1
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');
  });

  test('TC-104: Continue shopping from cart', async ({ page }) => {
    // Add items to cart
    await page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Navigate to cart
    await page.locator('a[data-test="shopping-cart-link"]').click();

    // Click Continue Shopping button
    await page.locator('button[data-test="continue-shopping"]').click();

    // Verify navigate back to inventory page
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();

    // Verify cart items remain
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');
  });

  test('TC-105: Navigate to checkout from cart', async ({ page }) => {
    // Add items to cart
    await page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Navigate to cart
    await page.locator('a[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart/);

    // Click Checkout button
    await page.locator('button[data-test="checkout"]').click();

    // Verify navigate to checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one/);
    await expect(page.locator('span:has-text("Checkout: Your Information")')).toBeVisible();

    // Verify form fields are displayed
    await expect(page.locator('input[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('input[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('input[data-test="postalCode"]')).toBeVisible();
  });
});
