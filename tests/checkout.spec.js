const { test, expect } = require('./fixtures');
const { products, customer, messages } = require('../test-data/testData');

test.describe('Checkout - standard_user', () => {
  test.beforeEach(async ({ signedIn, inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('requires customer information', async ({ checkoutPage }) => {
    await checkoutPage.expectInformationStep();
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.error).toHaveText(messages.firstNameRequired);
  });

  test('shows a correct order overview', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(customer);
    await checkoutPage.expectOverviewStep();

    await expect(checkoutPage.itemNames).toHaveText([products.backpack.name]);
    expect(await checkoutPage.amountOf(checkoutPage.subtotal)).toBe(products.backpack.price);

    const subtotal = await checkoutPage.amountOf(checkoutPage.subtotal);
    const tax = await checkoutPage.amountOf(checkoutPage.tax);
    const total = await checkoutPage.amountOf(checkoutPage.total);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('completes the order and returns home', async ({ checkoutPage, inventoryPage }) => {
    await checkoutPage.fillInformation(customer);
    await checkoutPage.finish();

    await checkoutPage.expectCompleteStep();
    await expect(checkoutPage.completeHeader).toHaveText(messages.orderComplete);
    await inventoryPage.expectCartCount(0);

    await checkoutPage.backHome();
    await inventoryPage.expectLoaded();
  });
});
