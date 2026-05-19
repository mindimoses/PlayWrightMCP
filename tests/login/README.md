# Payment Application Login Tests

This directory contains login test cases for the Payment Application at `https://swa.mfs.tn.ofti.app:31102/payment/`

## Test Credentials

- **Username**: `TUAutoTest1`
- **Password**: `Tunisia123!@#`
- **Verification Code**: `1111`

## Test Cases

### TC-001: Successful Login with Valid Credentials
Tests successful login flow with provided credentials and verification code.

### TC-002: Login Validation (Username Only)
Tests form validation when only username is provided without password.

### TC-003: Invalid Credentials
Tests error handling when invalid credentials are provided.

## Important: Customize Selectors

The test file uses generic selectors that will likely need to be customized based on the actual HTML structure of your application:

1. **Username Input**: Currently using `input[type="text"]`
   - Inspect the form and update to match actual selector (e.g., `input[id="username"]`, `input[name="user"]`)

2. **Password Input**: Currently using `input[type="password"]`
   - Verify this selector matches your form

3. **Verification Code Input**: Currently looking for text inputs with "code/verify/otp" filter
   - Update selector to match your 2FA field (e.g., `input[id="otp"]`, `input[id="verification"]`)

4. **Submit Button**: Currently using `button[type="submit"]`
   - May need to match by text or class if different (e.g., `button:has-text("Login")`)

5. **Error Messages**: Currently looking for `[role="alert"]`, `.error`, `.invalid`
   - Adjust to match your error message containers

## How to Run

```bash
# Run all login tests
npx playwright test tests/login/

# Run a specific test
npx playwright test tests/login/payment-app-login.spec.ts -g "TC-001"

# Run in headed mode for debugging
npx playwright test tests/login/payment-app-login.spec.ts --headed

# Run in debug mode
npx playwright test tests/login/payment-app-login.spec.ts --debug
```

## Next Steps

1. **Inspect the application** to identify the correct selectors for:
   - Username/Email input field
   - Password input field
   - Login/Submit button
   - Verification code field (if 2FA exists)
   - Error message containers

2. **Update the selectors** in `payment-app-login.spec.ts` to match your form structure

3. **Verify 2FA flow**: Check if verification code is required on the same page or redirects to a new page

4. **Run the test** and adjust assertions based on post-login redirect URL

## Tips for Debugging

1. Use `--debug` mode to step through test execution:
   ```bash
   npx playwright test tests/login/payment-app-login.spec.ts --debug
   ```

2. Use `--headed` mode to see browser:
   ```bash
   npx playwright test tests/login/payment-app-login.spec.ts --headed
   ```

3. Add screenshots to understand form structure:
   ```typescript
   await page.screenshot({ path: 'login-form.png' });
   ```

4. Inspect elements in browser DevTools to find correct selectors
