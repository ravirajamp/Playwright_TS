import { expect, Locator, Page } from '@playwright/test';

/** Prefer Playwright auto-waiting; helpers only encapsulate common sync patterns. */
export async function waitForVisible(locator: Locator, timeout = 15_000): Promise<void> {
  await expect(locator).toBeVisible({ timeout });
}

export async function waitForHidden(locator: Locator, timeout = 15_000): Promise<void> {
  await expect(locator).toBeHidden({ timeout });
}

export async function waitForUrlContains(page: Page, fragment: string | RegExp): Promise<void> {
  await expect(page).toHaveURL(fragment);
}

export async function dismissConsentIfPresent(page: Page): Promise<void> {
  const candidates = [
    page.locator('.fc-cta-consent'),
    page.getByRole('button', { name: /consent|accept|agree/i }),
    page.locator('#dismiss-button'),
  ];

  for (const locator of candidates) {
    const target = locator.first();
    if (await target.isVisible({ timeout: 800 }).catch(() => false)) {
      await target.click({ force: true }).catch(() => undefined);
    }
  }
}

/**
 * automationexercise.com injects full-page ad iframes that intercept clicks.
 * Remove them so POM actions stay deterministic.
 */
export async function clearAdOverlays(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.querySelectorAll('iframe, #aswift_0_host, #ad_position, .adsbygoogle').forEach((el) => {
      el.remove();
    });

    document.querySelectorAll('body > div').forEach((el) => {
      const style = window.getComputedStyle(el);
      const isOverlay =
        (style.position === 'fixed' || style.position === 'absolute') &&
        (style.zIndex === '2147483647' || Number(style.zIndex) > 100000);
      if (isOverlay) {
        el.remove();
      }
    });
  }).catch(() => undefined);
}
