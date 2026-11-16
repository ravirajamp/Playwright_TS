import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly loginHeading: Locator = this.page.getByRole('heading', { name: 'Login to your account' });
  readonly signupHeading: Locator = this.page.getByRole('heading', { name: 'New User Signup!' });
  readonly loginEmail: Locator = this.byDataQa('login-email');
  readonly loginPassword: Locator = this.byDataQa('login-password');
  readonly loginButton: Locator = this.byDataQa('login-button');
  readonly signupName: Locator = this.byDataQa('signup-name');
  readonly signupEmail: Locator = this.byDataQa('signup-email');
  readonly signupButton: Locator = this.byDataQa('signup-button');
  readonly loginError: Locator = this.page.locator('form[action="/login"] p');
  readonly signupError: Locator = this.page.locator('form[action="/signup"] p');

  async expectLoaded(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.signupHeading).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillVisible(this.loginEmail, email);
    await this.fillVisible(this.loginPassword, password);
    await this.clickVisible(this.loginButton);
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.fillVisible(this.signupName, name);
    await this.fillVisible(this.signupEmail, email);
    await this.clickVisible(this.signupButton);
  }

  async expectLoginError(): Promise<void> {
    await expect(this.loginError).toContainText('Your email or password is incorrect!');
  }

  async expectSignupEmailExistsError(): Promise<void> {
    await expect(this.signupError).toContainText('Email Address already exist!');
  }
}
