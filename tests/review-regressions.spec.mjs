import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const catalog = JSON.parse(await readFile('dist/catalog.json', 'utf8'));

// These checks exercise the review's interaction and lifecycle regressions.
// The controlled clock is used only for bounded demonstration timers; visual
// spring and CSS-animation checks run on the browser's actual animation clock.
async function openWithStoppedClock(page, id) {
  await page.clock.install({ time: new Date('2026-10-10T12:00:00Z') });
  await page.goto(`/examples/${id}.html?paused=true`);
  await page.clock.pauseAt(new Date('2026-10-10T12:01:00Z'));
}

test('Play previews starts scenes that were first loaded paused', async ({ page }) => {
  await page.addInitScript(() => { if (window.top === window) localStorage.setItem('ap-playing', 'false'); });
  await page.goto('/');
  const preview = page.frameLocator('iframe[data-preview="sliding-tabs"]');
  await expect(preview.locator('html')).toHaveAttribute('data-paused', 'true');
  const tabs = preview.locator('[role="tab"]');
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

  await page.getByRole('button', { name: 'Play previews', exact: true }).click();
  await expect(preview.locator('html')).toHaveAttribute('data-paused', 'false');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
});

test('a paused finite sequence resumes from its remaining logical delay', async ({ page }) => {
  await openWithStoppedClock(page, 'save-state');
  const button = page.locator('.save-button');
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  await page.clock.runFor(500);
  await expect(button).toHaveAttribute('data-state', 'saving');

  await page.evaluate(() => Demo.setSettings({ paused: true }));
  await page.clock.runFor(5000);
  await expect(button).toHaveAttribute('data-state', 'saving');
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  await page.clock.runFor(750);
  await expect(button).toHaveAttribute('data-state', 'saving');
  await page.clock.runFor(50);
  await expect(button).toHaveAttribute('data-state', 'saved');
  await page.clock.runFor(1600);
  await expect(button).toHaveAttribute('data-state', 'ready');
});

test('rate changes preserve the remaining finite sequence, including while paused', async ({ page }) => {
  await openWithStoppedClock(page, 'save-state');
  const button = page.locator('.save-button');
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  await page.clock.runFor(500);
  await page.evaluate(() => Demo.setSettings({ speed: 0.25 }));
  await page.clock.runFor(3000);
  await expect(button).toHaveAttribute('data-state', 'saving');
  await page.clock.runFor(200);
  await expect(button).toHaveAttribute('data-state', 'saved');

  await page.evaluate(() => Demo.setSettings({ paused: true }));
  await page.clock.runFor(5000);
  await page.evaluate(() => Demo.setSettings({ speed: 0.5 }));
  await page.clock.runFor(5000);
  await expect(button).toHaveAttribute('data-state', 'saved');
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  await page.clock.runFor(3000);
  await expect(button).toHaveAttribute('data-state', 'saved');
  await page.clock.runFor(200);
  await expect(button).toHaveAttribute('data-state', 'ready');
});

for (const [name, settings] of [
  ['pause', { paused: true }],
  ['playback rate', { speed: 0.5 }],
  ['motion preference', { reduced: true }],
]) {
  test(`changing ${name} cancels a deliberate hold instead of confirming it`, async ({ page }) => {
    await openWithStoppedClock(page, 'hold-confirm');
    // Start and cancel the educational preview before the real pointer hold.
    await page.evaluate(() => {
      Demo.setSettings({ paused: false });
      Demo.setSettings({ paused: true });
      Demo.setSettings({ paused: false });
    });
    const button = page.locator('.hold-button');
    const bounds = await button.boundingBox();
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.mouse.down();
    await page.clock.runFor(700);
    await expect(button).toHaveAttribute('data-holding', 'true');

    await page.evaluate(value => Demo.setSettings(value), settings);
    await expect(button).toHaveAttribute('data-holding', 'false');
    await expect(page.locator('#hold-help')).toContainText('cancelled');
    await page.clock.runFor(10000);
    await page.mouse.up();
    await expect(button).toHaveAttribute('data-confirmed', 'false');
    await expect(page.locator('.hold-label')).toHaveText('Hold to confirm');
  });
}

test('the first drag-card arrow key after pointer input snaps in the same event', async ({ page }) => {
  await page.goto('/examples/drag-card.html?paused=true');
  await page.getByRole('button', { name: 'Center', exact: true }).click();
  const card = page.locator('.drag-note');
  await card.focus();
  const expectedRight = await card.evaluate(element => {
    const track = document.querySelector('.drag-track');
    element.addEventListener('keydown', () => {
      window.keyboardEventPosition = new DOMMatrix(getComputedStyle(element).transform).m41;
    }, { once: true });
    return Math.max(20, (track.clientWidth - element.offsetWidth) / 2 - 12);
  });
  await page.keyboard.press('ArrowRight');
  expect(await page.evaluate(() => window.keyboardEventPosition)).toBeCloseTo(expectedRight, 2);
  await expect(page.getByRole('button', { name: 'Right', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('the exported orbit can be paused and resumed through its own control', async ({ page }) => {
  await page.goto('/examples/orbit.html');
  await page.getByRole('button', { name: 'Pause orbit', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Play orbit', exact: true })).toBeVisible();
  const satellites = page.locator('.orbit-satellite');
  const still = await satellites.evaluateAll(elements => elements.map(element => getComputedStyle(element).transform));
  await page.waitForTimeout(180);
  expect(await satellites.evaluateAll(elements => elements.map(element => getComputedStyle(element).transform))).toEqual(still);

  await page.getByRole('button', { name: 'Play orbit', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause orbit', exact: true })).toBeVisible();
  await page.waitForTimeout(180);
  expect(await satellites.evaluateAll(elements => elements.map(element => getComputedStyle(element).transform))).not.toEqual(still);
});

test('both flip-card faces have a readable active accessible description', async ({ page }) => {
  await page.goto('/examples/card-flip.html?paused=true');
  const card = page.locator('.flip-card');
  await expect(card).toHaveAccessibleDescription(/There’s more.*to the story\./);
  await expect(page.locator('.flip-front')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('.flip-back')).toHaveAttribute('aria-hidden', 'true');

  await card.press('Enter');
  await expect(card).toHaveAccessibleDescription(/Same object\..*New perspective\./);
  await expect(page.locator('.flip-front')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.flip-back')).toHaveAttribute('aria-hidden', 'false');
});

test('keyboard route changes focus the destination while search keeps typing focus', async ({ page }) => {
  await page.goto('/');
  const open = page.locator('.sample-title[data-open="sliding-tabs"]');
  await open.press('Enter');
  await expect(page.locator('#detail-frame')).toBeVisible();
  await expect(page.locator('#main')).toBeFocused();
  await page.getByRole('button', { name: 'Back to the collection', exact: true }).press('Enter');
  await expect(page.locator('.sample')).toHaveCount(catalog.count);
  await expect(page.locator('#main')).toBeFocused();

  await page.getByLabel('Search animations').fill('spring');
  await expect(page.getByLabel('Search animations')).toBeFocused();
  await expect(page.locator('.sample').first()).toBeVisible();
});

test('standalone motion follows repeated OS changes until an explicit override', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/examples/orbit.html');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-reduced', 'true');
  await expect(page.getByRole('button', { name: 'Motion reduced', exact: true })).toBeDisabled();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveAttribute('data-reduced', 'false');
  await expect(page.getByRole('button', { name: 'Pause orbit', exact: true })).toBeEnabled();

  await page.evaluate(() => Demo.setSettings({ reduced: false }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(100);
  await expect(page.locator('html')).toHaveAttribute('data-reduced', 'false');
});

test('a persisted page transition preserves working spring controls', async ({ page }) => {
  await page.goto('/examples/spring-orb.html?paused=true');
  await page.getByRole('button', { name: 'Center', exact: true }).press('Enter');
  // This exercises the persisted-event lifecycle contract; it does not claim
  // that this particular browser session actually admitted the page to BFCache.
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await page.getByRole('button', { name: 'Right', exact: true }).press('Enter');
  const position = await page.locator('.spring-orb').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41);
  expect(position).toBeCloseTo(76, 2);
});
