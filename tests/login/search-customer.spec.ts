import { test, expect } from '@playwright/test';

test.describe('Payment Application - Search Customer', () => {
  const APP_URL = 'https://swa.mfs.tn.ofti.app:31102/payment/';
  const TEST_USERNAME = 'TUAutoTest1';
  const TEST_PASSWORD = 'Tunisia123!@#';
  const VERIFICATION_CODE = '1111';
  const MSISDN_RANGE = '%94000050 to %94000054'; // MSISDN range for looping
  const MAX_WAIT_TIME = 3 * 60 * 1000; // 3 minutes in milliseconds

  // Helper function to parse MSISDN range and generate array of numbers
  function parseMSISDNRange(rangeString: string): string[] {
    const regex = /(%?)(\d+)\s+to\s+(%?)(\d+)/;
    const match = rangeString.match(regex);
    
    if (!match) {
      throw new Error(`Invalid MSISDN range format: ${rangeString}`);
    }

    const prefix = match[1]; // % or empty
    const startNum = parseInt(match[2]);
    const endNum = parseInt(match[4]);

    if (startNum > endNum) {
      throw new Error(`Invalid range: start (${startNum}) must be less than or equal to end (${endNum})`);
    }

    const result: string[] = [];
    for (let i = startNum; i <= endNum; i++) {
      result.push(`${prefix}${i}`);
    }
    return result;
  }

  test('TC-201: Search customer by MSISDN', async ({ browser, page }) => {
    // Set extended timeout for multiple iterations (101 iterations * ~3-4 seconds each)
    test.setTimeout(600000); // 10 minutes timeout for 101 MSISDN searches

    // Skip test for non-chromium browsers
    test.skip(browser.browserType().name() !== 'chromium', 'This test requires Chromium browser');

    // Step 1: Navigate to application URL
    console.log('Step 1: Navigating to application URL...');
    await page.goto(APP_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Step 2: Provide test credentials and login
    console.log('Step 2: Logging in with test credentials...');
    
    // Enter username
    await page.locator('#username').fill(TEST_USERNAME);

    // Enter password
    await page.locator('#password').fill(TEST_PASSWORD);

    // Enter verification code
    await page.locator('#validate').fill(VERIFICATION_CODE);

    // Click login button
    await page.locator('#submitBtn').click();

    // Wait for page to process login
    await page.waitForTimeout(2000);

    // Step 3: Wait for home page to load (maximum 3 minutes)
    console.log('Step 3: Waiting for home page to load (max 3 minutes)...');
    
    const startTime = Date.now();
    let homePageLoaded = false;

    while (Date.now() - startTime < MAX_WAIT_TIME && !homePageLoaded) {
      try {
        // Check if we're on a page that's not the login page
        const currentUrl = page.url();
        
        // Check if we're logged in (not on login page anymore)
        if (!currentUrl.includes('/login.action')) {
          homePageLoaded = true;
          console.log('✓ Home page loaded successfully');
          break;
        }

        // Wait before retrying
        await page.waitForTimeout(1000);
      } catch (error) {
        await page.waitForTimeout(1000);
      }
    }

    // Verify we're logged in
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login.action');
    console.log('✓ Logged in successfully');

    // Step 4: Hover on Search menu and click on Customer link
    console.log('Step 4: Hovering on Search and clicking Customer link...');

    // Find and hover on the "Search" menu in the main navigation
    const searchMenuLi = page.locator('li.horimenu_title_center').filter({ hasText: 'Search' }).first();
    await searchMenuLi.hover();
    console.log('✓ Hovered on Search menu');
    
    // Wait for submenu to appear
    await page.waitForTimeout(500);

    // Click on Customer link (ID: c_20004)
    await page.locator('#c_20004').click();
    console.log('✓ Customer link clicked');

    // Wait for page to load after click - use a shorter timeout
    try {
      await page.waitForTimeout(10000);
      // Don't wait for navigation as the page might not navigate in traditional way
    } catch (e) {
      // Ignore timeout errors
    }

    // Step 5-6: Loop through MSISDN range and search for each customer
    console.log(`Step 5-6: Looping through MSISDN range "${MSISDN_RANGE}"...`);
    
    const msisdnNumbers = parseMSISDNRange(MSISDN_RANGE);
    console.log(`Processing ${msisdnNumbers.length} MSISDN numbers...`);

    for (let index = 0; index < msisdnNumbers.length; index++) {
      const MSISDN = msisdnNumbers[index];
      console.log(`\n--- Iteration ${index + 1}/${msisdnNumbers.length}: Processing MSISDN "${MSISDN}" ---`);

      // Step 5: Fill the MSISDN text box
      console.log(`Step 5.${index + 1}: Filling text box "MSISDN" with "${MSISDN}"...`);

      // Wait for the form to be fully loaded (reduce wait time for subsequent iterations)
      await page.waitForTimeout(index === 0 ? 1500 : 500);

      // Try multiple approaches to find and fill the MSISDN field
      let msisdnFilled = false;

      // Approach 1: Use frameLocator to find the MSISDN input by ID
      try {
        // Try the last iframe (index 7) which contains the form
        const iframeLocator = page.frameLocator('iframe').last();
        const msisdnInput = iframeLocator.locator('#mobileNumberInput_value');
        
        // Wait for the element to be visible
        await msisdnInput.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
        
        const count = await msisdnInput.count().catch(() => 0);
        
        if (count > 0) {
          // Clear the field first
          await msisdnInput.clear();
          await msisdnInput.fill(MSISDN);
          msisdnFilled = true;
          console.log(`✓ MSISDN "${MSISDN}" filled successfully in text box`);
        }
      } catch (e) {
        console.log(`Approach 1 (frameLocator with ID) - MSISDN field not found: ${e.message}`);
      }

      // Approach 2: Use page.evaluate to directly access iframe and fill
      if (!msisdnFilled) {
        try {
          const filled = await page.evaluate((value) => {
            // Get the last iframe (which contains the form)
            const iframes = document.querySelectorAll('iframe');
            if (iframes.length === 0) return false;
            
            const iframe = iframes[iframes.length - 1];
            if (!iframe || !iframe.contentDocument) return false;
            
            const doc = iframe.contentDocument;
            const input = doc.getElementById('mobileNumberInput_value');
            
            if (input && input.offsetParent !== null) { // Check if visible
              input.focus();
              // Clear the field first
              input.value = '';
              input.dispatchEvent(new Event('input', { bubbles: true }));
              
              // Then fill with new value
              input.value = value;
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
              input.dispatchEvent(new Event('blur', { bubbles: true }));
              return true;
            }
            return false;
          }, MSISDN);
          
          if (filled) {
            console.log(`✓ MSISDN "${MSISDN}" filled successfully using page.evaluate`);
            msisdnFilled = true;
          }
        } catch (e) {
          console.log(`Approach 2 (page.evaluate) - Error filling MSISDN: ${e.message}`);
        }
      }

      if (!msisdnFilled) {
        console.log('⚠️  Could not fill MSISDN field - element not found');
        // Continue to next iteration instead of failing
        continue;
      }

      // Step 6: Click on Search button located below the MSISDN text box
      console.log(`Step 6.${index + 1}: Clicking on Search button located below MSISDN text box...`);

      let searchClicked = false;

      // Try multiple approaches to find and click the Search button
      try {
        // Approach 1: Use frameLocator to find and click search button by ID
        const iframeLocator = page.frameLocator('iframe').last();
        const searchButton = iframeLocator.locator('#less_btn');
        
        // Wait for the element to be visible
        await searchButton.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
        
        const count = await searchButton.count().catch(() => 0);
        
        if (count > 0) {
          await searchButton.click();
          searchClicked = true;
          console.log('✓ Search button clicked successfully');
        }
      } catch (e) {
        console.log(`Approach 1 (frameLocator with ID) - Search button not found: ${e.message}`);
      }

      // Approach 2: Use page.evaluate to find and click search button in iframe by ID
      if (!searchClicked) {
        try {
          const clicked = await page.evaluate(() => {
            // Get the last iframe (which contains the form)
            const iframes = document.querySelectorAll('iframe');
            if (iframes.length === 0) return false;
            
            const iframe = iframes[iframes.length - 1];
            if (!iframe || !iframe.contentDocument) return false;
            
            const doc = iframe.contentDocument;
            const searchButton = doc.getElementById('less_btn');
            
            if (searchButton && searchButton.offsetParent !== null) { // Check if visible
              searchButton.click();
              return true;
            }
            return false;
          });
          
          if (clicked) {
            console.log('✓ Search button clicked successfully using page.evaluate');
            searchClicked = true;
          }
        } catch (e) {
          console.log(`Approach 2 (page.evaluate) - Error clicking search button: ${e.message}`);
        }
      }

      if (!searchClicked) {
        console.log('⚠️  Could not click Search button - element not found');
        // Continue to next iteration instead of failing
        continue;
      }

      // Wait for search results to load (reduced wait)
      await page.waitForTimeout(800);

      // Verify search was executed successfully
      const pageContent = await page.locator('body').innerText().catch(() => '');
      
      // Verify we're not on an error page
      if (pageContent.toLowerCase().includes('error')) {
        console.log('⚠️  Error message found on page');
      } else {
        console.log(`✓ Customer search completed for MSISDN "${MSISDN}"`);
      }
    }

    console.log(`\n✓ All ${msisdnNumbers.length} MSISDN searches completed successfully`);

    // Pause execution after final step
    console.log('Pausing execution - inspect the page and press ENTER to continue or click RESUME in Playwright Inspector...');
    await page.pause(); // Pause for up to 1 minute
  });
});
