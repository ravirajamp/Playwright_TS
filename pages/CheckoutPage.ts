import { expect, Locator } from '@playwright/test';
import { PaymentDetails } from '../utils/testDataFactory';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly addressDetailsHeading: Locator = this.page.locator('h2').filter({ hasText: 'Address Details' });
  readonly reviewOrderHeading: Locator = this.page.locator('h2').filter({ hasText: 'Review Your Order' });
  readonly commentBox: Locator = this.page.locator('textarea[name="message"]');
  readonly placeOrderLink: Locator = this.page.getByRole('link', { name: 'Place Order' });
  readonly nameOnCard: Locator = this.byDataQa('name-on-card');
  readonly cardNumber: Locator = this.byDataQa('card-number');
  readonly cvc: Locator = this.byDataQa('cvc');
  readonly expiryMonth: Locator = this.byDataQa('expiry-month');
  readonly expiryYear: Locator = this.byDataQa('expiry-year');
  readonly payButton: Locator = this.byDataQa('pay-button');
  readonly orderPlacedHeading: Locator = this.byDataQa('order-placed');
  readonly downloadInvoiceLink: Locator = this.page.getByRole('link', { name: 'Download Invoice' });
  readonly continueButton: Locator = this.byDataQa('continue-button');

  async expectCheckoutLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout/);
    await expect(this.addressDetailsHeading).toBeVisible();
    await expect(this.reviewOrderHeading).toBeVisible();
  }

  async expectDeliveryContains(text: string): Promise<void> {
    await expect(this.page.locator('#address_delivery')).toContainText(text);
  }

  async placeOrderWithComment(comment: string): Promise<void> {
    await this.fillVisible(this.commentBox, comment);
    await this.clickVisible(this.placeOrderLink);
    await expect(this.page).toHaveURL(/payment/);
  }

  async fillPaymentAndConfirm(payment: PaymentDetails): Promise<void> {
    await this.fillVisible(this.nameOnCard, payment.nameOnCard);
    await this.fillVisible(this.cardNumber, payment.cardNumber);
    await this.fillVisible(this.cvc, payment.cvc);
    await this.fillVisible(this.expiryMonth, payment.expiryMonth);
    await this.fillVisible(this.expiryYear, payment.expiryYear);
    await this.clickVisible(this.payButton);
  }

  async expectOrderPlaced(): Promise<void> {
    await expect(this.orderPlacedHeading).toContainText(/Order Placed!/i);
  }

  async continueShopping(): Promise<void> {
    await this.clickVisible(this.continueButton);
  }
}
