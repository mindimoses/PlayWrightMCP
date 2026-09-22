import { chromium } from '@playwright/test';

const LOGIN_URL = 'https://huawei-sp-portal.uat.oman/payment/login.action';
const USERNAME = process.env.PAYMENT_USERNAME || 'cduser07';
const PASSWORD = process.env.PAYMENT_PASSWORD || 'Wall12!@';
const VERIFICATION_CODE = process.env.PAYMENT_VERIFICATION_CODE || '1111';
const KEEP_BROWSER_OPEN = process.env.KEEP_BROWSER_OPEN === 'true';

async function login(): Promise<void> {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  try {
    await page.goto(LOGIN_URL, {
      waitUntil: 'domcontentloaded',
      timeout: 180000
    });

    await page.locator('#username').waitFor({ state: 'visible', timeout: 180000 });
    await page.locator('#username').fill(USERNAME);
    await page.locator('#password').fill(PASSWORD);
    await page.locator('#validate').fill(VERIFICATION_CODE);
    await page.locator('#submitBtn').click();
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 180000 });
    console.log(`Login button clicked. Current URL: ${page.url()}`);

    // Span transactions perform this action during execution.
    console.log('Processing span transactions...');
    try {
      // Use a more specific selector to avoid strict mode violations with multiple 'Transaction' elements
      const transactionMenu = page.locator('#horimenuContainer').getByText('Transaction', { exact: true }).first();
      await transactionMenu.waitFor({ state: 'visible', timeout: 10000 });
      await transactionMenu.click();
      console.log('Clicked on Transaction menu');
    } catch (e) {
      console.log('Could not find "Transaction" menu. Searching for alternatives...');
      const allLinks = await page.locator('a, span, div').allInnerTexts();
      console.log('Visible text on page:', allLinks.filter(t => t.trim().length > 0).join(', '));
      throw e;
    }

    if (KEEP_BROWSER_OPEN) {
      await new Promise<void>(() => undefined);
    }
  } finally {
    if (!KEEP_BROWSER_OPEN) {
      await browser.close();
    }
  }
}

login().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});