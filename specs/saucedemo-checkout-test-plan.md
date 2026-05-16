# SauceDemo E-Commerce Checkout Test Plan

## Application Overview

Comprehensive test plan for SauceDemo e-commerce checkout process. The application is a web-based shopping platform at https://www.saucedemo.com that allows users to browse products, add items to cart, and complete a checkout process. This test plan covers all stages of the checkout workflow including cart review, checkout information entry, order overview, and order completion, with extensive coverage of happy paths, error scenarios, and edge cases.

## Test Scenarios

### 1. Cart Review and Navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. TC-101: View single item in cart

**File:** `tests/cart-review/single-item-cart.spec.ts`

**Steps:**
  1. Log in with standard_user / secret_sauce
    - expect: User is logged in and on inventory page
  2. Add Sauce Labs Backpack to cart
    - expect: Item is added to cart
    - expect: Cart icon displays '1'
  3. Click shopping cart icon
    - expect: Navigate to cart page
    - expect: Cart page title displays 'Your Cart'
    - expect: Backpack item is displayed with qty 1
    - expect: Price $29.99 is shown
  4. Verify cart columns are present
    - expect: QTY column is visible
    - expect: Description column is visible
  5. Verify action buttons are present
    - expect: Continue Shopping button is visible
    - expect: Checkout button is visible

#### 1.2. TC-102: View multiple items in cart

**File:** `tests/cart-review/multiple-items-cart.spec.ts`

**Steps:**
  1. Log in with standard_user / secret_sauce
    - expect: User is logged in
  2. Add 3 different items to cart: Backpack ($29.99), Bike Light ($9.99), Bolt T-Shirt ($15.99)
    - expect: Each item is added successfully
    - expect: Cart icon displays '3'
  3. Click shopping cart icon
    - expect: All 3 items are displayed in cart
    - expect: Each item shows qty 1
  4. Verify item details
    - expect: Backpack: $29.99 displayed
    - expect: Bike Light: $9.99 displayed
    - expect: Bolt T-Shirt: $15.99 displayed
  5. Verify item descriptions are present
    - expect: Each item shows product description

#### 1.3. TC-103: Remove item from cart

**File:** `tests/cart-review/remove-item-cart.spec.ts`

**Steps:**
  1. Log in and add 2 items to cart
    - expect: Both items added successfully
  2. Navigate to cart
    - expect: Cart shows 2 items
  3. Click Remove button for first item
    - expect: Item is removed from cart
    - expect: Cart now shows 1 item
    - expect: Cart badge updates to '1'
  4. Verify remaining item is correct
    - expect: Only one item remains in cart with correct details

#### 1.4. TC-104: Continue shopping from cart

**File:** `tests/cart-review/continue-shopping.spec.ts`

**Steps:**
  1. Log in and add items to cart
    - expect: Items added to cart
  2. Navigate to cart page
    - expect: Cart page is displayed
  3. Click Continue Shopping button
    - expect: Navigate back to inventory page
    - expect: Products are displayed
    - expect: Cart items remain (cart badge shows previous count)

#### 1.5. TC-105: Navigate to checkout from cart

**File:** `tests/cart-review/checkout-navigation.spec.ts`

**Steps:**
  1. Log in and add items to cart
    - expect: Items added
  2. Navigate to cart
    - expect: Cart page displayed
  3. Click Checkout button
    - expect: Navigate to checkout step one
    - expect: Page title shows 'Checkout: Your Information'
    - expect: Form fields are displayed

### 2. Checkout Information Entry

**Seed:** `tests/seed.spec.ts`

#### 2.1. TC-201: Complete checkout with valid data

**File:** `tests/checkout-info/valid-data.spec.ts`

**Steps:**
  1. Log in and add items to cart
    - expect: Items in cart
  2. Navigate to checkout
    - expect: Checkout Step One form displayed
  3. Enter First Name: 'John'
    - expect: First Name field populated with 'John'
  4. Enter Last Name: 'Doe'
    - expect: Last Name field populated with 'Doe'
  5. Enter Zip Code: '12345'
    - expect: Zip Code field populated with '12345'
  6. Verify Continue button is enabled
    - expect: Continue button is clickable
  7. Click Continue button
    - expect: Navigate to checkout step two
    - expect: Page shows 'Checkout: Overview'

#### 2.2. TC-202: Validation - Empty First Name field

**File:** `tests/checkout-info/empty-firstname.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Leave First Name empty
    - expect: First Name field is empty
  3. Enter Last Name: 'Doe'
    - expect: Last Name populated
  4. Enter Zip Code: '12345'
    - expect: Zip Code populated
  5. Click Continue button
    - expect: Error message displayed: 'First Name is required'
    - expect: User remains on checkout step one
    - expect: Form data is retained

#### 2.3. TC-203: Validation - Empty Last Name field

**File:** `tests/checkout-info/empty-lastname.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: 'John'
    - expect: First Name populated
  3. Leave Last Name empty
    - expect: Last Name field is empty
  4. Enter Zip Code: '12345'
    - expect: Zip Code populated
  5. Click Continue button
    - expect: Error message displayed: 'Last Name is required'
    - expect: User remains on checkout step one
    - expect: Form data is retained

#### 2.4. TC-204: Validation - Empty Zip Code field

**File:** `tests/checkout-info/empty-zipcode.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: 'John'
    - expect: First Name populated
  3. Enter Last Name: 'Doe'
    - expect: Last Name populated
  4. Leave Zip Code empty
    - expect: Zip Code field is empty
  5. Click Continue button
    - expect: Error message displayed: 'Postal Code is required'
    - expect: User remains on checkout step one
    - expect: Form data is retained

#### 2.5. TC-205: Validation - All fields empty

**File:** `tests/checkout-info/all-fields-empty.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Leave all fields empty
    - expect: All fields are empty
  3. Click Continue button
    - expect: Error message displayed
    - expect: User remains on checkout step one

#### 2.6. TC-206: Cancel checkout from Step One

**File:** `tests/checkout-info/cancel-checkout.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Enter some data in fields
    - expect: Fields populated
  3. Click Cancel button
    - expect: Navigate back to cart page
    - expect: Cart items remain
    - expect: Checkout data is not saved

#### 2.7. TC-207: Boundary - First Name with special characters

**File:** `tests/checkout-info/firstname-special-chars.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: 'John-Paul O\'Brien'
    - expect: First Name accepts special characters
  3. Enter Last Name: 'Smith' and Zip Code: '12345'
    - expect: Form populated
  4. Click Continue
    - expect: Form accepted with special characters
    - expect: Navigate to checkout step two

#### 2.8. TC-208: Boundary - Last Name with numbers

**File:** `tests/checkout-info/lastname-with-numbers.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: 'John' and Last Name: 'Smith123'
    - expect: Last Name accepts numbers
  3. Enter Zip Code: '12345'
    - expect: Form populated
  4. Click Continue
    - expect: Form accepted
    - expect: Navigate to checkout step two

#### 2.9. TC-209: Boundary - Zip Code with letters

**File:** `tests/checkout-info/zipcode-with-letters.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: 'John', Last Name: 'Doe', Zip Code: 'ABC123'
    - expect: Zip Code field accepts alphanumeric values
  3. Click Continue
    - expect: Form accepted
    - expect: Navigate to checkout step two

#### 2.10. TC-210: Boundary - Very long First Name (100 characters)

**File:** `tests/checkout-info/long-firstname.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: 'VeryLongFirstNameThatContains50CharactersAndIsUsedForBoundaryTesting1234567890'
    - expect: First Name field accepts long input
  3. Enter Last Name: 'Doe' and Zip Code: '12345'
    - expect: Form populated
  4. Click Continue
    - expect: Form accepted or truncated appropriately
    - expect: User navigates to next step or sees appropriate message

#### 2.11. TC-211: Boundary - Zip Code with spaces

**File:** `tests/checkout-info/zipcode-with-spaces.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: 'John', Last Name: 'Doe', Zip Code: '12 345' or '12345 '
    - expect: Zip Code field accepts or trims spaces
  3. Click Continue
    - expect: Form processed (spaces trimmed or accepted)

#### 2.12. TC-212: Data persistence - Field values retained on error

**File:** `tests/checkout-info/field-persistence.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: 'John', Last Name: 'Doe', leave Zip Code empty
    - expect: Fields populated/empty as specified
  3. Click Continue
    - expect: Error message shown for empty Zip Code
  4. Verify First Name and Last Name are still populated
    - expect: Previously entered data is retained
    - expect: Only Zip Code field is empty

### 3. Order Overview

**Seed:** `tests/seed.spec.ts`

#### 3.1. TC-301: Order overview displays correct item details

**File:** `tests/order-overview/item-details.spec.ts`

**Steps:**
  1. Log in and add Backpack ($29.99) and Bike Light ($9.99) to cart
    - expect: Items added
  2. Proceed through checkout step one with valid data
    - expect: Checkout step two (overview) displayed
  3. Verify item list section
    - expect: 'Sauce Labs Backpack' displayed with qty 1
    - expect: 'Sauce Labs Bike Light' displayed with qty 1
    - expect: Item descriptions are shown
  4. Verify prices
    - expect: Backpack price: $29.99
    - expect: Bike Light price: $9.99

#### 3.2. TC-302: Order overview displays payment information

**File:** `tests/order-overview/payment-info.spec.ts`

**Steps:**
  1. Add items to cart and navigate to order overview
    - expect: Order overview displayed
  2. Locate Payment Information section
    - expect: Section is visible
  3. Verify payment details
    - expect: 'Payment Information:' label shown
    - expect: 'SauceCard #31337' payment method displayed

#### 3.3. TC-303: Order overview displays shipping information

**File:** `tests/order-overview/shipping-info.spec.ts`

**Steps:**
  1. Add items to cart and navigate to order overview
    - expect: Order overview displayed
  2. Locate Shipping Information section
    - expect: Section is visible
  3. Verify shipping details
    - expect: 'Shipping Information:' label shown
    - expect: 'Free Pony Express Delivery!' shipping method displayed

#### 3.4. TC-304: Order overview displays correct totals

**File:** `tests/order-overview/totals-calculation.spec.ts`

**Steps:**
  1. Add items: Backpack ($29.99) + Bike Light ($9.99) = $39.98
    - expect: Items added
  2. Navigate to order overview
    - expect: Overview displayed
  3. Verify item total
    - expect: 'Item total: $39.98' displayed
  4. Verify tax calculation
    - expect: 'Tax: $3.20' displayed (approximately 8% tax)
  5. Verify order total
    - expect: 'Total: $43.18' displayed ($39.98 + $3.20)

#### 3.5. TC-305: Order overview with single item

**File:** `tests/order-overview/single-item-overview.spec.ts`

**Steps:**
  1. Add only Bolt T-Shirt ($15.99) to cart
    - expect: Item added
  2. Navigate to order overview
    - expect: Overview displayed with single item
  3. Verify item is displayed
    - expect: Bolt T-Shirt shown with qty 1 and price $15.99
  4. Verify totals
    - expect: Item total: $15.99
    - expect: Tax calculated correctly
    - expect: Total displayed

#### 3.6. TC-306: Order overview with multiple items

**File:** `tests/order-overview/multiple-items-overview.spec.ts`

**Steps:**
  1. Add 6 items to cart
    - expect: All items added
  2. Navigate to order overview
    - expect: Overview displayed
  3. Verify all items are listed
    - expect: All 6 items visible in order
    - expect: Each item shows correct qty and price
  4. Verify total calculations
    - expect: Item total reflects all items
    - expect: Tax and total are accurate

#### 3.7. TC-307: Cancel from order overview

**File:** `tests/order-overview/cancel-overview.spec.ts`

**Steps:**
  1. Add items and navigate to order overview
    - expect: Overview displayed
  2. Click Cancel button
    - expect: Navigate back to cart page
    - expect: Cart items remain
    - expect: Order is not completed

#### 3.8. TC-308: QTY column displays in overview

**File:** `tests/order-overview/qty-column.spec.ts`

**Steps:**
  1. Add items and navigate to order overview
    - expect: Overview displayed
  2. Verify QTY column header is present
    - expect: 'QTY' column header visible
  3. Verify quantity values
    - expect: Each item shows quantity (1 in normal flow)

#### 3.9. TC-309: Description column displays in overview

**File:** `tests/order-overview/description-column.spec.ts`

**Steps:**
  1. Add items and navigate to order overview
    - expect: Overview displayed
  2. Verify Description column header
    - expect: 'Description' column header visible
  3. Verify item descriptions
    - expect: Each item shows product name
    - expect: Product descriptions visible

#### 3.10. TC-310: Finish button is enabled and clickable

**File:** `tests/order-overview/finish-button.spec.ts`

**Steps:**
  1. Navigate to order overview
    - expect: Overview displayed
  2. Verify Finish button is present
    - expect: Finish button visible
  3. Verify Finish button is enabled
    - expect: Finish button is clickable
  4. Click Finish button
    - expect: Order is processed
    - expect: Navigate to completion page

### 4. Order Completion

**Seed:** `tests/seed.spec.ts`

#### 4.1. TC-401: Order completion success message

**File:** `tests/order-completion/success-message.spec.ts`

**Steps:**
  1. Complete full checkout process
    - expect: All steps completed successfully
  2. Verify page title
    - expect: Page title shows 'Checkout: Complete!'
  3. Verify success heading
    - expect: Heading displays 'Thank you for your order!'
  4. Verify order message
    - expect: Message shows 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'

#### 4.2. TC-402: Order completion with pony image

**File:** `tests/order-completion/pony-image.spec.ts`

**Steps:**
  1. Complete full checkout process
    - expect: Order completion page displayed
  2. Verify pony image is present
    - expect: Pony Express image displayed on completion page

#### 4.3. TC-403: Back Home button redirects to inventory

**File:** `tests/order-completion/back-home-button.spec.ts`

**Steps:**
  1. Complete full checkout process
    - expect: Order completion page displayed
  2. Click 'Back Home' button
    - expect: Navigate to inventory page
    - expect: Products are displayed
    - expect: Cart is empty or reset

#### 4.4. TC-404: Cart count resets after order completion

**File:** `tests/order-completion/cart-reset.spec.ts`

**Steps:**
  1. Add items to cart
    - expect: Cart badge shows item count
  2. Complete full checkout process
    - expect: Order completed
  3. Verify cart is empty
    - expect: Cart badge shows '0' or is not displayed
    - expect: Cart is reset after order

#### 4.5. TC-405: User can checkout again after order completion

**File:** `tests/order-completion/repeat-checkout.spec.ts`

**Steps:**
  1. Complete full checkout process
    - expect: Order completed
  2. Click 'Back Home' button
    - expect: Return to inventory page
  3. Add items to cart again
    - expect: Items added to fresh cart
  4. Proceed through checkout process
    - expect: Checkout form is fresh/empty
    - expect: Can complete another order successfully

#### 4.6. TC-406: Order completion page elements are displayed

**File:** `tests/order-completion/page-elements.spec.ts`

**Steps:**
  1. Complete checkout process
    - expect: Completion page displayed
  2. Verify all UI elements are present
    - expect: Page title visible
    - expect: Heading visible
    - expect: Message text visible
    - expect: Pony image visible
    - expect: Back Home button visible

### 5. Error Handling and Validation

**Seed:** `tests/seed.spec.ts`

#### 5.1. TC-501: Invalid input - First Name with numbers only

**File:** `tests/error-handling/firstname-numbers-only.spec.ts`

**Steps:**
  1. Navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: '123456'
    - expect: Field accepts numeric input
  3. Enter valid Last Name and Zip Code
    - expect: Form fields populated
  4. Click Continue
    - expect: System accepts or displays validation message as per business rules

#### 5.2. TC-502: Invalid input - Zip Code empty or whitespace only

**File:** `tests/error-handling/zipcode-whitespace.spec.ts`

**Steps:**
  1. Navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name and Last Name
    - expect: Names populated
  3. Enter Zip Code as '     ' (spaces only)
    - expect: Field shows spaces
  4. Click Continue
    - expect: Error message: 'Postal Code is required' or similar

#### 5.3. TC-503: Session timeout - Stay on checkout too long

**File:** `tests/error-handling/session-timeout.spec.ts`

**Steps:**
  1. Log in and navigate to checkout
    - expect: Checkout form displayed
  2. Wait for session timeout (if applicable)
    - expect: User is either kept in session or redirected to login
  3. Attempt to submit form
    - expect: Either form submits or user is redirected to login page

#### 5.4. TC-504: Cart empty checkout attempt

**File:** `tests/error-handling/empty-cart-checkout.spec.ts`

**Steps:**
  1. Log in to account
    - expect: Logged in
  2. Navigate directly to checkout URL without items in cart
    - expect: System either shows empty cart or allows proceeding
  3. Attempt to complete checkout
    - expect: System handles gracefully - either prevents checkout or shows appropriate message

#### 5.5. TC-505: Missing required field - First Name only

**File:** `tests/error-handling/first-name-only.spec.ts`

**Steps:**
  1. Navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: 'John'
    - expect: First Name populated
  3. Leave Last Name and Zip Code empty
    - expect: Fields are empty
  4. Click Continue
    - expect: Error displayed for missing required fields

#### 5.6. TC-506: SQL injection attempt in First Name

**File:** `tests/error-handling/sql-injection-firstname.spec.ts`

**Steps:**
  1. Navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name: "'; DROP TABLE users; --"
    - expect: Field accepts input
  3. Enter valid Last Name and Zip Code
    - expect: Form populated
  4. Click Continue
    - expect: Input is treated as literal text
    - expect: No database errors occur
    - expect: Either accepted as name or validated as invalid name

#### 5.7. TC-507: XSS attempt in Last Name

**File:** `tests/error-handling/xss-attempt-lastname.spec.ts`

**Steps:**
  1. Navigate to checkout
    - expect: Checkout form displayed
  2. Enter Last Name: '<script>alert("xss")</script>'
    - expect: Field accepts input
  3. Enter valid First Name and Zip Code
    - expect: Form populated
  4. Click Continue
    - expect: Script is not executed
    - expect: Input is treated as literal text
    - expect: No security issues occur

#### 5.8. TC-508: Unicode characters in Zip Code

**File:** `tests/error-handling/unicode-zipcode.spec.ts`

**Steps:**
  1. Navigate to checkout
    - expect: Checkout form displayed
  2. Enter First Name and Last Name
    - expect: Names populated
  3. Enter Zip Code: '北京100000' (Chinese characters)
    - expect: Field may accept or reject unicode
  4. Click Continue
    - expect: System handles unicode gracefully

#### 5.9. TC-509: Navigation to invalid checkout step

**File:** `tests/error-handling/invalid-checkout-step.spec.ts`

**Steps:**
  1. Log in without items in cart
    - expect: Logged in
  2. Attempt to navigate directly to checkout-step-two.html URL
    - expect: System either allows access or redirects appropriately
  3. If allowed, verify behavior
    - expect: System is either lenient or shows appropriate error

#### 5.10. TC-510: Rapid successive form submissions

**File:** `tests/error-handling/rapid-submissions.spec.ts`

**Steps:**
  1. Navigate to checkout
    - expect: Checkout form displayed
  2. Fill in valid data
    - expect: Form populated
  3. Click Continue button multiple times rapidly
    - expect: System handles gracefully
    - expect: Single submission or error message
    - expect: No duplicate orders created

### 6. Navigation and UI Flow

**Seed:** `tests/seed.spec.ts`

#### 6.1. TC-601: Complete checkout flow navigation

**File:** `tests/navigation/complete-flow.spec.ts`

**Steps:**
  1. Log in with valid credentials
    - expect: Login successful, on inventory page
  2. Add items to cart
    - expect: Items added
  3. Click cart icon
    - expect: Navigate to cart page
  4. Click Checkout button
    - expect: Navigate to checkout step one
  5. Fill form and click Continue
    - expect: Navigate to checkout step two
  6. Click Finish button
    - expect: Navigate to order completion page

#### 6.2. TC-602: Menu navigation from checkout

**File:** `tests/navigation/menu-navigation.spec.ts`

**Steps:**
  1. Navigate to checkout step one
    - expect: Checkout form displayed
  2. Click menu button (hamburger icon)
    - expect: Menu opens
    - expect: Navigation options available
  3. Verify menu contains options
    - expect: Menu shows navigation options

#### 6.3. TC-603: Back button from cart

**File:** `tests/navigation/back-button-cart.spec.ts`

**Steps:**
  1. Add items and navigate to cart
    - expect: On cart page
  2. Click Continue Shopping button
    - expect: Navigate back to inventory
    - expect: Cart items preserved

#### 6.4. TC-604: Back button from checkout step one

**File:** `tests/navigation/back-button-checkout-one.spec.ts`

**Steps:**
  1. Navigate to checkout step one
    - expect: On checkout form
  2. Click Cancel button
    - expect: Navigate back to cart
    - expect: Checkout data not saved

#### 6.5. TC-605: Back button from order overview

**File:** `tests/navigation/back-button-overview.spec.ts`

**Steps:**
  1. Navigate to order overview
    - expect: On overview page
  2. Click Cancel button
    - expect: Navigate back to cart

#### 6.6. TC-606: Logo click navigation

**File:** `tests/navigation/logo-click.spec.ts`

**Steps:**
  1. Navigate to any checkout page
    - expect: On checkout page
  2. Click Swag Labs logo
    - expect: Navigate to inventory or home page

#### 6.7. TC-607: Cart icon always visible and clickable

**File:** `tests/navigation/cart-icon-visible.spec.ts`

**Steps:**
  1. Add items to cart
    - expect: Items in cart
  2. Navigate to checkout step one
    - expect: On checkout page
  3. Verify cart icon is visible
    - expect: Cart icon visible with badge
  4. Click cart icon
    - expect: Navigate to cart page

#### 6.8. TC-608: Browser back button functionality

**File:** `tests/navigation/browser-back-button.spec.ts`

**Steps:**
  1. Add items and navigate to checkout
    - expect: On checkout step one
  2. Use browser back button
    - expect: Navigate to previous page (cart)
    - expect: History maintained
