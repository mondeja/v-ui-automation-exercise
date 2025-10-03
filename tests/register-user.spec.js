const { test, expect } = require("@playwright/test");
const {
  maybeAcceptConsent,
  createUser,
  afterCreateUserStrategies,
  goToHomePage,
} = require("./helpers");

test("Register user", async ({ page }) => {
  await goToHomePage(page);
  await maybeAcceptConsent(page);
  await createUser(page, afterCreateUserStrategies.deleteAccount);
});

test("Register user with existing email", async ({ page }) => {
  await goToHomePage(page);
  await maybeAcceptConsent(page);
  const { email } = await createUser(page, afterCreateUserStrategies.logout);

  // Go to 'Signup / Login' page
  const signupLoginButton = page.locator('a[href="/login"]');
  await signupLoginButton.click();
  await expect(page.locator(".signup-form")).toBeVisible();

  // Register with an existing email
  const nameInput = page.locator('input[data-qa="signup-name"]');
  await nameInput.fill("foobar");
  await expect(nameInput).toBeVisible();
  {
    const emailInput = page.locator('input[data-qa="signup-email"]');
    await expect(emailInput).toBeVisible();
    await emailInput.fill(email);
  }

  const signupButton = page.locator('button[data-qa="signup-button"]');
  await expect(signupButton).toBeVisible();
  await signupButton.click();

  const errorMessage = page.locator('form[action="/signup"] p');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toHaveText("Email Address already exist!");
});
