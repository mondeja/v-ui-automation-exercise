const { expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");

export const goToHomePage = async (page) => {
  await page.goto("https://www.automationexercise.com/");
  await expect(page).toHaveTitle(/Automation Exercise/);
  await expect(
    page.locator('img[alt="Website for automation practice"]')
  ).toBeVisible();
  await expect(page.locator(".features_items")).toBeVisible();
};

export const maybeAcceptConsent = async (page) => {
  const consentButton = page.locator("button.fc-cta-consent");
  if (!(await consentButton.isVisible())) {
    return;
  }
  await consentButton.click();
};

export const deleteAccountAndGoToHomePage = async (page) => {
    const deleteAccountButton = page.locator('a[href="/delete_account"]');
    await expect(deleteAccountButton).toBeVisible();
    await deleteAccountButton.click();

    const accountDeletedMessage = page.locator('h2[data-qa="account-deleted"]');
    await expect(accountDeletedMessage).toBeVisible();
    await expect(accountDeletedMessage).toHaveText("Account Deleted!");

    const continueAfterDeleteButton = page.locator(
      'a[data-qa="continue-button"]'
    );
    await expect(continueAfterDeleteButton).toBeVisible();
    await continueAfterDeleteButton.click();

    // Returned to home page
    await expect(page.locator(".features_items")).toBeVisible();
};

/**
 * Strategies to execute after creating an user.
 */
export const afterCreateUserStrategies = {
  deleteAccount: async (page) => {
    await deleteAccountAndGoToHomePage(page);
  },
  logout: async (page) => {
    const logoutButton = page.locator('a[href="/logout"]');
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    await expect(page.locator(".login-form")).toBeVisible();

    await goToHomePage(page);
  },
};

/**
 * Create a new user in the application using the UI interface.
 */
export const createUser = async (page, afterCreationStrategy) => {
  // Click on 'Signup / Login' button
  const signupLoginButton = page.locator('a[href="/login"]');
  await signupLoginButton.click();
  await expect(page.locator(".signup-form")).toBeVisible();

  // Fill in name and email
  const name = faker.person.firstName();
  const email = faker.internet.email();

  const nameInput = page.locator('input[data-qa="signup-name"]');
  await nameInput.fill(name);
  await expect(nameInput).toBeVisible();
  {
    const emailInput = page.locator('input[data-qa="signup-email"]');
    await expect(emailInput).toBeVisible();
    await emailInput.fill(email);
  }

  const signupButton = page.locator('button[data-qa="signup-button"]');
  await expect(signupButton).toBeVisible();
  await signupButton.click();

  // Fill in account information
  const signupForm = page.locator("form[action='/signup']");
  await expect(signupForm).toBeVisible();

  const genderNumber = faker.number.int({ min: 1, max: 2 });
  const genderRadio = page.locator(`input[id="id_gender${genderNumber}"]`);
  await expect(genderRadio).toBeVisible();
  await genderRadio.check();

  {
    const nameInput = page.locator('input[data-qa="name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(name);
  }

  const passwordInput = page.locator('input[data-qa="password"]');
  const password = faker.internet.password({ length: 8 });
  await expect(passwordInput).toBeVisible();
  await passwordInput.fill(password);

  const daysSelect = page.locator('select[data-qa="days"]');
  const monthsSelect = page.locator('select[data-qa="months"]');
  const yearsSelect = page.locator('select[data-qa="years"]');
  await expect(daysSelect).toBeVisible();
  await expect(monthsSelect).toBeVisible();
  await expect(yearsSelect).toBeVisible();

  const day = faker.number.int({ min: 1, max: 28 }).toString();
  const month = faker.number.int({ min: 1, max: 12 }).toString();
  const year = faker.number.int({ min: 1935, max: 2021 }).toString();
  await daysSelect.selectOption(day);
  await monthsSelect.selectOption(month);
  await yearsSelect.selectOption(year);

  const newsletterCheckbox = page.locator('input[name="newsletter"]');
  const offersCheckbox = page.locator('input[name="optin"]');
  await expect(newsletterCheckbox).toBeVisible();
  await expect(offersCheckbox).toBeVisible();
  await newsletterCheckbox.check();
  await offersCheckbox.check();

  const firstNameInput = page.locator('input[data-qa="first_name"]');
  await expect(firstNameInput).toBeVisible();
  await firstNameInput.fill(faker.person.firstName());

  const lastNameInput = page.locator('input[data-qa="last_name"]');
  await expect(lastNameInput).toBeVisible();
  await lastNameInput.fill(faker.person.lastName());

  const companyInput = page.locator('input[data-qa="company"]');
  await expect(companyInput).toBeVisible();
  await companyInput.fill(faker.company.name());

  const address1Input = page.locator('input[data-qa="address"]');
  await expect(address1Input).toBeVisible();
  await address1Input.fill(faker.location.streetAddress());

  const address2Input = page.locator('input[data-qa="address2"]');
  await expect(address2Input).toBeVisible();
  await address2Input.fill(faker.location.secondaryAddress());

  const countrySelect = page.locator('select[data-qa="country"]');
  await expect(countrySelect).toBeVisible();
  await countrySelect.selectOption("Canada");

  const stateInput = page.locator('input[data-qa="state"]');
  await expect(stateInput).toBeVisible();
  await stateInput.fill(faker.location.state());

  const cityInput = page.locator('input[data-qa="city"]');
  await expect(cityInput).toBeVisible();
  await cityInput.fill(faker.location.city());

  const zipCodeInput = page.locator('input[data-qa="zipcode"]');
  await expect(zipCodeInput).toBeVisible();
  await zipCodeInput.fill(faker.location.zipCode());

  const mobileNumberInput = page.locator('input[data-qa="mobile_number"]');
  await expect(mobileNumberInput).toBeVisible();
  await mobileNumberInput.fill(faker.phone.number("##########"));

  // Create account
  const createAccountButton = page.locator('button[data-qa="create-account"]');
  await expect(createAccountButton).toBeVisible();
  await createAccountButton.click();

  const accountCreatedMessage = page.locator('h2[data-qa="account-created"]');
  await expect(accountCreatedMessage).toBeVisible();
  await expect(accountCreatedMessage).toHaveText("Account Created!");

  const continueButton = page.locator('a[data-qa="continue-button"]');
  await expect(continueButton).toBeVisible();
  await continueButton.click();

  const loggedInAs = page.locator("header ul li:last-child");
  await expect(loggedInAs).toBeVisible();
  await expect(loggedInAs).toHaveText(` Logged in as ${name}`);

  if (afterCreationStrategy !== undefined) {
    await afterCreationStrategy(page);
  }

  return {
    email,
    name,
    password,
  };
};
