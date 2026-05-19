const { chromium } = require('playwright');

async function inspectForm() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to application...');
    await page.goto('https://swa.mfs.tn.ofti.app:31102/payment/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Look for clickable elements (button, input[type=submit], input[type=button], a with click handlers, divs with click handlers)
    console.log('\n=== CLICKABLE ELEMENTS ===');
    const clickables = await page.evaluate(() => {
      const elements = [];
      
      // Find buttons
      document.querySelectorAll('button, input[type="submit"], input[type="button"], input[type="reset"]').forEach(el => {
        elements.push({
          tag: el.tagName,
          type: el.getAttribute('type'),
          id: el.getAttribute('id'),
          name: el.getAttribute('name'),
          class: el.getAttribute('class'),
          value: el.value || el.innerText,
          text: el.innerText,
          visible: el.offsetParent !== null
        });
      });

      // Find divs/spans with click handlers or visible text that might be clickable
      document.querySelectorAll('div, span, a').forEach(el => {
        const hasClick = el.getAttribute('onclick') || el.hasAttribute('ng-click');
        if (hasClick && el.innerText.trim()) {
          elements.push({
            tag: el.tagName,
            text: el.innerText.substring(0, 50),
            class: el.getAttribute('class'),
            onclick: el.getAttribute('onclick')?.substring(0, 50),
            visible: el.offsetParent !== null
          });
        }
      });

      return elements;
    });
    
    console.log(JSON.stringify(clickables, null, 2));

    // Get full form HTML
    console.log('\n=== FULL FORM HTML ===');
    const formHtml = await page.locator('#loginForm').innerHTML();
    console.log(formHtml);

    console.log('\n✓ Form inspection complete');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

inspectForm();
