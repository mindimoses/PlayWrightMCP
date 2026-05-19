const { chromium } = require('playwright');

async function inspectWithCorrectSelectors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    const APP_URL = 'https://swa.mfs.tn.ofti.app:31102/payment/';
    const TEST_USERNAME = 'TUAutoTest1';
    const TEST_PASSWORD = 'Tunisia123!@#';
    const VERIFICATION_CODE = '1111';

    console.log('Navigating and logging in...');
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    await page.locator('#username').fill(TEST_USERNAME);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.locator('#validate').fill(VERIFICATION_CODE);
    await page.locator('#submitBtn').click();

    await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
    await page.waitForTimeout(2000);

    // Use text selector to find and hover on "Search"
    console.log('\n=== FINDING SEARCH MENU ===');
    
    const searchMenuLi = page.locator('li.horimenu_title_center').filter({ hasText: 'Search' }).first();
    const isSearchVisible = await searchMenuLi.first().isVisible().catch(() => false);
    
    console.log('Search menu visible:', isSearchVisible);
    
    if (isSearchVisible) {
      console.log('✓ Hovering on Search menu...');
      await searchMenuLi.hover();
      await page.waitForTimeout(1500);

      // Get Customer menu info
      console.log('\n=== CUSTOMER MENU INFO ===');
      const customerInfo = await page.evaluate(() => {
        const li = document.getElementById('c_20004');
        if (li && li.offsetParent !== null) {
          const parent = li.parentElement?.parentElement;
          return {
            id: li.id,
            text: li.innerText?.trim(),
            class: li.getAttribute('class'),
            visible: li.offsetParent !== null,
            parentClass: parent?.getAttribute('class'),
            parentId: parent?.getAttribute('id')
          };
        }
        return null;
      });
      
      console.log(JSON.stringify(customerInfo, null, 2));

      // Click Customer
      if (customerInfo && customerInfo.visible) {
        console.log('✓ Clicking Customer menu...');
        await page.locator('#c_20004').click();
        await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
        await page.waitForTimeout(2000);

        console.log('\nCurrent URL:', page.url());

        // Get form details
        console.log('\n=== FORM DETAILS ===');
        const formDetails = await page.evaluate(() => {
          const details = {
            inputs: [],
            buttons: [],
            labels: []
          };

          // Get all inputs
          document.querySelectorAll('input').forEach(el => {
            if (el.offsetParent !== null || el.type === 'hidden') {
              details.inputs.push({
                type: el.type,
                name: el.name,
                id: el.id,
                visible: el.offsetParent !== null,
                class: el.getAttribute('class'),
                placeholder: el.getAttribute('placeholder')
              });
            }
          });

          // Get all visible buttons
          document.querySelectorAll('button, span[class*="btn"]').forEach(el => {
            if (el.offsetParent !== null) {
              details.buttons.push({
                tag: el.tagName,
                text: el.innerText?.trim(),
                class: el.getAttribute('class'),
                id: el.getAttribute('id')
              });
            }
          });

          // Get labels that might indicate fields
          document.querySelectorAll('label, td, span').forEach(el => {
            const text = el.innerText?.trim();
            if (text && text.length < 100 && (text.includes('%') || text.toLowerCase().includes('msisdn'))) {
              details.labels.push({
                text: text,
                tag: el.tagName
              });
            }
          });

          return details;
        });

        console.log(JSON.stringify(formDetails, null, 2));

        // Take screenshot
        await page.screenshot({ path: 'final-customer-search-form.png' });
        console.log('\n✓ Screenshot saved');
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

inspectWithCorrectSelectors();
