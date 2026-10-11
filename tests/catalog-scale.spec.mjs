import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const catalog = JSON.parse(await readFile(new URL('../dist/catalog.json', import.meta.url), 'utf8'));

// These layouts exceeded the compact canvas in the first visual review. Check
// the actual outer document and captions, rather than hiding overflow in CSS.
for (const viewport of [{ width: 300, height: 230 }, { width: 700, height: 420 }]) {
  test(`reviewed dashboard layouts keep their content inside the ${viewport.width}×${viewport.height} canvas`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const id of ['table-row-expand', 'list-grid-morph', 'metric-drilldown', 'chart-range', 'timeline-cursor', 'split-pane']) {
      await page.goto(`/examples/${id}.html?reduced=true`);
      const bounds = await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        children: [...document.querySelector('.stage').children]
          .filter(element => !element.hidden && element.getClientRects().length)
          .map(element => {
            const box = element.getBoundingClientRect();
            return { name: element.className, top: box.top, bottom: box.bottom };
          }),
      }));
      expect(bounds.width, `${id}: outer width`).toBeLessThanOrEqual(viewport.width + 1);
      expect(bounds.height, `${id}: outer height`).toBeLessThanOrEqual(viewport.height + 1);
      for (const child of bounds.children) {
        expect(child.top, `${id}/${child.name}: top`).toBeGreaterThanOrEqual(-1);
        expect(child.bottom, `${id}/${child.name}: bottom`).toBeLessThanOrEqual(viewport.height + 1);
      }
    }
  });
}

test('the expanded gallery loads nearby previews and pauses studies left behind', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.sample')).toHaveCount(catalog.count);

  const firstId = catalog.recipes[0].id;
  const lastId = catalog.recipes.at(-1).id;
  const first = page.locator(`iframe[data-preview="${firstId}"]`);
  const last = page.locator(`iframe[data-preview="${lastId}"]`);
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute('src', /examples\//);
  await expect(page.frameLocator(`iframe[data-preview="${firstId}"]`).locator('html')).toHaveAttribute('data-paused', 'false');
  // Increasing catalog breadth must not eagerly start every embedded document.
  expect(await page.locator('iframe[data-preview][src]').count()).toBeLessThan(catalog.count / 2);

  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveAttribute('src', /examples\//);
  await expect(page.frameLocator(`iframe[data-preview="${lastId}"]`).locator('html')).toHaveAttribute('data-paused', 'false');
  await expect(page.frameLocator(`iframe[data-preview="${firstId}"]`).locator('html')).toHaveAttribute('data-paused', 'true');

  await page.locator('[data-action="previews"]').click();
  await expect(page.locator('[data-action="previews"]')).toHaveAttribute('aria-pressed', 'false');
  await last.scrollIntoViewIfNeeded();
  await expect(page.frameLocator(`iframe[data-preview="${lastId}"]`).locator('html')).toHaveAttribute('data-paused', 'true');
  expect(errors).toEqual([]);
});
