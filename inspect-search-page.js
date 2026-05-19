const { chromium } = require('playwright');

async function inspectSearchPage() {
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

    console.log('Current URL:', page.url());

    // Inspect menu structure
    console.log('\n=== PAGE STRUCTURE AFTER LOGIN ===');
    const htmlContent = await page.content();
    
    // Look for menu items
    console.log('\n=== MENU ITEMS / NAVIGATION ===');
    const navElements = await page.evaluate(() => {
      const elements = [];
      
      // Find all clickable elements that might be menu items
      document.querySelectorAll('a, button, div[onclick], span[onclick], li, nav, [class*="menu"], [class*="nav"]').forEach(el => {
        if (el.innerText && el.innerText.trim()) {
          const text = el.innerText.substring(0, 100).trim();
          if (text && !text.includes('\n')) {
            elements.push({
              tag: el.tagName,
              text: text,
              class: el.getAttribute('class'),
              id: el.getAttribute('id'),
              href: el.getAttribute('href'),
              visible: el.offsetParent !== null
            });
          }
        }
      });
      
      return elements;
    });
    
    console.log(JSON.stringify(navElements, null, 2));

    // Look specifically for Search-related items
    console.log('\n=== SEARCH/CUSTOMER RELATED ELEMENTS ===');
    const searchItems = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('*').forEach(el => {
        const text = el.innerText || el.textContent || '';
        if ((text.includes('Search') || text.includes('search') || text.includes('Customer') || text.includes('customer')) && text.length < 100) {
          items.push({
            tag: el.tagName,
            text: text.substring(0, 50),
            class: el.getAttribute('class'),
            id: el.getAttribute('id'),
            visible: el.offsetParent !== null
          });
        }
      });
      return items;
    });
    
    console.log(JSON.stringify(searchItems, null, 2));

    // Look for input fields
    console.log('\n=== INPUT FIELDS ===');
    const inputs = await page.locator('input').evaluateAll(inputs =>
      inputs.map(input => ({
        type: input.getAttribute('type'),
        name: input.getAttribute('name'),
        id: input.getAttribute('id'),
        placeholder: input.getAttribute('placeholder'),
        class: input.getAttribute('class'),
        visible: input.offsetParent !== null
      }))
    );
    console.log(JSON.stringify(inputs, null, 2));

    // Take screenshot
    await page.screenshot({ path: 'home-page-after-login.png' });
    console.log('\n✓ Screenshot saved to: home-page-after-login.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

inspectSearchPage();
