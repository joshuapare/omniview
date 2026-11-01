# Prometheus Operator editor design — issue 307

Design mock for review, not shipped React or an approved design. No named mock skill is installed. Uses approved #249 HTML interaction/capture workflow. Visual review used `/Users/joshuapare/.agents/skills/web-design-guidelines/SKILL.md` and its fetched Vercel guidelines. Faithful isolated HTML composition, not actual base-ui components.

## Sources and applicability

Pinned release v0.85.0 resolves through annotated tag `220134744a2821b84e2f187cb1ba15c753a29c25` to commit `2ed4172b180213b6082025237bb0c155b74b6080`.

Primary API reference: https://github.com/prometheus-operator/prometheus-operator/blob/2ed4172b180213b6082025237bb0c155b74b6080/Documentation/api-reference/api.md
CRDs: https://github.com/prometheus-operator/prometheus-operator/tree/2ed4172b180213b6082025237bb0c155b74b6080/example/prometheus-operator-crd
Common selectors and shard semantics: https://github.com/prometheus-operator/prometheus-operator/blob/2ed4172b180213b6082025237bb0c155b74b6080/pkg/apis/monitoring/v1/prometheus_types.go

Reference workflow: https://github.com/omniviewdev/omniview/issues/249 and plugin PR72/PR74. Epic262 and issue307 define scope. Snapshot API reference downloaded locally for research; upstream content is not republished.

All ten resources are namespaced. PrometheusAgent and ScrapeConfig use v1alpha1; AlertmanagerConfig uses v1beta1 in this design, with v1alpha1 retained as unsupported-source fallback. Other seven use v1. Presence of CRDs proves neither operator compatibility, authorization nor controller health. Agent DaemonSet mode requires the PrometheusAgentDaemonSet feature gate; this design does not expose that gated branch. Installed GVK, supported schema, actual verbs, ownership, and namespace availability must gate production authoring independently.

## Field → control → exact path

Identity uses text `metadata.name`, locks on edit, and destination `metadata.namespace: preview`. Prefix every path below with `spec.`. Each form patches its displayed paths only in the proposed production adapter. Mock serializes a bounded JSON-compatible YAML subset; it does not implement production AST editing.

| Resource | Controls and owned paths |
|---|---|
| Prometheus | Integer replicas → `replicas`; integer shards → `shards`; duration → `retention`; selector choice → `serviceMonitorSelector`; quantity string → `storage.volumeClaimTemplate.spec.resources.requests.storage`; URL → `remoteWrite[0].url` |
| PrometheusAgent | Integer replicas/shards → `replicas`, `shards`; URL → `remoteWrite[0].url`; selector → `serviceMonitorSelector`. No local rule or query controls |
| Alertmanager | Replicas → `replicas`; existing Secret name → `configSecret`; selector → `alertmanagerConfigSelector`; duration → `retention`; quantity → `storage.volumeClaimTemplate.spec.resources.requests.storage` |
| ThanosRuler | Replicas → `replicas`; query URL → `queryEndpoints[0]`; notification URL → `alertmanagersUrl[0]`; duration → `evaluationInterval`; selector → `ruleSelector` |
| ServiceMonitor | Service app label value → `selector.matchLabels.app`; named Service port → `endpoints[0].port`; path → `.path`; durations → `.interval`, `.scrapeTimeout` |
| PodMonitor | Pod app label value → `selector.matchLabels.app`; named container port → `podMetricsEndpoints[0].port`; path → `.path`; durations → `.interval`, `.scrapeTimeout` |
| Probe | Job text → `jobName`; existing prober host:port → `prober.url`; module → `module`; URL → `targets.staticConfig.static[0]`; duration → `interval` |
| PrometheusRule | Group name/interval → `groups[0].name`, `.interval`; Alert/Recording branch → `groups[0].rules[0].alert` OR `.record`; expression → `.expr`; pending duration → `.for` only for alert branch |
| AlertmanagerConfig | Receiver name → `receivers[0].name`; route receiver → `route.receiver`; group label → `route.groupBy[0]`; duration → `route.groupWait`; Secret reference → `receivers[0].webhookConfigs[0].urlSecret.name`, `.key` |
| ScrapeConfig | Job name → `jobName`; host:port → `staticConfigs[0].targets[0]`; path → `metricsPath`; explicit HTTP/HTTPS choice → `scheme`; durations → `scrapeInterval`, `scrapeTimeout` |

Relabel rows map source-label arrays, target label and action to ServiceMonitor `endpoints[0].relabelings`, PodMonitor `podMetricsEndpoints[0].relabelings`, Probe `targets.staticConfig.relabelingConfigs`, or ScrapeConfig `relabelings`. Other kinds require source-only advanced configuration. Add/remove and replacement serialization are demonstrated. Keep/drop action selection is a visual direction only, not fully serialized in this mock.

Selector choice distinguishes omitted versus `{}`. Selected-label example is fixed `matchLabels: {team: preview}`; editable arbitrary selector rows remain a production requirement, not demonstrated. Namespace selectors remain source-only; null means current namespace, empty means all namespaces. Monitor selector null means no objects. All four omitted Prometheus scrape selectors invoke deprecated unmanaged-configuration behavior, not a safe functioning collection preset. Create drafts intentionally start empty and are not deployable defaults.

## Lifecycle and safety

Create and edit use one compact 1000×700 frame, 32px fields, 13px text, 180px section rail, 20×24px content padding, 16px grid gaps. Fixture banner stays outside frame. Full source is JSON-compatible YAML 1.2, not a pretty YAML editor. Form changes and mode switches retain in-memory values. Any manual source edit retains exact text and locks Form. Comments, unknown fields, malformed documents, and exact large integers are demonstrated in this fallback, not parsed or normalized. No blanket lossless parser claim. Drafts and credentials never persist. Mode preference persistence is not implemented in this isolated mock.

All resources support proposed create/edit only after discovery, actual RBAC, schema, and ownership checks. Metadata identity locks on edit. Status, generated StatefulSets, generated configuration Secrets, selected targets, rules and monitor results are inspect-only integration boundaries. GitOps-managed or update-denied fixtures disable review. No automatic upstream-owner edits, delete/recreate, generated-workload changes, or health claims.

Review is a non-mutating draft preview. Shard changes do not redistribute historical data; storage and replica changes may roll Pods. Routes can redirect or silence notifications. Probe requires an existing blackbox exporter. No hidden controllers, Services, exporters, PVCs, credentials or external infrastructure are created by the prototype.

Secret references show synthetic names/key names only. No Secret bytes, passwords, tokens, PEM, Base64 or annotation values appear in captures. Credential lookup is not authentication testing. Full raw production imports would require a separate sensitive-document projection policy before capture; that import/reveal path is deliberately absent.

## Shared composition and provider ownership

Production reuse: Dialog, FormField, Input, NumberInput, Select/Combobox, Button, Table/EditableList composition, Collapsible, SegmentedControl, Tooltip/Popover and existing source editor. CSS values illustrate semantic base-ui surface, border, muted, accent and warning roles; no new package or production primitive was added. Existing composition suffices; no new generic base-ui component proposed.

Project-specific add-on provider should own monitoring.coreos.com schemas, discovery prerequisites, selectors, PromQL, routes and relabel serialization. Host owns frame, source lifecycle, fallback, privacy policy and mutation review contract. No hardcoded portfolio in Kubernetes plugin. Generic reference loading/empty/denied/unavailable/unsupported states remain distinct; fixture selects simulate them, not live authorization.

## Browser evidence

Each kind has its own populated edit capture. Shared create validation, typed create inputs, exact source fallback, row add/remove, relabel serialization, review, reference denied and integration, ownership block, and narrow fit have separate captures. Captures use real input and browser events, not injected draft state. Desktop files are 1800×1125 pixels: 1440×900 CSS at deviceScaleFactor 1.25. Narrow is 760×700 CSS at 1.25. Every capture was inspected in a browser contact sheet; Prometheus was also inspected full-size. All frames retain visible footer actions, without horizontal page overflow in exercised narrow state.

Help opens on focus/click/hover and Escape closes it with help-button focus restored. Detailed terminology stays on demand; consequences remain visible. No production code, tests, build, lint, formatter, live cluster or cloud action ran.

## Honest limits and review decisions

This is resource-specific interaction/design coverage, not complete schema coverage. Multiple endpoint/group/receiver/target authoring, arbitrary selectors, nested routes/matchers, all discovery integrations, full relabel action semantics, admission-quality validation, credential projection imports, focus-trap/opener lifecycle, persisted mode preference, conflict-aware updates and lossless supported source-to-Form round trips are not implemented. Unsupported source remains exact and cannot be silently rewritten through Form. Only resource-name presence receives local validation; valid manifest admission is explicitly unverified. Review source does not prove production submission correctness.

Mock acceptance remains open for user review. Do not close issue or mark review-dependent checkboxes. Production adapters must extend controls and safety checks before authoring can ship.
