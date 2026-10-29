const { expect } = require('@playwright/test');

/** Covers the three checkout steps: your information, overview and complete. */
class CheckoutPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');

    // Step one: your information
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.error = page.getByTestId('error');

    // Step two: overview
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');

    // Complete
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillInformation({ firstName, lastName, postalCode }) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async backHome() {
    await this.backHomeButton.click();
  }

  /** Reads a "Label: $12.34" summary line and returns 12.34. */
  async amountOf(locator) {
    const text = await locator.textContent();
    return parseFloat(text.split('$')[1]);
  }

  async expectInformationStep() {
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  async expectOverviewStep() {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  async expectCompleteStep() {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(this.title).toHaveText('Checkout: Complete!');
  }
}

module.exports = { CheckoutPage };
