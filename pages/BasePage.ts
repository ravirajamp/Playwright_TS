import { Locator, Page } from '@playwright/test';
import { clearAdOverlays, dismissConsentIfPresent, waitForVisible } from '../utils/waitHelpers';

/**
 * Shared navigation and locator helpers for all page objects.
 * Locator strategy priority: data-qa > role/label > stable CSS > text.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await dismissConsentIfPresent(this.page);
    await clearAdOverlays(this.page);
  }

  protected byDataQa(value: string): Locator {
    return this.page.locator(`[data-qa="${value}"]`);
  }

  protected async prepareForAction(): Promise<void> {
    await dismissConsentIfPresent(this.page);
    await clearAdOverlays(this.page);
  }

  protected async clickVisible(locator: Locator): Promise<void> {
    await this.prepareForAction();
    await waitForVisible(locator);
    await locator.click({ timeout: 15_000 });
  }

  protected async fillVisible(locator: Locator, value: string): Promise<void> {
    await this.prepareForAction();
    await waitForVisible(locator);
    await locator.fill(value);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
