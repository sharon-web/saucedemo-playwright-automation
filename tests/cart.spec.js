const { test, expect } = require('./fixtures');
const { products } = require('../test-data/testData');

test.describe('Cart - standard_user', () => {
  test.beforeEach(async ({ signedIn }) => {});

  test('adds products to the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.expectCartCount(1);
    await expect(inventoryPage.cartButton(products.backpack.name)).toHaveText('Remove');

    await inventoryPage.addToCart(products.bikeLight.name);
    await inventoryPage.expectCartCount(2);

    await inventoryPage.openCart();
    await cartPage.expectLoaded();
    await cartPage.expectItems([products.backpack.name, products.bikeLight.name]);
  });

  test('removes a product from the products page', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.expectCartCount(1);

    await inventoryPage.removeFromCart(products.backpack.name);
    await inventoryPage.expectCartCount(0);
    await expect(inventoryPage.cartButton(products.backpack.name)).toHaveText('Add to cart');
  });

  test('removes a product from the cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.addToCart(products.bikeLight.name);
    await inventoryPage.openCart();

    await cartPage.removeItem(products.backpack.name);
    await cartPage.expectItems([products.bikeLight.name]);
    await inventoryPage.expectCartCount(1);

    await cartPage.removeItem(products.bikeLight.name);
    await expect(cartPage.items).toHaveCount(0);
    await inventoryPage.expectCartCount(0);
  });

  test('keeps the cart contents after continuing shopping', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name);
    await inventoryPage.openCart();
    await cartPage.continueShopping();

    await inventoryPage.expectLoaded();
    await inventoryPage.expectCartCount(1);
  });
});
