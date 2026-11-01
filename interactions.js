const baseRender = render;
const escapeText = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
render = function () {
  baseRender();
  if (kind === 'ReferenceGrant' && drafts[kind].spec.to[0].name === '') delete drafts[kind].spec.to[0].name;
  const d = drafts[kind];
  const blocked = ['RBAC denied', 'API missing', 'Controller-owned'].includes($('scenario').value);
  if ($('content').querySelector('pre')) $('content').querySelector('pre').textContent = JSON.stringify(d, null, 2);
  if (kind === 'ReferenceGrant' && section === 'Attachment' && mode === 'Form') {
    const source = d.spec.from.map(ref => escapeText(ref.namespace + ' / ' + ref.kind)).join(' OR ');
    const target = d.spec.to.map(ref => escapeText(d.metadata.namespace + ' / ' + ref.kind + ' / ' + (ref.name || 'ALL NAMES'))).join(' OR ');
    $('content').innerHTML = '<h2>Permission edges</h2><div class="status">' + source + ' → ' + target + '</div><div class="notice">ReferenceGrant has no status subresource. Permission effect remains unverified.</div>';
    return;
  }
  if (kind !== 'Gateway' && section === 'Attachment' && mode === 'Form') {
    for (const row of $('content').querySelectorAll('.status')) if (row.textContent.includes('Programmed')) row.remove();
  }
  if (mode !== 'Form' || section !== 'Configure' || blocked || sourceChanged[kind]) return;
  const grid = $('content').querySelector('.grid');
  if (!grid) return;
  const trust = document.querySelector('[data-path="spec.validation.wellKnownCACertificates"]');
  if (trust) {
    if (d.spec.validation.caCertificateRefs) {
      trust.value = 'ConfigMap reference';
      if (!document.querySelector('[data-path="spec.validation.caCertificateRefs.0.name"]')) grid.insertAdjacentHTML('beforeend', field('CA ConfigMap', 'spec.validation.caCertificateRefs.0.name', 'select', 'backend-ca|Unresolved reference'));
    }
  }
  if (kind === 'Gateway') {
    const protocol = d.spec.listeners[0].protocol;
    for (const el of document.querySelectorAll('[data-path]')) {
      if ((el.dataset.path.includes('.tls.') && ['HTTP', 'TCP', 'UDP'].includes(protocol)) || (el.dataset.path.endsWith('.hostname') && ['TCP', 'UDP'].includes(protocol))) el.closest('label').hidden = true;
    }
  }
  const path = kind === 'Gateway' ? 'spec.listeners' : kind.endsWith('Route') ? 'spec.rules.0.backendRefs' : null;
  if (path) {
    const rows = get(d, path) || [];
    rows.slice(1).forEach((row, n) => {
      const i = n + 1;
      grid.insertAdjacentHTML('beforeend', `<h3 style="grid-column:1/-1">${kind === 'Gateway' ? 'Listener' : 'Backend'} ${i + 1}</h3>` + field('Additional name ' + i, path + '.' + i + '.name', 'text', row.name) + field('Additional port ' + i, path + '.' + i + '.port', 'number', String(row.port)) + (kind === 'Gateway' ? field('Additional protocol ' + i, path + '.' + i + '.protocol', 'select', 'HTTP|HTTPS|TLS|TCP|UDP') : field('Additional weight ' + i, path + '.' + i + '.weight', 'number', String(row.weight))));
    });
  }
  document.querySelectorAll('[data-path]').forEach(el => {
    const original = el.onchange;
    el.onchange = () => {
      if (original) original();
      else { put(d, el.dataset.path, el.type === 'number' ? Number(el.value) : el.value); render(); }
    };
  });
  const invalid = [...document.querySelectorAll('[data-path]')].find(el => el.dataset.path.endsWith('.port') && (Number(el.value) < 1 || Number(el.value) > 65535));
  if (invalid) {
    invalid.setAttribute('aria-invalid', 'true');
    const message = document.createElement('span');
    message.className = 'error'; message.textContent = 'Use a port from 1 to 65535.';
    invalid.closest('label').append(message);
    $('review').disabled = true;
  }
};
const style = document.createElement('style');
style.textContent = '@media(max-width:700px){header{flex-wrap:wrap;gap:10px}header .row{flex-wrap:wrap}footer{flex-wrap:wrap}.fixture span{width:100%}.shell{height:calc(100vh - 165px)}}';
document.head.append(style);
