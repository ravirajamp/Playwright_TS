import { Page, Route } from '@playwright/test';

const NOISE_PATTERNS = [
  '**/google-analytics.com/**',
  '**/googletagmanager.com/**',
  '**/doubleclick.net/**',
  '**/googlesyndication.com/**',
  '**/adservice.google.com/**',
  '**/pagead2.googlesyndication.com/**',
  '**/googleads.g.doubleclick.net/**',
  '**/tpc.googlesyndication.com/**',
  '**/fundingchoicesmessages.google.com/**',
];

/**
 * Network interception helpers.
 * Prefer API-level mocks for flaky third-party calls and deterministic UI states.
 */
export async function mockSubscriptionApi(
  page: Page,
  responseBody: Record<string, unknown> = { message: 'Email Successfully subscribed!' },
): Promise<void> {
  await page.route('**/api/verifySubscription**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(responseBody),
    });
  });
}

export async function mockProductsSearchApi(
  page: Page,
  products: Array<{ id: number; name: string; price: string; brand: string }>,
): Promise<void> {
  await page.route('**/api/searchProduct**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        responseCode: 200,
        products,
      }),
    });
  });
}

/** Abort known ad/analytics hosts only; avoid blanket catch-all routing. */
export async function blockThirdPartyNoise(page: Page): Promise<void> {
  for (const pattern of NOISE_PATTERNS) {
    await page.route(pattern, async (route: Route) => {
      await route.abort();
    });
  }
}

export async function captureApiTraffic(page: Page, pathFragment: string): Promise<string[]> {
  const urls: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes(pathFragment)) {
      urls.push(request.url());
    }
  });
  return urls;
}
