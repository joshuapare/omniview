const { chromium } = require('/Users/joshuapare/Repos/omniviewdev/omniview/node_modules/.pnpm/playwright@1.50.1/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const root = __dirname;
const url = 'http://192.168.68.55:48733/';
const receipt = { url, checks: [], captures: [], errors: [], measurements: {} };
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.on('pageerror', error => receipt.errors.push(error.message));
  const check = name => { receipt.checks.push(name); console.log('PASS', name); };
  const capture = async (name, target = page) => { if (name !== 'production-state-loading') await target.getByText(/^Loading (?:contents|preview|baseline|comparison|directory)…$/).first().waitFor({ state: 'hidden' }); await target.screenshot({ path: `${root}/screenshots/${name}.png`, fullPage: true, animations: 'disabled' }); receipt.captures.push(name); };
  const open = async (mode = 'Browse', state) => {
    await page.goto(`${url}?mode=${encodeURIComponent(mode)}${state ? '&state=' + state : ''}`);
    await page.getByRole('button', { name: 'File Explorer', exact: true }).click();
    await page.getByRole('button', { name: mode, exact: true }).waitFor();
  };
  const ready = () => page.getByRole('treeitem').first().waitFor();
  const row = name => page.getByRole('treeitem').filter({ has: page.locator('span').filter({ hasText: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }) }).first();
  try {
    await open(); await ready(); await page.locator('pre').filter({ hasText: 'worker_connections 4096' }).waitFor();
    const density = await page.getByRole('treeitem').first().evaluate(e => ({ height: e.getBoundingClientRect().height, font: getComputedStyle(e).fontSize, icon: e.querySelector('span svg')?.getBoundingClientRect().width }));
    assert.deepEqual(density, { height: 22, font: '13px', icon: 14 });
    assert.equal(await page.locator('section[aria-label^="Preview"] > header').evaluate(e => e.getBoundingClientRect().height), 36);
    receipt.measurements.desktop = density; check('Desktop22px /13px /14px; single36px preview header'); await capture('production-browse');
    await page.getByRole('button', { name: 'Hidden', exact: true }).click(); await row('.env').waitFor(); check('Independent hidden-file visibility');
    await page.getByRole('searchbox').fill('/app/config'); await page.getByText('Partial coverage · /root excluded', { exact: true }).waitFor(); await row('production.yaml').waitFor(); check('Provider path search retains ancestors and reports partial coverage');
    await page.getByRole('searchbox').fill(''); await row('nginx.conf').waitFor();
    assert.equal(await row('libssl.so.3').getAttribute('aria-setsize'), '-1'); await page.getByRole('button', { name: 'Load more', exact: true }).click(); await row('module-10.so').waitFor(); check('Paged child listing appends real rows with unknown sibling totals');
    await page.getByRole('button', { name: 'Preview', exact: true }).click(); assert.equal(await page.getByRole('separator', { name: 'Resize file tree' }).count(), 0); await page.getByRole('button', { name: 'Preview', exact: true }).click(); await page.locator('pre').filter({ hasText: 'worker_connections 4096' }).waitFor(); check('Preview closes and reopens with current contents');
    const fileDownload = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download', exact: true }).click(); const downloaded = await fileDownload; assert.match(await fs.readFile(await downloaded.path(), 'utf8'), /worker_connections 4096/); check('Download writes selected current file bytes');
    await page.getByRole('button', { name: 'Export snapshot', exact: true }).click(); await page.getByRole('button', { name: 'Cancel export', exact: true }).click(); await page.getByText('Export cancelled', { exact: true }).waitFor(); check('Transfer cancellation remains cancelled');
    const exportDownload = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export snapshot', exact: true }).click(); const manifest = JSON.parse(await fs.readFile(await (await exportDownload).path(), 'utf8')); assert(manifest.files.some(x => x.path === '/etc/nginx/nginx.conf' && x.presence === 'present' && x.content.includes('4096'))); check('Snapshot export creates truthful JSON manifest and contents');
    await open('Tree only'); await ready(); await page.getByText('Keyboard & mouse', { exact: true }).waitFor(); assert.equal(await page.locator('section[aria-label^="Preview"]').count(), 0); assert(await page.locator('kbd').count() >= 12); await row('server.js').click(); await row('package.json').click({ modifiers: ['Meta'] }); assert.equal(await page.locator('[role="treeitem"][aria-selected="true"]').count(), 2); check('Standalone tree supports multiselection and generic keycaps'); await capture('production-tree-only');
    await row('server.js').click({ button: 'right' }); await page.getByRole('dialog').waitFor(); await page.getByRole('button', { name: 'Close', exact: true }).click(); check('Context actions expose selected file actions');
    await open('Image layers'); await ready(); await row('legacy.conf').waitFor(); await row('legacy.conf').click(); await page.locator('pre').filter({ hasText: 'legacy.internal' }).waitFor(); assert.equal(await page.getByRole('button', { name: 'Download', exact: true }).count(), 0); check('Deleted entry previews baseline, never current-download action');
    const help = page.getByRole('dialog', { name: 'Layer scope', exact: true }); await page.getByLabel('Layer view help').hover(); await help.waitFor(); await page.keyboard.press('Escape'); await page.getByRole('checkbox', { name: 'Cumulative filesystem' }).focus(); await page.keyboard.press('Tab'); if (!(await help.isVisible())) await page.keyboard.press('Enter'); await help.waitFor(); await page.keyboard.press('Escape'); check('Layer help opens on hover and keyboard activation');
    await page.getByRole('checkbox', { name: 'Cumulative filesystem' }).check(); await ready(); assert.equal(await row('legacy.conf').count(), 0); check('Cumulative scope excludes deleted tombstones'); await capture('production-layers');
    await open('Compare'); await ready(); await page.locator('.monaco-diff-editor').waitFor({ timeout: 20000 }); await page.locator('.view-lines').filter({ hasText: '4096' }).first().waitFor(); check('Optional lazy text diff renders actual Monaco comparison'); await capture('production-compare');
    await row('production.yaml').click(); await page.locator('.view-lines').filter({ hasText: 'gracefulShutdown' }).first().waitFor(); await capture('production-compare-yaml'); await page.getByRole('button', { name: 'Browse', exact: true }).click(); await page.locator('pre').filter({ hasText: 'worker_connections 4096' }).waitFor(); check('Comparison changes files and releases editors on mode switch');
    await open('Live watch'); await page.getByRole('button', { name: 'Inject change', exact: true }).click(); await ready(); await page.locator('pre').filter({ hasText: '# update 1' }).waitFor(); assert.equal(await page.getByText('Live sync interrupted', { exact: true }).count(), 0); check('Live watch remains usable after an early change while opening');
    await open('Live watch'); await ready(); await page.locator('pre').filter({ hasText: 'worker_connections 4096' }).waitFor();
    await page.getByRole('checkbox', { name: 'Live sync', exact: true }).uncheck(); await page.getByRole('button', { name: 'Inject change', exact: true }).click(); await page.getByText('1 update available', { exact: true }).waitFor(); await capture('production-live-paused'); await page.getByRole('button', { name: 'Refresh', exact: true }).click(); await page.locator('pre').filter({ hasText: '# update 1' }).waitFor(); assert.equal(await page.getByRole('checkbox', { name: 'Live sync', exact: true }).isChecked(), false); check('Manual refresh drains paused updates without enabling sync');
    await page.getByRole('checkbox', { name: 'Live sync', exact: true }).check(); await page.getByRole('button', { name: 'Interrupt watch', exact: true }).click(); await page.getByText('Live sync interrupted', { exact: true }).waitFor(); await capture('production-live-interrupted'); await page.getByRole('button', { name: 'Refresh', exact: true }).click(); await page.getByRole('button', { name: 'Inject change', exact: true }).click(); await page.locator('pre').filter({ hasText: '# update 2' }).waitFor(); check('Interrupted watch reconciles and fresh subscription applies events');
    await page.getByLabel('Change type').selectOption('add'); await page.getByRole('button', { name: 'Inject change', exact: true }).click(); await page.getByRole('treeitem').filter({ hasText: /request-\d+\.log/ }).first().waitFor(); await page.getByLabel('Change type').selectOption('remove'); await page.getByRole('button', { name: 'Inject change', exact: true }).click(); assert.equal(await page.getByRole('treeitem').filter({ hasText: /request-\d+\.log/ }).count(), 0); await row('server.js').click(); await page.getByLabel('Change type').selectOption('move'); await page.getByRole('button', { name: 'Inject change', exact: true }).click(); await page.locator('section[aria-label="Preview server.js"] header').filter({ hasText: '/app/config' }).waitFor(); assert.equal(await row('server.js').getAttribute('aria-selected'), 'true'); check('Live add/remove and confirmed move preserve identity and selection'); await capture('production-live-move');
    await open('Live watch'); await ready(); await page.locator('pre').filter({ hasText: 'worker_connections 4096' }).waitFor();
    await page.getByRole('checkbox', { name: 'Live sync', exact: true }).uncheck(); await page.getByRole('button', { name: 'Inject change', exact: true }).click();
    assert.equal(await row('bin').getAttribute('aria-expanded'), 'false'); await row('bin').getByRole('button').first().click();
    await page.getByRole('alert').filter({ hasText: 'Files changed. Refresh to see updates.' }).waitFor(); await capture('production-branch-refresh');
    await page.getByRole('button', { name: 'Refresh', exact: true }).click(); await row('busybox').waitFor(); assert.equal(await page.getByRole('checkbox', { name: 'Live sync', exact: true }).isChecked(), false); check('Paused directory revision mismatch requires refresh and recovers a complete branch');
    for (const state of ['permission', 'loading', 'empty', 'offline', 'binary', 'large', 'missing-tar']) {
      await open('States', state);
      if (state === 'permission') { await page.getByText('Permission denied: /root', { exact: false }).first().waitFor(); }
      else if (state === 'loading') { await page.getByRole('status').filter({ hasText: 'Loading…' }).first().waitFor(); }
      else if (state === 'empty') { await page.getByText('Directory is empty', { exact: true }).waitFor(); }
      else if (state === 'offline') { await page.getByRole('button', { name: 'Reconnect', exact: true }).waitFor(); await capture('production-state-offline'); await page.getByRole('button', { name: 'Reconnect', exact: true }).click(); await ready(); }
      else if (state === 'binary') { await page.getByText('Binary file', { exact: true }).waitFor(); }
      else if (state === 'large') { await page.getByText('Preview limit reached', { exact: false }).waitFor(); }
      else { await page.getByRole('button', { name: /Export archive: tar is not installed/ }).waitFor(); }
      check(`Provider state: ${state}`); if (state !== 'offline') await capture(`production-state-${state}`);
    }
    await open(); await ready();
    for (const theme of ['Light', 'High Contrast Dark']) { await page.getByRole('button', { name: 'Switch theme', exact: true }).press('ArrowDown'); await page.getByRole('menuitemradio', { name: theme, exact: true }).click(); await page.keyboard.press('Escape'); await capture(`production-theme-${theme.toLowerCase().replace(/ /g, '-')}`); check(`Theme: ${theme}`); }
    const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const mobile = await phone.newPage(); mobile.setDefaultTimeout(8000); mobile.on('pageerror', error => receipt.errors.push(error.message));
    await mobile.goto(url); await mobile.getByRole('button', { name: 'File Explorer', exact: true }).tap(); await mobile.locator('pre').filter({ hasText: 'worker_connections 4096' }).waitFor();
    receipt.measurements.phone = await mobile.getByRole('treeitem').first().evaluate(e => ({ height: e.getBoundingClientRect().height, font: getComputedStyle(e).fontSize, icon: e.querySelector('span svg')?.getBoundingClientRect().width })); assert.deepEqual(receipt.measurements.phone, { height: 34, font: '13px', icon: 16 }); assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); await capture('production-phone-browse', mobile);
    await mobile.getByRole('button', { name: 'Image layers', exact: true }).tap(); await mobile.locator('pre').filter({ hasText: 'worker_connections 4096' }).waitFor(); await mobile.getByLabel('Layer view help').tap(); const mobileHelp = mobile.getByRole('dialog', { name: 'Layer scope', exact: true }); await mobileHelp.waitFor(); const helpBox = await mobileHelp.boundingBox(); assert(helpBox && helpBox.x >= 0 && helpBox.x + helpBox.width <= 390 && helpBox.y >= 0 && helpBox.y + helpBox.height <= 844); await capture('production-phone-help', mobile); check('Phone34px /13px /16px, no document overflow, touch-help fits viewport'); await phone.close();
    assert.deepEqual(receipt.errors, []); check('No page errors across exercised surfaces');
  } finally { await fs.writeFile(`${root}/implementation-verification.json`, JSON.stringify(receipt, null, 2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
