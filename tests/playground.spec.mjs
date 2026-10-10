import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const catalog = JSON.parse(await readFile('dist/catalog.json','utf8'));

test('catalog search, category and saved state remain useful across reloads',async ({page}) => {
  await page.goto('/');
  await expect(page.locator('.sample')).toHaveCount(catalog.count);
  await page.getByLabel('Search animations').fill('spring');
  await expect(page.locator('.sample').first()).toBeVisible();
  expect(await page.locator('.sample').count()).toBeGreaterThan(0);
  expect(await page.locator('.sample').count()).toBeLessThan(catalog.count);
  await page.getByLabel('Search animations').fill('<nothing matches this>');
  await expect(page.getByRole('heading',{name:'No matching animations.'})).toBeVisible();
  await page.getByRole('button',{name:'Browse all animations'}).click();
  await page.locator('[data-save="sliding-tabs"]').click();
  await page.locator('[data-category="saved"]').click();
  await expect(page.locator('.sample')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.sample')).toHaveCount(1);
  await page.locator('[data-save="sliding-tabs"]').click();
  await expect(page.getByRole('heading',{name:'Keep the good ones.'})).toBeVisible();
  await page.locator('[data-category="text"]').click();
  await expect(page.locator('.sample')).toHaveCount(6);
});

test('workbench exposes exact runnable source, reference tabs and a portable AI brief',async ({page,context}) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/?animation=sliding-tabs');
  await expect(page.locator('#detail-frame')).toBeVisible();
  await page.getByRole('button',{name:'Copy full example'}).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe(await readFile('dist/examples/sliding-tabs.html','utf8'));
  await page.getByRole('tab',{name:'How it works'}).click();
  await expect(page.getByRole('heading',{name:'Reduced motion',exact:true})).toBeVisible();
  await page.getByRole('tab',{name:'Copy for AI'}).click();
  await page.getByRole('button',{name:'Copy for AI'}).click();
  const prompt = await page.evaluate(() => navigator.clipboard.readText());
  expect(prompt).toContain('Recipe ID: sliding-tabs');
  expect(prompt).toContain('examples/sliding-tabs.html');
  expect(prompt).toContain('Reduced motion:');
  await page.getByRole('button',{name:'Copy link',exact:true}).click();
  const shared = new URL(await page.evaluate(() => navigator.clipboard.readText()));
  expect(shared.origin).toBe('http://127.0.0.1:4173');
  expect(shared.searchParams.get('animation')).toBe('sliding-tabs');
  expect(shared.searchParams.get('palette')).toBe('original');
  expect(shared.searchParams.get('mode')).toBe('light');
  await page.getByRole('tab',{name:'Code',exact:true}).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab',{name:'How it works'})).toBeFocused();
  await page.getByRole('button',{name:'Back to the collection',exact:true}).click();
  await expect(page.locator('.sample')).toHaveCount(catalog.count);
  await page.goBack();
  await expect(page.locator('#detail-frame')).toBeVisible();
});

test('reduced motion follows OS preference and all examples remain readable',async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/?animation=orbit');
  await expect(page.locator('[data-action="reduced"]')).toHaveAttribute('aria-pressed','true');
  const frame = page.frameLocator('#detail-frame');
  await expect(frame.locator('html')).toHaveAttribute('data-reduced','true');
  expect(await frame.locator('body').innerText()).not.toBe('');
  await page.getByRole('button',{name:'Replay',exact:true}).click();
  const moving = await frame.locator('body').evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running' && animation.effect?.getTiming().iterations === Infinity).length);
  expect(moving).toBe(0);
  await page.locator('[data-action="reduced"]').click();
  await expect(frame.locator('html')).toHaveAttribute('data-reduced','false');
});

test('keyboard search shortcut and theme are functional',async ({page}) => {
  await page.goto('/');
  await expect(page.locator('.sample')).toHaveCount(catalog.count);
  await page.keyboard.press('/');
  await expect(page.getByLabel('Search animations')).toBeFocused();
  const old = await page.locator('html').getAttribute('data-theme');
  await page.getByRole('button',{name:'Switch color theme'}).click();
  expect(await page.locator('html').getAttribute('data-theme')).not.toBe(old);
  await page.reload();
  expect(await page.locator('html').getAttribute('data-theme')).not.toBe(old);
});

test('gallery and workbench have no serious accessible-name or contrast defects',async ({page}) => {
  for (const url of ['/', '/?animation=sliding-tabs','/?view=notes']) {
    await page.goto(url);
    await expect(page.locator('.main h1')).toBeVisible();
    if (url.includes('animation')) await expect(page.locator('#reference-panel')).toBeVisible();
    const results = await new AxeBuilder({page}).exclude('iframe').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(results.violations,JSON.stringify(results.violations.map(v => ({id:v.id,nodes:v.nodes.map(n => n.target)})))).toEqual([]);
  }
});

for (const width of [320,390,768,1024,1440]) {
  test(`gallery and detail do not overflow at ${width}px`,async ({page}) => {
    await page.setViewportSize({width,height:900});
    for (const route of ['/', '/?animation=hold-confirm','/?view=notes']) {
      await page.goto(route);
      await expect(page.locator('.main h1')).toBeVisible();
      if (route.includes('animation')) await expect(page.locator('#reference-panel')).toBeVisible();
      const overflow = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      expect(overflow.scroll).toBeLessThanOrEqual(overflow.width + 1);
    }
  });
}

for (const recipe of catalog.recipes) {
  test(`standalone ${recipe.id} runs, replays, reduces and stays within its stage`,async ({page}) => {
    const errors = [];
    const external = [];
    page.on('pageerror',error => errors.push(error.message));
    page.on('request',request => { if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('data:')) external.push(request.url()); });
    await page.setViewportSize({width:300,height:230});
    await page.goto(`/${recipe.example}`);
    await page.evaluate(() => { Demo.replay(); Demo.replay(); Demo.setSettings({speed:.25}); });
    await page.waitForTimeout(80);
    await page.evaluate(() => { Demo.setSettings({paused:true}); Demo.setSettings({paused:false}); Demo.setSettings({reduced:true}); Demo.replay(); });
    await expect(page.locator('html')).toHaveAttribute('data-reduced','true');
    const measurements = await page.evaluate(() => ({scroll:document.documentElement.scrollWidth,width:innerWidth,text:document.body.innerText.trim(),controls:[...document.querySelectorAll('button,input,summary')].filter(el => {const rect=el.getBoundingClientRect();return rect.width && rect.height;}).length}));
    expect(measurements.scroll).toBeLessThanOrEqual(measurements.width + 1);
    expect(measurements.text.length).toBeGreaterThan(0);
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
    const accessibility = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(accessibility.violations,JSON.stringify(accessibility.violations.map(v => ({id:v.id,nodes:v.nodes.map(n => n.target)})))).toEqual([]);
  });
}
