import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { normalizeTheme, resolveTheme, themedCode, tokenExport, defaults, palettes, accents, contrast } from '../src/theme.mjs';

test('dark workbench collection navigation stays readable and keyboard operable', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/?animation=press-feedback&palette=radix&mode=dark&accent=amber');
  const back = page.getByRole('button', { name: 'The whole collection', exact: true });
  await back.scrollIntoViewIfNeeded();
  const accessibility = await new AxeBuilder({ page }).include('.related-heading')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(accessibility.violations).toEqual([]);
  await back.press('Enter');
  await expect(page.getByRole('heading', { name: 'Motion worth borrowing.', exact: true })).toBeVisible();
  await expect(page.locator('#main')).toBeFocused();
});
// Import the built catalog so new recipes automatically receive the same dark
// preview checks. Run the build before this suite, as with playground.spec.mjs.
const catalog = JSON.parse(await readFile(new URL('../dist/catalog.json', import.meta.url), 'utf8'));
const families = ['lavender', 'peach', 'blue', 'green', 'sand', 'graphite'];
const customColors = [
  '#000000', '#010101', '#111113', '#666666', '#767676', '#777777', '#808080',
  '#eeeeee', '#fefefe', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#00ffff', '#ff00ff', '#7c5ce7',
];
const readablePairs = [
  ['ink', 'paper'], ['ink', 'demo-bg'], ['ink', 'line'], ['on-ink', 'ink'], ['muted', 'paper'], ['muted', 'demo-bg'],
  ['accent-ink', 'paper'], ['accent-ink', 'demo-bg'], ['accent-ink', 'accent-soft'],
  ['on-accent', 'accent'], ['on-accent', 'accent-hover'],
];

function assertReadable(tokens, description) {
  for (const [foreground, background] of readablePairs) {
    expect(tokens[foreground], `${description}: ${foreground}`).toMatch(/^#[\da-f]{6}$/i);
    expect(tokens[background], `${description}: ${background}`).toMatch(/^#[\da-f]{6}$/i);
    expect(contrast(tokens[foreground], tokens[background]), `${description}: ${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
  }
}

function rgb(hex) {
  return `rgb(${[1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16)).join(', ')})`;
}

function embeddedTheme(code) {
  const match = code.match(/<script id="playground-theme-config" type="application\/json">([\s\S]*?)<\/script>/);
  expect(match, 'Standalone HTML must embed its selected theme').not.toBeNull();
  return JSON.parse(match[1]);
}

async function expectTheme(surface, selection, color = 'lavender') {
  const tokens = resolveTheme(selection, color);
  const root = surface.locator('html');
  await expect(root).toHaveAttribute('data-palette', selection.palette);
  await expect(root).toHaveAttribute('data-demo-mode', selection.mode);
  await expect(root).toHaveCSS('color-scheme', selection.mode);
  await expect(root).toHaveCSS('background-color', rgb(tokens['demo-bg']));
  await expect(surface.locator('body')).toHaveCSS('background-color', rgb(tokens['demo-bg']));
  const applied = await root.evaluate((element, names) => {
    const styles = getComputedStyle(element);
    return Object.fromEntries(names.map(name => [name, styles.getPropertyValue(`--${name}`).trim()]));
  }, Object.keys(tokens));
  expect(applied).toEqual(tokens);
}

test('theme inputs preserve valid choices and reject malformed route or storage values', () => {
  for (const input of [null, [], 'dark', { palette: 'unknown', mode: 'system', accent: 'missing', custom: 'url(javascript:alert(1))' }]) {
    expect(normalizeTheme(input)).toEqual(defaults);
  }
  expect(normalizeTheme({ mode: 'dark', custom: '#A0b1C2' }, { ...defaults, palette: 'geist' })).toEqual({
    ...defaults, palette: 'geist', mode: 'dark', custom: '#a0b1c2',
  });
});

test('contrast measurement agrees with known WCAG reference pairs', () => {
  expect(contrast('#000000', '#ffffff')).toBe(21);
  expect(contrast('#3e63dd', '#3e63dd')).toBe(1);
  expect(contrast('#777777', '#ffffff')).toBeCloseTo(4.47809, 4);
  expect(contrast('#ffffff', '#777777')).toBeCloseTo(4.47809, 4);
});

for (const palette of palettes) {
  for (const mode of ['light', 'dark']) {
    test(`${palette.id} ${mode}: text stays readable across accent and material choices`, () => {
      const colors = palette.id === 'original' ? families : ['lavender'];
      const customChoices = palette.id === 'custom' ? customColors : [defaults.custom];
      for (const accent of accents) {
        for (const color of colors) {
          for (const custom of customChoices) {
            const selection = { palette: palette.id, mode, accent: accent.id, custom };
            const tokens = resolveTheme(selection, color);
            assertReadable(tokens, `${palette.id}/${mode}/${accent.id}/${color}/${custom}`);
            if (palette.id === 'custom') expect(tokens.accent).toBe(custom);
          }
        }
      }
    });
  }
}

test('theme replacement updates the portable document without rewriting its animation', () => {
  const fixture = '<!doctype html><style id="playground-theme">:root { --accent: red; }</style>'
    + '<script id="playground-theme-config" type="application/json">{}</script>'
    + '<main class="stage">Keep this content.</main><script>window.animationSentinel = 42;</script>';
  const selection = { ...defaults, palette: 'radix', mode: 'dark', accent: 'amber' };
  const code = themedCode(fixture, selection, 'peach');
  expect(embeddedTheme(code)).toEqual({ ...selection, color: 'peach' });
  expect(code).toContain(`--accent: ${resolveTheme(selection, 'peach').accent};`);
  expect(code).toContain('color-scheme: dark;');
  expect(code).toContain('<main class="stage">Keep this content.</main><script>window.animationSentinel = 42;</script>');
  expect(code).not.toContain('--accent: red;');
});

test('token exports retain complete fallbacks and distinguish solid from readable accent roles', () => {
  const selection = { ...defaults, palette: 'radix', mode: 'dark', accent: 'jade' };
  const tokens = resolveTheme(selection, 'green');
  const values = tokenExport(selection, 'green');
  for (const [name, value] of Object.entries(tokens)) expect(values).toContain(`--${name}: ${value};`);
  const radix = tokenExport(selection, 'green', 'radix');
  expect(radix).toContain(`--accent: var(--jade-9, ${tokens.accent});`);
  expect(radix).toContain(`--accent-ink: ${tokens['accent-ink']};`);
  expect(radix).not.toContain('var(--jade-11,');
  expect(radix).toContain(`--paper: var(--gray-2, ${tokens.paper});`);
  const geist = tokenExport(selection, 'green', 'geist');
  expect(geist).toContain(`--demo-bg: var(--ds-background-100, ${tokens['demo-bg']});`);
  expect(geist).toContain(`--ink: var(--ds-gray-1000, ${tokens.ink});`);
  for (const exported of [values, radix, geist]) {
    expect(exported).toContain('.animation-theme {');
    expect(exported).toContain('color-scheme: dark;');
    expect(exported).toContain(`--on-accent: ${tokens['on-accent']};`);
  }
});

for (const accent of ['jade', 'amber']) {
  test(`light Radix ${accent}: stepper action text stays readable in the preview and offline export`, async ({ page, browser }) => {
    const recipe = catalog.recipes.find(item => item.id === 'stepper-progress');
    const selection = { ...defaults, palette: 'radix', mode: 'light', accent };
    const tokens = resolveTheme(selection, recipe.color);

    async function expectReadableAction(surface, description) {
      const action = surface.getByRole('button', { name: 'Next step', exact: true });
      await expect(action).toBeVisible();
      // The primary action now uses a solid accent. Keep the rendered 4.5:1
      // check across preview, scoped host aliases, and the offline document.
      const accessibility = await new AxeBuilder({ page: surface }).include('.stepper-next')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(accessibility.violations, `${description}: ${JSON.stringify(accessibility.violations.map(issue => ({
        id: issue.id, nodes: issue.nodes.map(node => ({ target: node.target, summary: node.failureSummary })),
      })))}`).toEqual([]);
      await expect(action).toHaveCSS('color', rgb(tokens['on-accent']));
      await expect(action).toHaveCSS('background-color', rgb(tokens.accent));
      await expectTheme(surface, selection, recipe.color);
    }

    await page.setViewportSize({ width: 300, height: 230 });
    await page.goto(`/${recipe.example}?${new URLSearchParams({ ...selection, reduced: 'true' })}`);
    await expectReadableAction(page, `${accent} preview`);

    // Import the scoped Radix token export into a host that already supplies
    // official step-11 colors; those aliases must not undo the corrected ink.
    await page.addStyleTag({ content: ':root { --jade-11: #208368; --amber-11: #ab6400; }\n'
      + tokenExport(selection, recipe.color, 'radix') });
    await page.locator('.stepper').evaluate(element => element.classList.add('animation-theme'));
    await expectReadableAction(page, `${accent} scoped token export with host Radix colors`);

    const built = await readFile(new URL(`../dist/${recipe.example}`, import.meta.url), 'utf8');
    const exported = themedCode(built, selection, recipe.color);
    expect(embeddedTheme(exported)).toEqual({ ...selection, color: recipe.color });
    expect(exported).toContain(`--accent-ink: ${tokens['accent-ink']};`);
    const offline = await browser.newContext({ offline: true, viewport: { width: 300, height: 230 }, reducedMotion: 'reduce' });
    try {
      const standalone = await offline.newPage();
      const errors = [];
      const requests = [];
      standalone.on('pageerror', error => errors.push(error.message));
      standalone.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
      // No URL theme parameters or host color variables are available here;
      // the portable document must preserve its readable selected colors.
      await standalone.setContent(exported, { waitUntil: 'load' });
      await expectReadableAction(standalone, `${accent} offline export`);
      expect(requests).toEqual([]);
      expect(errors).toEqual([]);
    } finally {
      await offline.close();
    }
  });
}

for (const recipe of catalog.recipes) {
  test(`dark standalone ${recipe.id}: semantic colors, AA access, and compact layout`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: 300, height: 230 });
    await page.goto(`/${recipe.example}?palette=radix&mode=dark&accent=indigo&reduced=true`);
    await page.evaluate(() => { Demo.setSettings({ reduced: true }); Demo.replay(); });
    await expect(page.locator('html')).toHaveAttribute('data-reduced', 'true');
    await expectTheme(page, { ...defaults, palette: 'radix', mode: 'dark', accent: 'indigo' }, recipe.color);
    const size = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, text: document.body.innerText.trim() }));
    expect(size.scroll, `${recipe.id}: horizontal overflow at 300×230`).toBeLessThanOrEqual(size.width + 1);
    expect(size.text.length).toBeGreaterThan(0);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(accessibility.violations, JSON.stringify(accessibility.violations.map(issue => ({
      id: issue.id, nodes: issue.nodes.map(node => ({ target: node.target, summary: node.failureSummary })),
    })))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('workbench theme controls update routes and copy a working themed example offline', async ({ page, context, browser }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?animation=press-feedback&palette=radix&mode=dark&accent=amber');
  await expect(page.locator('#palette-select')).toHaveValue('radix');
  await expect(page.locator('#appearance-select')).toHaveValue('dark');
  await expect(page.locator('#accent-select')).toHaveValue('amber');

  await page.locator('#accent-select').selectOption('indigo');
  await expect.poll(() => new URL(page.url()).searchParams.get('accent')).toBe('indigo');
  await page.locator('#appearance-select').selectOption('light');
  await expect.poll(() => new URL(page.url()).searchParams.get('mode')).toBe('light');
  await page.locator('#palette-select').selectOption('geist');
  await expect.poll(() => new URL(page.url()).searchParams.get('palette')).toBe('geist');

  await page.locator('#palette-select').selectOption('radix');
  await page.locator('#appearance-select').selectOption('dark');
  await page.locator('#accent-select').selectOption('amber');
  const selection = { ...defaults, palette: 'radix', mode: 'dark', accent: 'amber' };
  await expectTheme(page.frameLocator('#detail-frame'), selection);
  await page.getByRole('button', { name: 'Copy full example', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('playground-theme-config');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(embeddedTheme(copied)).toEqual({ ...selection, color: 'lavender' });
  const built = await readFile(new URL('../dist/examples/press-feedback.html', import.meta.url), 'utf8');
  expect(copied).toBe(themedCode(built, selection, 'lavender'));

  const offline = await browser.newContext({ offline: true, viewport: { width: 300, height: 230 } });
  try {
    const standalone = await offline.newPage();
    const errors = [];
    const requests = [];
    standalone.on('pageerror', error => errors.push(error.message));
    standalone.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
    // about:blank has no route parameters; the embedded config must carry the
    // selected palette on its own, with all executable code already included.
    await standalone.setContent(copied, { waitUntil: 'load' });
    await expectTheme(standalone, selection);
    await standalone.evaluate(() => Demo.setSettings({ reduced: true }));
    await standalone.getByRole('button', { name: 'Press me', exact: true }).click();
    await expect(standalone.locator('.press-caption')).toHaveText('That is all it needs');
    expect(requests).toEqual([]);
    expect(errors).toEqual([]);
  } finally {
    await offline.close();
  }
});

test('a custom-color route is reflected in the preview and preserved by Copy link', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const selection = { ...defaults, palette: 'custom', mode: 'dark', accent: 'violet', custom: '#00ff88' };
  const params = new URLSearchParams({ animation: 'press-feedback', ...selection });
  await page.goto(`/?${params}`);
  await expect(page.locator('#palette-select')).toHaveValue('custom');
  await expect(page.locator('#appearance-select')).toHaveValue('dark');
  await expect(page.locator('#accent-select')).toHaveValue('violet');
  await expectTheme(page.frameLocator('#detail-frame'), selection);
  await page.getByRole('button', { name: 'Copy link', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('animation=press-feedback');
  const copied = new URL(await page.evaluate(() => navigator.clipboard.readText()));
  expect(copied.searchParams.get('animation')).toBe('press-feedback');
  for (const [name, value] of Object.entries(selection)) expect(copied.searchParams.get(name)).toBe(value);
});
