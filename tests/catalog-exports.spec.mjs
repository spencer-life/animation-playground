import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { defaults, resolveTheme, themedCode } from '../src/theme.mjs';

const catalog = JSON.parse(await readFile(new URL('../dist/catalog.json', import.meta.url), 'utf8'));
const examples = [
  { id: 'form-success', selection: { palette: 'custom', mode: 'dark', custom: '#00ff88' } },
  { id: 'dock-magnification', selection: { palette: 'geist', mode: 'dark', accent: 'violet' } },
  { id: 'path-follower', selection: { palette: 'radix', mode: 'light', accent: 'amber' } },
];

for (const example of examples) {
  test(`${example.id}: workbench exports preserve their selected theme and run offline`, async ({ page, context, browser }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const recipe = catalog.recipes.find(item => item.id === example.id);
    const selection = { ...defaults, ...example.selection };
    const parameters = new URLSearchParams({ animation: recipe.id, ...selection });
    await page.goto(`/?${parameters}`);
    await page.getByRole('button', { name: 'Copy full example', exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('playground-theme-config');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    const built = await readFile(new URL(`../dist/${recipe.example}`, import.meta.url), 'utf8');
    expect(copied).toBe(themedCode(built, selection, recipe.color));

    const offline = await browser.newContext({ offline: true, viewport: { width: 700, height: 420 }, reducedMotion: 'reduce' });
    try {
      const standalone = await offline.newPage();
      const errors = [];
      const requests = [];
      standalone.on('pageerror', error => errors.push(error.message));
      standalone.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
      // There is no application shell, URL configuration, stylesheet request,
      // or CDN in this context. The copied document must carry every prerequisite.
      await standalone.setContent(copied, { waitUntil: 'load' });
      await expect(standalone.locator('html')).toHaveAttribute('data-palette', selection.palette);
      await expect(standalone.locator('html')).toHaveAttribute('data-demo-mode', selection.mode);
      const tokens = resolveTheme(selection, recipe.color);
      const applied = await standalone.locator('html').evaluate((root, names) => {
        const style = getComputedStyle(root);
        return Object.fromEntries(names.map(name => [name, style.getPropertyValue(`--${name}`).trim()]));
      }, Object.keys(tokens));
      expect(applied).toEqual(tokens);

      if (recipe.id === 'form-success') {
        await standalone.getByRole('button', { name: 'Edit details', exact: true }).click();
        const email = standalone.getByRole('textbox', { name: 'Email address', exact: true });
        await expect(email).toBeFocused();
        await email.fill('a-person@example.com');
        await email.press('Enter');
        await expect(standalone.getByRole('heading', { name: 'You’re on the demo list.', exact: true })).toBeFocused();
        await standalone.getByRole('button', { name: 'Edit details', exact: true }).click();
        await expect(email).toHaveValue('a-person@example.com');
      } else if (recipe.id === 'dock-magnification') {
        expect(await standalone.evaluate(() => typeof Motion.motionValue)).toBe('function');
        await standalone.getByRole('button', { name: 'Notes', exact: true }).press('Enter');
        await expect(standalone.getByRole('status')).toHaveText('Notes is open');
        await standalone.evaluate(() => { Demo.setSettings({ reduced: false }); Demo.replay(); });
        await expect.poll(() => standalone.locator('.dock-face').nth(1).evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeGreaterThan(1.05);
        await standalone.evaluate(() => Demo.setSettings({ reduced: true }));
        await expect.poll(() => standalone.locator('.dock-face').nth(1).evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBe(1);
      } else {
        const destination = await standalone.locator('.follower-marker').evaluate(element => {
          const transform = new DOMMatrixReadOnly(getComputedStyle(element).transform);
          return { x: transform.e, y: transform.f };
        });
        expect(destination.x).toBeCloseTo(253, 1);
        expect(destination.y).toBeCloseTo(43, 1);
        await standalone.evaluate(() => { Demo.setSettings({ reduced: false }); Demo.replay(); });
        await expect.poll(() => standalone.evaluate(() => document.getAnimations().some(animation => animation.playState === 'running'))).toBe(true);
        await standalone.evaluate(() => Demo.setSettings({ reduced: true }));
      }

      expect(requests).toEqual([]);
      expect(errors).toEqual([]);
    } finally {
      await offline.close();
    }
  });
}
