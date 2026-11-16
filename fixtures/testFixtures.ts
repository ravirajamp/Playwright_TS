import { test as base } from '@playwright/test';
import {
  CartPage,
  CheckoutPage,
  ContactUsPage,
  HomePage,
  LoginPage,
  ProductsPage,
  SignupPage,
} from '../pages';
import { blockThirdPartyNoise } from '../utils/networkMocks';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  contactUsPage: ContactUsPage;
};

type Options = {
  /** When true, aborts analytics/ad requests for more stable runs. */
  blockNoise: boolean;
};

/**
 * Custom fixtures expose page objects and optional network hygiene to every test.
 */
export const test = base.extend<Pages & Options>({
  blockNoise: [true, { option: true }],

  page: async ({ page, blockNoise }, use) => {
    if (blockNoise) {
      await blockThirdPartyNoise(page);
    }
    await use(page);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },
});

export { expect } from '@playwright/test';
