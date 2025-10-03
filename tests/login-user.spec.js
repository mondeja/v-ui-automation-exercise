const { test, expect } = require("@playwright/test");
const {
  maybeAcceptConsent,
  createUser,
  goToHomePage,
  deleteAccountAndGoToHomePage,
  afterCreateUserStrategies,
} = require("./helpers");

test("Login User with correct email and password", async ({ page }) => {
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

  await deleteAccountAndGoToHomePage(page);
});

test("Login User with incorrect email and password", async ({ page }) => {
  await goToHomePage(page);

  // Accept cookie consent
  await maybeAcceptConsent(page);

  // Go to 'Signup / Login' page
  const signupLoginButton = page.locator('a[href="/login"]');
  await signupLoginButton.click();
  await expect(page.locator(".signup-form")).toBeVisible();

  // Login with incorrect email and password
  const emailInput = page.locator('input[data-qa="login-email"]');
  await emailInput.fill("foobar@baz.qux");
  const passwordInput = page.locator('input[data-qa="login-password"]');
  await passwordInput.fill("foobarbaz");
  const loginButton = page.locator('button[data-qa="login-button"]');
  await loginButton.click();
  
  const errorMessage = page.locator('form[action="/login"] p');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText("Your email or password is incorrect!");
});
