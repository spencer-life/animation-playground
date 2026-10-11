import { test, expect } from '@playwright/test';

const preview = (page, id) => page.frameLocator(`iframe[data-preview="${id}"]`);
const replayCount = frame => frame.locator('html').evaluate(() => window.__recipeReplays || 0);
const fullAperture = art => art.evaluate(element => getComputedStyle(element).clipPath.split('round')[0].match(/[\d.]+/g).every(value => Number(value) === 0));

async function recordReplays(page, { playing = true, reduced = false } = {}) {
  await page.addInitScript(({ playing, reduced }) => {
    if (window === window.top) {
      localStorage.setItem('ap-playing', JSON.stringify(playing));
      localStorage.setItem('ap-reduced', JSON.stringify(reduced));
    }
    let api;
    Object.defineProperty(window, 'Demo', {
      configurable: true,
      get: () => api,
      set(value) {
        api = value;
        const register = api.onReplay;
        api.onReplay = callback => register(() => {
          window.__recipeReplays = (window.__recipeReplays || 0) + 1;
          callback();
        });
      },
    });
  }, { playing, reduced });
}

async function positionPreview(page, id, visible) {
  const frame = page.locator(`iframe[data-preview="${id}"]`);
  await frame.waitFor({ state: 'attached' });
  await frame.evaluate((element, visible) => {
    const top = visible ? 180 : innerHeight + 80;
    scrollTo({ top: scrollY + element.getBoundingClientRect().top - top, behavior: 'instant' });
  }, visible);
  return preview(page, id);
}

test('nearby timed previews stay paused until visible, replay on return, and do not loop', async ({ page }) => {
  await recordReplays(page);
  await page.goto('/?palette=geist&mode=dark&accent=blue');
  const frame = await positionPreview(page, 'underline-trail', false);
  await expect(frame.locator('html')).toHaveAttribute('data-paused', 'true');
  await expect(frame.locator('html')).toHaveAttribute('data-demo-mode', 'dark');
  const position = await page.locator('iframe[data-preview="underline-trail"]').boundingBox();
  expect(position.y).toBeGreaterThan(page.viewportSize().height);
  // This exceeds the old preview's complete timed sequence. Preloading must
  // not consume it while the card is still below the actual viewport.
  await page.waitForTimeout(1900);
  expect(await replayCount(frame)).toBe(0);
  expect(await page.locator('iframe[data-preview][src]').count()).toBeLessThan(100);

  await positionPreview(page, 'underline-trail', true);
  await expect.poll(() => replayCount(frame)).toBe(1);
  await expect(frame.locator('.text-action')).toHaveClass(/is-preview/);
  await positionPreview(page, 'underline-trail', false);
  await expect(frame.locator('html')).toHaveAttribute('data-paused', 'true');
  await positionPreview(page, 'underline-trail', true);
  await expect.poll(() => replayCount(frame)).toBe(2);
  await expect(frame.locator('.text-action')).toHaveClass(/is-preview/);
  await expect(frame.locator('.text-action')).not.toHaveClass(/is-preview/);
  await page.waitForTimeout(400);
  expect(await replayCount(frame)).toBe(2);
  expect(new URL(page.url()).searchParams.has('animation')).toBe(false);
});

test('a card Replay overrides gallery Pause only for that visible card, and a dialog pauses it', async ({ page }) => {
  await recordReplays(page, { playing: false });
  await page.goto('/');
  const frame = await positionPreview(page, 'underline-trail', true);
  await expect(frame.locator('html')).toHaveAttribute('data-paused', 'true');
  expect(await replayCount(frame)).toBe(0);
  await page.locator('[data-replay-preview="underline-trail"]').click();
  await expect.poll(() => replayCount(frame)).toBe(1);
  await expect(frame.locator('.text-action')).toHaveClass(/is-preview/);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ap-playing')))).toBe(false);
  const otherStates = await Promise.all(page.frames().filter(item => {
    const url = new URL(item.url());
    return url.searchParams.has('preview') && !url.pathname.endsWith('/underline-trail.html');
  }).map(item => item.evaluate(() => window.Demo?.paused)));
  expect(otherStates.filter(value => value !== undefined).length).toBeGreaterThan(0);
  expect(otherStates.every(value => value === undefined || value === true)).toBe(true);

  await page.locator('[data-inspect="underline-trail"]').click();
  await expect(page.locator('#quick-dialog')).toBeVisible();
  await expect(frame.locator('html')).toHaveAttribute('data-paused', 'true');
  // A queued background action must not restart motion behind protected focus.
  await page.locator('[data-replay-preview="underline-trail"]').evaluate(button => button.click());
  expect(await replayCount(frame)).toBe(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('#quick-dialog')).not.toBeVisible();
  await expect(frame.locator('html')).toHaveAttribute('data-paused', 'true');
  await page.locator('[data-replay-preview="underline-trail"]').click();
  await expect.poll(() => replayCount(frame)).toBe(2);
  await positionPreview(page, 'underline-trail', false);
  await expect(frame.locator('html')).toHaveAttribute('data-paused', 'true');
});

test('a delayed preview uses current preferences and starts once after load and ready races', async ({ page }) => {
  await recordReplays(page);
  let release;
  let requested;
  const gate = new Promise(resolve => { release = resolve; });
  const request = new Promise(resolve => { requested = resolve; });
  await page.route('**/examples/underline-trail.html*', async route => {
    requested(route.request().url());
    await gate;
    await route.continue();
  });
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await positionPreview(page, 'underline-trail', false);
    const source = new URL(await request);
    expect(source.searchParams.get('paused')).toBe('true');
    await positionPreview(page, 'underline-trail', true);
    await page.locator('#palette-select').selectOption('radix');
    await page.locator('#appearance-select').selectOption('dark');
    await page.locator('[data-action="previews"]').evaluate(button => button.click());
    await positionPreview(page, 'underline-trail', false);
    release();
    const frame = preview(page, 'underline-trail');
    await expect(frame.locator('html')).toHaveAttribute('data-palette', 'radix');
    await expect(frame.locator('html')).toHaveAttribute('data-demo-mode', 'dark');
    await expect(frame.locator('html')).toHaveAttribute('data-paused', 'true');
    expect(await replayCount(frame)).toBe(0);

    await positionPreview(page, 'underline-trail', true);
    expect(await replayCount(frame)).toBe(0);
    await page.locator('[data-action="previews"]').evaluate(button => button.click());
    await expect.poll(() => replayCount(frame)).toBe(1);
    await frame.locator('html').evaluate(() => window.parent.postMessage({ type: 'playground:ready' }, '*'));
    await page.locator('iframe[data-preview="underline-trail"]').evaluate(element => element.dispatchEvent(new Event('load')));
    await expect(frame.locator('.text-action')).toHaveClass(/is-preview/);
    expect(await replayCount(frame)).toBe(1);
  } finally {
    release();
  }
});

test('hidden-page updates freeze timed previews and reject a background Replay', async ({ page }) => {
  await recordReplays(page);
  await page.goto('/');
  const frame = await positionPreview(page, 'underline-trail', true);
  await expect(frame.locator('.text-action')).toHaveClass(/is-preview/);
  const count = await replayCount(frame);
  // Exercise the document visibility event deterministically in headless
  // Chromium; this does not claim physical tab or device-background coverage.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
    document.querySelector('[data-replay-preview="underline-trail"]').click();
  });
  await expect(frame.locator('html')).toHaveAttribute('data-paused', 'true');
  await page.waitForTimeout(1800);
  await expect(frame.locator('.text-action')).toHaveClass(/is-preview/);
  expect(await replayCount(frame)).toBe(count);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(frame.locator('.text-action')).not.toHaveClass(/is-preview/);
  expect(await replayCount(frame)).toBe(count);
});

test('native-scroll artwork demonstrates its reveal in the gallery without opening a study', async ({ page }) => {
  await recordReplays(page);
  await page.goto('/');
  const frame = await positionPreview(page, 'scroll-mask', true);
  await expect.poll(() => frame.locator('.mask-scroll').evaluate(element => element.scrollTop)).toBeGreaterThan(10);
  await expect(frame.locator('.mask-status')).toHaveText('Reading position · 100%');
  expect(await fullAperture(frame.locator('.mask-art'))).toBe(true);
  expect(new URL(page.url()).searchParams.has('animation')).toBe(false);
});

const scrollStudies = [
  { id: 'scroll-progress', pane: '.reading-pane' },
  { id: 'parallax-layers', pane: '.depth-scroll' },
  { id: 'pinned-story', pane: '.pinned-scroll' },
  { id: 'scroll-mask', pane: '.mask-scroll' },
  { id: 'reveal-on-view', pane: '.once-scroll', target: '.once-target' },
];

for (const { id, pane, target } of scrollStudies) {
  test(`${id}: preview scrolling is finite, pausable, reduced, and absent from the portable default`, async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 230 });
    await page.goto(`/examples/${id}.html?preview=1&paused=true&reduced=false`);
    const position = () => page.locator(pane).evaluate(element => element.scrollTop);
    const atEnd = () => page.locator(pane).evaluate((element, target) => {
      if (!target) return Math.abs(element.scrollTop - (element.scrollHeight - element.clientHeight)) < 1;
      const frame = element.getBoundingClientRect();
      const content = element.querySelector(target).getBoundingClientRect();
      const center = frame.top + element.clientTop + element.clientHeight / 2;
      return content.top >= frame.top && content.bottom <= frame.bottom && Math.abs(content.top + content.height / 2 - center) < 1;
    }, target);
    expect(await position()).toBe(0);
    await page.evaluate(() => Demo.replay());
    await expect.poll(position).toBeGreaterThan(8);
    await page.evaluate(() => Demo.setSettings({ paused: true }));
    const stopped = await position();
    await page.waitForTimeout(160);
    expect(await position()).toBe(stopped);
    await page.evaluate(() => Demo.setSettings({ paused: false }));
    await expect.poll(atEnd).toBe(true);
    await page.waitForTimeout(100);
    const finished = await position();
    await page.waitForTimeout(300);
    expect(await position()).toBe(finished);
    if (id === 'reveal-on-view') await expect(page.locator('.once-status')).toHaveText('Revealed once · stays visible');

    await page.evaluate(() => { Demo.setSettings({ reduced: true }); Demo.replay(); });
    expect(await atEnd()).toBe(true);
    await page.waitForTimeout(80);
    expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
    if (id === 'scroll-mask') expect(await fullAperture(page.locator('.mask-art'))).toBe(true);
    if (id === 'parallax-layers') expect(await page.locator('.depth-near').evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).f)).toBe(0);

    await page.goto(`/examples/${id}.html?paused=true&reduced=false`);
    await page.evaluate(() => Demo.replay());
    await page.waitForTimeout(650);
    expect(await position()).toBe(0);
  });
}

test('a real keyboard scroll stops the gallery-only scroll demonstration until Replay', async ({ page }) => {
  await page.setViewportSize({ width: 300, height: 230 });
  await page.goto('/examples/scroll-progress.html?preview=1&reduced=false');
  const pane = page.locator('.reading-pane');
  await expect.poll(() => pane.evaluate(element => element.scrollTop)).toBeGreaterThan(10);
  await pane.press('Home');
  await expect.poll(() => pane.evaluate(element => element.scrollTop)).toBe(0);
  await page.waitForTimeout(400);
  expect(await pane.evaluate(element => element.scrollTop)).toBe(0);
  await page.evaluate(() => Demo.replay());
  await expect.poll(() => pane.evaluate(element => element.scrollTop)).toBeGreaterThan(10);
});

test('finished native animations remain finished through Pause and Resume', async ({ page }) => {
  await page.goto('/examples/staggered-list.html?reduced=false');
  await expect.poll(() => page.locator('.arrival-list li').first().evaluate(element => element.getAnimations()[0]?.playState)).toBe('finished');
  const result = await page.evaluate(() => {
    const animation = document.querySelector('.arrival-list li').getAnimations()[0];
    Demo.setSettings({ paused: true });
    Demo.setSettings({ paused: false });
    return { state: animation.playState, time: animation.currentTime, duration: animation.effect.getTiming().duration };
  });
  expect(result.state).toBe('finished');
  expect(result.time).toBe(result.duration);
});
