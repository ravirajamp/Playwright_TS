import AxeBuilder from '@axe-core/playwright';
import { expect, Page, TestInfo } from '@playwright/test';

export type A11yScanOptions = {
  include?: string[];
  exclude?: string[];
  tags?: string[];
};

/**
 * Runs axe-core against the current page and attaches a JSON report on failure.
 */
export async function assertNoCriticalA11yViolations(
  page: Page,
  testInfo: TestInfo,
  options: A11yScanOptions = {},
): Promise<void> {
  let builder = new AxeBuilder({ page }).withTags(options.tags ?? ['wcag2a', 'wcag2aa']);

  if (options.include?.length) {
    builder = builder.include(options.include);
  }
  if (options.exclude?.length) {
    for (const selector of options.exclude) {
      builder = builder.exclude(selector);
    }
  }

  const results = await builder.analyze();
  const criticalOrSerious = results.violations.filter((v) =>
    ['critical', 'serious'].includes(v.impact ?? ''),
  );

  await testInfo.attach('axe-results.json', {
    body: Buffer.from(JSON.stringify(results, null, 2)),
    contentType: 'application/json',
  });

  expect(
    criticalOrSerious,
    `Found ${criticalOrSerious.length} critical/serious accessibility violation(s):\n` +
      criticalOrSerious.map((v) => `- ${v.id}: ${v.help}`).join('\n'),
  ).toEqual([]);
}
