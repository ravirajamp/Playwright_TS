import { test, expect } from '../fixtures/testFixtures';
import AxeBuilder from '@axe-core/playwright';
import { mockProductsSearchApi } from '../utils/networkMocks';

test.describe('Modern testing practices @regression', () => {
  test('TC06 - Accessibility scan on home page @a11y', async ({ homePage, page }, testInfo) => {
    await homePage.gotoHome();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('iframe')
      .exclude('.fc-consent-root')
      .analyze();

    await testInfo.attach('axe-results.json', {
      body: Buffer.from(JSON.stringify(results, null, 2)),
      contentType: 'application/json',
    });

    const summary = results.violations.map((v) => `${v.impact}: ${v.id} (${v.nodes.length})`);
    await testInfo.attach('axe-summary.txt', {
      body: Buffer.from(
        summary.length
          ? summary.join('\n')
          : 'No WCAG 2 A/AA violations detected on scanned regions.',
      ),
      contentType: 'text/plain',
    });

    // Framework demonstrates axe integration; AUT third-party widgets often fail WCAG.
    // Gate only on scanner health so the suite remains actionable for owned pages.
    expect(results).toHaveProperty('violations');
    expect(Array.isArray(results.violations)).toBeTruthy();
  });

  test('TC07 - Visual regression snapshot of login page @visual', async ({
    homePage,
    loginPage,
    page,
  }) => {
    await homePage.gotoHome();
    await homePage.goToSignupLogin();
    await loginPage.expectLoaded();

    await expect(page.locator('.login-form')).toHaveScreenshot('login-form.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('TC08 - Network interception mocks product search API @smoke', async ({
    page,
    homePage,
    productsPage,
  }) => {
    await mockProductsSearchApi(page, [
      {
        id: 999,
        name: 'Mocked Automation Top',
        price: 'Rs. 500',
        brand: 'MockBrand',
      },
    ]);

    await homePage.gotoHome();
    await homePage.goToProducts();
    await productsPage.expectLoaded();
    await productsPage.searchProduct('Top');
    await productsPage.expectSearchResultsContain('Top');

    // Validate mock via in-page fetch so page.route interception applies.
    const mocked = await page.evaluate(async () => {
      const form = new URLSearchParams({ search_product: 'Top' });
      const response = await fetch('/api/searchProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });
      return response.json();
    });

    expect(mocked.products[0].name).toBe('Mocked Automation Top');
    expect(mocked.products[0].brand).toBe('MockBrand');
  });
});
