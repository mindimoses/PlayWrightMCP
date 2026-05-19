const { chromium } = require('playwright');

async function inspectForm() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to application...');
    await page.goto('https://swa.mfs.tn.ofti.app:31102/payment/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Inspect all inputs
    console.log('\n=== INPUT FIELDS ===');
    const inputData = await page.locator('input').evaluateAll(inputs => 
      inputs.map(input => ({
        type: input.getAttribute('type'),
        name: input.getAttribute('name'),
        id: input.getAttribute('id'),
        placeholder: input.getAttribute('placeholder'),
        class: input.getAttribute('class'),
        visible: input.offsetParent !== null
      }))
    );
    console.log(JSON.stringify(inputData, null, 2));

    // Inspect all buttons
    console.log('\n=== BUTTONS ===');
    const buttonData = await page.locator('button').evaluateAll(buttons =>
      buttons.map(button => ({
        text: button.innerText,
        type: button.getAttribute('type'),
        id: button.getAttribute('id'),
        class: button.getAttribute('class'),
        visible: button.offsetParent !== null
      }))
    );
    console.log(JSON.stringify(buttonData, null, 2));

    // Inspect forms
    console.log('\n=== FORMS ===');
    const formData = await page.locator('form').evaluateAll(forms =>
      forms.map(form => ({
        id: form.getAttribute('id'),
        class: form.getAttribute('class'),
        method: form.getAttribute('method'),
        action: form.getAttribute('action')
      }))
    );
    console.log(JSON.stringify(formData, null, 2));

    // Take screenshot
    await page.screenshot({ path: 'login-form-inspection.png' });
    console.log('\n✓ Screenshot saved to: login-form-inspection.png');

    // Get page HTML snippet
    console.log('\n=== PAGE HTML (first form) ===');
    const formHtml = await page.locator('form').first().innerHTML().catch(() => 'No form found');
    console.log(formHtml.substring(0, 2000));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

inspectForm();
