# Automation Exercise — Playwright TypeScript Framework

Enterprise e-commerce automation framework for [automationexercise.com](https://automationexercise.com/), built for the Perficient Playwright Capstone.

## Goals

- Validate critical customer journeys across Chromium, Firefox, and WebKit
- Keep tests readable with Page Object Model + custom fixtures
- Separate config and test data from test logic
- Produce HTML/JUnit reports, screenshots, videos, and traces
- Demonstrate accessibility scanning, visual regression, and network mocking

## Framework structure

```text
automation-exercise-pw/
├── config/                 # Environment & runtime settings
├── fixtures/               # Custom Playwright fixtures (POM injection)
├── pages/                  # Page Object Model classes
├── testdata/               # Static JSON / upload fixtures
├── tests/                  # Spec files (business workflows)
├── utils/                  # Factories, waits, a11y, network helpers
├── reports/                # HTML / JSON / JUnit output
├── playwright.config.ts
└── README.md
```

## Design decisions

| Area | Approach |
|------|----------|
| Locator strategy | Prefer `data-qa`, then role/label, then stable CSS |
| Synchronization | Rely on Playwright auto-wait; helpers only for consent/common patterns |
| Fixtures | Inject page objects so specs stay assertion-focused |
| Test data | Factory for unique users; JSON for shared static inputs |
| Isolation | Disposable accounts created/deleted per journey where needed |
| Reporting | HTML + JSON + JUnit; trace on first retry; screenshot/video on failure |
| Noise control | Optional blocking of analytics/ad requests for stability |

## Prerequisites

- Node.js 18+
- npm

```bash
npm install
npx playwright install
```

If corporate TLS interception blocks browser downloads:

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx playwright install
```

## Configuration

Copy `.env.example` to `.env` (already included for local runs):

```env
BASE_URL=https://automationexercise.com/
HEADLESS=true
DEFAULT_TIMEOUT=30000
SLOW_MO=0
```

## Test coverage (10 cases)

| ID | Spec | Coverage |
|----|------|----------|
| TC01 | `auth.spec.ts` | Register → session → logout |
| TC02 | `products-cart.spec.ts` | Data-driven product search |
| TC03 | `products-cart.spec.ts` | Add / remove cart items |
| TC04 | `checkout.spec.ts` | Checkout + order placement |
| TC05 | `contact.spec.ts` | Contact Us + file upload |
| TC06 | `advanced.spec.ts` | axe-core accessibility scan |
| TC07 | `advanced.spec.ts` | Visual regression snapshot |
| TC18 | `advanced.spec.ts` | Network interception / API mock |

## Commands

```bash
# Full suite (all configured browsers)
npm test

# Single browser
npm run test:chromium

# Tags
npm run test:smoke
npm run test:regression
npm run test:a11y
npm run test:visual

# Headed / report / codegen
npm run test:headed
npm run report
npm run codegen

# Create or refresh visual baselines
npx playwright test --grep @visual --update-snapshots
```

## Debugging failures

1. Open the HTML report: `npm run report`
2. Inspect failure screenshot / video under `test-results/`
3. Re-run with trace: failures retry with `trace: on-first-retry`
4. View a trace: `npx playwright show-trace test-results/.../trace.zip`
5. Use headed mode or Playwright Inspector: `npx playwright test --debug`

## Accessibility & visual notes

- **axe-core** attaches JSON + summary artifacts to the report. Third-party ads/consent widgets on the AUT often introduce WCAG noise; owned application regions should be gated more strictly in real client apps.
- **Visual baselines** are browser/OS sensitive. Generate them once with `--update-snapshots` on the intended CI image, then commit `*-snapshots/` folders.

## AI-assisted development note

AI tooling was used to accelerate scaffolding (POM skeleton, fixture wiring, config boilerplate). Locators, wait strategy, checkout stability, consent handling, and assertion design were reviewed and tightened manually for maintainability and interview-ready explanations.

## Suggested presentation talking points

1. Why POM + fixtures beat raw scripts for multi-engineer teams
2. Locator priority and why `data-qa` reduces flake
3. How unique test-data factories avoid shared-account collisions
4. Trace/screenshot workflow for production triage
5. Where network mocks, a11y, and visual checks fit in a CI quality gate
