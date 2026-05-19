const { chromium } = require('playwright');

async function inspectCustomerSearchForm() {
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

    // Find the "Search" menu in the main navigation
    console.log('\n=== HOVERING ON SEARCH MENU ===');
    
    // Look for the Search menu title in the main navigation
    const searchMenuTitle = page.locator('li.horimenu_title_center:has-text("Search")');
    const isSearchVisible = await searchMenuTitle.isVisible().catch(() => false);
    
    if (isSearchVisible) {
      console.log('✓ Found Search menu in navigation');
      await searchMenuTitle.hover();
      console.log('✓ Hovered on Search menu');
      
      await page.waitForTimeout(1000);

      // Now the submenu should be visible, find Customer link
      console.log('\n=== LOOKING FOR CUSTOMER LINK ===');
      
      const customerLink = page.locator('#c_20004');
      const isCustomerVisible = await customerLink.isVisible().catch(() => false);
      
      console.log(`Customer link visible: ${isCustomerVisible}`);
      
      if (isCustomerVisible) {
        console.log('✓ Customer link is now visible');
        await customerLink.click();
        console.log('✓ Clicked on Customer');
        
        await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => null);
        await page.waitForTimeout(2000);

        console.log('Current URL:', page.url());

        // Inspect the search form
        console.log('\n=== CUSTOMER SEARCH FORM FIELDS ===');
        const formFields = await page.evaluate(() => {
          const fields = [];
          document.querySelectorAll('input, textarea, select').forEach(el => {
            fields.push({
              tag: el.tagName,
              type: el.getAttribute('type'),
              name: el.getAttribute('name'),
              id: el.getAttribute('id'),
              placeholder: el.getAttribute('placeholder'),
              class: el.getAttribute('class'),
              visible: el.offsetParent !== null,
              labelText: Array.from(document.querySelectorAll('label')).find(l => l.htmlFor === el.id)?.innerText,
              parentText: el.parentElement?.innerText?.substring(0, 50)
            });
          });
          return fields;
        });
        
        console.log(JSON.stringify(formFields, null, 2));

        // Look for Search button
        console.log('\n=== SEARCH BUTTON ===');
        const buttons = await page.evaluate(() => {
          const btns = [];
          document.querySelectorAll('button, input[type="submit"], input[type="button"], span[class*="btn"]').forEach(el => {
            if (el.offsetParent !== null) {
              btns.push({
                tag: el.tagName,
                type: el.getAttribute('type'),
                text: el.innerText || el.value || '',
                class: el.getAttribute('class'),
                id: el.getAttribute('id'),
                visible: el.offsetParent !== null
              });
            }
          });
          return btns;
        });
        
        console.log(JSON.stringify(buttons, null, 2));

        // Take screenshot
        await page.screenshot({ path: 'customer-search-form.png' });
        console.log('\n✓ Screenshot saved to: customer-search-form.png');

      } else {
        console.log('Customer link is not visible, checking visible menu items...');
        
        // List all visible menu items under Search
        const visibleMenuItems = await page.evaluate(() => {
          const items = [];
          document.querySelectorAll('li.menu_li_word_wrap').forEach(el => {
            if (el.offsetParent !== null) {
              items.push({
                text: el.innerText?.trim(),
                id: el.getAttribute('id'),
                visible: el.offsetParent !== null
              });
            }
          });
          return items;
        });
        
        console.log('Visible menu items:', JSON.stringify(visibleMenuItems, null, 2));
      }

    } else {
      console.log('Search menu not found in main navigation');
      
      // Try to find it with a different approach
      const allMenuItems = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('li.horimenu_title_center').forEach(el => {
          items.push({
            text: el.innerText?.trim(),
            visible: el.offsetParent !== null
          });
        });
        return items;
      });
      
      console.log('All menu items:', JSON.stringify(allMenuItems, null, 2));
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

inspectCustomerSearchForm();
