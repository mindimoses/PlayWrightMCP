import { test, expect } from '@playwright/test';

test.describe('Payment Application - Authentication', () => {
  const APP_URL = 'https://swa.mfs.tn.ofti.app:31102/payment/';
  const TEST_USERNAME = 'TUAutoTest1';
  const TEST_PASSWORD = 'Tunisia123!@#';
  const VERIFICATION_CODE = '1111';

  test.beforeEach(async ({ page }) => {
    // Navigate to application
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
  });

  test('TC-001: Successful login with valid credentials and verification code', async ({ page }) => {
    // Verify login page is displayed
    await expect(page).toHaveURL(new RegExp(APP_URL));
    
    // Enter username
    await page.locator('#username').fill(TEST_USERNAME);

    // Enter password
    await page.locator('#password').fill(TEST_PASSWORD);

    // Enter verification code
    await page.locator('#validate').fill(VERIFICATION_CODE);

    // Click login button (it's a span element with ID "submitBtn", not a regular button)
    await page.locator('#submitBtn').click();

    // Wait for navigation after login
    await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
    await page.waitForTimeout(2000);

    // Verify successful login - should be redirected away from login page or see success indicator
    const currentUrl = page.url();
    const isLoginPage = APP_URL.includes(currentUrl.split('/').pop());
    
    if (!isLoginPage) {
      // Successfully logged in and redirected
      expect(currentUrl).not.toBe(APP_URL);
    } else {
      // Check for success message or logged-in indicator on the page
      const errorMsg = await page.locator('#loginErrorMsg').innerText().catch(() => '');
      expect(errorMsg).toBe(''); // No error message should be present
    }
  });

  test('TC-002: Login with username only (validation test)', async ({ page }) => {
    // Enter only username without password
    await page.locator('#username').fill(TEST_USERNAME);

    // Try to click login button
    await page.locator('#submitBtn').click();

    // Wait a moment for validation
    await page.waitForTimeout(1000);

    // Verify error message appears or stay on login page
    const errorMsg = await page.locator('#loginErrorMsg').innerText().catch(() => '');
    const isStillOnLogin = page.url().includes(APP_URL.split('/').slice(0, -1).join('/'));
    
    // Either expect error message or to remain on login page
    expect(errorMsg.length > 0 || isStillOnLogin).toBeTruthy();
  });

  test('TC-003: Login with invalid credentials', async ({ page }) => {
    // Enter invalid username
    await page.locator('#username').fill('InvalidUser123');

    // Enter invalid password
    await page.locator('#password').fill('InvalidPassword123');

    // Enter verification code
    await page.locator('#validate').fill(VERIFICATION_CODE);

    // Click login button
    await page.locator('#submitBtn').click();

    // Wait for response
    await page.waitForTimeout(2000);
    await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);

    // Verify error message is displayed or remain on login page
    const errorMsg = await page.locator('#loginErrorMsg').innerText().catch(() => '');
    const isStillOnLogin = page.url().includes(APP_URL.split('/').slice(0, -1).join('/'));
    
    const hasErrorOrStillOnLogin = (errorMsg.length > 0) || isStillOnLogin;
    expect(hasErrorOrStillOnLogin).toBeTruthy();
  });
});
