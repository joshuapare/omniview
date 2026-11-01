// Bounded design adapter. JSON is a YAML 1.2 subset. Manual source stays opaque.
const oldYaml = yaml;
yaml = function () {
  const d = doc(), c = C[kind];
  const out = {apiVersion: 'v1', kind, metadata: {name: d.name}};
  if (!c.scope) out.metadata.namespace = 'preview';
  for (const [path, value] of Object.entries(d.values)) {
    if (value === '' || value === 'Omit') continue;
    let parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    if (path.startsWith('metadata.labels.')) parts = ['metadata', 'labels', path.slice(16)];
    let obj = out;
    for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]] ??= /^\d+$/.test(parts[i + 1]) ? [] : {};
    let typed = value;
    if (path === 'automountServiceAccountToken') typed = value === 'true';
    if (['spec.replicas', 'subsets[0].ports[0].port'].includes(path)) typed = Number(value);
    obj[parts.at(-1)] = typed;
  }
  for (const [key, value] of d.labels) if (key) (out.metadata.labels ??= {})[key] = value;
  if (kind === 'ResourceQuota' && d.values['spec.scopeSelector.matchExpressions[0].values[0]']) {
    const expr = out.spec.scopeSelector.matchExpressions[0]; expr.scopeName = 'PriorityClass'; expr.operator = 'In';
  }
  return JSON.stringify(out, null, 2);
};
const oldReview = review;
review = function () {
  const d = doc(), c = C[kind], v = d.values;
  let errors = [];
  if (manual[kind]) errors.push('Manual source retained. Guided review cannot validate this source.');
  if (!c.inspect && !/^[a-z0-9]([-a-z0-9.]*[a-z0-9])?$/.test(d.name)) errors.push('Enter a valid lowercase resource name.');
  if (kind === 'ReplicationController') {
    if (!/^\d+$/.test(v['spec.replicas'] || '')) errors.push('Enter a non-negative replica count.');
    if (!v['spec.selector.app'] || v['spec.selector.app'] !== v['spec.template.metadata.labels.app']) errors.push('Match selector and template application labels.');
  }
  if (kind === 'Endpoints') {
    const port = Number(v['subsets[0].ports[0].port']);
    if (!Number.isInteger(port) || port < 1 || port > 65535) errors.push('Enter a port from 1 to 65535.');
  }
  if (kind === 'PersistentVolume' && (!v['spec.capacity.storage'] || !v['spec.nfs.server'] || !v['spec.nfs.path']?.startsWith('/'))) errors.push('Enter capacity, NFS server and absolute export path.');
  if (['PodTemplate', 'ReplicationController'].includes(kind)) {
    const prefix = kind === 'PodTemplate' ? 'template.spec' : 'spec.template.spec';
    if (!v[prefix + '.containers[0].name'] || !v[prefix + '.containers[0].image']) errors.push('Enter container name and explicit image.');
  }
  if (errors.length) {
    document.querySelectorAll('.error').forEach(e => e.remove());
    $('#main').insertAdjacentHTML('afterbegin', '<div class="error" role="alert">' + errors.map(esc).join('<br>') + '</div>');
    $('#main input:not(:disabled)')?.focus(); return;
  }
  oldReview();
};
$('#review').onclick = review;
// Review navigation follows the same guard as the primary action.
document.querySelector('[data-section="Review"]').onclick = review;
window.addEventListener('beforeunload', e => { if (Object.values(drafts).some(d => d.name || Object.keys(d.values).length)) { e.preventDefault(); e.returnValue = ''; } });

// Keep scope and adapter details out of the working field layout.
const renderCoreFrame = render;
render = function () {
  renderCoreFrame();
  if (C[kind].scope) {
    for (const input of document.querySelectorAll('#main input:disabled')) {
      if (input.value === 'Not applicable') input.closest('label').remove();
    }
  }
  for (const hint of document.querySelectorAll('#main .field small')) {
    const label = hint.closest('label');
    const detail = hint.textContent;
    const control = label.querySelector('input, select');
    if (control) control.title = detail;
    const helpButton = document.createElement('button');
    helpButton.type = 'button';
    helpButton.textContent = '?';
    helpButton.setAttribute('aria-label', 'Field details: ' + label.firstChild.textContent.trim());
    helpButton.style.cssText = 'width:24px;height:24px;padding:0;align-self:flex-end';
    const open = () => {
      dismiss();
      helpOpen = true;
      const popup = document.createElement('div');
      popup.id = 'helpbox';
      popup.className = 'help';
      popup.setAttribute('role', 'tooltip');
      popup.textContent = detail;
      popup.style.cssText = 'right:max(20px,calc((100vw - 950px)/2));top:155px';
      document.body.append(popup);
    };
    helpButton.onmouseenter = open;
    helpButton.onfocus = open;
    helpButton.onclick = open;
    hint.replaceWith(helpButton);
  }
  if (kind === 'Namespace') {
    for (const warning of document.querySelectorAll('#main .warning')) {
      if (warning.textContent.includes(C[kind].warning)) {
        if (section === 'Review') warning.textContent = 'Non-mutating review · no namespace deletion or finalization';
        else warning.remove();
      }
    }
    if (section === 'Connections') {
      const warning = document.createElement('div');
      warning.className = 'warning';
      warning.textContent = C[kind].warning;
      $('#main').append(warning);
    }
  }
};
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && helpOpen && document.activeElement?.getAttribute('aria-label')?.startsWith('Field details:')) {
    event.stopImmediatePropagation();
    dismiss();
  }
}, true);
