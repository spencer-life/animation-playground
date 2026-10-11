import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 300, height: 230 } });

async function openStudy(page, id, extra = {}) {
  const params = new URLSearchParams({ palette: 'radix', mode: 'dark', accent: 'indigo', paused: 'true', reduced: 'false', ...extra });
  await page.goto(`/examples/${id}.html?${params}`);
  await expect(page.locator('.workflow-stage')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function finishMotion(page) {
  await page.evaluate(async () => {
    const animations = document.getAnimations();
    animations.forEach(animation => { try { animation.finish(); } catch { animation.cancel(); } });
    await Promise.allSettled(animations.map(animation => animation.finished));
  });
}

async function activateStudy(page) {
  // Enable playback before proving that an ordinary keyboard action is instant.
  // The explicit replay may change the state; each test restores its own setup.
  await page.evaluate(() => Demo.replay());
  await finishMotion(page);
  await expect(page.locator('html')).toHaveAttribute('data-paused', 'false');
}

async function manualMotionCount(page) {
  return page.evaluate(() => document.getAnimations().filter(animation =>
    !(animation instanceof CSSAnimation) && !(animation instanceof CSSTransition) && animation.playState === 'running',
  ).length);
}

async function expectCanvasFit(page, selector = '.wf-shell, .wf-caption') {
  const bounds = await page.evaluate(selector => {
    const stage = document.querySelector('.workflow-stage').getBoundingClientRect();
    return { width: innerWidth, height: innerHeight, stageHeight: stage.height, boxes: [...document.querySelectorAll(selector)].map(element => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
    }).filter(rect => rect.width && rect.height) };
  }, selector);
  expect(bounds.stageHeight).toBeLessThanOrEqual(bounds.height + 1);
  for (const box of bounds.boxes) {
    expect(box.top).toBeGreaterThanOrEqual(-.5);
    expect(box.left).toBeGreaterThanOrEqual(-.5);
    expect(box.bottom).toBeLessThanOrEqual(bounds.height + .5);
    expect(box.right).toBeLessThanOrEqual(bounds.width + .5);
  }
}

test('chapter navigation demonstrates both directions and preserves focus at its endpoints', async ({ page }) => {
  await openStudy(page, 'directional-pagination', { speed: '0.25' });
  await page.evaluate(() => Demo.replay());
  await finishMotion(page);
  const back = page.locator('.page-back'), next = page.locator('.page-next');
  const firstTransform = () => page.locator('.page-sheet').evaluate(element => element.getAnimations()[0]?.effect.getKeyframes()[0].transform);

  await back.click();
  await expect(page.locator('.page-count')).toHaveText('1 / 3');
  expect(await firstTransform()).toBe('translateX(-24px)');
  await expect(back).toBeDisabled();
  await expect(next).toBeFocused();
  await finishMotion(page);

  await next.click();
  expect(await firstTransform()).toBe('translateX(24px)');
  await finishMotion(page);
  await next.click();
  await expect(page.locator('.page-count')).toHaveText('3 / 3');
  await expect(next).toBeDisabled();
  await expect(back).toBeFocused();

  await back.press('Enter');
  await expect(page.locator('.page-count')).toHaveText('2 / 3');
  expect(await manualMotionCount(page)).toBe(0);
  await back.press('Enter');
  await expect(next).toBeFocused();
  await expect(page.locator('.page-count')).toHaveText('1 / 3');

  await page.evaluate(() => Demo.replay());
  await back.focus();
  await page.evaluate(() => Demo.replay());
  await expect(back).toBeFocused();
  expect(await page.evaluate(() => {
    document.activeElement.blur();
    const previous = document.activeElement;
    Demo.replay();
    return document.activeElement === previous;
  })).toBe(true);
});

test('tabs ignore repeated selection and keyboard navigation updates panels and hierarchy focus immediately', async ({ page }) => {
  await openStudy(page, 'tab-panel-transition', { speed: '0.25' });
  await page.evaluate(() => Demo.replay());
  await finishMotion(page);
  await page.getByRole('tab', { name: 'Activity' }).click();
  const repeat = await page.evaluate(() => {
    const panel = document.querySelector('#panel-activity'), animation = panel.getAnimations()[0];
    animation.pause(); animation.currentTime = 90;
    const before = getComputedStyle(panel).opacity;
    document.querySelector('#view-activity').click();
    return { same: panel.getAnimations()[0] === animation, before, after: getComputedStyle(panel).opacity };
  });
  expect(repeat.same).toBe(true);
  expect(repeat.after).toBe(repeat.before);
  await page.getByRole('tab', { name: 'Activity' }).press('Home');
  await expect(page.getByRole('tab', { name: 'Overview' })).toBeFocused();
  await expect(page.locator('#panel-overview')).toBeVisible();
  await expect(page.locator('#panel-activity')).toBeHidden();
  await page.getByRole('tab', { name: 'Overview' }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Notes' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
  expect(await manualMotionCount(page)).toBe(0);

  await openStudy(page, 'drilldown-navigation');
  await activateStudy(page);
  await page.locator('.drill-back').click();
  await finishMotion(page);
  const origin = page.locator('[data-folder="Type"]');
  await origin.press('Enter');
  await expect(page.locator('.drill-heading')).toHaveText('Type studies');
  await expect(page.locator('.drill-back')).toBeFocused();
  await expect(page.locator('.drill-parent')).toBeHidden();
  await page.locator('.drill-back').press('Enter');
  await expect(origin).toBeFocused();
  await expect(page.locator('.drill-child')).toBeHidden();
  expect(await manualMotionCount(page)).toBe(0);
});

test('contextual tools never cover either text block and the search result pane supports native keyboard scrolling', async ({ page }) => {
  for (const viewport of [{ width: 300, height: 230 }, { width: 700, height: 420 }]) {
    await page.setViewportSize(viewport);
    await openStudy(page, 'floating-toolbar');
    const blocks = page.locator('.format-line');
    await blocks.nth(1).click();
    await page.getByRole('button', { name: 'Italic', exact: true }).click();
    await expect(blocks.nth(1).locator('span')).toHaveCSS('font-style', 'italic');
    await blocks.nth(0).click();
    await page.getByRole('button', { name: 'Bold', exact: true }).click();
    await expect(blocks.nth(0).locator('span')).toHaveCSS('font-weight', '700');
    await expect(blocks.nth(1).locator('span')).toHaveCSS('font-style', 'italic');
    const clear = await page.evaluate(() => {
      const toolbar = document.querySelector('.format-toolbar').getBoundingClientRect();
      return [...document.querySelectorAll('.format-line')].every(block => {
        const rect = block.getBoundingClientRect();
        return toolbar.bottom < rect.top && block.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
      });
    });
    expect(clear).toBe(true);
    await page.getByRole('button', { name: 'Bold', exact: true }).press('ArrowRight');
    await expect(page.getByRole('button', { name: 'Italic', exact: true })).toBeFocused();
    await expectCanvasFit(page);
  }

  await page.setViewportSize({ width: 300, height: 230 });
  await openStudy(page, 'expanding-search');
  await page.locator('.search-toggle').press('Enter');
  await expect(page.locator('#asset-query')).toBeFocused();
  await page.locator('#asset-query').fill('icon');
  await expect(page.locator('.search-items li:visible')).toHaveCount(1);
  await expect(page.locator('.search-count')).toHaveText('1 asset');
  await page.locator('#asset-query').fill('no matching asset');
  await expect(page.locator('.search-count')).toHaveText('No matching assets');
  await page.locator('#asset-query').press('Escape');
  await expect(page.locator('.search-toggle')).toBeFocused();
  await expect(page.locator('.search-items li:visible')).toHaveCount(3);
  const results = page.getByRole('list', { name: 'Matching demo assets' });
  await results.press('End');
  await expect.poll(() => results.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await expect(results).toBeFocused();
  expect(await results.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
  await expectCanvasFit(page);
});

test('table sorting preserves exact data and disclosures retain real table structure during rapid changes', async ({ page }) => {
  await openStudy(page, 'data-sort');
  await page.evaluate(() => Demo.replay());
  expect(await manualMotionCount(page)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Name' }).click();
  await expect(page.locator('.sort-table tbody tr')).toHaveCount(3);
  expect(await page.locator('.sort-table tbody tr').evaluateAll(rows => rows.map(row => [row.dataset.name, row.querySelector('td').textContent]))).toEqual([
    ['Alex', '34'], ['June', '56'], ['Mira', '21'],
  ]);
  await expect(page.locator('.sort-table thead th').first()).toHaveAttribute('aria-sort', 'ascending');
  expect(await manualMotionCount(page)).toBe(0);
  await page.getByRole('button', { name: 'Tasks' }).press('Enter');
  expect(await page.locator('.sort-table tbody tr').evaluateAll(rows => rows.map(row => row.dataset.name))).toEqual(['June', 'Alex', 'Mira']);
  await expect(page.locator('.sort-table thead th').last()).toHaveAttribute('aria-sort', 'descending');
  expect(await manualMotionCount(page)).toBe(0);

  await openStudy(page, 'table-row-expand');
  await page.evaluate(() => {
    Demo.replay();
    const controls = [...document.querySelectorAll('[data-record]')];
    controls[1].click(); controls[0].click(); controls[1].click();
  });
  await expect(page.locator('.detail-record:visible')).toHaveCount(1);
  await expect(page.locator('#record-web')).toBeVisible();
  await expect(page.locator('[data-record="1"]')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-record="0"]')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.detail-table thead th[scope="col"]')).toHaveCount(2);
  await expect(page.locator('.detail-summary th[scope="row"]')).toHaveCount(2);
  await expect(page.locator('.detail-summary td')).toHaveText(['12', '18']);
  await expect(page.locator('#record-web td')).toHaveAttribute('colspan', '2');
  await finishMotion(page);
  await expectCanvasFit(page);
  await page.locator('[data-record="1"]').press('Enter');
  await expect(page.locator('.detail-record:visible')).toHaveCount(0);
  expect(await manualMotionCount(page)).toBe(0);
});

test('list/grid keeps actual artwork and labels uncovered through reversals while keyboard density changes stay direct', async ({ page }) => {
  for (const viewport of [{ width: 300, height: 230 }, { width: 700, height: 420 }]) {
    await page.setViewportSize(viewport);
    await openStudy(page, 'list-grid-morph');
    const motion = await page.evaluate(() => {
      const collection = document.querySelector('.asset-views'), cards = [...collection.querySelectorAll('li')];
      const selector = '.asset-view-art, .asset-views strong, .asset-views small';
      const foreground = [...document.querySelectorAll(selector)], surfaces = [...collection.querySelectorAll('.asset-view-surface')];
      const boxes = () => foreground.map(element => { const rect = element.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }; });
      const baseline = boxes(), retargets = [], samples = [];
      const animations = () => collection.getAnimations({ subtree: true });
      const seek = (active, fraction) => {
        const duration = foreground[0].getAnimations()[0].effect.getTiming().duration;
        active.forEach(animation => { animation.pause(); animation.currentTime = duration * fraction; });
      };
      const inspect = context => {
        const bounds = collection.getBoundingClientRect(), caption = document.querySelector('.wf-caption').getBoundingClientRect();
        samples.push(...foreground.map((element, index) => {
          const rect = element.getBoundingClientRect(), style = getComputedStyle(element), matrix = new DOMMatrixReadOnly(style.transform);
          // Test the actual foreground, including its corners. An opaque later
          // card or a clipped parent must not pass merely because the list fits.
          const covered = [];
          for (const x of [rect.left + 1, rect.left + rect.width / 2, rect.right - 1]) {
            for (const y of [rect.top + 1, rect.top + rect.height / 2, rect.bottom - 1]) {
              const hit = document.elementFromPoint(x, y);
              if (hit !== element && !element.contains(hit)) covered.push(hit?.className?.baseVal ?? hit?.className ?? hit?.tagName ?? 'outside viewport');
            }
          }
          return {
            context, node: element.textContent.trim() || 'art ' + Math.floor(index / 3), covered,
            bounded: rect.top >= bounds.top - .5 && rect.left >= bounds.left - .5 && rect.right <= bounds.right + .5 && rect.bottom <= bounds.bottom + .5 && rect.bottom < caption.top,
            scale: [matrix.a, matrix.d], dimensions: [rect.width, rect.height], expectedDimensions: [baseline[index].width, baseline[index].height], opacity: style.opacity,
          };
        }));
      };
      Demo.replay();
      const first = animations();
      seek(first, .35);
      const held = boxes();
      document.querySelector('.view-controls [data-view="grid"]').click();
      const sameChoiceUnchanged = first.every(animation => animations().includes(animation)) && JSON.stringify(held) === JSON.stringify(boxes());

      // Reverse during both phases, then reverse that live presentation again.
      // Positions, dimensions, and the decorative fade must all continue from
      // their current values instead of restarting from a cached layout.
      for (const [view, fraction] of [['list', .25], ['grid', .75], ['list', .75], ['grid', .25]]) {
        const previous = animations(); seek(previous, fraction);
        inspect('before reversal to ' + view + ' at ' + fraction);
        const before = boxes(), opacityBefore = surfaces.map(surface => getComputedStyle(surface).opacity);
        document.querySelector('.view-controls [data-view="' + view + '"]').click();
        const current = animations(); seek(current, 0);
        retargets.push({
          before, after: boxes(), opacityBefore, opacityAfter: surfaces.map(surface => getComputedStyle(surface).opacity),
          foregroundAnimations: foreground.flatMap(element => element.getAnimations()).length,
          canceled: previous.every(animation => animation.playState === 'idle'),
        });
        inspect('after reversal to ' + view);
      }
      animations().forEach(animation => animation.finish());
      for (const view of ['list', 'grid']) {
        document.querySelector('.view-controls [data-view="' + view + '"]').click();
        const active = animations();
        for (const fraction of [0, .1, .25, .49, .5, .51, .75, .9, .99]) {
          seek(active, fraction); inspect(view + ' at ' + fraction);
        }
        active.forEach(animation => animation.finish());
      }
      return {
        nodeCount: foreground.length, sameChoiceUnchanged, retargets, samples,
        sameNodes: cards.every((card, index) => card === collection.querySelectorAll('li')[index]) && foreground.every((element, index) => element === document.querySelectorAll(selector)[index]),
      };
    });
    expect(motion.nodeCount).toBe(9);
    expect(motion.sameNodes).toBe(true);
    expect(motion.sameChoiceUnchanged).toBe(true);
    for (const retarget of motion.retargets) {
      expect(retarget.foregroundAnimations).toBe(9);
      expect(retarget.canceled).toBe(true);
      for (let index = 0; index < retarget.before.length; index++) {
        for (const property of ['x', 'y', 'width', 'height']) expect(retarget.after[index][property]).toBeCloseTo(retarget.before[index][property], 1);
      }
      for (let index = 0; index < retarget.opacityBefore.length; index++) expect(Number(retarget.opacityAfter[index])).toBeCloseTo(Number(retarget.opacityBefore[index]), 3);
    }
    for (const sample of motion.samples) {
      const context = `${viewport.width}px ${sample.context}: ${sample.node}`;
      expect(sample.covered, context).toEqual([]);
      expect(sample.bounded, context).toBe(true);
      expect(sample.scale, context).toEqual([1, 1]);
      expect(sample.opacity, context).toBe('1');
      for (let index = 0; index < 2; index++) expect(sample.dimensions[index], context).toBeCloseTo(sample.expectedDimensions[index], 1);
    }
    await finishMotion(page);
    await expect(page.locator('.view-shell')).toHaveAttribute('data-view', 'grid');
    await expect(page.locator('.asset-views strong')).toHaveText(['Mark', 'Cover', 'Type']);
    await expect(page.locator('.asset-views small')).toHaveText(['Brand', 'Image', 'System']);
    expect(await page.locator('.asset-views, .asset-views li').evaluateAll(elements => elements.every(element => !element.getAttribute('style')))).toBe(true);
    expect(await page.locator('.asset-view-art, .asset-views strong, .asset-views small').evaluateAll(elements => elements.every(element => getComputedStyle(element).transform === 'none'))).toBe(true);
    expect(await page.locator('.asset-view-art svg').evaluateAll(elements => elements.every(element => {
      const rect = element.getBoundingClientRect(); return Math.abs(rect.width - rect.height) < .01;
    }))).toBe(true);
    await expectCanvasFit(page);
    await expect(page.locator('html')).toHaveAttribute('data-paused', 'false');
    await page.locator('.view-controls [data-view="list"]').press('Enter');
    await expect(page.locator('.view-shell')).toHaveAttribute('data-view', 'list');
    expect(await manualMotionCount(page)).toBe(0);
    await page.evaluate(() => { Demo.replay(); Demo.setSettings({ reduced: true }); });
    expect(await page.locator('.asset-views').evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
    expect(await page.locator('.asset-view-art, .asset-views strong, .asset-views small').evaluateAll(elements => elements.every(element => getComputedStyle(element).transform === 'none'))).toBe(true);
  }

  await page.setViewportSize({ width: 300, height: 230 });
  await openStudy(page, 'density-switch');
  await activateStudy(page);
  await page.getByRole('button', { name: 'Comfortable', exact: true }).click();
  await finishMotion(page);
  const comfortable = await page.locator('.density-list li').first().evaluate(element => element.getBoundingClientRect().height);
  await page.getByRole('button', { name: 'Compact', exact: true }).press('Enter');
  const compact = await page.locator('.density-list li').first().evaluate(element => element.getBoundingClientRect().height);
  expect(compact).toBeLessThan(comfortable);
  await expect(page.locator('.density-list strong')).toHaveText(['08', '12', '06']);
  expect(await manualMotionCount(page)).toBe(0);
});

test('the dock freezes and resumes its spring presentation while reduced motion keeps every fixed target usable', async ({ page }) => {
  await openStudy(page, 'dock-magnification');
  const faces = page.locator('.dock-face');
  const scale = () => faces.nth(1).evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).a);
  const targets = await page.locator('.dock-tool').evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  }));
  await page.evaluate(() => Demo.replay());
  await expect.poll(scale, { intervals: [20, 30, 50] }).toBeGreaterThan(1.03);
  const frozen = await page.evaluate(async () => {
    Demo.setSettings({ paused: true });
    await new Promise(requestAnimationFrame);
    return [...document.querySelectorAll('.dock-face')].map(element => getComputedStyle(element).transform);
  });
  await page.waitForTimeout(120);
  expect(await faces.evaluateAll(elements => elements.map(element => getComputedStyle(element).transform))).toEqual(frozen);
  const held = await scale();
  await page.evaluate(() => Demo.setSettings({ paused: false }));
  await expect.poll(scale, { intervals: [20, 30, 50] }).toBeGreaterThan(held + .002);
  await page.evaluate(() => Demo.setSettings({ reduced: true }));
  for (const face of await faces.all()) expect(await face.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBe(1);
  await page.getByRole('button', { name: 'Files', exact: true }).press('Enter');
  await expect(page.locator('.dock-status')).toHaveText('Files is open');
  await expect(page.getByRole('button', { name: 'Files', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.dock-tool').evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  }))).toEqual(targets);
});

test('section links and sticky titles follow native scroll geometry in compact and expanded previews', async ({ page }) => {
  for (const viewport of [{ width: 300, height: 230 }, { width: 700, height: 420 }]) {
    await page.setViewportSize(viewport);
    await openStudy(page, 'anchor-scrollspy');
    await page.getByRole('link', { name: 'Details', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Details', exact: true })).toHaveAttribute('aria-current', 'location');
    await page.locator('.spy-pane').press('End');
    await expect(page.getByRole('link', { name: 'Finish', exact: true })).toHaveAttribute('aria-current', 'location');
    await page.locator('.spy-pane').press('Home');
    await expect(page.getByRole('link', { name: 'Start', exact: true })).toHaveAttribute('aria-current', 'location');
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await expectCanvasFit(page);

    await openStudy(page, 'sticky-header');
    const threshold = await page.evaluate(() => {
      const pane = document.querySelector('.sticky-pane'), heading = document.querySelector('.sticky-article h2'), header = document.querySelector('.sticky-bar');
      const boundary = heading.getBoundingClientRect().bottom - header.getBoundingClientRect().bottom;
      pane.scrollTop = boundary - 8; pane.dispatchEvent(new Event('scroll'));
      return boundary;
    });
    await expect(page.locator('.sticky-bar')).toHaveAttribute('data-reading', 'false');
    await page.locator('.sticky-jump').evaluate(button => button.click());
    await expect(page.locator('.sticky-bar')).toHaveAttribute('data-reading', 'true');
    expect(await page.locator('.sticky-pane').evaluate(element => element.scrollTop)).toBeCloseTo(threshold + 1, 0);
    expect(await page.evaluate(() => document.querySelector('.sticky-article h2').getBoundingClientRect().bottom <= document.querySelector('.sticky-bar').getBoundingClientRect().bottom + .5)).toBe(true);
    await page.locator('.sticky-pane').press('Home');
    await expect(page.locator('.sticky-bar')).toHaveAttribute('data-reading', 'false');
    await page.locator('.sticky-pane').press('End');
    await expect(page.locator('.sticky-bar')).toHaveAttribute('data-reading', 'true');
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await expectCanvasFit(page);
  }
});

test('chart ranges keep exact totals and native timeline/pane controls remain readable at both limits', async ({ page }) => {
  for (const viewport of [{ width: 300, height: 230 }, { width: 700, height: 420 }]) {
    await page.setViewportSize(viewport);
    await openStudy(page, 'chart-range');
    await activateStudy(page);
    await page.getByRole('button', { name: 'Month', exact: true }).press('Enter');
    await expect(page.locator('.range-total')).toHaveText('1,830');
    await expect(page.locator('.range-scale')).toHaveText('Maximum 700');
    await page.getByRole('button', { name: 'Year', exact: true }).press('Enter');
    await expect(page.locator('.range-total')).toHaveText('18,600');
    await expect(page.locator('#range-chart-label')).toContainText('920, 1120, 980, 1400, 1280, 1530, 1710, 1630, 1900, 2010, 1880, 2240');
    expect(await manualMotionCount(page)).toBe(0);
    await expectCanvasFit(page);

    await openStudy(page, 'timeline-cursor');
    await activateStudy(page);
    const timeline = page.getByRole('slider', { name: 'Selected time in seconds' });
    await timeline.press('End');
    await expect(timeline).toHaveValue('60');
    await expect(page.locator('.timeline-time')).toHaveText('01:00');
    await expect(page.locator('.timeline-chapter')).toHaveText('Finish');
    await timeline.press('Home');
    await expect(page.locator('.timeline-time')).toHaveText('00:00');
    await timeline.press('ArrowRight');
    await expect(page.locator('.timeline-time')).toHaveText('00:01');
    expect(await manualMotionCount(page)).toBe(0);
    await expectCanvasFit(page);

    await openStudy(page, 'split-pane');
    await activateStudy(page);
    const split = page.getByRole('slider', { name: 'Navigation width, percent' });
    for (const [key, percent] of [['Home', 25], ['End', 65]]) {
      await split.press(key);
      await expect(split).toHaveValue(String(percent));
      await expect(page.locator('.split-value')).toHaveText(percent + '%');
      const geometry = await page.evaluate(() => {
        const workspace = document.querySelector('.split-workspace'), navigation = document.querySelector('.split-navigation'), preview = document.querySelector('.split-preview');
        const pane = preview.getBoundingClientRect();
        return { fraction: navigation.getBoundingClientRect().width / workspace.clientWidth, readable: [...preview.querySelectorAll('h2, p')].every(element => {
          const rect = element.getBoundingClientRect();
          return rect.top >= pane.top && rect.bottom <= pane.bottom && element.scrollWidth <= element.clientWidth;
        }) };
      });
      expect(geometry.fraction).toBeCloseTo(percent / 100, 2);
      expect(geometry.readable).toBe(true);
      expect(await manualMotionCount(page)).toBe(0);
      await expectCanvasFit(page);
    }
    const scales = await page.evaluate(() => {
      Demo.replay();
      const panes = [...document.querySelector('.split-workspace').children];
      panes.flatMap(element => element.getAnimations()).forEach(animation => { animation.pause(); animation.currentTime = animation.effect.getTiming().duration / 2; });
      return panes.map(element => { const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform); return [matrix.a, matrix.d]; });
    });
    expect(scales).toEqual([[1, 1], [1, 1]]);
  }
});

test('the board supports all three tasks in one native scroll column and cleans up every interrupted visual snapshot', async ({ page }) => {
  for (const viewport of [{ width: 300, height: 230 }, { width: 700, height: 420 }]) {
    await page.setViewportSize(viewport);
    await openStudy(page, 'kanban-move');
    await activateStudy(page);
    await page.locator('.kanban-move').click();
    await finishMotion(page);
    await page.locator('.kanban-move').click();
    await page.locator('[data-task="Type scale"] button').click();
    await page.locator('.kanban-move').click();
    await expect(page.locator('.kanban-count')).toHaveText(['0', '3']);
    await expect(page.locator('[data-task]')).toHaveCount(3);
    const ready = page.getByRole('list', { name: 'Ready tasks' });
    await ready.press('Home');
    await expect.poll(() => ready.evaluate(element => element.scrollTop)).toBe(0);
    await ready.press('End');
    await expect.poll(() => ready.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
    await expectCanvasFit(page, '.wf-shell, .kanban-move');
    await page.locator('.kanban-move').press('Enter');
    await expect(page.locator('.kanban-count')).toHaveText(['1', '2']);
    expect(await manualMotionCount(page)).toBe(0);

    const interruption = await page.evaluate(() => {
      Demo.replay();
      const previous = document.querySelector('.kanban-flight'), animation = previous.getAnimations()[0];
      animation.pause(); animation.currentTime = animation.effect.getTiming().duration * .4;
      const rect = previous.getBoundingClientRect(), before = { x: rect.x, y: rect.y };
      document.querySelector('.kanban-move').click();
      const current = document.querySelector('.kanban-flight'), replacement = current.getAnimations()[0];
      replacement.pause(); replacement.currentTime = 0;
      const next = current.getBoundingClientRect();
      return { before, after: { x: next.x, y: next.y }, removed: !previous.isConnected, count: document.querySelectorAll('.kanban-flight').length, inert: current.inert, hidden: current.getAttribute('aria-hidden') };
    });
    expect(interruption.removed).toBe(true);
    expect(interruption.count).toBe(1);
    expect(interruption.inert).toBe(true);
    expect(interruption.hidden).toBe('true');
    expect(interruption.after.x).toBeCloseTo(interruption.before.x, 0);
    expect(interruption.after.y).toBeCloseTo(interruption.before.y, 0);

    const multiple = await page.evaluate(() => {
      Demo.replay();
      const oldNavigation = document.querySelector('.kanban-flight[data-flight="Navigation"]'), animation = oldNavigation.getAnimations()[0];
      animation.pause(); animation.currentTime = animation.effect.getTiming().duration * .4;
      const rect = oldNavigation.getBoundingClientRect(), before = { x: rect.x, y: rect.y };
      document.querySelector('[data-task="Type scale"] button').click();
      // Selection must update the visible in-flight copy immediately, before
      // another move has an opportunity to replace that snapshot.
      const previousMarker = oldNavigation.querySelector('button').getAttribute('aria-pressed');
      document.querySelector('.kanban-move').click();
      const navigation = document.querySelector('.kanban-flight[data-flight="Navigation"]');
      navigation.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = 0; });
      const next = navigation.getBoundingClientRect(), two = document.querySelectorAll('.kanban-flight').length;
      document.querySelector('[data-task="Copy review"] button').click();
      document.querySelector('.kanban-move').click();
      return { before, after: { x: next.x, y: next.y }, previousMarker, removed: !oldNavigation.isConnected, two, three: document.querySelectorAll('.kanban-flight').length, originals: document.querySelectorAll('[data-task]').length, names: [...document.querySelectorAll('.kanban-flight')].map(element => element.dataset.flight).sort(), accessible: [...document.querySelectorAll('.kanban-flight')].every(element => element.inert && element.getAttribute('aria-hidden') === 'true') };
    });
    expect(multiple.removed).toBe(true);
    expect(multiple.previousMarker).toBe('false');
    expect(multiple.two).toBe(2);
    expect(multiple.three).toBe(3);
    expect(multiple.originals).toBe(3);
    expect(multiple.names).toEqual(['Copy review', 'Navigation', 'Type scale']);
    expect(multiple.accessible).toBe(true);
    expect(multiple.after.x).toBeCloseTo(multiple.before.x, 0);
    expect(multiple.after.y).toBeCloseTo(multiple.before.y, 0);
    await expect(page.locator('.kanban-count')).toHaveText(['1', '2']);

    await page.locator('.kanban-move').focus();
    await page.evaluate(() => Demo.setSettings({ paused: true }));
    await page.locator('.kanban-move').press('Shift+Tab');
    const focusedTask = page.locator('[data-task="Type scale"] button');
    await expect(focusedTask).toBeFocused();
    await expect(page.locator('[data-task="Type scale"]')).toHaveCSS('opacity', '1');
    await expect(page.locator('.kanban-flight[data-flight="Type scale"]')).toHaveCount(0);
    expect(await focusedTask.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');

    expect(await page.evaluate(() => {
      const previous = [...document.querySelectorAll('.kanban-flight')]; Demo.replay();
      return previous.every(element => !element.isConnected) && document.querySelectorAll('.kanban-flight').length === 1;
    })).toBe(true);
    const frozen = await page.evaluate(async () => {
      Demo.setSettings({ paused: true });
      await new Promise(requestAnimationFrame);
      return getComputedStyle(document.querySelector('.kanban-flight')).transform;
    });
    await page.waitForTimeout(80);
    expect(await page.locator('.kanban-flight').evaluate(element => getComputedStyle(element).transform)).toBe(frozen);
    await page.evaluate(() => Demo.setSettings({ paused: false }));
    await finishMotion(page);
    await expect(page.locator('.kanban-flight')).toHaveCount(0);

    await page.evaluate(() => {
      Demo.replay(); document.querySelector('[data-task="Type scale"] button').click(); document.querySelector('.kanban-move').click();
      Demo.setSettings({ paused: true });
    });
    await expect(page.locator('.kanban-flight')).toHaveCount(2);
    await ready.press('Home');
    await expect(page.locator('.kanban-flight')).toHaveCount(0);
    await expect.poll(() => ready.evaluate(element => element.scrollTop)).toBe(0);

    for (const reason of ['resize', 'reduced', 'pagehide']) {
      const cleanup = await page.evaluate(reason => {
        Demo.setSettings({ paused: false, reduced: false }); Demo.replay();
        document.querySelector('[data-task="Type scale"] button').click(); document.querySelector('.kanban-move').click();
        const previous = [...document.querySelectorAll('.kanban-flight')];
        if (reason === 'resize') window.dispatchEvent(new Event('resize'));
        else if (reason === 'reduced') Demo.setSettings({ reduced: true });
        else window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }));
        return { before: previous.length, after: document.querySelectorAll('.kanban-flight').length, removed: previous.every(element => !element.isConnected), originals: document.querySelectorAll('[data-task]').length, visible: [...document.querySelectorAll('[data-task]')].every(card => getComputedStyle(card).opacity === '1') };
      }, reason);
      expect(cleanup).toEqual({ before: 2, after: 0, removed: true, originals: 3, visible: true });
    }
  }
});

test('notification disclosure keeps triage state, reverses from its visible frame, and settles canceled exits', async ({ page }) => {
  await openStudy(page, 'notification-center', { speed: '0.25' });
  await page.evaluate(() => Demo.replay());
  await finishMotion(page);
  await page.locator('.inbox-panel button').first().click();
  await expect(page.locator('.inbox-count')).toHaveText('1');
  await page.locator('.inbox-toggle').evaluate(button => button.click());
  await expect(page.locator('.inbox-toggle')).toBeFocused();
  expect(await page.locator('.inbox-panel').evaluate(element => element.inert)).toBe(true);
  const reversal = await page.evaluate(() => {
    const panel = document.querySelector('.inbox-panel'), previous = panel.getAnimations()[0];
    previous.pause(); previous.currentTime = previous.effect.getTiming().duration * .4;
    const before = getComputedStyle(panel).opacity;
    document.querySelector('.inbox-toggle').click();
    const current = panel.getAnimations()[0]; current.pause(); current.currentTime = 0;
    return { before, after: getComputedStyle(panel).opacity, canceled: previous.playState === 'idle', inert: panel.inert };
  });
  expect(reversal.after).toBe(reversal.before);
  expect(reversal.canceled).toBe(true);
  expect(reversal.inert).toBe(false);
  await finishMotion(page);
  await expect(page.locator('.inbox-panel')).toBeVisible();
  await expect(page.locator('.inbox-count')).toHaveText('1');

  await page.locator('.inbox-toggle').click();
  await page.evaluate(() => { Demo.setSettings({ paused: true }); Demo.setSettings({ reduced: true }); });
  await expect(page.locator('.inbox-panel')).toBeHidden();
  expect(await page.locator('.inbox-panel').evaluate(element => element.inert)).toBe(true);
  await page.evaluate(() => { Demo.setSettings({ reduced: false, paused: false }); Demo.replay(); });
  await finishMotion(page);
  await page.locator('.inbox-toggle').click();
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await expect(page.locator('.inbox-panel')).toBeHidden();
  await page.locator('.inbox-toggle').press('Enter');
  await expect(page.locator('.inbox-panel')).toBeVisible();
  await expect(page.locator('.inbox-count')).toHaveText('1');
  expect(await manualMotionCount(page)).toBe(0);
  await expectCanvasFit(page);
});
