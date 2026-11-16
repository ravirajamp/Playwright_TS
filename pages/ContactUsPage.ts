import { expect, Locator } from '@playwright/test';
import { ContactFormData } from '../utils/testDataFactory';
import { BasePage } from './BasePage';
import path from 'path';

export class ContactUsPage extends BasePage {
  readonly getInTouchHeading: Locator = this.page.getByRole('heading', { name: 'Get In Touch' });
  readonly nameInput: Locator = this.page.locator('#contact-us-form input[data-qa="name"]');
  readonly emailInput: Locator = this.page.locator('#contact-us-form input[data-qa="email"]');
  readonly subjectInput: Locator = this.page.locator('#contact-us-form input[data-qa="subject"]');
  readonly messageInput: Locator = this.page.locator('#contact-us-form textarea[data-qa="message"]');
  readonly uploadInput: Locator = this.page.locator('#contact-us-form input[name="upload_file"]');
  readonly submitButton: Locator = this.page.locator('#contact-us-form input[data-qa="submit-button"]');
  readonly successAlert: Locator = this.page.locator('.status.alert-success');
  readonly homeButton: Locator = this.page.getByRole('link', { name: 'Home' });

  async expectLoaded(): Promise<void> {
    await expect(this.getInTouchHeading).toBeVisible();
  }

  async submitContactForm(data: ContactFormData, uploadFilePath?: string): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectInput.fill(data.subject);
    await this.messageInput.fill(data.message);

    if (uploadFilePath) {
      await this.uploadInput.setInputFiles(path.resolve(uploadFilePath));
    }

    // Native confirm() is raised on submit; accept it, then jQuery shows the success banner.
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.submitButton.click();
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(this.successAlert).toBeVisible({ timeout: 15_000 });
    await expect(this.successAlert).toContainText(
      'Success! Your details have been submitted successfully.',
    );
  }
}
