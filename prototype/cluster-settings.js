'use strict';
// Provider connections are independent from resource connections. Datasource UIDs
// are scoped by their provider connection, never treated as globally unique IDs.
const providerCatalog = [
  { id: 'grafanacloud-eu', host: 'acme.grafana.net', mode: 'cloud', sources: [
    { uid: 'prom-prod', name: 'prometheus-production', kind: 'prometheus' },
    { uid: 'prom-staging', name: 'prometheus-staging', kind: 'prometheus' },
  ] },
  { id: 'grafana-us', host: 'grafana.us.example.com', mode: 'self', sources: [
    { uid: 'prom-prod', name: 'prometheus-us', kind: 'prometheus' },
    { uid: 'prom-platform', name: 'platform-infrastructure', kind: 'prometheus' },
  ] },
];
const clusterModels = {
  'production-eu': { provider: 'grafanacloud-eu', datasource: 'prom-prod', scope: 'prod-eu-01', mode: 'grafana', policy: 'Replace mapped metrics', overrides: {} },
  'staging-eu': { provider: 'grafanacloud-eu', datasource: 'prom-staging', scope: 'staging-eu-01', mode: 'grafana', policy: 'Supplement native metrics', overrides: {} },
  'production-us': { provider: 'grafana-us', datasource: 'prom-prod', scope: 'prod-us-01', mode: 'grafana', policy: 'Replace mapped metrics', overrides: {} },
};
const clusterUI = { ready: false, selected: 'production-eu', open: null, filter: '', dirty: false, saved: '', nativeOpen: false };
function initializeClusters() {
  if (clusterUI.ready) return;
  clusterModels['production-eu'].overrides[0] = { query: metrics[0].query.replace(/\bpod\b/g, 'pod_name'), join: 'pod_name' };
  clusterUI.saved = JSON.stringify(clusterModels);
  const requested = new URLSearchParams(location.search).get('cluster');
  if (clusterModels[requested]) clusterUI.selected = requested;
  clusterUI.ready = true;
}
function availableProviders() { return providerCatalog.concat(connectionState.added.map(c => ({ id: c.name, host: c.host, mode: c.mode, sources: c.sources }))); }
function providerByID(id) { return availableProviders().find(p => p.id === id); }
function clusterModel() { return clusterModels[clusterUI.selected]; }
function effectiveMetric(id) { return clusterModel().overrides[id]?.query ?? metrics[id].query; }
function setClusterView(name = clusterUI.selected) {
  initializeClusters();
  if (clusterModels[name]) clusterUI.selected = name;
  state.view = 'cluster'; state.selectedNav = 'Kubernetes'; clusterUI.open = null;
  render();
}
function setGlobalView(tab = 'connections') {
  state.view = 'global'; state.selectedNav = 'Grafana'; state.tab = tab;
  render();
}
function applyGlobalChrome() {
  document.body.classList.remove('cluster-view');
  document.getElementById('workspaceChrome')?.remove();
  document.getElementById('workspaceStatus')?.remove();
  const aside = document.querySelector('aside');
  if (!aside.querySelector('#nav')) aside.innerHTML = '<div class="brand">Settings</div><input class="search-settings" id="settingsSearch" placeholder="Search settings" aria-label="Search settings"><nav id="nav"></nav>';
  const search = document.getElementById('settingsSearch');
  search.oninput = e => { state.filter = e.target.value; state.tab = 'mappings'; render(); };
  document.querySelector('.subheading').textContent = 'Metrics providers';
  document.querySelector('.close').hidden = false;
  document.querySelector('.footer').hidden = false;
}
function renderCluster() {
  initializeClusters();
  clusterUI.dirty = JSON.stringify(clusterModel()) !== JSON.stringify(JSON.parse(clusterUI.saved)[clusterUI.selected]);
  document.body.classList.add('cluster-view');
  if (!document.getElementById('workspaceChrome')) {
    document.body.insertAdjacentHTML('afterbegin', '<div id="workspaceChrome"><div class="ide-top"><span class="ide-search">'+icon('search')+'Search anything…<span>⌘ K</span></span><button class="ghost" id="openGrafanaSettings" aria-label="Open Grafana settings">'+icon('settings')+'</button></div><div class="ide-tabs"><span>'+icon('cube')+'Kubernetes</span><span class="active">'+icon('cube')+E(clusterUI.selected)+'</span></div></div>');
    document.body.insertAdjacentHTML('beforeend', '<div id="workspaceStatus"><span class="status-dot"></span>Kubernetes<span class="spacer"></span>Design preview · sample data</div>');
  }
  document.querySelector('.ide-tabs .active').innerHTML = icon('cube') + E(clusterUI.selected);
  document.getElementById('openGrafanaSettings').onclick = () => setGlobalView('connections');
  document.querySelector('aside').innerHTML = `<div class="cluster-nav-head"><button id="backToGrafana" class="ghost icon" aria-label="Back to Grafana settings"><span style="transform:rotate(180deg);display:flex">${icon('arrow')}</span></button><b>Cluster Settings</b><span class="spacer"></span><button id="clusterDiscard" class="ghost icon" aria-label="Discard cluster changes" ${clusterUI.dirty?'':'hidden'}>${icon('close')}</button><button id="clusterSave" class="primary icon" aria-label="Save cluster changes" ${clusterUI.dirty?'':'hidden'}>${icon('check')}</button></div><div class="cluster-card-wrap"><div class="cluster-identity"><div class="cluster-avatar">${icon('cube')}</div><div><select id="clusterSelect" aria-label="Cluster connection">${Object.keys(clusterModels).map(n=>`<option ${n===clusterUI.selected?'selected':''}>${n}</option>`).join('')}</select><span class="cluster-connected"><i></i>Connected</span></div></div></div><nav class="cluster-native-nav"><div class="group">General</div>${['Identity','Tags','Cluster Info','Connection'].map(n=>`<div class="cluster-nav-item">${n}</div>`).join('')}<div class="group">Configuration</div><button class="selected" id="metricsSection">Metrics</button><div class="cluster-nav-item">Node Shell</div></nav>`;
  document.getElementById('backToGrafana').onclick = () => setGlobalView();
  document.getElementById('clusterSelect').onchange = e => { clusterUI.selected = e.target.value; clusterUI.open = null; clusterUI.filter = ''; renderCluster(); };
  document.getElementById('clusterSave').onclick = () => { const saved = JSON.parse(clusterUI.saved); saved[clusterUI.selected] = structuredClone(clusterModel()); clusterUI.saved = JSON.stringify(saved); clusterUI.dirty = false; renderCluster(); toast('Cluster metrics saved in preview'); };
  document.getElementById('clusterDiscard').onclick = () => { clusterModels[clusterUI.selected] = JSON.parse(clusterUI.saved)[clusterUI.selected]; clusterUI.dirty = false; clusterUI.open = null; renderCluster(); };
  document.querySelector('h1').innerHTML = icon('prometheus')+'Metrics';
  document.querySelector('.subheading').textContent = clusterUI.selected;
  document.querySelector('.close').hidden = true;
  document.getElementById('tabs').innerHTML = '';
  document.getElementById('top').innerHTML = '';
  document.querySelector('.footer').hidden = true;
  renderClusterBody();
}
function renderClusterBody() {
  const c = clusterModel(), p = providerByID(c.provider);
  const source = p.sources.find(s => s.uid === c.datasource);
  const overrides = Object.keys(c.overrides).length;
  document.getElementById('body').innerHTML = `<div class="cluster-content"><section class="cluster-provider"><div class="cluster-provider-title">${icon(c.mode==='grafana'?'grafana':'cube')}<strong>Metrics provider</strong><span class="spacer"></span><span class="badge">This connection</span><select id="clusterMode" aria-label="Metrics provider"><option value="grafana" ${c.mode==='grafana'?'selected':''}>Grafana</option><option value="native" ${c.mode==='native'?'selected':''}>Native Kubernetes</option></select></div>${c.mode==='grafana'?`<div class="cluster-provider-fields"><div><label for="providerConnection">Grafana connection</label><select id="providerConnection">${providerCatalog.map(v=>`<option value="${v.id}" ${c.provider===v.id?'selected':''}>${v.id}</option>`).join('')}</select><small>${E(p.host)}</small></div><div><label for="providerDatasource">Data source</label><select id="providerDatasource">${p.sources.filter(v=>v.kind==='prometheus').map(s=>`<option value="${s.uid}" ${c.datasource===s.uid?'selected':''}>${s.name}</option>`).join('')}</select><small>${icon('prometheus')}Prometheus <span>UID: ${E(c.datasource)}</span></small></div><div><label for="clusterPolicy">Use for</label><select id="clusterPolicy">${['Replace mapped metrics','Supplement native metrics'].map(s=>`<option ${c.policy===s?'selected':''}>${s}</option>`).join('')}</select></div><div><label for="clusterScope">Cluster label value</label><input id="clusterScope" value="${E(c.scope)}"><small><code>connection.metricsCluster</code></small></div></div><div class="cluster-provider-foot">${icon('shield')}Read-only<span class="spacer"></span><button class="ghost" id="manageGlobalConnections">${icon('external')}Manage Grafana connections</button></div>`:nativeControls()}</section>${c.mode==='grafana'?`<div class="cluster-mapping-head"><b>Metric mappings <span class="count">${metrics.length}</span></b><span class="badge ${overrides?'changed':''}">${overrides?overrides+' cluster override'+(overrides===1?'':'s'):'All inherited'}</span><span class="spacer"></span><button class="ghost" id="globalMappings">${icon('external')}Global mappings</button></div><div class="cluster-filter"><input id="clusterFilter" placeholder="Search mappings…" aria-label="Search cluster mappings" value="${E(clusterUI.filter)}"><span class="quiet">${E(source?.name||'')} · Global defaults + cluster overrides</span></div><div id="clusterMappingRows"></div>`:''}</div>`;
  document.getElementById('clusterMode').onchange = e => { c.mode = e.target.value; markClusterDirty(); renderCluster(); };
  if (c.mode === 'grafana') {
    document.getElementById('providerConnection').innerHTML = availableProviders().map(v => `<option value="${E(v.id)}" ${c.provider===v.id?'selected':''}>${E(v.id)}</option>`).join('');
    document.getElementById('providerConnection').onchange = e => { c.provider = e.target.value; c.datasource = providerByID(c.provider).sources.find(s=>s.kind==='prometheus').uid; markClusterDirty(); renderCluster(); };
    document.getElementById('providerDatasource').onchange = e => { c.datasource = e.target.value; markClusterDirty(); renderCluster(); };
    document.getElementById('clusterPolicy').onchange = e => { c.policy = e.target.value; markClusterDirty(); };
    document.getElementById('clusterScope').oninput = e => { c.scope = e.target.value; markClusterDirty(); };
    document.getElementById('manageGlobalConnections').onclick = () => setGlobalView('connections');
    document.getElementById('globalMappings').onclick = () => setGlobalView('mappings');
    document.getElementById('clusterFilter').oninput = e => { clusterUI.filter = e.target.value; renderClusterRows(); };
    renderClusterRows();
  } else bindNativeControls();
}
function markClusterDirty() {
  clusterUI.dirty = JSON.stringify(clusterModel()) !== JSON.stringify(JSON.parse(clusterUI.saved)[clusterUI.selected]);
  document.getElementById('clusterSave').hidden = !clusterUI.dirty;
  document.getElementById('clusterDiscard').hidden = !clusterUI.dirty;
}
function renderClusterRows() {
  const c = clusterModel();
  document.getElementById('clusterMappingRows').innerHTML = metrics.filter(m => `${m.name} ${m.resource} ${effectiveMetric(m.id)}`.toLowerCase().includes(clusterUI.filter.toLowerCase())).map(m => {
    const override = c.overrides[m.id], open = clusterUI.open === m.id;
    return `<article class="mapping ${open?'expanded':''}"><div class="row"><button class="toggle" data-cluster-expand="${m.id}" aria-label="Edit cluster ${E(m.name)} ${m.resource}">${icon(open?'down':'chevron')}</button><span class="ref">${String.fromCharCode(65+m.id)}</span><b>${E(m.name)}</b><span class="resource">${m.resource}</span><span class="badge">${m.unit}</span><span class="spacer"></span><span class="badge ${override?'changed':''}">${override?'Cluster override':'Inherited'}</span><button class="ghost cluster-override-button" data-cluster-expand="${m.id}">${override?'Edit override':'Override'}</button></div>${open?`<div class="editor"><div class="editorbar"><b>${override?'Cluster override':'Inherited from global'}</b><span class="quiet">${E(clusterUI.selected)}</span><span class="spacer"></span>${override?'<button class="ghost" id="resetClusterOverride">'+icon('refresh')+'Reset to global</button>':''}</div><div class="codebox"><pre id="clusterHighlight" aria-hidden="true">${syntax(effectiveMetric(m.id))}</pre><textarea id="clusterCode" aria-label="Cluster PromQL override" spellcheck="false">${E(effectiveMetric(m.id))}</textarea></div><div class="options"><label>Response identity label <input id="clusterJoin" value="${E(override?.join||'pod')}" style="width:110px;height:25px"></label><span class="spacer"></span><span>${icon('cube')}Only ${E(clusterUI.selected)}</span></div></div>`:`<div class="query-preview">${syntax(effectiveMetric(m.id))}</div>`}</article>`;
  }).join('');
  document.querySelectorAll('[data-cluster-expand]').forEach(b => b.onclick = () => { const id = Number(b.dataset.clusterExpand); clusterUI.open = clusterUI.open === id ? null : id; renderClusterRows(); });
  if (clusterUI.open !== null && document.getElementById('clusterCode')) {
    const id = clusterUI.open, editor = document.getElementById('clusterCode');
    editor.oninput = () => { c.overrides[id] = { query: editor.value, join: document.getElementById('clusterJoin').value }; document.getElementById('clusterHighlight').innerHTML = syntax(editor.value); markClusterDirty(); reflectClusterOverride(id); };
    document.getElementById('clusterJoin').oninput = e => { c.overrides[id] = { query: editor.value, join: e.target.value }; markClusterDirty(); reflectClusterOverride(id); };
    document.getElementById('resetClusterOverride')?.addEventListener('click', () => { delete c.overrides[id]; markClusterDirty(); renderClusterBody(); });
  }
}
function reflectClusterOverride(id) {
  const article = document.getElementById('clusterCode').closest('article');
  const badge = article.querySelector('.row > .badge:last-of-type');
  badge.textContent = 'Cluster override'; badge.classList.add('changed');
  article.querySelector('.cluster-override-button').textContent = 'Edit override';
  article.querySelector('.editorbar > b').textContent = 'Cluster override';
  const count = Object.keys(clusterModel().overrides).length;
  document.querySelector('.cluster-mapping-head > .badge').textContent = `${count} cluster override${count===1?'':'s'}`;
  if (!document.getElementById('resetClusterOverride')) {
    article.querySelector('.editorbar').insertAdjacentHTML('beforeend', '<button class="ghost" id="resetClusterOverride">'+icon('refresh')+'Reset to global</button>');
    document.getElementById('resetClusterOverride').onclick = () => { delete clusterModel().overrides[id]; markClusterDirty(); renderClusterBody(); };
  }
}
function nativeControls() { return `<div class="native-settings"><div class="native-source">${icon('cube')}metrics-server<span class="health">Native</span><span class="spacer"></span><span class="quiet">Current CPU & memory</span></div><div class="native-fields"><b>${icon('prometheus')}Prometheus Configuration</b><div class="cluster-provider-fields"><div><label>Service name</label><input id="nativeService" placeholder="Auto-detect"></div><div><label>Namespace</label><input id="nativeNamespace" placeholder="monitoring"></div><div><label>Port</label><input id="nativePort" placeholder="9090"></div></div><button id="testNative" class="ghost">${icon('refresh')}Test connection</button><span id="nativeResult" class="quiet"></span></div></div>`; }
function bindNativeControls() { document.getElementById('testNative').onclick = () => { document.getElementById('nativeResult').textContent = 'Native provider check · sample data'; }; }
function globalDataSources() {
  return `<div class="connection-toolbar"><strong>Data sources</strong><span class="quiet">Prometheus-compatible</span></div>${availableProviders().map(p=>`<section class="datasource-group"><div class="datasource-group-title">${icon('grafana')}<b>${E(p.id)}</b><span class="quiet">${E(p.host)}</span></div>${p.sources.map(s=>`<div class="datasource-row">${icon('prometheus')}<b>${E(s.name)}</b><code>${E(s.uid)}</code><span class="spacer"></span><span class="badge">${s.kind}</span></div>`).join('')}</section>`).join('')}`;
}
window.__clusterMock = { models: clusterModels, ui: clusterUI, providers: providerCatalog, effectiveMetric };
