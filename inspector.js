// Fixture rendering only; never a transport or production adapter.
const renderInspector = draw;
draw = function () {
  const originalUID = uid;
  uid = uid.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  renderInspector();
  uid = originalUID;
  if ($('#uid')) { $('#uid').value = uid; $('#uid').setAttribute('aria-describedby', 'uiderror'); validate(); }
  if (op === 'CONNECT' && !review && version !== 'vNext') {
    if (tab === 'request') {
      document.querySelectorAll('.field').forEach(field => {
        const label = field.querySelector('label')?.textContent;
        if (label === 'Object Kind') field.querySelector('.value').textContent = 'core / v1 / Pod';
        if (label === 'Resource') field.querySelector('.value').textContent = 'core / v1 / pods';
      });
    }
    if (tab === 'source') $('pre').textContent = $('pre').textContent.replace('group: apps, version: v1, kind: Deployment', 'group: "", version: v1, kind: Pod').replace('group: apps, version: v1, resource: deployments', 'group: "", version: v1, resource: pods');
  }
  if (version === 'vNext') $('#review').hidden = true;
};
$('#help').setAttribute('aria-describedby', 'tip');
draw();
