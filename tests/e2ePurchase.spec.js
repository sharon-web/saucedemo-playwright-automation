const { test, expect } = require('./fixtures');
const { users, products, customer, messages } = require('../test-data/testData');

test('E2E: sign in, add to cart, remove from cart, checkout and back home', async ({
  loginPage,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  await test.step('Sign in as standard_user', async () => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });

  await test.step('Add three products to the cart', async () => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);
    await inventoryPage.addToCart(products.boltTShirt.name);
    await inventoryPage.expectCartCount(3);
  });

  await test.step('Remove one product from the cart', async () => {
    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.removeItem(products.bikeLight.name);
    await cartPage.expectItems([products.backpack.name, products.boltTShirt.name]);
    await inventoryPage.expectCartCount(2);
  });

  await test.step('Enter customer information', async () => {
    await cartPage.checkout();
    await checkoutPage.expectInformationStep();
    await checkoutPage.fillInformation(customer);
  });

  await test.step('Verify order overview and totals', async () => {
    await checkoutPage.expectOverviewStep();
    await expect(checkoutPage.itemNames).toHaveText([products.backpack.name, products.boltTShirt.name]);

    const expectedSubtotal = products.backpack.price + products.boltTShirt.price;
    const subtotal = await checkoutPage.amountOf(checkoutPage.subtotal);
    const tax = await checkoutPage.amountOf(checkoutPage.tax);
    const total = await checkoutPage.amountOf(checkoutPage.total);

    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  await test.step('Finish checkout', async () => {
    await checkoutPage.finish();
    await checkoutPage.expectCompleteStep();
    await expect(checkoutPage.completeHeader).toHaveText(messages.orderComplete);
    await expect(checkoutPage.completeText).toHaveText(messages.orderDispatched);
    await inventoryPage.expectCartCount(0);
  });

  await test.step('Return home', async () => {
    await checkoutPage.backHome();
    await inventoryPage.expectLoaded();
    await expect(inventoryPage.items).toHaveCount(6);
  });
});
