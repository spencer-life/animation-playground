import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { defaults, themedCode } from '../src/theme.mjs';

const catalog = JSON.parse(await readFile(new URL('../dist/catalog.json', import.meta.url), 'utf8'));
const ids = recipes => recipes.map(recipe => recipe.id);
const renderedIds = page => page.locator('.sample').evaluateAll(elements => elements.map(element => element.dataset.recipe));
const routeValue = (page, name) => new URL(page.url()).searchParams.get(name);

async function expectMembers(page, recipes) {
  await expect.poll(async () => (await renderedIds(page)).sort()).toEqual(ids(recipes).sort());
}

async function openStudy(page, id, reduced = false) {
  await page.goto(`/examples/${id}.html?palette=radix&mode=dark&accent=indigo&paused=true&reduced=${reduced}`);
  await expect(page.locator('html')).toHaveAttribute('data-reduced', String(reduced));
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
});

test('project collections select real members, put curated picks first, and toggle off', async ({ page }) => {
  await page.goto('/');
  await expectMembers(page, catalog.recipes);
  for (const collection of catalog.collections) {
    const members = catalog.recipes.filter(recipe => recipe.collections.includes(collection.id));
    expect(members.length).toBeGreaterThan(0);
    expect(members.length).toBeLessThan(catalog.recipes.length);
    const button = page.locator(`[data-collection="${collection.id}"]`);
    await expect(button.locator('.collection-count')).toHaveText(String(members.length));
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expectMembers(page, members);
    expect((await renderedIds(page)).slice(0, collection.featured.length)).toEqual(collection.featured);
    await expect(page.locator('.collection-description')).toHaveText(collection.description);
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(routeValue(page, 'collection')).toBeNull();
    await expectMembers(page, catalog.recipes);
  }
});

test('purpose, technology, complexity, and multiword search narrow the same collection', async ({ page }) => {
  await page.goto('/');
  for (const intent of ['expressive', 'everyday']) {
    await page.locator(`[data-intent="${intent}"]`).click();
    await expectMembers(page, catalog.recipes.filter(recipe => recipe.intent === intent));
    await expect(page.locator(`[data-intent="${intent}"]`)).toHaveAttribute('aria-pressed', 'true');
  }
  await page.locator('#tech-filter').selectOption('CSS');
  await page.locator('#complexity-filter').selectOption('starter');
  await expectMembers(page, catalog.recipes.filter(recipe => recipe.intent === 'everyday' && recipe.tech === 'CSS' && recipe.complexity === 'starter'));
  await page.getByRole('searchbox', { name: 'Search animations' }).fill('three-percent compression');
  await expect.poll(() => renderedIds(page)).toEqual(['press-feedback']);
  await expect(page.getByRole('searchbox', { name: 'Search animations' })).toBeFocused();
  expect(routeValue(page, 'q')).toBe('three-percent compression');
  expect(routeValue(page, 'intent')).toBe('everyday');
  expect(routeValue(page, 'tech')).toBe('CSS');
  expect(routeValue(page, 'complexity')).toBe('starter');
  await page.locator('#tech-filter').selectOption('Motion');
  await expect(page.getByRole('heading', { name: 'No matching animations.' })).toBeVisible();
  await expect(page.locator('.sample')).toHaveCount(0);
});

test('clearing discovery filters keeps the selected project colors', async ({ page }) => {
  const params = new URLSearchParams({ collection: 'dashboards', intent: 'everyday', tech: 'CSS', complexity: 'starter', sort: 'az', q: 'button', palette: 'custom', mode: 'dark', accent: 'jade', custom: '#00ff88' });
  await page.goto(`/?${params}`);
  await page.getByRole('button', { name: /^Clear filters/ }).click();
  await expectMembers(page, catalog.recipes);
  for (const name of ['collection', 'category', 'intent', 'tech', 'complexity', 'sort', 'q']) expect(routeValue(page, name)).toBeNull();
  for (const [name, value] of Object.entries({ palette: 'custom', mode: 'dark', accent: 'jade', custom: '#00ff88' })) expect(routeValue(page, name)).toBe(value);
  await expect(page.locator('#palette-select')).toHaveValue('custom');
  await expect(page.locator('#appearance-select')).toHaveValue('dark');
  await expect(page.locator('#custom-hex')).toHaveValue('#00ff88');
  await expect(page.locator('#tech-filter')).toHaveValue('all');
  await expect(page.locator('#complexity-filter')).toHaveValue('all');
  await expect(page.locator('#sort-filter')).toHaveValue('curated');
});

test('A–Z order survives back and forward while saves and viewing preferences survive reload', async ({ page }) => {
  await page.goto('/?collection=dashboards');
  await page.locator('#palette-select').selectOption('geist');
  await page.locator('#appearance-select').selectOption('dark');
  await page.locator('#accent-select').selectOption('violet');
  await page.locator('[data-save="toggle-switch"]').click();
  await page.locator('[data-action="previews"]').click();
  await page.locator('[data-action="reduced"]').click();
  await page.locator('#sort-filter').selectOption('az');
  const alphabetical = catalog.recipes.filter(recipe => recipe.collections.includes('dashboards')).sort((a, b) => a.title.localeCompare(b.title));
  await expect.poll(() => renderedIds(page)).toEqual(ids(alphabetical));
  await page.locator('.sample-title[data-open="toggle-switch"]').click();
  await expect(page.locator('#detail-frame')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#sort-filter')).toHaveValue('az');
  await expect.poll(() => renderedIds(page)).toEqual(ids(alphabetical));
  await page.goForward();
  await expect(page.locator('#detail-frame')).toBeVisible();
  await page.goBack();
  await page.reload();
  await expect(page.locator('[data-save="toggle-switch"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-action="previews"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-action="reduced"]')).toHaveAttribute('aria-pressed', 'true');
  // A plain URL must restore stored choices, rather than just repeating them
  // from the history entry that already carries palette parameters.
  await page.goto('/');
  await expect(page.locator('#palette-select')).toHaveValue('geist');
  await expect(page.locator('#appearance-select')).toHaveValue('dark');
  await expect(page.locator('#accent-select')).toHaveValue('violet');
  await page.locator('[data-category="saved"]').click();
  await expect.poll(() => renderedIds(page)).toEqual(['toggle-switch']);
});

test('invalid route values fall back safely and an unknown animation has a working recovery', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const invalid = Object.fromEntries(['category', 'collection', 'intent', 'tech', 'complexity', 'sort', 'palette', 'mode', 'accent', 'custom'].map(name => [name, 'not-a-valid-value']));
  await page.goto(`/?${new URLSearchParams(invalid)}`);
  await expectMembers(page, catalog.recipes);
  await expect(page.locator('#palette-select')).toHaveValue('original');
  await expect(page.locator('#appearance-select')).toHaveValue('auto');
  await expect(page.locator('#accent-select')).toHaveValue('indigo');
  for (const selector of ['#tech-filter', '#complexity-filter']) await expect(page.locator(selector)).toHaveValue('all');
  await expect(page.locator('#sort-filter')).toHaveValue('curated');
  await page.goto('/?animation=not-an-animation&palette=radix&mode=dark');
  await expect(page.getByRole('heading', { name: 'That animation isn’t here.' })).toBeVisible();
  await page.getByRole('button', { name: 'Browse all animations', exact: true }).click();
  await expectMembers(page, catalog.recipes);
  await expect(page.locator('#palette-select')).toHaveValue('radix');
  await expect(page.locator('#appearance-select')).toHaveValue('dark');
  expect(errors).toEqual([]);
});

test('blocked localStorage leaves search, palette choices, and visit-only saves usable', async ({ page }) => {
  await page.addInitScript(() => {
    if (window.top !== window) return;
    Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('Storage is blocked in this test.', 'SecurityError'); } });
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expectMembers(page, catalog.recipes);
  await page.locator('#palette-select').selectOption('radix');
  await page.locator('#appearance-select').selectOption('dark');
  await page.getByRole('searchbox', { name: 'Search animations' }).fill('three-percent compression');
  await expect.poll(() => renderedIds(page)).toEqual(['press-feedback']);
  await page.locator('[data-save="press-feedback"]').click();
  await expect(page.locator('#announcement')).toContainText('Saved for this visit. Browser storage is unavailable.');
  await page.locator('[data-category="saved"]').click();
  await expect.poll(() => renderedIds(page)).toEqual(['press-feedback']);
  await expect(page.locator('[data-save="press-feedback"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#palette-select')).toHaveValue('radix');
  await expect(page.locator('#appearance-select')).toHaveValue('dark');
  expect(errors).toEqual([]);
});

test('Download standalone HTML saves the selected custom palette with complete source', async ({ page }) => {
  const selection = { ...defaults, palette: 'custom', mode: 'dark', accent: 'jade', custom: '#00ff88' };
  await page.goto(`/?${new URLSearchParams({ animation: 'press-feedback', ...selection })}`);
  await expect(page.locator('#detail-frame')).toBeVisible();
  const pending = page.waitForEvent('download');
  await page.locator('[data-action="download-full"]').click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe('press-feedback.html');
  expect(await download.failure()).toBeNull();
  const stream = await download.createReadStream();
  expect(stream).not.toBeNull();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const code = Buffer.concat(chunks).toString('utf8');
  const built = await readFile(new URL('../dist/examples/press-feedback.html', import.meta.url), 'utf8');
  expect(code).toBe(themedCode(built, selection, 'lavender'));
  const embedded = code.match(/<script id="playground-theme-config" type="application\/json">([\s\S]*?)<\/script>/);
  expect(embedded).not.toBeNull();
  expect(JSON.parse(embedded[1])).toEqual({ ...selection, color: 'lavender' });
  expect(code).toContain('--accent: #00ff88;');
  expect(code).toContain('color-scheme: dark;');
});

test.describe('390px touch discovery', () => {
  test.use({ viewport: { width: 390, height: 1000 }, isMobile: true, hasTouch: true });

  test('collection scrolling and compact filters remain operable without page overflow', async ({ page }) => {
    await page.goto('/');
    const theme = page.locator('details.theme-studio');
    await expect(theme).toHaveJSProperty('open', false);
    await expect(theme.locator('summary')).toBeVisible();
    const firstSample = await page.locator('.sample').first().boundingBox();
    expect(firstSample).not.toBeNull();
    expect(firstSample.y).toBeGreaterThanOrEqual(0);
    expect(firstSample.y).toBeLessThan(1000);
    await theme.locator('summary').tap();
    await expect(theme).toHaveJSProperty('open', true);
    await page.locator('#palette-select').selectOption('radix');
    await page.locator('#appearance-select').selectOption('dark');
    await expect(theme).toHaveJSProperty('open', true);
    await expect(page.locator('#palette-select')).toHaveValue('radix');
    await expect(page.locator('#appearance-select')).toHaveValue('dark');
    const signature = page.locator('[data-collection="signature"]');
    await signature.scrollIntoViewIfNeeded();
    await signature.tap();
    await expect(signature).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => signature.evaluate(button => {
      const bounds = button.getBoundingClientRect();
      const strip = button.closest('.collection-strip').getBoundingClientRect();
      return bounds.left >= strip.left - 1 && bounds.right <= strip.right + 1;
    }), { message: 'The selected collection remains visible inside its horizontal strip.' }).toBe(true);
    await page.locator('[data-intent="expressive"]').tap();
    await page.locator('#tech-filter').selectOption('Motion');
    await page.locator('#complexity-filter').selectOption('intermediate');
    const expected = catalog.recipes.filter(recipe => recipe.collections.includes('signature') && recipe.intent === 'expressive' && recipe.tech === 'Motion' && recipe.complexity === 'intermediate');
    await expectMembers(page, expected);
    for (const selector of ['[data-intent="expressive"]', '#tech-filter', '#complexity-filter', '#sort-filter', '#palette-select', '#appearance-select']) {
      const control = page.locator(selector);
      await control.scrollIntoViewIfNeeded();
      const bounds = await control.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds.width).toBeGreaterThanOrEqual(24);
      expect(bounds.height).toBeGreaterThanOrEqual(24);
      expect(bounds.x).toBeGreaterThanOrEqual(-1);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(391);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
    await page.getByRole('button', { name: /^Clear filters/ }).tap();
    await expectMembers(page, catalog.recipes);
  });
});

test('skeleton loading can be interrupted and a later reload still reveals real content', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openStudy(page, 'skeleton-reveal');
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  await expect(page.locator('.skeleton-card')).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Load again', exact: true }).click();
  await page.evaluate(() => Demo.setSettings({ reduced: true }));
  await expect(page.locator('.skeleton-card')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('.skeleton-layer')).toBeHidden();
  await expect(page.locator('.loaded-card')).toHaveCSS('opacity', '1');
  await expect(page.locator('.loaded-card')).not.toHaveAttribute('aria-hidden', 'true');
  await page.evaluate(() => Demo.setSettings({ reduced: false }));
  await page.getByRole('button', { name: 'Load again', exact: true }).click();
  await expect(page.locator('.skeleton-card')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('.skeleton-layer')).toBeHidden();
  await expect(page.locator('.skeleton-status')).toHaveText('Demo content loaded');
  expect(errors).toEqual([]);
});

test('keyboard navigation keeps publishing steps and a collapsed sidebar understandable', async ({ page }) => {
  await openStudy(page, 'stepper-progress');
  await expect(page.locator('.stepper-back')).toBeDisabled();
  await page.locator('.stepper-next').press('Enter');
  await expect(page.locator('[data-step="1"]')).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('.stepper-copy p')).toHaveText('Step 2 of 3 · Review');
  expect(await page.locator('.stepper-track span').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m11)).toBe(0.5);
  await page.locator('[data-step="2"]').press('Enter');
  await expect(page.locator('.stepper-next')).toContainText('Start again');
  await page.locator('.stepper-next').press('Enter');
  await expect(page.locator('[data-step="0"]')).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('.stepper-back')).toBeDisabled();

  await openStudy(page, 'sidebar-collapse');
  const initialWidth = await page.locator('.rail-view').evaluate(element => element.getBoundingClientRect().width);
  await page.getByRole('button', { name: 'Collapse navigation', exact: true }).press('Enter');
  await expect(page.locator('.rail-shell')).toHaveAttribute('data-compact', 'true');
  await expect(page.getByRole('button', { name: 'Expand navigation', exact: true })).toHaveAttribute('aria-expanded', 'false');
  expect(await page.locator('.rail-view').evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(initialWidth);
  await page.getByRole('button', { name: 'Activity', exact: true }).press('Enter');
  await expect(page.getByRole('button', { name: 'Activity', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.rail-view h2')).toHaveText('Activity');
  await page.getByRole('button', { name: 'Expand navigation', exact: true }).press('Enter');
  await expect(page.locator('.rail-shell')).toHaveAttribute('data-compact', 'false');
  await expect(page.locator('.rail-view h2')).toHaveText('Activity');
});

test('filtered assets and reading progress report the actual visible content', async ({ page }) => {
  await openStudy(page, 'filter-grid', true);
  await expect(page.locator('.filter-item:visible')).toHaveCount(6);
  for (const [name, labels] of [['Brand', ['Mark', 'Pattern', 'Loop']], ['UI', ['Button', 'Card', 'Badge']]]) {
    await page.getByRole('button', { name, exact: true }).press('Enter');
    await expect(page.locator('.filter-item:visible')).toHaveText(labels);
    await expect(page.locator('.filter-item[hidden]')).toHaveCount(3);
    await expect(page.locator('.filter-count')).toHaveText(`3 assets · ${name}`);
  }
  await page.getByRole('button', { name: 'All', exact: true }).press('Enter');
  await expect(page.locator('.filter-item:visible')).toHaveCount(6);
  await expect(page.locator('.filter-count')).toHaveText('6 assets · All');

  await openStudy(page, 'scroll-progress', true);
  const pane = page.locator('.reading-pane');
  const progress = page.getByRole('progressbar', { name: 'Reading position' });
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await pane.press('PageDown');
  await expect.poll(async () => Number(await progress.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
  await pane.press('End');
  await expect(progress).toHaveAttribute('aria-valuenow', '100');
  await expect(page.locator('.reading-percent')).toHaveText('100%');
  await pane.press('Home');
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await expect(page.locator('.reading-percent')).toHaveText('0%');
});

test('reduced-motion spotlight and ripple controls still respond without pointer travel', async ({ page }) => {
  await openStudy(page, 'spotlight-card', true);
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  const card = page.getByRole('button', { name: 'Keep spotlight on' });
  await card.press('Enter');
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.spotlight-status')).toHaveText('Spotlight stays on');
  const bounds = await card.boundingBox();
  await page.mouse.move(bounds.x + 12, bounds.y + 12);
  await expect(page.locator('.spotlight-beam')).toHaveCSS('transform', 'none');
  await card.press('Enter');
  await expect(card).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.spotlight-status')).toHaveText('Spotlight follows your pointer or focus');

  await openStudy(page, 'ripple-field', true);
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  const field = page.getByRole('button', { name: 'Send a ripple', exact: true });
  await field.click({ position: { x: 40, y: 40 } });
  await expect(page.locator('.ripple-origin')).not.toHaveAttribute('transform', 'translate(140 81)');
  await field.press('Enter');
  await expect(page.locator('.ripple-origin')).toHaveAttribute('transform', 'translate(140 81)');
  await expect(page.locator('.ripple-status')).toHaveText('Ripple 3 · then stillness');
  expect(await page.locator('.ripple-ring').evaluateAll(elements => elements.every(element => Number(getComputedStyle(element).opacity) > 0 && element.getAnimations().length === 0))).toBe(true);
});
