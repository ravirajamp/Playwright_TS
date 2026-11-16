import { test } from '../fixtures/testFixtures';
import { createContactFormData } from '../utils/testDataFactory';
import contact from '../testdata/contact.json';
import path from 'path';

test.describe('Contact Us form @regression', () => {
  // Keep third-party blocking off here; consent/ad scripts can race the native confirm dialog.
  test.use({ blockNoise: false });

  test('TC05 - Submit Contact Us form with attachment', async ({ page, contactUsPage }) => {
    const data = createContactFormData({
      name: contact.valid.name,
      subject: contact.valid.subject,
      message: contact.valid.message,
    });

    await page.goto('/contact_us', { waitUntil: 'domcontentloaded' });
    await contactUsPage.expectLoaded();
    await contactUsPage.submitContactForm(
      data,
      path.join(__dirname, '..', 'testdata', 'sample-upload.txt'),
    );
    await contactUsPage.expectSuccessMessage();
  });
});
