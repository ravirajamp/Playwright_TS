import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly logo: Locator = this.page.locator('img[alt="Website for automation practice"]');
  readonly signupLoginLink: Locator = this.page.getByRole('link', { name: 'Signup / Login' });
  readonly logoutLink: Locator = this.page.getByRole('link', { name: 'Logout' });
  readonly deleteAccountLink: Locator = this.page.getByRole('link', { name: 'Delete Account' });
  readonly productsLink: Locator = this.page.getByRole('link', { name: 'Products' });
  readonly cartLink: Locator = this.page.getByRole('link', { name: 'Cart' });
  readonly contactUsLink: Locator = this.page.getByRole('link', { name: 'Contact us' });
  readonly loggedInAs: Locator = this.page.locator('a').filter({ hasText: 'Logged in as' });
  readonly subscriptionEmail: Locator = this.page.locator('#susbscribe_email');
  readonly subscriptionButton: Locator = this.page.locator('#subscribe');
  readonly subscriptionSuccess: Locator = this.page.locator('#success-subscribe');

  async gotoHome(): Promise<void> {
    await this.open('/');
    await expect(this.logo).toBeVisible();
  }

  async goToSignupLogin(): Promise<void> {
    await this.clickVisible(this.signupLoginLink);
  }

  async goToProducts(): Promise<void> {
    await this.clickVisible(this.productsLink);
  }

  async goToCart(): Promise<void> {
    await this.clickVisible(this.cartLink);
  }

  async goToContactUs(): Promise<void> {
    await this.clickVisible(this.contactUsLink);
  }

  async logout(): Promise<void> {
    await this.clickVisible(this.logoutLink);
  }

  async deleteAccount(): Promise<void> {
    await this.clickVisible(this.deleteAccountLink);
  }

  async expectLoggedInAs(name: string): Promise<void> {
    await expect(this.loggedInAs).toContainText(name);
  }

  async subscribe(email: string): Promise<void> {
    await this.fillVisible(this.subscriptionEmail, email);
    await this.clickVisible(this.subscriptionButton);
  }
}
