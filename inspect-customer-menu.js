const { chromium } = require('playwright');

async function inspectMenuAndFields() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    const APP_URL = 'https://swa.mfs.tn.ofti.app:31102/payment/';
    const TEST_USERNAME = 'TUAutoTest1';
    const TEST_PASSWORD = 'Tunisia123!@#';
    const VERIFICATION_CODE = '1111';

    console.log('Navigating to application...');
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Login
    console.log('Logging in...');
    await page.locator('#username').fill(TEST_USERNAME);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.locator('#validate').fill(VERIFICATION_CODE);
    await page.locator('#submitBtn').click();

    // Wait for home page
    console.log('Waiting for home page...');
    await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
    await page.waitForTimeout(2000);

    // Find the Customer menu item
    console.log('\n=== CUSTOMER MENU STRUCTURE ===');
    const customerMenuInfo = await page.evaluate(() => {
      const customerLi = document.getElementById('c_20004');
      if (customerLi) {
        return {
          tag: customerLi.tagName,
          text: customerLi.innerText,
          class: customerLi.getAttribute('class'),
          id: customerLi.getAttribute('id'),
          parent: customerLi.parentElement?.getAttribute('class'),
          parentId: customerLi.parentElement?.getAttribute('id'),
          parentText: customerLi.parentElement?.innerText?.substring(0, 100)
        };
      }
      return null;
    });
    console.log(JSON.stringify(customerMenuInfo, null, 2));

    // Find the hover trigger element
    console.log('\n=== HOVER TRIGGER ELEMENTS ===');
    const hoverElements = await page.evaluate(() => {
      const elements = [];
      document.querySelectorAll('[class*="horimenu"], [class*="menu_li"], [class*="nav"]').forEach(el => {
        if (el.innerText && el.innerText.trim().length < 200) {
          elements.push({
            tag: el.tagName,
            text: el.innerText.substring(0, 100),
            class: el.getAttribute('class'),
            id: el.getAttribute('id'),
            onmouseover: el.getAttribute('onmouseover'),
            visible: el.offsetParent !== null
          });
        }
      });
      return elements;
    });
    console.log(JSON.stringify(hoverElements, null, 2));

    // Click on Customer menu
    console.log('\n=== CLICKING CUSTOMER MENU ===');
    try {
      await page.locator('#c_20004').click();
      console.log('✓ Customer menu clicked');
      
      await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
      await page.waitForTimeout(1500);

      console.log('Current URL after click:', page.url());

      // Now inspect the search form fields
      console.log('\n=== FORM FIELDS ON CUSTOMER SEARCH PAGE ===');
      const formFields = await page.evaluate(() => {
        const fields = [];
        document.querySelectorAll('input, textarea, select').forEach(el => {
          if (el.offsetParent !== null) { // Only visible elements
            fields.push({
              tag: el.tagName,
              type: el.getAttribute('type'),
              name: el.getAttribute('name'),
              id: el.getAttribute('id'),
              placeholder: el.getAttribute('placeholder'),
              class: el.getAttribute('class'),
              label: el.labels?.[0]?.innerText,
              visible: el.offsetParent !== null
            });
          }
        });
        return fields;
      });
      console.log(JSON.stringify(formFields, null, 2));

      // Look for Search button
      console.log('\n=== SEARCH BUTTON ===');
      const searchButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"], span[class*="btn"]'));
        for (const btn of buttons) {
          if ((btn.innerText || btn.value || '').toLowerCase().includes('search') && btn.offsetParent !== null) {
            return {
              tag: btn.tagName,
              type: btn.getAttribute('type'),
              text: btn.innerText || btn.value,
              class: btn.getAttribute('class'),
              id: btn.getAttribute('id'),
              visible: btn.offsetParent !== null
            };
          }
        }
        return null;
      });
      console.log(JSON.stringify(searchButton, null, 2));

      // Take screenshot
      await page.screenshot({ path: 'customer-search-page.png' });
      console.log('\n✓ Screenshot saved to: customer-search-page.png');

    } catch (error) {
      console.error('Error clicking customer menu:', error.message);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

inspectMenuAndFields();
