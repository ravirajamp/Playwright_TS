import { expect, Locator } from '@playwright/test';
import { UserProfile } from '../utils/testDataFactory';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  readonly enterAccountInfoHeading: Locator = this.page.getByText('Enter Account Information');
  readonly titleMr: Locator = this.page.locator('#id_gender1');
  readonly titleMrs: Locator = this.page.locator('#id_gender2');
  readonly password: Locator = this.byDataQa('password');
  readonly days: Locator = this.byDataQa('days');
  readonly months: Locator = this.byDataQa('months');
  readonly years: Locator = this.byDataQa('years');
  readonly newsletter: Locator = this.page.locator('#newsletter');
  readonly offers: Locator = this.page.locator('#optin');
  readonly firstName: Locator = this.byDataQa('first_name');
  readonly lastName: Locator = this.byDataQa('last_name');
  readonly company: Locator = this.byDataQa('company');
  readonly address1: Locator = this.byDataQa('address');
  readonly address2: Locator = this.byDataQa('address2');
  readonly country: Locator = this.byDataQa('country');
  readonly state: Locator = this.byDataQa('state');
  readonly city: Locator = this.byDataQa('city');
  readonly zipcode: Locator = this.byDataQa('zipcode');
  readonly mobileNumber: Locator = this.byDataQa('mobile_number');
  readonly createAccountButton: Locator = this.byDataQa('create-account');
  readonly accountCreatedHeading: Locator = this.byDataQa('account-created');
  readonly continueButton: Locator = this.byDataQa('continue-button');
  readonly accountDeletedHeading: Locator = this.byDataQa('account-deleted');

  async expectAccountInfoForm(): Promise<void> {
    await expect(this.enterAccountInfoHeading).toBeVisible();
  }

  async completeRegistration(user: UserProfile): Promise<void> {
    if (user.title === 'Mr') {
      await this.titleMr.check();
    } else {
      await this.titleMrs.check();
    }

    await this.fillVisible(this.password, user.password);
    await this.days.selectOption(user.birthDay);
    await this.months.selectOption(user.birthMonth);
    await this.years.selectOption(user.birthYear);
    await this.newsletter.check();
    await this.offers.check();
    await this.fillVisible(this.firstName, user.firstName);
    await this.fillVisible(this.lastName, user.lastName);
    await this.fillVisible(this.company, user.company);
    await this.fillVisible(this.address1, user.address1);
    await this.fillVisible(this.address2, user.address2);
    await this.country.selectOption(user.country);
    await this.fillVisible(this.state, user.state);
    await this.fillVisible(this.city, user.city);
    await this.fillVisible(this.zipcode, user.zipcode);
    await this.fillVisible(this.mobileNumber, user.mobileNumber);
    await Promise.all([
      this.page.waitForURL(/account_created|created_account/i, { timeout: 30_000 }).catch(() => undefined),
      this.clickVisible(this.createAccountButton),
    ]);
  }

  async expectAccountCreated(): Promise<void> {
    await expect(this.accountCreatedHeading).toBeVisible({ timeout: 30_000 });
    await expect(this.accountCreatedHeading).toHaveText(/Account Created!/i);
  }

  async continueAfterAccountCreated(): Promise<void> {
    await this.clickVisible(this.continueButton);
  }

  async expectAccountDeleted(): Promise<void> {
    await expect(this.accountDeletedHeading).toHaveText(/Account Deleted!/i);
  }

  async continueAfterAccountDeleted(): Promise<void> {
    await this.clickVisible(this.continueButton);
  }
}
