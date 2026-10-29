const { test, expect } = require('./fixtures');
const { users } = require('../test-data/testData');

test.describe('Sign In - standard_user', () => {
  test('signs in and lands on the products page', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.items).toHaveCount(6);
    await expect(loginPage.error).toBeHidden();
  });

  test('signs out and returns to the login page', async ({ signedIn, inventoryPage, loginPage }) => {
    await inventoryPage.logout();
    await loginPage.expectLoaded();
  });
});
