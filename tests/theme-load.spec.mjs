import { test, expect } from '@playwright/test';
import { contrast, defaults, resolveTheme } from '../src/theme.mjs';

const rgb = hex => `rgb(${[1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16)).join(', ')})`;

test('a gallery preview receives palette changes made while its HTML is loading', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
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

const focusStudies = [
  { id: 'press-feedback', control: '.press-button', outline: '.press-button', surface: 'body' },
  { id: 'toggle-switch', control: '#focus-switch', outline: '.switch-track', surface: '.switch-row' },
  { id: 'segmented-control', control: '.segments input:checked', outline: '.segments > label:first-of-type', surface: '.segments' },
  { id: 'accordion', control: '.measured-details summary', outline: '.measured-details summary', surface: '.measured-details' },
];

const cssHex = color => '#' + color.match(/[\d.]+/g).slice(0, 3)
  .map(channel => Math.round(Number(channel)).toString(16).padStart(2, '0')).join('');

for (const theme of [
  { label: 'custom black in dark mode', palette: 'custom', mode: 'dark', custom: '#000000' },
  { label: 'Radix amber in light mode', palette: 'radix', mode: 'light', accent: 'amber' },
]) {
  test(`keyboard focus remains visible and still with ${theme.label}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const { label, ...selection } = theme;
    const params = new URLSearchParams({ ...defaults, ...selection, reduced: 'true', paused: 'false' });

    for (const study of focusStudies) {
      await test.step(study.id, async () => {
        await page.goto(`/examples/${study.id}.html?${params}`);
        await expect(page.locator('html')).toHaveAttribute('data-reduced', 'true');
        await page.evaluate(() => document.fonts.ready);
        const outlined = page.locator(study.outline);
        await expect(outlined).toBeVisible();
        const before = await outlined.boundingBox();

        await page.keyboard.press('Tab');
        await expect(page.locator(study.control)).toBeFocused();
        expect(await page.locator(study.control).evaluate(element => element.matches(':focus-visible'))).toBe(true);
        await expect(page.locator('html')).toHaveAttribute('data-keyboard', 'true');
        const focus = await page.evaluate(({ outline, surface }) => {
          const style = getComputedStyle(document.querySelector(outline));
          return {
            color: style.outlineColor,
            width: parseFloat(style.outlineWidth),
            style: style.outlineStyle,
            background: getComputedStyle(document.querySelector(surface)).backgroundColor,
            moving: document.getAnimations().filter(animation => animation.playState === 'running').length,
          };
        }, study);
        expect(focus.style).toBe('solid');
        expect(focus.width).toBeGreaterThanOrEqual(3);
        expect(contrast(cssHex(focus.color), cssHex(focus.background))).toBeGreaterThanOrEqual(3);
        expect(focus.moving).toBe(0);
        expect(await outlined.boundingBox()).toEqual(before);
        await page.waitForTimeout(120);
        expect(await outlined.boundingBox()).toEqual(before);
        expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
      });
    }
  });
}
