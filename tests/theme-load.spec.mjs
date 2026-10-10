import { test, expect } from '@playwright/test';
import { defaults, resolveTheme } from '../src/theme.mjs';

const rgb = hex => `rgb(${[1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16)).join(', ')})`;

test('a gallery preview receives palette changes made while its HTML is loading', async ({ page }) => {
  let releaseResponse;
  let recordRequest;
  const responseGate = new Promise(resolve => { releaseResponse = resolve; });
  const requested = new Promise(resolve => { recordRequest = resolve; });
  await page.route('**/examples/sliding-tabs.html*', async route => {
    recordRequest(route.request().url());
    await responseGate;
    await route.continue();
  });

  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const initialUrl = new URL(await requested);
    expect(initialUrl.searchParams.get('palette')).toBe('original');
    expect(initialUrl.searchParams.get('mode')).toBe('light');

    await page.locator('#palette-select').selectOption('radix');
    await page.locator('#appearance-select').selectOption('dark');
    releaseResponse();

    const preview = page.frameLocator('iframe[data-preview="sliding-tabs"]');
    await expect(preview.locator('html')).toHaveAttribute('data-palette', 'radix');
    await expect(preview.locator('html')).toHaveAttribute('data-demo-mode', 'dark');
    const expected = resolveTheme({ ...defaults, palette: 'radix', mode: 'dark' }, 'sand');
    await expect(preview.locator('html')).toHaveCSS('background-color', rgb(expected['demo-bg']));
    await expect(preview.locator('body')).toHaveCSS('color', rgb(expected.ink));
  } finally {
    releaseResponse();
  }
});
