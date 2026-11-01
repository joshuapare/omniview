const { chromium } = require('/Users/joshuapare/Repos/omniviewdev/omniview/node_modules/.pnpm/playwright@1.50.1/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(15000);
  const receipt = { checks: [], errors: [], measurements: {} };
  page.on('pageerror', error => receipt.errors.push(error.message));
  try {
    await page.goto('http://127.0.0.1:48734/?mode=Tree%20only');
    await page.evaluate(async () => {
      const { FixtureFileProvider } = await import('/src/demos/file-explorer/provider.ts');
      window.minimalIO = { reads: 0, watches: 0 };
      const read = FixtureFileProvider.prototype.readFile, watch = FixtureFileProvider.prototype.watch;
      FixtureFileProvider.prototype.readFile = function (...args) { window.minimalIO.reads++; return read.apply(this, args); };
      FixtureFileProvider.prototype.watch = function (...args) { window.minimalIO.watches++; return watch.apply(this, args); };
    });
    await page.getByRole('button', { name: 'File Explorer', exact: true }).click();
    await page.getByRole('treeitem').first().waitFor();
    await page.evaluate(async () => {
      const urls = performance.getEntriesByType('resource').map(entry => entry.name);
      const reactModule = await import(urls.find(name => /\/react\.js\?/.test(name)));
      const React = reactModule.default ?? reactModule;
      const clientModule = await import(urls.find(name => /react-dom_client\.js/.test(name)));
      const { createRoot } = clientModule.default ?? clientModule;
      const { FileTree, ThemeProvider, KeyChord } = await import(urls.findLast(name => /base-ui\/dist\/index\.js/.test(name)));
      window.mountWindowsChord = () => { const host = document.createElement('div'); document.body.append(host); createRoot(host).render(React.createElement(ThemeProvider, { themeId: 'dark' }, React.createElement(KeyChord, { keys: ['Meta', 'K'], platform: 'windows' }))); };
      window.mountActivation = () => { const host = document.createElement('div'); host.id = 'activation-smoke'; document.body.append(host); const nodes = ['visible', 'filtered'].map(id => ({ id, parentId: null, name: id + '.txt', path: '/' + id + '.txt', kind: 'file', metadata: null })); function Activation() { const [query, setQuery] = React.useState(''); const [opened, setOpened] = React.useState([]); return React.createElement(ThemeProvider, { themeId: 'dark' }, React.createElement('button', { onClick: () => setQuery('visible') }, 'Filter activation tree'), React.createElement(FileTree, { nodes, activeKey: 'filtered', filterText: query, virtualized: false, onOpen: node => setOpened(previous => [...previous, node.id]), style: { height: 150 } }), React.createElement('output', { 'aria-label': 'Activation requests' }, opened.join(','))); } createRoot(host).render(React.createElement(Activation)); };
      document.getElementById('root').style.display = 'none';
      const mount = document.createElement('div'); mount.id = 'scale-smoke'; mount.style.cssText = 'height:600px;width:100%;'; document.body.append(mount);
      window.gc?.(); window.scaleHeapBefore = performance.memory?.usedJSHeapSize; window.scaleStarted = performance.now();
      const entries = [{ id: 'archive', parentId: null, name: 'archive', path: '/archive', kind: 'directory', metadata: null }, ...Array.from({ length: 99999 }, (_, index) => ({ id: `file-${index}`, parentId: index < 50000 ? null : 'archive', name: `file-${String(index).padStart(5, '0')}.conf`, path: `${index < 50000 ? '' : '/archive'}/file-${String(index).padStart(5, '0')}.conf`, kind: 'file', metadata: null }))];
      function Scale() {
        const [nodes, setNodes] = React.useState(entries);
        const [expanded, setExpanded] = React.useState(new Set());
        const [query, setQuery] = React.useState('');
        window.scaleSetNodes = setNodes; window.scaleSetExpanded = setExpanded; window.scaleSetQuery = setQuery;
        window.scaleBurst = () => { window.scaleBurstStarted = performance.now(); setNodes(previous => previous.map((node, index) => (index > 0 && index <= 1000) || node.id === 'file-49999' ? { ...node, change: 'modified' } : node)); };
        return React.createElement(ThemeProvider, { themeId: 'dark' }, React.createElement(FileTree, { nodes, expandedKeys: expanded, onExpandedKeysChange: setExpanded, filterText: query, selectionMode: 'multiple', style: { height: 600 } }));
      }
      window.scaleRoot = createRoot(mount); window.scaleRoot.render(React.createElement(Scale));
    });
    const tree = page.locator('#scale-smoke [role="tree"]');
    await tree.locator('[role="treeitem"]').first().waitFor();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    receipt.measurements.initialMs = await page.evaluate(() => performance.now() - window.scaleStarted);
    receipt.measurements.initialMountedRows = await tree.locator('[role="treeitem"]').count(); assert(receipt.measurements.initialMountedRows < 100);
    assert.equal(await tree.locator('[role="treeitem"]').first().getAttribute('aria-setsize'), '50001');
    receipt.checks.push('100000 supplied nodes;50001 visible projection;bounded mounted rows');
    const started = await page.evaluate(() => performance.now()); await tree.focus(); await tree.press('End');
    await page.waitForFunction(() => { const tree = document.querySelector('#scale-smoke [role=tree]'); const row = document.getElementById(tree.getAttribute('aria-activedescendant')); return row?.id.endsWith('file-49999') && row.getBoundingClientRect().bottom <= tree.getBoundingClientRect().bottom + 1 && row.getBoundingClientRect().top >= tree.getBoundingClientRect().top; });
    receipt.measurements.endRevealMs = await page.evaluate(start => performance.now() - start, started); await tree.press('Space');
    await page.evaluate(() => window.scaleBurst());
    await page.waitForFunction(() => { const tree = document.querySelector('#scale-smoke [role=tree]'); const row = document.getElementById(tree.getAttribute('aria-activedescendant')); return row?.querySelector('[aria-label=modified]') && row.getAttribute('aria-selected') === 'true'; });
    receipt.measurements.burst1001Ms = await page.evaluate(() => performance.now() - window.scaleBurstStarted); receipt.checks.push('End reveals unmounted final row;1001-change batch preserves selection');
    await page.evaluate(() => { window.gc?.(); }); receipt.measurements.retainedHeapDeltaBytes = await page.evaluate(() => performance.memory.usedJSHeapSize - window.scaleHeapBefore);
    await page.screenshot({ path: __dirname + '/screenshots/production-scale-end.png' });
    await page.evaluate(() => { let viewport = document.querySelector('#scale-smoke [role=treeitem]').parentElement; while (viewport && !(/auto|scroll/.test(getComputedStyle(viewport).overflowY) && viewport.scrollHeight > viewport.clientHeight)) viewport = viewport.parentElement; if (!viewport) throw Error('Scrollable tree viewport not found'); window.scaleViewport = viewport; viewport.scrollTop = 0; viewport.dispatchEvent(new Event('scroll')); });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => document.querySelector('#scale-smoke [role=treeitem]').getBoundingClientRect().height === 34);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await page.evaluate(() => window.scaleViewport.scrollTop), 0); assert(await tree.locator('[role="treeitem"][id$="file-49999"]').count()); receipt.checks.push('CSS sizing change preserves scroll-away position and pins active row');
    receipt.measurements.phoneMountedRows = await tree.locator('[role="treeitem"]').count(); assert(receipt.measurements.phoneMountedRows < 100); await tree.press('End');
    await page.waitForFunction(() => { const tree = document.querySelector('#scale-smoke [role=tree]'); const row = document.getElementById(tree.getAttribute('aria-activedescendant')); return row?.id.endsWith('file-49999') && row.getBoundingClientRect().bottom <= tree.getBoundingClientRect().bottom + 1 && row.getBoundingClientRect().top >= tree.getBoundingClientRect().top; }); receipt.checks.push('Responsive34px geometry retains bounded range and End navigation');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.evaluate(() => { window.scaleSetNodes([...Array.from({ length: 300 }, (_, index) => ({ id: `dir-${index}`, parentId: index ? `dir-${index - 1}` : null, name: `d${index}`, path: '/' + Array.from({ length: index + 1 }, (_, i) => 'd' + i).join('/'), kind: 'directory', metadata: null })), { id: 'deep-leaf', parentId: 'dir-299', name: 'leaf.txt', path: '/deep/leaf.txt', kind: 'file', metadata: null }]); window.scaleSetExpanded(new Set(Array.from({ length: 300 }, (_, index) => `dir-${index}`))); });
    await page.waitForFunction(() => Array.from(document.querySelectorAll('#scale-smoke [role=treeitem]')).some(row => row.id.includes('-item-dir-') || row.id.endsWith('-item-deep-leaf')));
    await tree.press('End'); await page.waitForFunction(() => { const tree = document.querySelector('#scale-smoke [role=tree]'); return document.getElementById(tree.getAttribute('aria-activedescendant'))?.getAttribute('aria-level') === '301'; });
    receipt.checks.push('300 nested directories reveal level301 leaf without full-DOM rendering');
    receipt.measurements.minimalIO = await page.evaluate(() => ({ ...window.minimalIO, richModules: performance.getEntriesByType('resource').filter(entry => entry.name.includes('monaco') || entry.name.includes('editors/dist/index')).length }));
    assert.deepEqual(receipt.measurements.minimalIO, { reads: 0, watches: 0, richModules: 0 });
    receipt.checks.push('Tree-only provider and standalone scale surface start no content reads, watch, or rich-editor modules');
    await page.evaluate(() => window.mountWindowsChord()); await page.getByRole('group', { name: 'Windows key plus K', exact: true }).waitFor(); receipt.checks.push('Compiled KeyChord displays Windows Meta without a Command label');
    await page.evaluate(() => window.mountActivation()); const activationTree = page.locator('#activation-smoke [role="tree"]'); await activationTree.waitFor(); await activationTree.focus(); await activationTree.press('Enter'); await page.getByLabel('Activation requests').filter({ hasText: /^filtered$/ }).waitFor(); await activationTree.getByRole('treeitem', { name: 'visible.txt', exact: true }).dblclick(); await page.getByLabel('Activation requests').filter({ hasText: /^filtered,visible$/ }).waitFor(); await page.getByRole('button', { name: 'Filter activation tree', exact: true }).click(); assert.equal(await activationTree.getByRole('treeitem', { name: 'filtered.txt', exact: true }).count(), 0); await activationTree.focus(); await activationTree.press('Enter'); assert.equal(await page.getByLabel('Activation requests').textContent(), 'filtered,visible'); receipt.checks.push('Compiled FileTree opens once on explicit activation and never opens filtered controlled focus');
    assert.deepEqual(receipt.errors, []); console.log(JSON.stringify(receipt, null, 2));
  } finally { receipt.finalTree = await page.evaluate(() => { const tree = document.querySelector('#scale-smoke [role=tree]'); return { active: tree?.getAttribute('aria-activedescendant'), rows: Array.from(tree?.querySelectorAll('[role=treeitem]') ?? []).map(row => ({ id: row.id, level: row.getAttribute('aria-level'), text: row.textContent })) }; }); await fs.writeFile(__dirname + '/implementation-scale-verification.json', JSON.stringify(receipt, null, 2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
