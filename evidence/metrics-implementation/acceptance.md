# Actual metrics source-cohort acceptance

Real Wails host, in-tree Grafana provider, Grafana12.2.0 Viewer gateway, Prometheus3.0.0, and isolated K3s with24PendingPods. No native metrics-server or in-cluster Prometheus. Two source contexts share one physical fixture API; they are not two physical clusters.

| Scenario | Observed result | Upstream queries |
|---|---|---:|
|24Pods CPU+memory|48values; actual table paints numeric millicores/Mi|2instant|
|Late matching sidebar/Metrics tab|Values reused beyond5second detached-cache retention|0extra|
|Additional network metric|Actual B/s value and history chart; no CPU/memory refetch|1instant+1range|
|Object-label identity mismatch|23OK,1missing; never zero|1|
|Lowercase object-field transform|24OK|1|
|Same datasource UID across2provider connections|4OK from each, distinct provenance|2total|
|Forged/cross-Pod/omitted known incarnation|RESET_REQUIRED; matching identity succeeds|0for3negativecalls|

Actual global inheritance, explicit override stability, Reset+Save, and unsaved draft isolation passed. Global definitions and both fixture bindings were restored. Both smoke-a and smoke-b gateways were exercised. Direct Prometheus used trusted tailnet HTTPS. Invalid gateway credential was rejected without queries. Cold restart preserved provider connections. Native selection remained explicit; absent native backend produced an error, not external fallback or zero.

Checks: SDK full suite; scoped host race tests; runtime typecheck+8tests; Kubernetes typecheck+59tests. Standalone Go builds use the published SDK pin after CLI overlays are removed.

Limits: source-cohort evidence, not published release. A transient native catalog acquisition timeout used its existing30second failure cache; explicit source retry recovered views. Initial stall not identified; no lifetime/deadline/cache-policy changes. Pod recreation was not performed; actual negative calls changed incarnation tokens. Source-stream regressions cover replacement and conflicting observations.
