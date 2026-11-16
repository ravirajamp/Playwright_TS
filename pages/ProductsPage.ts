import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly allProductsHeading: Locator = this.page.getByRole('heading', { name: 'All Products' });
  readonly searchInput: Locator = this.page.locator('#search_product');
  readonly searchButton: Locator = this.page.locator('#submit_search');
  readonly searchedProductsHeading: Locator = this.page.getByText('Searched Products');
  readonly productCards: Locator = this.page.locator('.features_items .product-image-wrapper');
  readonly continueShoppingButton: Locator = this.page.getByRole('button', {
    name: 'Continue Shopping',
  });
  readonly viewCartLink: Locator = this.page.getByRole('link', { name: 'View Cart' });

  async expectLoaded(): Promise<void> {
    await expect(this.allProductsHeading).toBeVisible();
  }

  async searchProduct(term: string): Promise<void> {
    // Button is type="button" (no native form submit). Prefer URL navigation for stability
    // against intermittent full-page ad iframes on this public AUT.
    await this.page.goto(`/products?search=${encodeURIComponent(term)}`, {
      waitUntil: 'domcontentloaded',
    });
    await this.prepareForAction();
    await expect(this.searchedProductsHeading).toBeVisible({ timeout: 20_000 });
  }

  productByName(name: string): Locator {
    return this.productCards.filter({ hasText: name }).first();
  }

  async expectProductVisible(name: string): Promise<void> {
    await expect(this.productByName(name)).toBeVisible();
  }

  async addProductToCartByName(name: string): Promise<void> {
    const card = this.productByName(name);
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await card.locator('a.add-to-cart').first().click();
  }

  async addFirstProductToCart(): Promise<string> {
    const firstCard = this.productCards.first();
    await firstCard.scrollIntoViewIfNeeded();
    const name = (await firstCard.locator('.productinfo p').innerText()).trim();
    await firstCard.hover();
    await firstCard.locator('a.add-to-cart').first().click();
    return name;
  }

  async continueShopping(): Promise<void> {
    await this.clickVisible(this.continueShoppingButton);
  }

  async viewCartFromModal(): Promise<void> {
    await this.clickVisible(this.viewCartLink);
  }

  async expectSearchResultsContain(term: string): Promise<void> {
    const count = await this.productCards.count();
    expect(count, `Expected search results for "${term}"`).toBeGreaterThan(0);

    // AUT search is fuzzy; assert at least one returned card matches the term.
    const matching = this.productCards.filter({ hasText: new RegExp(term, 'i') });
    await expect(matching.first()).toBeVisible();
  }
}
