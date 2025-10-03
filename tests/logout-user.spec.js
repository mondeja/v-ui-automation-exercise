const { test, expect } = require("@playwright/test");
const {
  maybeAcceptConsent,
  createUser,
  goToHomePage,
  afterCreateUserStrategies,
} = require("./helpers");

test("Logout user", async ({ page }) => {
  await goToHomePage(page);

  // Accept cookie consent
  await maybeAcceptConsent(page);

  // Create user and logout
  const { email, password, name } = await createUser(
    page,
    afterCreateUserStrategies.logout
  );

  // Go to 'Signup / Login' page
  const signupLoginButton = page.locator('a[href="/login"]');
  await signupLoginButton.click();
  await expect(page.locator(".signup-form")).toBeVisible();

  // Login with the created user
  const emailInput = page.locator('input[data-qa="login-email"]');
  await emailInput.fill(email);
  const passwordInput = page.locator('input[data-qa="login-password"]');
  await passwordInput.fill(password);
  const loginButton = page.locator('button[data-qa="login-button"]');
  await loginButton.click();

  const loggedInAs = page.locator("header ul li:last-child");
  await expect(loggedInAs).toBeVisible();
  await expect(loggedInAs).toHaveText(` Logged in as ${name}`);

  // Logout
  const logoutButton = page.locator('a[href="/logout"]');
  await expect(logoutButton).toBeVisible();
  await logoutButton.click();

  await expect(page.locator(".login-form")).toBeVisible();

  await goToHomePage(page);
});
