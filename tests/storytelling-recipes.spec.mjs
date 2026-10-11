import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 300, height: 230 } });

test('dedicated play commands accept keyboard activation regardless of wording and respect reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const { id, label, selector, heading } of [
    { id: 'text-marquee', label: 'Replay strip', selector: '.marquee-track', heading: 'Form. Motion. Feeling.' },
    { id: 'text-wave', label: 'Send a wave', selector: '.wave-heading i', heading: 'FLOW' },
  ]) {
    await page.goto(`/examples/${id}.html?paused=true&reduced=false&speed=0.25`);
    const play = page.getByRole('button', { name: label });
    const target = page.locator(selector).first();
    await play.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-keyboard', 'false');
    await expect.poll(() => target.evaluate(element =>
      element.getAnimations().filter(animation => animation.playState === 'running').length,
    )).toBe(1);

    await page.evaluate(() => Demo.setSettings({ reduced: true }));
    await play.focus();
    await page.keyboard.press('Enter');
    await expect(target).toHaveCSS('transform', 'none');
    expect(await target.evaluate(element => element.getAnimations().length)).toBe(0);
    await expect(page.getByRole('heading')).toHaveText(heading);
  }
});

for (const id of ['text-scramble', 'radar-scan']) {
  test(`${id}: pause, speed, replay, and completion share a bounded timeline`, async ({ page }) => {
    await page.goto(`/examples/${id}.html?paused=true&reduced=false`);
    const frozen = await page.evaluate(async () => {
      Demo.replay();
      const animations = document.getAnimations().filter(animation =>
        !(animation instanceof CSSAnimation) && !(animation instanceof CSSTransition),
      );
      if (!animations.length) throw new Error('The explicit replay created no sequence.');
      for (const animation of animations) {
        const timing = animation.effect.getTiming();
        animation.currentTime = timing.delay + timing.duration * .28;
      }
      Demo.setSettings({ paused: true });
      await Promise.all(animations.map(animation => animation.ready));
      const snapshot = () => ({
        times: animations.map(animation => animation.currentTime),
        states: animations.map(animation => animation.playState),
        styles: animations.map(animation => {
          const style = getComputedStyle(animation.effect.target);
          return { transform: style.transform, opacity: style.opacity };
        }),
      });
      window.storyPlayback = { animations, snapshot };
      return snapshot();
    });
    expect(frozen.states.every(state => state === 'paused')).toBe(true);

    // Observe the real browser clock while the sequence is held, including
    // staggered characters or signals whose reveal used to need a timer.
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => window.storyPlayback.snapshot())).toEqual(frozen);
    const slowed = await page.evaluate(async () => {
      Demo.setSettings({ speed: .5 });
      await Promise.all(window.storyPlayback.animations.map(animation => animation.ready));
      return window.storyPlayback.animations.map(animation => animation.playbackRate);
    });
    expect(slowed.every(rate => rate === .5)).toBe(true);
    await page.evaluate(() => Demo.setSettings({ paused: false }));
    await expect.poll(() => page.evaluate(() => window.storyPlayback.animations[0].currentTime)).toBeGreaterThan(frozen.times[0]);

    const replayed = await page.evaluate(() => {
      const previous = window.storyPlayback.animations;
      Demo.replay();
      const current = document.getAnimations().filter(animation =>
        !(animation instanceof CSSAnimation) && !(animation instanceof CSSTransition),
      );
      const result = {
        previousCancelled: previous.every(animation => animation.playState === 'idle'),
        before: previous.length,
        after: current.length,
        bounded: current.every(animation => {
          const timing = animation.effect.getComputedTiming();
          return Number.isFinite(timing.endTime) && timing.endTime > 0 && timing.endTime < 10000;
        }),
      };
      current.forEach(animation => animation.finish());
      return result;
    });
    expect(replayed.previousCancelled).toBe(true);
    expect(replayed.after).toBe(replayed.before);
    expect(replayed.bounded).toBe(true);
    expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
    if (id === 'radar-scan') {
      await expect(page.locator('.radar-sector')).toHaveCSS('opacity', '0');
      for (const signal of await page.locator('.radar-signal').all()) await expect(signal).toHaveCSS('opacity', '1');
    } else {
      expect(await page.locator('.scramble-cell').evaluateAll(cells => cells.every(cell => {
        const bounds = cell.getBoundingClientRect();
        const finalLetter = cell.querySelector('i:last-child').getBoundingClientRect();
        return finalLetter.top >= bounds.top - .5 && finalLetter.bottom <= bounds.bottom + .5;
      }))).toBe(true);
    }
  });
}

test('native scrolling carries depth while keyboard and reduced motion keep the artwork still', async ({ page }) => {
  await page.goto('/examples/parallax-layers.html?reduced=false');
  const pane = page.locator('.depth-scroll');
  const status = page.locator('.depth-status');
  await pane.click({ position: { x: 25, y: 25 } });
  await page.mouse.wheel(0, 700);
  await expect(status).toContainText('100%');
  const travel = await page.evaluate(() => ['.depth-far', '.depth-middle', '.depth-near'].map(selector =>
    Math.abs(new DOMMatrixReadOnly(getComputedStyle(document.querySelector(selector)).transform).m42),
  ));
  expect(travel[0]).toBeGreaterThan(0);
  expect(travel[1]).toBeGreaterThan(travel[0]);
  expect(travel[2]).toBeGreaterThan(travel[1]);
  expect(travel[2]).toBeLessThanOrEqual(32);

  await page.evaluate(() => Demo.setSettings({ paused: true }));
  expect(await page.locator('.depth-near').evaluate(element => Math.abs(new DOMMatrixReadOnly(getComputedStyle(element).transform).m42))).toBe(travel[2]);
  await page.mouse.wheel(0, -700);
  await expect(status).toHaveText('Foreground travels farther · 0%');
  expect(await page.locator('.depth-near').evaluate(element => Math.abs(new DOMMatrixReadOnly(getComputedStyle(element).transform).m42))).toBe(travel[2]);
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  expect(await page.locator('.depth-near').evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42)).toBe(0);
  await page.mouse.wheel(0, 700);
  await expect(status).toContainText('100%');

  await page.keyboard.press('Home');
  await expect(status).toHaveText('Foreground travels farther · 0%');
  await page.keyboard.press('End');
  await expect(status).toContainText('100%');
  expect(await page.locator('.depth-near').evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42)).toBe(0);

  await page.evaluate(() => Demo.setSettings({ reduced: true }));
  await pane.click({ position: { x: 25, y: 25 } });
  await page.mouse.wheel(0, -700);
  await expect(status).toHaveText('Foreground travels farther · 0%');
  await page.mouse.wheel(0, 700);
  await expect(status).toContainText('100%');
  expect(await page.locator('.depth-near').evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42)).toBe(0);
});

test('the aperture follows native scroll, freezes on pause, and opens completely in reduced motion', async ({ page }) => {
  await page.goto('/examples/scroll-mask.html?reduced=false');
  const pane = page.locator('.mask-scroll');
  const status = page.locator('.mask-status');
  const insets = () => page.locator('.mask-art').evaluate(element =>
    getComputedStyle(element).clipPath.split('round')[0].match(/[\d.]+/g).map(Number),
  );
  expect((await insets()).some(value => value > 0)).toBe(true);
  await pane.click({ position: { x: 25, y: 25 } });
  await page.mouse.wheel(0, 700);
  await expect(status).toHaveText('Reading position · 100%');
  expect((await insets()).every(value => value === 0)).toBe(true);

  await page.mouse.wheel(0, -700);
  await expect(status).toHaveText('Reading position · 0%');
  const heldInsets = await insets();
  expect(heldInsets.some(value => value > 0)).toBe(true);
  await page.evaluate(() => Demo.setSettings({ paused: true }));
  expect(await insets()).toEqual(heldInsets);
  await page.mouse.wheel(0, 700);
  await expect(status).toHaveText('Reading position · 100%');
  expect(await insets()).toEqual(heldInsets);
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  expect((await insets()).every(value => value === 0)).toBe(true);
  await page.mouse.wheel(0, -700);
  await expect(status).toHaveText('Reading position · 0%');
  expect((await insets()).some(value => value > 0)).toBe(true);
  await page.evaluate(() => Demo.setSettings({ reduced: true }));
  expect((await insets()).every(value => value === 0)).toBe(true);
  await page.mouse.wheel(0, 700);
  await expect(status).toHaveText('Reading position · 100%');
  expect((await insets()).every(value => value === 0)).toBe(true);
  await page.mouse.wheel(0, -700);
  await expect(status).toHaveText('Reading position · 0%');
  expect((await insets()).every(value => value === 0)).toBe(true);
});

test('the radial navigation preserves keyboard selection, focus return, and inert hidden destinations', async ({ page }) => {
  await page.goto('/examples/orbit-menu.html?paused=true&reduced=false');
  const toggle = page.locator('.orbit-nav-toggle');
  const destinations = page.locator('#orbit-destinations');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(destinations).toHaveAttribute('aria-hidden', 'true');
  expect(await destinations.evaluate(element => element.inert)).toBe(true);
  await page.keyboard.press('Tab');
  expect(await destinations.evaluate(element => element.contains(document.activeElement))).toBe(false);

  await toggle.focus();
  await page.keyboard.press('Enter');
  expect(await destinations.evaluate(element => element.inert)).toBe(false);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Work', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  const about = page.getByRole('button', { name: 'About', exact: true });
  await expect(about).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(about).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.orbit-nav-status')).toHaveText('About selected · demo navigation');
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(await destinations.evaluate(element => element.inert)).toBe(true);
});

test('the scroll-entry artwork reveals once and becomes eligible again only after Replay', async ({ page }) => {
  await page.goto('/examples/reveal-on-view.html?reduced=false&speed=0.25');
  const pane = page.locator('.once-scroll');
  const status = page.locator('.once-status');
  await expect(page.locator('.once-target')).toHaveAttribute('data-armed', 'true');
  expect(await page.locator('.once-target').evaluate(element =>
    element.getBoundingClientRect().top >= document.querySelector('.once-scroll').getBoundingClientRect().bottom,
  )).toBe(true);
  await pane.click({ position: { x: 25, y: 25 } });
  await page.mouse.wheel(0, 160);
  await expect(status).toHaveText('Revealed once · stays visible');
  expect(await page.locator('.once-target').evaluate(element => {
    const animation = element.getAnimations()[0];
    window.firstEntryAnimation = animation;
    animation?.finish();
    return Boolean(animation);
  })).toBe(true);
  await page.mouse.wheel(0, -700);
  await expect.poll(() => pane.evaluate(element => element.scrollTop)).toBe(0);
  await page.mouse.wheel(0, 160);
  await expect.poll(() => pane.evaluate(element => element.scrollTop)).toBeGreaterThan(100);
  expect(await page.locator('.once-target').evaluate(element =>
    element.getAnimations().every(animation => animation === window.firstEntryAnimation && animation.playState === 'finished'),
  )).toBe(true);

  await page.evaluate(() => Demo.replay());
  await expect(status).toHaveText('Waiting for the artwork to enter');
  await page.mouse.wheel(0, 160);
  await expect(status).toHaveText('Revealed once · stays visible');
  expect(await page.locator('.once-target').evaluate(element =>
    element.getAnimations().some(animation => animation !== window.firstEntryAnimation && animation.playState === 'running'),
  )).toBe(true);

  // Pausing before entry restores visible content. Resuming after that content
  // has entered must never hide it to manufacture another reveal.
  await page.evaluate(() => { Demo.replay(); Demo.setSettings({ paused: true }); });
  await expect(page.locator('.once-target')).toHaveAttribute('data-armed', 'false');
  await expect(page.locator('.once-target')).toHaveCSS('opacity', '1');
  await page.mouse.wheel(0, 160);
  await expect(status).toHaveText('Revealed once · stays visible');
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  await expect(page.locator('.once-target')).toHaveCSS('opacity', '1');
  expect(await page.locator('.once-target').evaluate(element => element.getAnimations().length)).toBe(0);
});

test('the path marker follows the SVG geometry, reaches its endpoint, and resets on Replay', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 420 });
  await page.goto('/examples/path-follower.html?paused=true&reduced=false');
  const measured = await page.evaluate(() => {
    const path = document.querySelector('.follower-guide');
    const marker = document.querySelector('.follower-marker');
    const distanceFrom = fraction => {
      const point = path.getPointAtLength(path.getTotalLength() * fraction);
      const expected = new DOMPoint(point.x, point.y).matrixTransform(path.getCTM());
      const actual = new DOMPoint(0, 0).matrixTransform(marker.getCTM());
      return Math.hypot(expected.x - actual.x, expected.y - actual.y);
    };
    const resting = distanceFrom(1);
    Demo.replay();
    Demo.setSettings({ paused: true });
    const animation = marker.getAnimations()[0];
    if (!animation) throw new Error('Replay created no route animation.');
    animation.currentTime = animation.effect.getTiming().duration * .5;
    const midpoint = distanceFrom(.5);
    animation.finish();
    const endpoint = distanceFrom(1);
    Demo.replay();
    Demo.setSettings({ paused: true });
    const next = marker.getAnimations()[0];
    next.currentTime = 0;
    const restarted = distanceFrom(0);
    const previousCancelled = animation.playState === 'idle';
    Demo.setSettings({ reduced: true });
    return { resting, midpoint, endpoint, restarted, previousCancelled, reduced: distanceFrom(1), remaining: marker.getAnimations().length };
  });
  for (const key of ['resting', 'midpoint', 'endpoint', 'restarted', 'reduced']) expect(measured[key], key).toBeLessThan(1);
  expect(measured.previousCancelled).toBe(true);
  expect(measured.remaining).toBe(0);
});
