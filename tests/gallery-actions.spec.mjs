import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import { defaults, themedCode, tokenExport } from '../src/theme.mjs';

const catalog = JSON.parse(await readFile(new URL('../dist/catalog.json', import.meta.url), 'utf8'));
const recipeFor = id => catalog.recipes.find(recipe => recipe.id === id);
const detailFor = async id => JSON.parse(await readFile(new URL(`../dist/${recipeFor(id).details}`, import.meta.url), 'utf8'));
const sourceFor = id => readFile(new URL(`../dist/${recipeFor(id).example}`, import.meta.url), 'utf8');
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};

async function openQuick(page, id) {
  await page.locator(`[data-inspect="${id}"]`).click();
  const dialog = page.locator('#quick-dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('#quick-title')).toHaveText(recipeFor(id).title);
  return dialog;
}

async function downloadedText(download) {
  expect(await download.failure()).toBeNull();
  const stream = await download.createReadStream();
  expect(stream).not.toBeNull();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
});

test('gallery details, colors, and AI guidance are available before any source file is fetched', async ({ page }) => {
  const sourceRequests = [];
  await page.route('**/examples/*.json', async route => {
    sourceRequests.push(route.request().url());
    await route.abort();
  });
  await page.goto('/?palette=geist&mode=dark&accent=blue');
  const recipe = recipeFor('dock-magnification');
  const dialog = await openQuick(page, recipe.id);
  await expect(page.locator('#quick-tab-guide')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#quick-reference-panel')).toContainText(recipe.useWhen);
  await expect(page.locator('#quick-reference-panel')).toContainText(recipe.reducedMotion);
  await expect(dialog).toContainText(recipe.duration);
  await expect(dialog).toContainText('Motion 14.1.0');

  await page.locator('#quick-tab-theme').click();
  await expect(page.locator('#quick-token-system')).toBeVisible();
  await expect(page.locator('#quick-reference-panel')).toContainText('.animation-theme');
  await page.locator('#quick-tab-ai').click();
  await expect(page.locator('#quick-reference-panel')).toContainText(`Recipe ID: ${recipe.id}`);
  await expect(page.locator('#quick-reference-panel')).toContainText('Motion 14.1.0, already bundled');
  await page.locator('#quick-tab-guide').click();
  await expect(page.locator('#quick-reference-panel')).toContainText(recipe.principle);
  expect(sourceRequests).toEqual([]);
  expect(new URL(page.url()).searchParams.has('animation')).toBe(false);
});

test('closing quick details restores the filtered gallery, its scroll position, and the original preview nodes', async ({ page }) => {
  const id = catalog.recipes.filter(recipe => recipe.tags.includes('outline')).at(-1).id;
  await page.goto('/?q=outline&palette=geist&mode=dark&accent=blue');
  const trigger = page.locator(`[data-inspect="${id}"]`);
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  const before = await trigger.evaluate(button => {
    const card = button.closest('.sample');
    window.galleryBeforeQuickDetails = {
      card, frame: card.querySelector('iframe'), gallery: card.closest('.gallery'),
    };
    return { url: location.href, scroll: scrollY };
  });
  expect(before.scroll).toBeGreaterThan(500);
  await trigger.press('Enter');
  await expect(page.locator('#quick-dialog')).toBeVisible();

  await page.locator('#quick-tab-guide').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#quick-tab-theme')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#quick-tab-ai')).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.locator('#quick-tab-code')).toBeFocused();
  await expect(page.locator('#quick-reference-panel .code-languages')).toBeVisible();
  await page.keyboard.press('Escape');

  await expect(page.locator('#quick-dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(page.url()).toBe(before.url);
  expect(Math.abs(await page.evaluate(() => scrollY) - before.scroll)).toBeLessThanOrEqual(1);
  expect(await page.evaluate(id => {
    const previous = window.galleryBeforeQuickDetails;
    const card = document.querySelector(`.sample[data-recipe="${id}"]`);
    return {
      card: previous.card === card,
      frame: previous.frame === card.querySelector('iframe'),
      gallery: previous.gallery === card.closest('.gallery'),
    };
  }, id)).toEqual({ card: true, frame: true, gallery: true });
  await expect(page.locator('#search-input')).toHaveValue('outline');
  await expect(page.locator('#detail-frame')).toHaveCount(0);
});

test('a cold card copy starts during the click and keeps its palette while the same source opens in details', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => {
    if (window !== window.top) return;
    window.pendingSourceClipboardWrites = 0;
    const write = navigator.clipboard.write.bind(navigator.clipboard);
    Object.defineProperty(navigator.clipboard, 'write', {
      configurable: true,
      value(items) {
        window.pendingSourceClipboardWrites++;
        return write(items);
      },
    });
  });
  const first = { ...defaults, palette: 'radix', mode: 'light', accent: 'amber' };
  const second = { ...defaults, palette: 'geist', mode: 'dark', accent: 'blue' };
  const detail = await detailFor('press-feedback');
  const source = await sourceFor('press-feedback');
  const requested = deferred();
  const release = deferred();
  let requests = 0;
  await page.route('**/examples/press-feedback.json', async route => {
    requests++;
    requested.resolve();
    await release.promise;
    await route.fulfill({ json: detail });
  });

  try {
    await page.goto(`/?${new URLSearchParams(first)}`);
    await page.locator('[data-copy-recipe="press-feedback"]').click();
    await requested.promise;
    // The clipboard request must begin while source loading is still blocked;
    // a write after awaiting fetch can lose the originating user activation.
    await expect.poll(() => page.evaluate(() => window.pendingSourceClipboardWrites)).toBe(1);
    await page.locator('#palette-select').selectOption(second.palette);
    await page.locator('#appearance-select').selectOption(second.mode);
    await page.locator('#accent-select').selectOption(second.accent);
    const dialog = await openQuick(page, 'press-feedback');
    await page.locator('#quick-tab-code').click();
    expect(requests).toBe(1);
    release.resolve();

    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(themedCode(source, first, detail.color));
    await dialog.locator('[data-language="full"]').click();
    await expect(page.locator('#quick-reference-panel .code-container code')).toHaveText(themedCode(source, second, detail.color));
    expect(requests).toBe(1);
    await expect(page.locator('#clipboard-dialog')).toBeHidden();
  } finally {
    release.resolve();
  }
});

test('a denied delayed card copy cannot cover newly opened details or move their focus', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    if (window !== window.top) return;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        write: () => Promise.reject(new DOMException('Blocked for this test.', 'NotAllowedError')),
        writeText: () => Promise.reject(new DOMException('Blocked for this test.', 'NotAllowedError')),
      },
    });
    document.execCommand = () => false;
  });
  const detail = await detailFor('press-feedback');
  const requested = deferred();
  const release = deferred();
  await page.route('**/examples/press-feedback.json', async route => {
    requested.resolve();
    await release.promise;
    await route.fulfill({ json: detail });
  });

  try {
    await page.goto('/');
    const copy = page.locator('[data-copy-recipe="press-feedback"]');
    await copy.click();
    await requested.promise;
    await expect(copy).toHaveAttribute('aria-busy', 'true');
    await openQuick(page, 'sliding-tabs');
    await page.locator('#quick-tab-theme').click();
    await expect(page.locator('#quick-tab-theme')).toBeFocused();
    release.resolve();
    await expect(copy).not.toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('#quick-title')).toHaveText(recipeFor('sliding-tabs').title);
    await expect(page.locator('#quick-tab-theme')).toBeFocused();
    await expect(page.locator('#clipboard-dialog')).toBeHidden();
    await expect(page.locator('#quick-status')).toContainText('Clipboard access was blocked');
    expect(errors).toEqual([]);
  } finally {
    release.resolve();
  }
});

test('a newer card copy supersedes a slower earlier copy without stale clipboard text or a fallback dialog', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const selection = { ...defaults, palette: 'geist', mode: 'dark', accent: 'blue' };
  const detail = await detailFor('press-feedback');
  const expected = themedCode(await sourceFor('sliding-tabs'), selection, recipeFor('sliding-tabs').color);
  const requested = deferred();
  const release = deferred();
  await page.route('**/examples/press-feedback.json', async route => {
    requested.resolve();
    await release.promise;
    await route.fulfill({ json: detail });
  });

  try {
    await page.goto(`/?${new URLSearchParams(selection)}`);
    const older = page.locator('[data-copy-recipe="press-feedback"]');
    await older.click();
    await requested.promise;
    await expect(older).toHaveAttribute('aria-busy', 'true');
    await page.locator('[data-copy-recipe="sliding-tabs"]').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
    await openQuick(page, 'sliding-tabs');
    await expect(page.locator('#quick-title')).toBeFocused();
    release.resolve();
    await expect(older).not.toHaveAttribute('aria-busy', 'true');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
    await expect(page.locator('#quick-title')).toHaveText(recipeFor('sliding-tabs').title);
    await expect(page.locator('#quick-title')).toBeFocused();
    await expect(page.locator('#clipboard-dialog')).toBeHidden();
    expect(errors).toEqual([]);
  } finally {
    release.resolve();
  }
});

test('downloads and clipboard copies finish independently when their source loads overlap', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const selection = { ...defaults, palette: 'geist', mode: 'dark', accent: 'blue' };
  const ids = ['press-feedback', 'sliding-tabs'];
  const sources = new Map(await Promise.all(ids.map(async id => [id, {
    detail: await detailFor(id),
    expected: themedCode(await sourceFor(id), selection, recipeFor(id).color),
    requested: deferred(), release: deferred(),
  }])));
  for (const [id, source] of sources) {
    await page.route(`**/examples/${id}.json`, async route => {
      source.requested.resolve();
      await source.release.promise;
      await route.fulfill({ json: source.detail });
    });
  }

  try {
    await page.goto(`/?${new URLSearchParams(selection)}`);
    const first = sources.get(ids[0]);
    let dialog = await openQuick(page, ids[0]);
    const firstDownload = page.waitForEvent('download');
    await dialog.locator('[data-action="download-full"]').click();
    await first.requested.promise;
    await dialog.locator('[data-action="copy-link"]').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(`animation=${ids[0]}`);
    await page.locator('#quick-tab-ai').click();
    await dialog.locator('[data-action="copy-ai"]').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(`Recipe ID: ${ids[0]}`);
    const brief = await page.evaluate(() => navigator.clipboard.readText());
    first.release.resolve();
    expect(await downloadedText(await firstDownload)).toBe(first.expected);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(brief);
    await page.keyboard.press('Escape');

    const second = sources.get(ids[1]);
    await page.locator(`[data-copy-recipe="${ids[1]}"]`).click();
    await second.requested.promise;
    dialog = await openQuick(page, ids[1]);
    const secondDownload = page.waitForEvent('download');
    await dialog.locator('[data-action="download-full"]').click();
    second.release.resolve();
    expect(await downloadedText(await secondDownload)).toBe(second.expected);
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(second.expected);
    await expect(page.locator('#clipboard-dialog')).toBeHidden();
  } finally {
    for (const source of sources.values()) source.release.resolve();
  }
});

test('failed source can retry and a dismissed slow retry cannot replace another animation', async ({ page }) => {
  const detail = await detailFor('press-feedback');
  const other = await detailFor('sliding-tabs');
  const retryRequested = deferred();
  const releaseRetry = deferred();
  let requests = 0;
  await page.route('**/examples/press-feedback.json', async route => {
    requests++;
    if (requests === 1) {
      await route.fulfill({ status: 503, body: 'Source temporarily unavailable' });
      return;
    }
    retryRequested.resolve();
    await releaseRetry.promise;
    await route.fulfill({ json: detail });
  });

  try {
    await page.goto('/');
    const dialog = await openQuick(page, 'press-feedback');
    await page.locator('#quick-tab-code').click();
    await expect(dialog.locator('[data-action="retry-source"]')).toBeVisible();
    await dialog.locator('[data-action="retry-source"]').click();
    await retryRequested.promise;
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await openQuick(page, 'sliding-tabs');
    await page.locator('#quick-tab-code').click();
    await expect(page.locator('#quick-reference-panel .code-container code')).toHaveText(other.study.css);

    const received = page.waitForResponse(response => response.url().endsWith('/examples/press-feedback.json') && response.status() === 200);
    releaseRetry.resolve();
    await (await received).finished();
    await expect(page.locator('#quick-title')).toHaveText(other.title);
    await expect(page.locator('#quick-reference-panel .code-container code')).toHaveText(other.study.css);
    await page.keyboard.press('Escape');
    await openQuick(page, 'press-feedback');
    await page.locator('#quick-tab-code').click();
    await expect(page.locator('#quick-reference-panel .code-container code')).toHaveText(detail.study.css);
    expect(requests).toBe(2);
  } finally {
    releaseRetry.resolve();
  }
});

test('related-card details keep their tabs and exports separate from the underlying workbench', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const selection = { ...defaults, palette: 'geist', mode: 'dark', accent: 'violet' };
  await page.goto(`/?${new URLSearchParams({ animation: 'press-feedback', ...selection })}`);
  await expect(page.locator('#detail-frame')).toBeVisible();
  await page.locator('#tab-guide').click();
  const originalGuide = await page.locator('#reference-panel').textContent();
  await page.locator('#detail-frame').evaluate(frame => { window.workbenchBeforeQuickDetails = frame; });
  const related = page.locator('.related [data-inspect]').first();
  const id = await related.getAttribute('data-inspect');
  await related.click();
  await expect(page.locator('#quick-title')).toHaveText(recipeFor(id).title);
  await page.locator('#quick-tab-guide').focus();
  await page.keyboard.press('Home');
  await expect(page.locator('#quick-tab-code')).toBeFocused();
  await expect(page.locator('#quick-reference-panel .code-languages')).toBeVisible();
  await page.keyboard.press('End');
  await expect(page.locator('#quick-tab-ai')).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#quick-tab-theme')).toBeFocused();
  await page.locator('#quick-token-system').selectOption('radix');
  await expect(page.locator('#quick-token-system')).toBeFocused();
  await expect(page.locator('#tab-guide')).toHaveAttribute('aria-selected', 'true');
  expect(await page.locator('#reference-panel').textContent()).toBe(originalGuide);
  expect(await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  })).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(page.locator('#quick-dialog')).toBeHidden();
  await expect(related).toBeFocused();
  expect(await page.evaluate(() => window.workbenchBeforeQuickDetails === document.querySelector('#detail-frame'))).toBe(true);
  expect(new URL(page.url()).searchParams.get('animation')).toBe('press-feedback');
  await page.locator('.detail-actions [data-action="copy-full"]').click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(themedCode(await sourceFor('press-feedback'), selection, recipeFor('press-feedback').color));
});

test('keyboard source-language changes retain focus in the matching workbench or quick inspector', async ({ page }) => {
  const selection = { ...defaults, palette: 'geist', mode: 'dark', accent: 'blue' };
  await page.goto(`/?${new URLSearchParams({ animation: 'sliding-tabs', ...selection })}`);
  await expect(page.locator('#reference-panel .code-languages')).toBeVisible();
  const detail = await detailFor('sliding-tabs');
  for (const language of ['js', 'html', 'full']) {
    const control = page.locator(`#reference-panel [data-language="${language}"]`);
    await control.press('Enter');
    await expect(control).toBeFocused();
    await expect(control).toHaveAttribute('aria-pressed', 'true');
    const expected = language === 'full' ? themedCode(detail.code, selection, detail.color) : detail.study[language];
    await expect(page.locator('#reference-panel .code-container code')).toHaveText(expected);
  }

  const related = page.locator('.related [data-inspect]').first();
  const id = await related.getAttribute('data-inspect');
  await related.click();
  await page.locator('#quick-tab-code').click();
  await expect(page.locator('#quick-reference-panel .code-languages')).toBeVisible();
  const quickDetail = await detailFor(id);
  for (const language of ['js', 'html', 'full']) {
    const control = page.locator(`#quick-reference-panel [data-language="${language}"]`);
    await control.press('Enter');
    await expect(control).toBeFocused();
    await expect(control).toHaveAttribute('aria-pressed', 'true');
    const expected = language === 'full' ? themedCode(quickDetail.code, selection, quickDetail.color) : quickDetail.study[language];
    await expect(page.locator('#quick-reference-panel .code-container code')).toHaveText(expected);
    await expect(page.locator('#reference-panel [data-language="full"]')).toHaveAttribute('aria-pressed', 'true');
  }
});

test('manual copy stays selectable above quick details and closes back through both invoking controls', async ({ page }) => {
  await page.addInitScript(() => {
    if (window !== window.top) return;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        write: () => Promise.reject(new DOMException('Blocked for this test.', 'NotAllowedError')),
        writeText: () => Promise.reject(new DOMException('Blocked for this test.', 'NotAllowedError')),
      },
    });
    document.execCommand = () => false;
  });
  await page.goto('/?q=press');
  const trigger = page.locator('[data-inspect="press-feedback"]');
  const dialog = await openQuick(page, 'press-feedback');
  await page.locator('#quick-tab-ai').click();
  const copy = dialog.locator('[data-action="copy-ai"]');
  await copy.click();
  const manual = page.locator('#clipboard-dialog');
  const text = page.locator('#clipboard-text');
  await expect(manual).toBeVisible();
  await expect(text).toBeFocused();
  await expect(text).toHaveValue(/Recipe ID: press-feedback/);
  expect(await text.evaluate(element => ({ start: element.selectionStart, end: element.selectionEnd, length: element.value.length }))).toMatchObject({ start: 0, end: (await text.inputValue()).length });
  await page.keyboard.press('Escape');
  await expect(manual).toBeHidden();
  await expect(dialog).toBeVisible();
  await expect(copy).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator('#search-input')).toHaveValue('press');
});

test('gallery copy, downloads, tokens, links, and AI briefs match the workbench for native and Motion examples', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const selection = { ...defaults, palette: 'custom', mode: 'dark', accent: 'jade', custom: '#00ff88' };
  const galleryUrl = `/?${new URLSearchParams(selection)}`;
  for (const id of ['press-feedback', 'dock-magnification']) {
    const recipe = recipeFor(id);
    const expectedSource = themedCode(await sourceFor(id), selection, recipe.color);
    await page.goto(galleryUrl);
    const before = page.url();
    await page.locator(`[data-copy-recipe="${id}"]`).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expectedSource);
    expect(page.url()).toBe(before);
    const dialog = await openQuick(page, id);

    const downloading = page.waitForEvent('download');
    await dialog.locator('[data-action="download-full"]').click();
    const download = await downloading;
    expect(download.suggestedFilename()).toBe(`${id}.html`);
    expect(await downloadedText(download)).toBe(expectedSource);
    await dialog.locator('[data-action="copy-link"]').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(`animation=${id}`);
    const link = new URL(await page.evaluate(() => navigator.clipboard.readText()));
    expect(link.searchParams.get('animation')).toBe(id);
    for (const [name, value] of Object.entries(selection)) expect(link.searchParams.get(name)).toBe(value);

    await page.locator('#quick-tab-theme').click();
    for (const system of ['values', 'radix']) {
      await page.locator('#quick-token-system').selectOption(system);
      await dialog.locator('[data-action="copy-tokens"]').click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(tokenExport(selection, recipe.color, system));
    }
    await page.locator('#quick-tab-ai').click();
    await dialog.locator('[data-action="copy-ai"]').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(`Recipe ID: ${id}`);
    const quickBrief = await page.evaluate(() => navigator.clipboard.readText());
    expect(quickBrief).toContain('Selected appearance: custom / dark / #00ff88.');
    expect(quickBrief).toContain(recipe.usesMotion ? 'Motion 14.1.0, already bundled' : 'None; native HTML, CSS, and browser APIs.');
    expect(quickBrief).toContain(recipe.reducedMotion);

    await dialog.locator(`[data-open="${id}"]`).click();
    await expect(page.locator('#quick-dialog')).toBeHidden();
    await expect(page.locator('#detail-frame')).toBeVisible();
    await page.locator('#tab-ai').click();
    await page.locator('#reference-panel [data-action="copy-ai"]').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(quickBrief);
  }
});

test.describe('compact quick details', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('the reference tabs, source, and footer actions stay reachable at 320px and 390px', async ({ page }) => {
    const recipe = catalog.recipes.reduce((longest, item) => item.title.length > longest.title.length ? item : longest);
    for (const [width, mode] of [[320, 'light'], [390, 'dark']]) {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ colorScheme: mode, reducedMotion: 'reduce' });
      await page.goto(`/?palette=geist&mode=${mode}&accent=blue`);
      const trigger = page.locator(`[data-inspect="${recipe.id}"]`);
      await trigger.tap();
      const dialog = page.locator('#quick-dialog');
      await expect(dialog).toBeVisible();
      await page.locator('#quick-tab-code').tap();
      await expect(page.locator('#quick-reference-panel .code-languages')).toBeVisible();
      for (const control of [page.locator('#quick-tab-theme'), dialog.locator('[data-action="copy-full"]'), dialog.locator('[data-action="download-full"]'), dialog.getByRole('button', { name: /close/i })]) {
        await control.scrollIntoViewIfNeeded();
        const bounds = await control.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds.height).toBeGreaterThanOrEqual(44);
        expect(bounds.x).toBeGreaterThanOrEqual(-1);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
        expect(bounds.y).toBeGreaterThanOrEqual(-1);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(845);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      const accessibility = await new AxeBuilder({ page }).include('#quick-dialog').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(accessibility.violations, JSON.stringify(accessibility.violations.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) })))).toEqual([]);
      await dialog.getByRole('button', { name: /close/i }).tap();
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    }
  });
});
