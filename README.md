# SauceDemo – Playwright E2E Automation

[![Playwright E2E Tests](https://github.com/sharon-web/saucedemo-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/sharon-web/saucedemo-playwright-automation/actions/workflows/playwright.yml)
[![Live Test Report](https://img.shields.io/badge/Live%20Test%20Report-View%20on%20GitHub%20Pages-2ea44f)](https://sharon-web.github.io/saucedemo-playwright-automation/)

End-to-end UI test automation of the full purchase journey on [SauceDemo](https://www.saucedemo.com), built with **Playwright** and **JavaScript**. It uses the **Page Object Model** with custom fixtures, runs on three browsers (Chromium, Firefox and WebKit), and reports through **GitHub Actions** CI.

> Companion project: [saucedemo-cypress-automation](https://github.com/sharon-web/saucedemo-cypress-automation) automates sign-in (standard and locked-out users) and the products page with Cypress.

## Scope (`standard_user`)

| Spec | Scenarios |
|---|---|
| `signIn.spec.js` | Sign in lands on the Products page · Sign out returns to the login page |
| `cart.spec.js` | Add products to the cart · Remove from the products page · Remove from the cart page · Cart keeps its contents after Continue Shopping |
| `checkout.spec.js` | Customer information is required · Order overview items and totals are correct (total = subtotal + tax) · Complete the order and go back home |
| `e2ePurchase.spec.js` | **Full journey:** sign in → add 3 products → remove 1 → checkout → verify totals → finish → back home |

**10 tests × 3 browsers = 30 test runs.**

> **Note:** SauceDemo has no "generate PDF / download order" feature, so the scope does not include a PDF step.

## Project Structure

```
├── .github/workflows/playwright.yml  # CI pipeline – runs on every push / PR
├── pages/                            # Page Object Model
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── test-data/
│   └── testData.js                   # Users, customer, products, expected messages
├── tests/
│   ├── fixtures.js                   # Custom fixtures: page objects + signed-in user
│   ├── signIn.spec.js
│   ├── cart.spec.js
│   ├── checkout.spec.js
│   └── e2ePurchase.spec.js
└── playwright.config.js
```

## Design Decisions

- **Page Object Model with fixtures:** page objects are injected through `test.extend()`, and a `signedIn` fixture handles authentication. Specs contain no setup boilerplate.
- **Stable, user-facing locators:** `testIdAttribute` is set to SauceDemo's `data-test` attribute, so specs can use `getByTestId()`. `getByRole()` is used where the accessible name matters.
- **Web-first assertions:** auto-retrying `expect()` assertions replace hard waits.
- **Readable reports:** the full journey is split into `test.step()` blocks, so each stage appears separately in the HTML report.
- **Business-logic checks:** the checkout tests check the order totals (subtotal and subtotal + tax = total), not just that pages load.
- **Cross-browser:** tests run on Chromium, Firefox and WebKit, in parallel.
- **Debuggability:** a trace is recorded on the first retry, and screenshots and video are kept on failure. CI retries a failing test once.

## Getting Started

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/sharon-web/saucedemo-playwright-automation.git
cd saucedemo-playwright-automation
npm install
npx playwright install
```

| Command | Description |
|---|---|
| `npm test` | Run all tests on all browsers (headless) |
| `npm run test:chromium` | Run on Chromium only |
| `npm run test:headed` | Watch the tests run in a visible Chromium window |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run report` | Open the last HTML report |

## Test Reports

- **Live report:** [**View the latest test report**](https://sharon-web.github.io/saucedemo-playwright-automation/), published to GitHub Pages after every CI run on `main`.
- **Locally:** after `npm test`, run `npm run report`.
- **CI artifact:** each run on the [Actions tab](https://github.com/sharon-web/saucedemo-playwright-automation/actions) also includes a downloadable **playwright-html-report**.

## CI/CD

GitHub Actions runs the whole suite on all three browsers on every push and pull request to `main`. The HTML report, including traces and failure screenshots, is uploaded as a build artifact on the **Actions** tab.

## Author

**Sharon Ogboli** – QA Automation Engineer
