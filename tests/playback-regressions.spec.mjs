import { test, expect } from '@playwright/test';

const transitionStudies = [
  { id: 'card-stack', target: '.stack-card', status: '.stack-status', result: 'Card 2 of 3.' },
  { id: 'text-crossfade', target: '.copy-first', status: '.crossfade-status', result: 'More flow.' },
  { id: 'rolling-number', target: '.digit-reel', status: '.number-status', result: '256' },
  { id: 'notification-stack', target: '.activity-entry', status: '.activity-status', result: 'Timing refined.' },
];

for (const { id, target } of [
  { id: 'staggered-words', target: '.word-visual i' },
  ...transitionStudies,
]) {
  test(`${id}: explicit full motion animates on the first load despite OS reduction`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Capture the initial replay in the page, before a later settings message
    // or an explicit Replay could conceal incorrect initialization.
    await page.addInitScript(selector => {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const element = document.querySelector(selector);
          window.initialPlayback = {
            reduced: window.Demo.reduced,
            animations: element.getAnimations().filter(animation => animation.playState !== 'finished').length,
          };
        }, 0);
      }, { once: true });
    }, target);
    await page.goto(`/examples/${id}.html?reduced=false&speed=0.25`);
    await expect.poll(() => page.evaluate(() => window.initialPlayback?.reduced)).toBe(false);
    expect(await page.evaluate(() => window.initialPlayback.animations)).toBeGreaterThan(0);
    await expect(page.locator('html')).toHaveAttribute('data-reduced', 'false');
  });
}

for (const { name, preference, query } of [
  { name: 'the OS default', preference: 'reduce', query: '' },
  { name: 'an explicit reduced setting', preference: 'no-preference', query: '?reduced=true' },
]) {
  test(`initial replay still respects ${name}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: preference });
    await page.goto(`/examples/staggered-words.html${query}`);
    await expect(page.locator('html')).toHaveAttribute('data-reduced', 'true');
    expect(await page.locator('.word-visual i').first().evaluate(element => ({
      opacity: getComputedStyle(element).opacity,
      animations: element.getAnimations().length,
    }))).toEqual({ opacity: '1', animations: 0 });
  });
}

for (const study of transitionStudies) {
  test(`${study.id}: Pause freezes an active transition and Resume completes it`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/examples/${study.id}.html?paused=true&reduced=false&speed=0.25`);

    const frozen = await page.evaluate(async selector => {
      Demo.replay();
      const element = document.querySelector(selector);
      const animations = element.getAnimations().filter(animation => animation instanceof CSSTransition);
      if (animations.length === 0) throw new Error('The study did not start a CSS transition.');

      // Seek an existing, real CSS transition to a reproducible interior point.
      // Pause/Resume and the observation interval use the real browser clock.
      for (const animation of animations) animation.currentTime = animation.effect.getTiming().duration * 0.35;
      Demo.setSettings({ paused: true });
      await Promise.all(animations.map(animation => animation.ready));
      window.playbackUnderTest = { element, animations };
      const style = getComputedStyle(element);
      return {
        transform: style.transform,
        opacity: style.opacity,
        states: animations.map(animation => animation.playState),
        progress: animations.map(animation => animation.effect.getComputedTiming().progress),
        times: animations.map(animation => animation.currentTime),
      };
    }, study.target);

    expect(frozen.states.every(state => state === 'paused')).toBe(true);
    for (const progress of frozen.progress) {
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThan(1);
    }
    await expect(page.locator(study.status)).toContainText(study.result);
    if (study.id === 'notification-stack') await expect(page.locator('.activity-entry')).toHaveCount(4);

    // The activity wait also exceeds the former wall-clock removal timeout:
    // its outgoing entry must survive until the paused transition completes.
    await page.waitForTimeout(study.id === 'notification-stack' ? 1100 : 140);
    const held = await page.evaluate(() => {
      const { element, animations } = window.playbackUnderTest;
      const style = getComputedStyle(element);
      return {
        transform: style.transform,
        opacity: style.opacity,
        states: animations.map(animation => animation.playState),
        times: animations.map(animation => animation.currentTime),
      };
    });
    expect(held.transform).toBe(frozen.transform);
    expect(held.opacity).toBe(frozen.opacity);
    expect(held.states).toEqual(frozen.states);
    expect(held.times).toEqual(frozen.times);
    if (study.id === 'notification-stack') await expect(page.locator('.activity-entry')).toHaveCount(4);

    await page.evaluate(() => Demo.setSettings({ paused: false }));
    await expect.poll(() => page.evaluate(() => window.playbackUnderTest.animations[0].currentTime)).toBeGreaterThan(frozen.times[0]);
    const completed = await page.evaluate(async () => {
      const { element, animations } = window.playbackUnderTest;
      await Promise.all(animations.map(animation => animation.finished));
      const style = getComputedStyle(element);
      return {
        transform: style.transform,
        opacity: style.opacity,
        states: animations.map(animation => animation.playState),
      };
    });
    expect(completed.states.every(state => state === 'finished')).toBe(true);
    expect(completed.transform !== frozen.transform || completed.opacity !== frozen.opacity).toBe(true);
    await expect(page.locator(study.status)).toContainText(study.result);
    if (study.id === 'notification-stack') await expect(page.locator('.activity-entry')).toHaveCount(3);
  });
}
