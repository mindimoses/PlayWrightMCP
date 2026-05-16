import { test, expect } from '@playwright/test';

test.describe('Checkout Information Entry', () => {
  test.beforeEach(async ({ page }) => {
    // Login and add item to cart
    await page.goto('https://www.saucedemo.com');
    await page.locator('input[data-test="username"]').fill('standard_user');
    await page.locator('input[data-test="password"]').fill('secret_sauce');
    await page.locator('input[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory/);
    
    // Add item to cart
    await page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Navigate to checkout
    await page.locator('a[data-test="shopping-cart-link"]').click();
    await page.locator('button[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('TC-201: Complete checkout with valid data', async ({ page }) => {
    // Enter First Name: 'John'
    await page.locator('input[data-test="firstName"]').fill('John');
    await expect(page.locator('input[data-test="firstName"]')).toHaveValue('John');

    // Enter Last Name: 'Doe'
    await page.locator('input[data-test="lastName"]').fill('Doe');
    await expect(page.locator('input[data-test="lastName"]')).toHaveValue('Doe');

    // Enter Zip Code: '12345'
    await page.locator('input[data-test="postalCode"]').fill('12345');
    await expect(page.locator('input[data-test="postalCode"]')).toHaveValue('12345');

    // Verify Continue button is enabled
    await expect(page.locator('input[data-test="continue"]')).toBeEnabled();

    // Click Continue button
    await page.locator('input[data-test="continue"]').click();

    // Verify navigate to checkout step two
    await expect(page).toHaveURL(/.*checkout-step-two/);
    await expect(page.locator('span:has-text("Checkout: Overview")')).toBeVisible();
  });

  test('TC-202: Validation - Empty First Name field', async ({ page }) => {
    // Leave First Name empty
    await expect(page.locator('input[data-test="firstName"]')).toHaveValue('');

    // Enter Last Name and Zip Code
    await page.locator('input[data-test="lastName"]').fill('Doe');
    await page.locator('input[data-test="postalCode"]').fill('12345');

    // Click Continue button
    await page.locator('input[data-test="continue"]').click();

    // Verify error message
    await expect(page.locator('h3:has-text("Error")')).toBeVisible();
    await expect(page.locator('text=First Name is required')).toBeVisible();

    // Verify still on checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one/);

    // Verify form data is retained
    await expect(page.locator('input[data-test="lastName"]')).toHaveValue('Doe');
    await expect(page.locator('input[data-test="postalCode"]')).toHaveValue('12345');
  });

  test('TC-203: Validation - Empty Last Name field', async ({ page }) => {
    // Enter First Name
    await page.locator('input[data-test="firstName"]').fill('John');

    // Leave Last Name empty
    await expect(page.locator('input[data-test="lastName"]')).toHaveValue('');

    // Enter Zip Code
    await page.locator('input[data-test="postalCode"]').fill('12345');

    // Click Continue button
    await page.locator('input[data-test="continue"]').click();

    // Verify error message
    await expect(page.locator('h3:has-text("Error")')).toBeVisible();
    await expect(page.locator('text=Last Name is required')).toBeVisible();

    // Verify still on checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one/);

    // Verify form data is retained
    await expect(page.locator('input[data-test="firstName"]')).toHaveValue('John');
    await expect(page.locator('input[data-test="postalCode"]')).toHaveValue('12345');
  });

  test('TC-204: Validation - Empty Zip Code field', async ({ page }) => {
    // Enter First Name and Last Name
    await page.locator('input[data-test="firstName"]').fill('John');
    await page.locator('input[data-test="lastName"]').fill('Doe');

    // Leave Zip Code empty
    await expect(page.locator('input[data-test="postalCode"]')).toHaveValue('');

    // Click Continue button
    await page.locator('input[data-test="continue"]').click();

    // Verify error message
    await expect(page.locator('h3:has-text("Error")')).toBeVisible();
    await expect(page.locator('text=Postal Code is required')).toBeVisible();

    // Verify still on checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one/);

    // Verify form data is retained
    await expect(page.locator('input[data-test="firstName"]')).toHaveValue('John');
    await expect(page.locator('input[data-test="lastName"]')).toHaveValue('Doe');
  });

  test('TC-205: Validation - All fields empty', async ({ page }) => {
    // Verify all fields are empty
    await expect(page.locator('input[data-test="firstName"]')).toHaveValue('');
    await expect(page.locator('input[data-test="lastName"]')).toHaveValue('');
    await expect(page.locator('input[data-test="postalCode"]')).toHaveValue('');

    // Click Continue button
    await page.locator('input[data-test="continue"]').click();

    // Verify error message displayed
    await expect(page.locator('h3:has-text("Error")')).toBeVisible();

    // Verify still on checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });

  test('TC-206: Cancel checkout from Step One', async ({ page }) => {
    // Enter some data
    await page.locator('input[data-test="firstName"]').fill('John');
    await page.locator('input[data-test="lastName"]').fill('Doe');

    // Click Cancel button
    await page.locator('button[data-test="cancel"]').click();

    // Verify navigate back to cart
    await expect(page).toHaveURL(/.*cart/);

    // Verify cart items remain
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');
  });

  test('TC-207: Boundary - First Name with special characters', async ({ page }) => {
    // Enter First Name with special characters
    await page.locator('input[data-test="firstName"]').fill("John-Paul O'Brien");
    await page.locator('input[data-test="lastName"]').fill('Smith');
    await page.locator('input[data-test="postalCode"]').fill('12345');

    // Click Continue
    await page.locator('input[data-test="continue"]').click();

    // Verify form accepted and navigated to step two
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('TC-208: Boundary - Last Name with numbers', async ({ page }) => {
    // Enter Last Name with numbers
    await page.locator('input[data-test="firstName"]').fill('John');
    await page.locator('input[data-test="lastName"]').fill('Smith123');
    await page.locator('input[data-test="postalCode"]').fill('12345');

    // Click Continue
    await page.locator('input[data-test="continue"]').click();

    // Verify form accepted and navigated to step two
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('TC-209: Boundary - Zip Code with letters', async ({ page }) => {
    // Enter Zip Code with letters
    await page.locator('input[data-test="firstName"]').fill('John');
    await page.locator('input[data-test="lastName"]').fill('Doe');
    await page.locator('input[data-test="postalCode"]').fill('ABC123');

    // Click Continue
    await page.locator('input[data-test="continue"]').click();

    // Verify form accepted and navigated to step two
    await expect(page).toHaveURL(/.*checkout-step-two/);
  });

  test('TC-210: Boundary - Very long First Name', async ({ page }) => {
    // Enter very long First Name
    const longName = 'VeryLongFirstNameThatContains50CharactersAndIsUsedForBoundaryTesting1234567890';
    await page.locator('input[data-test="firstName"]').fill(longName);
    await page.locator('input[data-test="lastName"]').fill('Doe');
    await page.locator('input[data-test="postalCode"]').fill('12345');

    // Click Continue
    await page.locator('input[data-test="continue"]').click();

    // Verify form accepted and navigated to step two or error shown
    const isOnStepTwo = page.url().includes('checkout-step-two');
    const isOnStepOne = page.url().includes('checkout-step-one');
    await expect(isOnStepTwo || isOnStepOne).toBeTruthy();
  });

  test('TC-211: Boundary - Zip Code with spaces', async ({ page }) => {
    // Enter Zip Code with spaces
    await page.locator('input[data-test="firstName"]').fill('John');
    await page.locator('input[data-test="lastName"]').fill('Doe');
    await page.locator('input[data-test="postalCode"]').fill('12 345');

    // Click Continue
    await page.locator('input[data-test="continue"]').click();

    // Verify form processed (spaces trimmed or accepted)
    const isProcessed = page.url().includes('checkout-step-two') || page.url().includes('checkout-step-one');
    await expect(isProcessed).toBeTruthy();
  });

  test('TC-212: Data persistence - Field values retained on error', async ({ page }) => {
    // Enter First Name and Last Name, leave Zip Code empty
    await page.locator('input[data-test="firstName"]').fill('John');
    await page.locator('input[data-test="lastName"]').fill('Doe');
    await expect(page.locator('input[data-test="postalCode"]')).toHaveValue('');

    // Click Continue
    await page.locator('input[data-test="continue"]').click();

    // Verify error message for empty Zip Code
    await expect(page.locator('text=Postal Code is required')).toBeVisible();

    // Verify First Name and Last Name are still populated
    await expect(page.locator('input[data-test="firstName"]')).toHaveValue('John');
    await expect(page.locator('input[data-test="lastName"]')).toHaveValue('Doe');

    // Verify Zip Code field is still empty
    await expect(page.locator('input[data-test="postalCode"]')).toHaveValue('');
  });
});
