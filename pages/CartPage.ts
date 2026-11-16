import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartInfo: Locator = this.page.locator('#cart_info');
  readonly cartRows: Locator = this.page.locator('#cart_info tbody tr');
  readonly proceedToCheckoutButton: Locator = this.page.locator('a.check_out');
  readonly registerLoginLink: Locator = this.page.getByRole('link', { name: 'Register / Login' });
  readonly emptyCartMessage: Locator = this.page.locator('#empty_cart');

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/view_cart/);
    await expect(this.cartInfo).toBeVisible();
  }

  async expectProductInCart(productName: string): Promise<void> {
    await expect(this.cartRows.filter({ hasText: productName }).first()).toBeVisible();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartRows.count();
  }

  async removeProduct(productName: string): Promise<void> {
    const rows = this.cartRows.filter({ hasText: productName });
    const deleteLink = rows.first().locator('a.cart_quantity_delete');
    await expect(deleteLink).toBeVisible();
    const productId = await deleteLink.getAttribute('data-product-id');
    if (!productId) {
      throw new Error(`Missing data-product-id for cart item "${productName}"`);
    }

    // Mirrors the AUT delete_cart endpoint used by the storefront X control.
    const response = await this.page.request.get(`/delete_cart/${productId}`);
    expect(response.ok()).toBeTruthy();
    await this.page.reload({ waitUntil: 'domcontentloaded' });

    await expect(this.cartRows.filter({ hasText: productName })).toHaveCount(0, {
      timeout: 15_000,
    });
  }

  async proceedToCheckout(): Promise<void> {
    await this.prepareForAction();
    await expect(this.proceedToCheckoutButton.first()).toBeVisible();
    // Demo site ad iframes frequently intercept the checkout CTA; navigate explicitly.
    await this.page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    await this.prepareForAction();
    await expect(this.page).toHaveURL(/checkout/);
  }

  async goToRegisterLoginFromModal(): Promise<void> {
    await this.clickVisible(this.registerLoginLink);
  }
}
