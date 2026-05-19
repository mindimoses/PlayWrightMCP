import { test } from '@playwright/test';

test('Inspect login form structure', async ({ page }) => {
  const APP_URL = 'https://swa.mfs.tn.ofti.app:31102/payment/';
  
  // Navigate to application
  await page.goto(APP_URL, { waitUntil: 'networkidle' });

  // Wait a moment for page to fully load
  await page.waitForTimeout(2000);

  // Get all input fields with their attributes
  const inputs = await page.locator('input').all();
  console.log('\n=== INPUT FIELDS ===');
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const type = await input.getAttribute('type');
    const name = await input.getAttribute('name');
    const id = await input.getAttribute('id');
    const placeholder = await input.getAttribute('placeholder');
    const className = await input.getAttribute('class');
    console.log(`Input ${i}: type=${type}, name=${name}, id=${id}, placeholder=${placeholder}, class=${className}`);
  }

  // Get all buttons with their attributes
  const buttons = await page.locator('button').all();
  console.log('\n=== BUTTONS ===');
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const text = await button.innerText();
    const className = await button.getAttribute('class');
    const id = await button.getAttribute('id');
    const type = await button.getAttribute('type');
    console.log(`Button ${i}: text="${text}", type=${type}, id=${id}, class=${className}`);
  }

  // Get form elements
  const forms = await page.locator('form').all();
  console.log(`\n=== FORMS ===`);
  console.log(`Total forms: ${forms.length}`);
  for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    const id = await form.getAttribute('id');
    const className = await form.getAttribute('class');
    console.log(`Form ${i}: id=${id}, class=${className}`);
  }

  // Get all text/labels that might indicate login fields
  console.log('\n=== PAGE CONTENT ===');
  const body = await page.locator('body').innerText();
  console.log(body.substring(0, 1000)); // First 1000 chars

  // Take screenshot
  await page.screenshot({ path: 'login-form-inspect.png' });
  console.log('\n=== Screenshot saved to login-form-inspect.png ===');
});
