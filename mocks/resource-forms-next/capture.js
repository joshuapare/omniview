/**
 * Run with a browser BrowserTab already open on this prototype's index.html.
 * Example: await captureAll(tab, '/absolute/path/to/screenshots/resource-forms-next').
 * The caller owns serving, opening/closing the tab, and reviewing the captures.
 * No application state is injected. All edits use real browser input events.
 */
async function captureAll(tab, outputDir) {
  const currentURL = await tab.url();
  return await tab.run(async ({ page, tab }, outputDir, currentURL) => {
    const fs = await import('node:fs/promises');
    const os = await import('node:os');
    const path = await import('node:path');
    await fs.mkdir(outputDir, { recursive: true });
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.25 });
    const checks = {};
    const screenshots = [];
    const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'resource-forms-next-'));
    const baseURL = new URL(currentURL);
    baseURL.search = '';
    baseURL.hash = '';
    let pageError = false;
    const onPageError = () => { pageError = true; };
    page.on('pageerror', onPageError);
    const saveChecks = () => fs.writeFile(path.join(outputDir, 'checks.json'), JSON.stringify({ checks, screenshots }, null, 2));
    const check = async (id, expression) => {
      // Expressions, unlike Puppeteer's isolated-world page.evaluate callbacks,
      // can read the prototype's page-global window.__mock and window.YAML.
      const result = await tab.evaluate(typeof expression === 'string' ? expression : `(${expression.toString()})()`);
      checks[id] = result === true;
      if (!checks[id]) {
        await saveChecks();
        throw new Error(`Capture assertion failed: ${id}`);
      }
    };
    const yaml = async (id, predicate) => check(id, `(() => {
      const state = window.__mock.state;
      const document = window.YAML.parse(state.source);
      return (${predicate.toString()})(document, state) === true;
    })()`);
    const settle = async () => {
      await tab.evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))`);
      await page.waitForFunction(() => document.getAnimations().every(animation => animation.playState !== 'running'), { timeout: 5000 });
    };
    const stateCheck = async id => check(id, () => {
      const state = window.__mock?.state;
      return !!state && typeof state.source === 'string' && ['form', 'yaml'].includes(state.mode)
        && document.body.textContent.includes('dev-us-east') && document.body.textContent.includes('payments');
    });
    let step = 0;
    const afterInput = async () => { await settle(); await stateCheck(`input${++step}`); };
    const click = async selector => { await page.click(selector); await afterInput(); };
    const fill = async (selector, value) => { await tab.fill(selector, String(value)); await afterInput(); };
    const select = async (selector, value) => { await page.select(selector, value); await afterInput(); };
    const toggle = async (selector, expected) => {
      if (await tab.isChecked(selector) !== expected) await click(selector);
      await check(`toggle${++step}`, `document.querySelector(${JSON.stringify(selector)}).checked === ${expected}`);
    };
    const mode = async value => {
      if (await tab.evaluate('window.__mock.state.mode') !== value) await click(`[data-mode="${value}"]`);
      await check(`mode${++step}`, `window.__mock.state.mode === ${JSON.stringify(value)}`);
    };
    const section = async value => {
      await click(`[data-section="${value}"]`);
      await check(`section${++step}`, `window.__mock.state.section === ${JSON.stringify(value)}`);
    };
    const go = async (kind, intent = 'create', forceForm = true) => {
      const url = new URL(baseURL);
      url.searchParams.set('kind', kind);
      url.searchParams.set('intent', intent);
      await page.goto(url.href, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-mode="form"]');
      await check(`kind${++step}`, `window.__mock.state.kind === ${JSON.stringify(kind)}`);
      if (forceForm) await mode('form');
      await afterInput();
    };
    const snapshot = async filename => {
      await page.mouse.move(1400, 850);
      await settle();
      await stateCheck(`capture${++step}`);
      if (await tab.evaluate('window.__mock.state.kind === "Secret"')) {
        await check(`secretMask${++step}`, () => {
          const fields = [...document.querySelectorAll('.secret-value, #docker-username, #docker-password, #docker-email')];
          return fields.every(field => field.type === 'password')
            && (!document.querySelector('#yaml-editor') || document.querySelector('#yaml-editor').readOnly);
        });
        await check(`secretRenderedSafety${++step}`, () => {
          const source = window.YAML.parse(window.__mock.state.source);
          const material = [...Object.values(source.data || {}), ...Object.values(source.stringData || {}),
            ...Object.values(source.metadata?.annotations || {})];
          for (const encoded of Object.values(source.data || {})) {
            try {
              material.push(new TextDecoder().decode(Uint8Array.from(atob(encoded), char => char.charCodeAt(0))));
            } catch { return false; }
          }
          const fields = [...document.querySelectorAll('.secret-value, #docker-username, #docker-password, #docker-email')];
          material.push(...fields.map(field => field.value));
          const visible = [document.body.innerText, document.querySelector('#yaml-editor')?.value || '',
            ...[...document.querySelectorAll('[aria-label], [title], [alt]')].map(element =>
              ['aria-label', 'title', 'alt'].map(attribute => element.getAttribute(attribute) || '').join(' '))].join('\n');
          return material.filter(value => typeof value === 'string' && value.length >= 4)
            .every(value => !visible.includes(value));
        });
      }
      await page.screenshot({ path: path.join(outputDir, filename), fullPage: false });
      screenshots.push(filename);
      await saveChecks();
    };
    const fingerprint = () => tab.evaluate(`(async () => {
      const bytes = new TextEncoder().encode(window.__mock.state.source);
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    })()`);
    const sameFingerprint = async (id, expected, equal = true) => {
      const actual = await fingerprint();
      checks[id] = (actual === expected) === equal;
      if (!checks[id]) { await saveChecks(); throw new Error(`Capture assertion failed: ${id}`); }
    };
    const retainedFixture = async id => check(id, () => {
      const state = window.__mock.state;
      const document = window.YAML.parse(state.source, { intAsBigInt: true });
      return document['x-design-context']?.exactInteger === 9007199254740993n
        && state.source.includes('# Keep this operator note.');
    });
    try {
      // Service: a real string-or-integer targetPort union, not a digit heuristic.
      await go('Service');
      await fill('#name', 'payments-api');
      await section('ports');
      await fill('[data-port-index="0"] .port-name', 'http');
      await fill('[data-port-index="0"] .port-number', '80');
      await select('[data-port-index="0"] .target-kind', 'name');
      await fill('[data-port-index="0"] .target-value', 'http');
      await select('[data-port-index="0"] .protocol', 'TCP');
      await click('#add-port');
      await fill('[data-port-index="1"] .port-name', 'metrics');
      await fill('[data-port-index="1"] .port-number', '9090');
      await select('[data-port-index="1"] .target-kind', 'number');
      await fill('[data-port-index="1"] .target-value', '9090');
      await yaml('servicePortUnion', d => d.spec.ports[0].port === 80 && d.spec.ports[0].targetPort === 'http'
        && d.spec.ports[1].targetPort === 9090 && typeof d.spec.ports[1].targetPort === 'number');
      await snapshot('2-01-service-named-targets.png');
      await section('basics');
      await fill('#name', 'postgres-headless');
      await toggle('#headless', true);
      await section('selector');
      await fill('[data-selector-index="0"] .selector-key', 'app');
      await fill('[data-selector-index="0"] .selector-value', 'postgres');
      await yaml('headlessIsClusterIP', d => d.spec.type === 'ClusterIP' && d.spec.clusterIP === 'None' && d.spec.selector.app === 'postgres');
      await check('selectorPreviewIsSample', () => /Sample matches/i.test(document.body.textContent) && /postgres/.test(document.body.textContent));
      await snapshot('2-02-service-headless-sample-matches.png');
      await section('basics');
      await toggle('#headless', false);
      await select('#service-type', 'LoadBalancer');
      await fill('#name', 'payments-public');
      await yaml('loadBalancerMapping', d => d.spec.type === 'LoadBalancer' && d.spec.clusterIP !== 'None');
      await check('loadBalancerSafety', () => [...document.querySelectorAll('.warning')].some(el => /charges|externally reachable/i.test(el.textContent)));
      await snapshot('2-03-service-load-balancer-warning.png');
      await select('#service-type', 'NodePort');
      await check('nodePortSafety', () => [...document.querySelectorAll('.warning')].some(el => /node addresses|network controls/i.test(el.textContent)));
      await select('#service-type', 'ExternalName');
      await fill('#external-name', 'catalog.example.net');
      await yaml('externalNameMapping', d => d.spec.type === 'ExternalName' && d.spec.externalName === 'catalog.example.net' && !d.spec.selector && !d.spec.ports);
      await check('externalNameHidesEditors', () => !document.querySelector('[data-port-index]') && !document.querySelector('[data-selector-index]'));
      await go('Service', 'edit');
      await section('basics');
      await check('serviceEditIdentityAndHeadlessLocked', () => document.querySelector('#name').disabled && document.querySelector('#namespace').disabled && document.querySelector('#headless').disabled);
      await retainedFixture('serviceEditFixtureIntact');
      await section('selector');
      await fill('[data-selector-index="0"] .selector-value', 'payments-api');
      await retainedFixture('serviceEditUnknownFieldsPreserved');

      await go('Ingress');
      await fill('#name', 'payments-web');
      await select('#ingress-class', 'nginx');
      await section('routes');
      await fill('#route-host', 'payments.example.net');
      await fill('[data-route-index="0"] .route-path', '/api');
      await select('[data-route-index="0"] .route-type', 'Prefix');
      await select('[data-route-index="0"] .route-service', 'payments-api');
      await select('[data-route-index="0"] .route-port', 'name:http');
      await click('#add-route');
      await fill('[data-route-index="1"] .route-path', '/');
      await select('[data-route-index="1"] .route-type', 'Prefix');
      await select('[data-route-index="1"] .route-service', 'payments-web');
      await select('[data-route-index="1"] .route-port', 'number:80');
      await yaml('ingressRouteUnion', d => {
        const paths = d.spec.rules[0].http.paths;
        return d.spec.ingressClassName === 'nginx' && d.spec.rules[0].host === 'payments.example.net'
          && paths[0].backend.service.port.name === 'http' && !('number' in paths[0].backend.service.port)
          && paths[1].backend.service.port.number === 80 && !('name' in paths[1].backend.service.port) && !d.spec.tls;
      });
      await snapshot('2-04-ingress-routes-service-ports.png');
      await section('tls');
      await toggle('#tls-enabled', true);
      await select('#tls-secret', 'payments-web-tls');
      await fill('#tls-hosts', 'payments.example.net');
      await page.keyboard.press('Enter');
      await afterInput();
      await fill('#tls-hosts', 'api.payments.example.net');
      await page.keyboard.press('Enter');
      await afterInput();
      await check('tlsHostsUseDirectRemovableTokens', () => document.querySelectorAll('[data-remove-tls-host]').length === 2
        && window.YAML.parse(window.__mock.state.source).spec.tls[0].hosts[1] === 'api.payments.example.net');
      await click('[data-remove-tls-host="1"]');
      await yaml('tlsHostRemovalPatchesOnlyHostList', d => d.spec.tls[0].hosts.length === 1 && d.spec.tls[0].secretName === 'payments-web-tls');
      await fill('#tls-hosts', 'api.payments.example.net');
      await page.keyboard.press('Enter');
      await afterInput();
      await yaml('ingressTLSMapping', d => d.spec.tls[0].secretName === 'payments-web-tls' && d.spec.tls[0].hosts[0] === 'payments.example.net');
      await snapshot('2-05-ingress-existing-tls-reference.png');
      const beforeReview = await fingerprint();
      await click('#review');
      await sameFingerprint('reviewDoesNotMutate', beforeReview);

      await go('ConfigMap');
      await fill('#name', 'payments-config');
      await section('entries');
      await fill('[data-entry-index="0"] .entry-key', 'LOG_LEVEL');
      await fill('[data-entry-index="0"] .entry-value', 'false');
      await click('#add-entry');
      await fill('[data-entry-index="1"] .entry-key', 'MAX_RETRIES');
      await fill('[data-entry-index="1"] .entry-value', '123');
      await click('#add-entry');
      await fill('[data-entry-index="2"] .entry-key', 'app.yaml');
      await select('[data-entry-index="2"] .entry-kind', 'file');
      await click('[data-entry-index="2"] .entry-expand');
      await fill('[data-entry-index="2"] .entry-content', 'logging:\n  format: json\n  sample: false\n');
      await yaml('configMapStringsExact', d => d.data.LOG_LEVEL === 'false' && d.data.MAX_RETRIES === '123'
        && d.data['app.yaml'] === 'logging:\n  format: json\n  sample: false\n');
      await check('configMapByteCountUpdatesWithExpandedInput', () => {
        const data = window.YAML.parse(window.__mock.state.source).data;
        const expected = Object.values(data).reduce((sum, value) => sum + new TextEncoder().encode(value).length, 0);
        return document.querySelector('#entry-byte-count').textContent === expected.toLocaleString();
      });
      await snapshot('2-06-configmap-expanded-file.png');
      await click('#add-entry');
      await fill('[data-entry-index="3"] .entry-key', 'fixture.bin');
      await select('[data-entry-index="3"] .entry-kind', 'binary');
      const binaryPath = path.join(temporaryDirectory, 'fixture.bin');
      await fs.writeFile(binaryPath, Buffer.from([0, 255, 128, 10, 13]));
      const upload = await page.$('[data-entry-index="3"] .entry-upload');
      await upload.uploadFile(binaryPath);
      for (let attempt = 0; attempt < 100; attempt++) {
        if (await tab.evaluate('window.__mock.state.source.includes("AP+ACg0=")')) break;
        await new Promise(resolve => setTimeout(resolve, 25));
      }
      await afterInput();
      await yaml('configMapBinaryUploadExact', d => d.binaryData['fixture.bin'] === 'AP+ACg0=' && !('fixture.bin' in d.data));
      await mode('yaml');
      await snapshot('2-07-configmap-yaml-string-preservation.png');
      const originalConfig = await tab.evaluate('window.__mock.state.source');
      await fill('#yaml-editor', originalConfig + '\n# capture-preserve-note\nx-capture-evidence:\n  exactInteger: 9007199254740993\n  untouched: true\n');
      await mode('form');
      await section('entries');
      await fill('[data-entry-index="0"] .entry-value', 'null');
      await check('yamlUnknownCommentAndBigintPreserved', () => {
        const source = window.__mock.state.source;
        const parsed = window.YAML.parse(source, { intAsBigInt: true });
        return source.includes('# capture-preserve-note') && parsed['x-capture-evidence'].exactInteger === 9007199254740993n
          && parsed['x-capture-evidence'].untouched === true && parsed.data.LOG_LEVEL === 'null';
      });
      await fill('[data-entry-index="1"] .entry-key', 'LOG_LEVEL');
      await click('#review');
      await check('duplicateConfigMapKeyBlocked', () => document.querySelectorAll('[aria-invalid="true"], .error').length > 0);
      await fill('[data-entry-index="1"] .entry-key', 'MAX_RETRIES');
      await mode('yaml');
      await fill('#yaml-editor', 'apiVersion: [');
      await check('invalidYamlRetainedAndFormUnavailable', () => window.__mock.state.source === 'apiVersion: ['
        && document.querySelector('[data-mode="form"]').disabled && document.querySelector('#yaml-editor').value === 'apiVersion: [');
      await fill('#yaml-editor', originalConfig);
      await mode('form');
      await section('basics');
      await toggle('#immutable', true);
      await check('immutableSafetyVisible', () => /permanent|cannot be changed after saving/i.test(document.body.textContent));
      await yaml('immutableMapping', d => d.immutable === true);
      await mode('yaml');
      await go('ConfigMap', 'create', false);
      await check('modePreferencePersists', () => window.__mock.state.mode === 'yaml');
      await yaml('draftValuesNotPersisted', d => !d.data || !('LOG_LEVEL' in d.data));

      // All credential material remains within the page and masked screenshots.
      // Hashes below compare source equality without returning source values.
      await go('Secret');
      await fill('#name', 'payments-runtime');
      await section('credentials');
      await fill('[data-secret-index="0"] .secret-key', 'API_TOKEN');
      await fill('[data-secret-index="0"] .secret-value', 'synthetic-capture-only-value');
      await yaml('opaqueTypeAndKey', d => d.type === 'Opaque' && ('API_TOKEN' in (d.data || d.stringData || {})));
      await check('opaqueMaskedAccessibleNameSafe', () => [...document.querySelectorAll('.secret-value')].every(el => el.type === 'password'
        && !(el.getAttribute('aria-label') || '').includes(el.value)));
      await snapshot('2-08-secret-opaque-masked.png');
      await section('basics');
      await select('#secret-type', 'kubernetes.io/tls');
      await check('typeChangeNeedsConfirmation', () => !!document.querySelector('#type-confirm'));
      await click('#cancel-type-change');
      await yaml('cancelTypeChangeRetainsDraft', d => d.type === 'Opaque' && ('API_TOKEN' in (d.data || d.stringData || {})));
      await go('Secret', 'edit');
      await section('credentials');
      const retainedSecret = await fingerprint();
      await click('[data-secret-index="0"] [data-secret-action="reveal"]');
      await check('explicitRevealWorks', () => document.querySelector('[data-secret-index="0"] .secret-value').type === 'text');
      await sameFingerprint('revealDoesNotChangeSource', retainedSecret);
      await section('basics');
      await section('credentials');
      await check('leavingCredentialsRemasks', () => {
        const row = document.querySelector('[data-secret-index="0"]');
        return !!row.querySelector('.retained .mask') && !row.querySelector('.secret-value[type="text"]');
      });
      await click('[data-secret-index="0"] [data-secret-action="replace"]');
      await fill('[data-secret-index="0"] .secret-value', '');
      await yaml('emptyReplacementIsNotKeep', d => d.data?.API_TOKEN === '' || d.stringData?.API_TOKEN === '');
      await fill('[data-secret-index="0"] .secret-value', 'synthetic-replacement-only');
      await sameFingerprint('replacementChangesSource', retainedSecret, false);
      await yaml('replacementPreservesOtherKeys', d => Object.hasOwn(d.data || {}, 'SESSION_KEY'));
      await snapshot('2-09-secret-explicit-replace-intent.png');
      await click('[data-secret-index="0"] [data-secret-action="cancel"]');
      await sameFingerprint('cancelRestoresExactUnseenValues', retainedSecret);
      await check('secretEditTypeLocked', () => !document.querySelector('#secret-type') || document.querySelector('#secret-type').disabled);
      await click('#review');
      await check('secretReviewDoesNotExposeValues', () => {
        const source = window.YAML.parse(window.__mock.state.source);
        const visible = document.body.innerText;
        const values = [...Object.values(source.data || {}), ...Object.values(source.stringData || {})];
        for (const value of Object.values(source.data || {})) {
          values.push(new TextDecoder().decode(Uint8Array.from(atob(value), char => char.charCodeAt(0))));
        }
        return values.filter(value => typeof value === 'string' && value.length >= 4).every(value => !visible.includes(value));
      });
      await sameFingerprint('secretReviewDoesNotChangeSource', retainedSecret);
      await click('#back');
      await mode('yaml');
      await check('secretYamlIsReadonlyRedactedProjection', () => {
        const editor = document.querySelector('#yaml-editor');
        const source = window.YAML.parse(window.__mock.state.source);
        const displayed = editor.value;
        const values = [...Object.values(source.data || {}), ...Object.values(source.stringData || {}),
          ...Object.values(source.metadata?.annotations || {})];
        return editor.readOnly && /redacted/i.test(document.body.textContent) && /redacted/i.test(displayed)
          && values.filter(value => value !== '').every(value => !displayed.includes(String(value)));
      });
      await sameFingerprint('redactedProjectionDoesNotReplaceSource', retainedSecret);
      await snapshot('2-10-secret-cancel-retains-redacted-yaml.png');
      await go('Secret');
      await fill('#name', 'payments-web-tls');
      await select('#secret-type', 'kubernetes.io/tls');
      await section('credentials');
      await check('tlsDedicatedEmptySlots', () => !!document.querySelector('#tls-certificate-upload') && !!document.querySelector('#tls-private-key-upload'));
      await yaml('tlsTypeMapping', d => d.type === 'kubernetes.io/tls');
      await snapshot('2-11-secret-tls-empty-upload-slots.png');
      await go('Secret');
      await fill('#name', 'payments-registry');
      await select('#secret-type', 'kubernetes.io/dockerconfigjson');
      await section('credentials');
      await fill('#docker-server', 'registry.example.invalid');
      await fill('#docker-username', 'synthetic-user');
      await fill('#docker-password', 'synthetic-password-only');
      await fill('#docker-email', 'synthetic@example.invalid');
      await check('dockerFieldsMasked', () => ['#docker-username', '#docker-password', '#docker-email'].every(selector => document.querySelector(selector).type === 'password'));
      await yaml('dockerExactMappingWithoutDisclosure', d => {
        if (d.type !== 'kubernetes.io/dockerconfigjson' || !d.data?.['.dockerconfigjson']) return false;
        const config = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(d.data['.dockerconfigjson']), char => char.charCodeAt(0))));
        const entry = config.auths?.['registry.example.invalid'];
        return !!entry && entry.username === 'synthetic-user' && entry.password === 'synthetic-password-only'
          && entry.email === 'synthetic@example.invalid' && atob(entry.auth) === 'synthetic-user:synthetic-password-only';
      });
      await snapshot('2-12-secret-docker-masked-form.png');

      await go('PersistentVolumeClaim');
      await fill('#name', 'payments-data');
      await section('storage');
      await fill('#capacity', '20');
      await select('#capacity-unit', 'Gi');
      await select('#storage-class', 'default');
      await select('#volume-mode', 'default');
      await yaml('pvcDefaultOmission', d => !Object.hasOwn(d.spec, 'storageClassName') && !Object.hasOwn(d.spec, 'volumeMode')
        && d.spec.resources.requests.storage === '20Gi' && d.spec.accessModes.includes('ReadWriteOnce'));
      await snapshot('2-13-pvc-cluster-default.png');
      await select('#capacity-unit', 'Mi');
      await check('capacityUnitConversionExact', () => document.querySelector('#capacity').value === '20480');
      await yaml('capacityConvertedQuantity', d => d.spec.resources.requests.storage === '20480Mi');
      await select('#capacity-unit', 'Gi');
      await check('capacityRoundTripExact', () => document.querySelector('#capacity').value === '20');
      await select('#storage-class', 'none');
      await yaml('pvcExplicitNoStorageClass', d => Object.hasOwn(d.spec, 'storageClassName') && d.spec.storageClassName === '');
      await snapshot('2-14-pvc-no-storage-class.png');
      await select('#storage-class', 'standard');
      await yaml('pvcNamedStorageClass', d => d.spec.storageClassName === 'standard');
      await go('PersistentVolumeClaim', 'edit');
      await section('storage');
      await retainedFixture('pvcEditFixtureIntact');
      await check('pvcImmutableFieldsLocked', () => document.querySelector('#storage-class').disabled && document.querySelector('#volume-mode').disabled
        && [...document.querySelectorAll('[data-access-mode]')].every(el => el.disabled));
      await fill('#capacity', '30');
      await yaml('pvcExpansionPreservesBinding', d => d.spec.resources.requests.storage === '30Gi' && d.spec.storageClassName === 'fast-ssd' && !!d.spec.volumeName);
      await retainedFixture('pvcExpansionPreservesUnknownFields');
      await snapshot('2-15-pvc-edit-expansion.png');
      await fill('#capacity', '10');
      await click('#review');
      await check('pvcShrinkBlockedInline', () => document.querySelectorAll('[aria-invalid="true"], .error').length > 0
        && /shrink|smaller|20\s*Gi|below/i.test(document.body.textContent));
      await snapshot('2-16-pvc-edit-shrink-error.png');
      checks.noPageErrors = !pageError;
      if (pageError) throw new Error('Capture assertion failed: noPageErrors');
      await saveChecks();
      return { checks, screenshots };
    } finally {
      await saveChecks();
      page.off('pageerror', onPageError);
      await fs.rm(temporaryDirectory, { recursive: true, force: true });
    }
  }, { args: [outputDir, currentURL], timeout: 300 });
}

// Supports both CommonJS loading and direct evaluation in the browser Eval kernel.
if (typeof module !== 'undefined') module.exports = { captureAll };
