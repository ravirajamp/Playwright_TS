import { test, expect } from '../fixtures/testFixtures';
import users from '../testdata/users.json';

test.describe('Product search and cart @regression', () => {

    test(`TC02 - Data-driven search for "${users.searchTerms}" returns matching products @smoke`, async ({
      homePage,
      productsPage,
    }) => {
      await homePage.gotoHome();
      await homePage.goToProducts();
      await productsPage.expectLoaded();
      await productsPage.searchProduct(users.searchTerms[0]);
      await productsPage.expectSearchResultsContain(users.searchTerms[0]);
    });

  test('TC03 - Add and remove products from cart', async ({
    homePage,
    productsPage,
    cartPage,
  }) => {
    await homePage.gotoHome();
    await homePage.goToProducts();
    await productsPage.expectLoaded();

    const firstProduct = await productsPage.addFirstProductToCart();
    await productsPage.continueShopping();

    await productsPage.addProductToCartByName(users.products.menTshirt);
    await productsPage.viewCartFromModal();

    await cartPage.expectLoaded();
    await cartPage.expectProductInCart(firstProduct);
    await cartPage.expectProductInCart(users.products.menTshirt);

    const beforeCount = await cartPage.getCartItemCount();
    expect(beforeCount).toBeGreaterThanOrEqual(2);

    await cartPage.removeProduct(users.products.menTshirt);
    const afterCount = await cartPage.getCartItemCount();
    expect(afterCount).toBeLessThan(beforeCount);
  });
});
