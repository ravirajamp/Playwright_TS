import { test } from '../fixtures/testFixtures';
import {
  createPaymentDetails,
  createUser,
} from '../utils/testDataFactory';
import users from '../testdata/users.json';

test.describe('Checkout and order placement @smoke @regression', () => {
  test('TC04 - Place an order end-to-end and validate confirmation', async ({
    homePage,
    loginPage,
    signupPage,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = createUser();
    const payment = createPaymentDetails({ nameOnCard: user.name });

    // Register
    await homePage.gotoHome();
    await homePage.goToSignupLogin();
   
    await loginPage.login(user.email, user.password);

    // Assert
    await homePage.expectLoggedInAs(user.name);

    // Add product and checkout
    await homePage.goToProducts();
    await productsPage.expectLoaded();
    await productsPage.addProductToCartByName(users.products.blueTop);
    await productsPage.viewCartFromModal();
    await cartPage.expectLoaded();
    await cartPage.expectProductInCart(users.products.blueTop);
    await cartPage.proceedToCheckout();

    await checkoutPage.expectCheckoutLoaded();
    await checkoutPage.expectDeliveryContains(user.firstName);
    await checkoutPage.placeOrderWithComment('Capstone order placement validation');
    await checkoutPage.fillPaymentAndConfirm(payment);
    await checkoutPage.expectOrderPlaced();

  });
});
