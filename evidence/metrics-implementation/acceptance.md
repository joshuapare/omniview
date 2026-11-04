# Actual metrics source-cohort acceptance

Real Wails host, in-tree Grafana provider, Grafana 12.2.0 Viewer gateway, Prometheus 3.0.0, and isolated K3s with 24 Pending Pods. No native metrics-server or in-cluster Prometheus. Two source contexts share one physical fixture API; they are not two physical clusters.

| Scenario | Observed result | Upstream queries |
|---|---|---:|
|24 Pods CPU+memory|48 values; actual table paints numeric millicores/Mi|2 instant|
|Late matching sidebar/Metrics tab|Values reused beyond5-second detached-cache retention|0 extra|
|Additional network metric|Actual B/s value and history chart; no CPU/memory refetch|1 instant + 1 range|
|Object-label identity mismatch|23 OK, 1 missing; never zero|1|
|Lowercase object-field transform|24 OK|1|
|Same datasource UID across 2 provider connections|4 OK from each, distinct provenance|2 total|
|Forged/cross-Pod/omitted known incarnation|RESET_REQUIRED; matching identity succeeds|0 for 3 negative calls|

Actual global inheritance, explicit override stability, Reset+Save, and unsaved draft isolation passed. Global definitions and both fixture bindings were restored. Both smoke-a and smoke-b gateways were exercised. Direct Prometheus used trusted tailnet HTTPS. Invalid gateway credential was rejected without queries. Cold restart preserved provider connections. Native selection remained explicit; absent native backend produced an error, not external fallback or zero.

Checks: SDK full suite; scoped host race tests; runtime typecheck + 8 tests; Kubernetes typecheck + 59 tests. Standalone Go builds use the published SDK pin after CLI overlays are removed.

Limits: source-cohort evidence, not published release. A transient native catalog acquisition timeout used its existing 30-second failure cache; explicit source retry recovered views. Initial stall not identified; no lifetime/deadline/cache-policy changes. Pod recreation was not performed; actual negative calls changed incarnation tokens. Source-stream regressions cover replacement and conflicting observations.

## Published source revisions

- Host: `d153a8a724f98c8999e8e29ba820ab0382ed3c66`
- Kubernetes: `98c3a50fccaec1ee04b308392fa7c32c383fe316`
- SDK: `e391d4f586e26f9dec12a5c81079ba81a3b05eb3`

These changes are in source PRs, not merged or released artifacts. Kubernetes registry publication depends on the compatible host/npm release.
