import { test, expect } from '@playwright/test';

async function openStudy(page, id, extra = {}) {
  const params = new URLSearchParams({ palette: 'radix', mode: 'dark', accent: 'indigo', paused: 'true', ...extra });
  await page.goto(`/examples/${id}.html?${params}`);
  await expect(page.locator('.form-stage')).toBeVisible();
}

test('checkboxes, cadence radios, and star ratings preserve native keyboard selection', async ({ page }) => {
  await openStudy(page, 'checkbox-check');
  const checkbox = page.getByRole('checkbox', { name: /Weekly digest/ });
  await expect(checkbox).toBeChecked();
  await checkbox.press('Space');
  await expect(checkbox).not.toBeChecked();
  await checkbox.press('Space');
  await expect(checkbox).toBeChecked();

  await openStudy(page, 'radio-selection');
  const daily = page.getByRole('radio', { name: 'Daily', exact: true });
  await daily.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Weekly', exact: true })).toBeChecked();
  await expect(daily).not.toBeChecked();

  await openStudy(page, 'rating-stars');
  await page.getByRole('radio', { name: '3 stars', exact: true }).press('ArrowRight');
  await expect(page.getByRole('radio', { name: '4 stars', exact: true })).toBeChecked();
  await expect(page.locator('.rating-value')).toHaveText('4 of 5 · Really helpful');
  expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
});

test('field feedback is specific, clears on edit, and preserves password and character-limit controls', async ({ page }) => {
  await openStudy(page, 'field-validation');
  const email = page.getByLabel('Work email', { exact: true });
  await email.press('Enter');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#validation-message')).toHaveText('Use a full address, like hello@example.com.');
  await email.fill('designer@example.com');
  await expect(email).not.toHaveAttribute('aria-invalid', 'true');
  await email.press('Enter');
  await expect(page.locator('#validation-message')).toHaveText('The email format looks right.');

  await openStudy(page, 'password-reveal');
  const password = page.getByLabel('Demo password', { exact: true });
  await page.getByRole('button', { name: 'Show password', exact: true }).press('Enter');
  await expect(password).toHaveAttribute('type', 'text');
  await expect(page.getByRole('button', { name: 'Hide password', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Hide password', exact: true }).press('Enter');
  await expect(password).toHaveAttribute('type', 'password');

  await openStudy(page, 'password-strength');
  await page.getByLabel('Demo passphrase', { exact: true }).fill('Paperplanes!27');
  await expect(page.locator('#strength-message')).toHaveText('All four demo checks are met.');
  await expect(page.locator('.strength-bars [data-filled="true"]')).toHaveCount(4);
  await page.getByLabel('Demo passphrase', { exact: true }).fill('');
  await expect(page.locator('#strength-message')).toHaveText('Start with a memorable phrase.');

  await openStudy(page, 'character-budget');
  const bio = page.getByLabel('A little about you', { exact: true });
  await bio.fill('a'.repeat(80));
  await expect(page.locator('#budget-count')).toHaveText('0 left');
  await bio.press('End');
  await bio.press('b');
  await expect(bio).toHaveValue('a'.repeat(80));
  await bio.fill('A short bio.');
  await expect(page.locator('#budget-count')).toHaveText('68 left');
});

test('clearing a real search restores every result and returns keyboard focus', async ({ page }) => {
  await openStudy(page, 'search-clear');
  const input = page.getByLabel('Find a page block', { exact: true });
  await input.fill('pricing');
  await expect(page.locator('.search-results li:visible')).toHaveText(['Pricing table']);
  await page.getByRole('button', { name: 'Clear search', exact: true }).press('Enter');
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(page.locator('.search-results li:visible')).toHaveText(['Hero section', 'Pricing table', 'Footer links']);
  await input.fill('no such block');
  await expect(page.locator('.search-results li:visible')).toHaveCount(0);
  await expect(page.locator('.search-count')).toHaveText('No matching blocks');
});

test('copy feedback reflects actual clipboard success and offers manual selection after rejection', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openStudy(page, 'copy-confirm');
  await page.getByRole('button', { name: 'Copy', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('FIELD-2026');

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Clipboard unavailable'); } } });
    document.execCommand = () => false;
  });
  await page.getByRole('button', { name: 'Copied', exact: true }).click();
  await expect(page.locator('.copy-message')).toHaveText('Code selected. Use your device’s Copy command.');
  await expect(page.getByRole('button', { name: 'Copy', exact: true })).toBeVisible();
  await expect(page.locator('#copy-code')).toBeFocused();
  expect(await page.locator('#copy-code').evaluate(input => input.value.slice(input.selectionStart, input.selectionEnd))).toBe('FIELD-2026');
  await page.evaluate(() => Demo.replay());
  await expect(page.locator('.copy-message')).toHaveText('Replay preview · clipboard unchanged.');
});

test('file selection and real drop events keep a long filename local and within the compact canvas', async ({ page }) => {
  await page.setViewportSize({ width: 300, height: 230 });
  await openStudy(page, 'upload-dropzone');
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  const name = 'Homepage preview — final review for the whole team <draft>.png';
  await page.locator('#drop-file').setInputFiles({ name, mimeType: 'image/png', buffer: Buffer.from('local demo fixture') });
  await expect(page.locator('.drop-name')).toHaveText(name);
  await expect(page.locator('.drop-name')).toHaveAttribute('title', name);
  expect(await page.locator('#drop-file').evaluate(input => [...input.files].map(file => file.name))).toEqual([name]);
  await expect(page.locator('.drop-status')).toHaveText('File selected. Nothing uploaded.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(301);
  await page.locator('.drop-target').evaluate(target => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(['local attachment'], 'notes.txt', { type: 'text/plain' }));
    transfer.items.add(new File(['a second attachment'], 'extra.txt', { type: 'text/plain' }));
    target.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
  });
  await expect(page.locator('.drop-name')).toHaveText('notes.txt');
  await expect(page.locator('.drop-target')).toHaveAttribute('data-over', 'false');
  expect(await page.locator('#drop-file').evaluate(input => [...input.files].map(file => file.name))).toEqual(['notes.txt']);
  expect(await page.locator('#drop-file').evaluate(input => input.files[0].text())).toBe('local attachment');
  await page.getByRole('button', { name: 'Try demo file', exact: true }).click();
  await expect(page.locator('.drop-name')).toHaveText('project-notes.txt');
  expect(await page.locator('#drop-file').evaluate(input => [...input.files].map(file => file.name))).toEqual(['project-notes.txt']);
  await expect(page.locator('.drop-status')).toHaveText('Demo file selected');
  await page.locator('#drop-file').setInputFiles([]);
  await expect(page.locator('.drop-name')).toHaveText('Choose or drop one file');
  await expect(page.locator('.drop-status')).toHaveText('No file selected');
  await expect(page.locator('.drop-target')).toHaveAttribute('data-selected', 'false');
  expect(requests).toEqual([]);
});

test('upload cancellation, restart, pause, and completion keep progress and focus coherent', async ({ page }) => {
  await openStudy(page, 'upload-queue', { speed: '0.25' });
  await page.evaluate(() => Demo.replay());
  await expect(page.locator('.upload-state').first()).toHaveText('Uploading');
  const progress = page.getByRole('progressbar', { name: 'cover.png demo transfer', exact: true });
  await expect(progress).not.toHaveAttribute('aria-valuenow');
  await expect(progress).toHaveAttribute('aria-valuetext', 'Uploading');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('.upload-state')).toHaveText(['Canceled', 'Canceled']);
  await expect(page.locator('.upload-status')).toHaveText('Demo transfer canceled.');
  await expect(progress).not.toHaveAttribute('aria-valuenow');
  await expect(progress).toHaveAttribute('aria-valuetext', 'Canceled before completion');
  await expect(page.getByRole('button', { name: 'Start again', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Start again', exact: true }).click();
  await expect(page.locator('.upload-state').first()).toHaveText('Uploading');
  await page.evaluate(() => Demo.setSettings({ paused: true }));
  const firstState = await page.locator('.upload-state').allTextContents();
  await page.waitForTimeout(300);
  await expect(page.locator('.upload-state')).toHaveText(firstState);
  await page.getByRole('button', { name: 'Cancel', exact: true }).focus();
  await page.evaluate(() => Demo.setSettings({ reduced: true }));
  await expect(page.locator('.upload-state')).toHaveText(['Complete', 'Complete']);
  await expect(page.locator('.upload-status')).toHaveText('Two demo files uploaded.');
  await expect(progress).toHaveAttribute('aria-valuenow', '100');
  await expect(progress).toHaveAttribute('aria-valuetext', 'Complete');
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Run again', exact: true })).toBeFocused();

  await page.evaluate(() => { Demo.setSettings({ reduced: false, paused: false, speed: 1 }); Demo.replay(); });
  await page.getByRole('button', { name: 'Cancel', exact: true }).focus();
  await expect(page.locator('.upload-state')).toHaveText(['Complete', 'Complete']);
  await expect(page.getByRole('button', { name: 'Run again', exact: true })).toBeFocused();

  // A replay with focus elsewhere must not pull focus into its completion action.
  await page.evaluate(() => { document.activeElement.blur(); Demo.replay(); });
  await expect(page.locator('.upload-state')).toHaveText(['Complete', 'Complete']);
  expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
});

test('editing during sync invalidates the stale result and keyboard sync saves the current revision', async ({ page }) => {
  await openStudy(page, 'sync-status', { speed: '0.5' });
  await page.evaluate(() => Demo.replay());
  await expect(page.locator('.sync-status')).toHaveText('Syncing revision 1…');
  await page.getByLabel('Page title', { exact: true }).fill('A new project title');
  await expect(page.locator('.sync-status')).toHaveText('Revision 2 · unsynced');
  // The canceled revision would have completed after 1.6 seconds at this speed.
  await page.waitForTimeout(1750);
  await expect(page.locator('.sync-status')).toHaveText('Revision 2 · unsynced');
  await page.getByRole('button', { name: 'Sync demo', exact: true }).press('Enter');
  await expect(page.locator('.sync-status')).toHaveText('Revision 2 · synced locally');
  await expect(page.getByLabel('Page title', { exact: true })).toHaveValue('A new project title');
});

test('undo restores the draft and focus while form receipts preserve editable details', async ({ page }) => {
  await openStudy(page, 'undo-removal');
  const remove = page.getByRole('button', { name: 'Remove old hero draft', exact: true });
  await remove.press('Enter');
  await expect(page.locator('.undo-draft')).toHaveAttribute('aria-hidden', 'true');
  const undo = page.getByRole('button', { name: 'Undo', exact: true });
  await expect(undo).toBeFocused();
  await undo.press('Enter');
  await expect(remove).toBeFocused();
  await expect(page.locator('.undo-draft')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('.undo-draft')).toContainText('Old hero draft');

  await openStudy(page, 'form-success');
  const email = page.getByLabel('Email address', { exact: true });
  await email.fill('unfinished@');
  await page.getByRole('button', { name: 'Send demo request', exact: true }).press('Enter');
  await expect(email).toBeFocused();
  await expect(page.locator('.success-receipt')).toBeHidden();
  await email.fill('designer@example.com');
  await email.press('Enter');
  await expect(page.getByRole('heading', { name: 'You’re on the demo list.', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Edit details', exact: true }).press('Enter');
  await expect(email).toBeFocused();
  await expect(email).toHaveValue('designer@example.com');
});

test('retry and phased progress retain canceled state and recover focus only when Cancel completes', async ({ page }) => {
  await openStudy(page, 'retry-feedback', { speed: '0.5' });
  await page.evaluate(() => Demo.replay());
  await expect(page.getByRole('heading', { name: 'Trying again…', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.evaluate(() => Demo.setSettings({ reduced: true }));
  await expect(page.getByRole('heading', { name: 'Preview unavailable', exact: true })).toBeVisible();
  await expect(page.locator('.retry-copy p')).toHaveText('Retry canceled. You can try again.');
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Preview is ready', exact: true })).toBeVisible();
  await page.evaluate(() => { Demo.setSettings({ reduced: false, speed: 1 }); Demo.replay(); });
  await page.getByRole('button', { name: 'Cancel', exact: true }).focus();
  await expect(page.getByRole('button', { name: 'Reset demo', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeDisabled();

  await openStudy(page, 'segmented-progress', { speed: '0.25' });
  await page.evaluate(() => Demo.replay());
  const progress = page.getByRole('progressbar', { name: 'Demo export checkpoints', exact: true });
  await expect.poll(async () => Number(await progress.getAttribute('aria-valuenow'))).toBeGreaterThanOrEqual(1);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  const completed = Number(await progress.getAttribute('aria-valuenow'));
  expect(completed).toBeGreaterThanOrEqual(1);
  expect(completed).toBeLessThan(4);
  await page.evaluate(() => Demo.setSettings({ reduced: true }));
  await expect(progress).toHaveAttribute('aria-valuenow', String(completed));
  await expect(page.locator('.phase-status')).toHaveText(`Canceled · ${completed} of 4 phases complete`);
  await page.getByRole('button', { name: 'Start again', exact: true }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '4');
  await expect(page.locator('.phase-status')).toHaveText('All four phases complete · demo ready');
  await page.evaluate(() => { Demo.setSettings({ reduced: false, speed: 1 }); Demo.replay(); });
  await page.getByRole('button', { name: 'Cancel', exact: true }).focus();
  await expect(progress).toHaveAttribute('aria-valuenow', '4');
  await expect(page.getByRole('button', { name: 'Run again', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeDisabled();
});

test('selection, connection, unread state, and the live range expose meaningful state changes', async ({ page }) => {
  await openStudy(page, 'bulk-selection-toolbar');
  const all = page.locator('#bulk-all');
  await page.locator('[name="bulk-task"]').first().check();
  expect(await all.evaluate(input => input.indeterminate)).toBe(true);
  await expect(page.locator('.bulk-count')).toHaveText('1 selected');
  await all.check();
  await expect(page.locator('.bulk-count')).toHaveText('2 selected');
  await page.getByRole('button', { name: 'Clear selection', exact: true }).press('Enter');
  await expect(all).toBeFocused();
  await expect(page.locator('.bulk-toolbar')).toHaveAttribute('aria-hidden', 'true');
  expect(await all.evaluate(input => input.indeterminate)).toBe(false);

  await openStudy(page, 'notification-badge');
  await page.getByRole('button', { name: 'Mark read', exact: true }).press('Enter');
  await expect(page.locator('.badge-status')).toHaveText('All demo updates read');
  await expect(page.getByRole('button', { name: 'Mark read', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Add demo', exact: true }).press('Enter');
  await expect(page.locator('.badge-status')).toHaveText('1 unread demo update');

  await openStudy(page, 'connection-status');
  await page.getByRole('button', { name: 'Go offline', exact: true }).press('Enter');
  await expect(page.locator('.connection-label')).toHaveText('Offline');
  await expect(page.locator('.connection-detail')).toHaveText('You can keep editing this demo.');
  await page.getByRole('button', { name: 'Go online', exact: true }).press('Enter');
  await expect(page.locator('.connection-label')).toHaveText('Online');

  await openStudy(page, 'range-feedback');
  await page.getByRole('slider', { name: 'Preview volume', exact: true }).press('ArrowRight');
  await expect(page.getByRole('slider', { name: 'Preview volume', exact: true })).toHaveValue('49');
  await expect(page.locator('.range-value')).toHaveText('49%');
});
