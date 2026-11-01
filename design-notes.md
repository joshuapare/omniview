# External metrics inspection — issue 293

Design proposal, not production code or approval. Covers the sole unchecked component: ExternalMetricValue, external.metrics.k8s.io/v1beta1. ExternalMetricValueList is its response envelope, not another authored resource.

## Sources and ownership

Pinned baseline Kubernetes 1.35.0 / metrics v0.35.0:
- https://github.com/kubernetes/metrics/blob/v0.35.0/pkg/apis/external_metrics/v1beta1/register.go
- https://github.com/kubernetes/metrics/blob/v0.35.0/pkg/apis/external_metrics/v1beta1/types.go
- https://github.com/kubernetes/metrics/blob/v0.35.0/pkg/client/external_metrics/client.go

The client performs GET against a namespaced metric-name path with ListOptions.labelSelector. An optional aggregated adapter serves this API; schema registration does not install it or grant authorization. Values belong to the adapter. No metadata.name, spec, status, ordinary create/edit/delete, server-side apply, or HPA mutation belongs here. Namespace scopes the request; it does not assert that an external time series physically belongs to a namespace. No Kubernetes-object selector exists in this external API.

## Field-to-control mapping

| Field or request location | Control | Ownership |
|---|---|---|
| GET /apis/external.metrics.k8s.io/v1beta1/namespaces/{namespace}/{metricName} | Namespace selector + discovered metric selector | Query draft only; never manifest metadata |
| ListOptions.labelSelector / URL labelSelector | Repeatable equality key/value rows, AND-composed and URL-encoded | Request filtering only; no metricLabels writes |
| items[i].metricName | Selected metric context; source | Adapter output, read-only |
| items[i].metricLabels | Series-label table | Adapter output; full label set identifies a series with metricName |
| items[i].timestamp | Produced-at timestamp | Adapter output; no fabricated freshness threshold |
| items[i].window | Window seconds / Not supplied | Optional int64; preserve omission; zero would mean instantaneous, not missing |
| items[i].value | Exact quantity code cell | Keep quantity string, no floating-point conversion; 12500m is not a universal unit |
| apiVersion, kind, metadata, items and unknown response fields | Read-only original fixture JSON | Source is inspection only, never a mutation source |

## Interaction and safety

1000×700 compact modal; 32px controls; 13px text; 180px navigation; 20×24px content padding. Destination remains visible in footer. Query → review → fixture response → read-only source share in-memory query state. There is no authored YAML mode and therefore no bidirectional YAML preservation claim. No storage APIs, credentials, config imports or cluster clients exist.

Required metric validation focuses the selector. Add/remove filter rows retain unedited sibling input. Review shows encoded GET and destination with explicit no-mutation consequence. Loading, missing API, 403, 503, unsupported version and empty series have distinct states. Missing/loading/unsupported disable fixture execution. Denied/unavailable retain inputs. Help opens on hover, focus or click; Escape dismisses help before the native modal; close restores opener focus. Native dialog supplies focus containment. All visible actions use buttons and labeled controls.

## Reuse and provider boundary

Faithful isolated HTML composition, not shipped React. Production should compose existing Dialog, FormField/Input/Select or Combobox, Button, Table, Tooltip/Popover, and source editor. No new base-ui primitive proposed. Generic host owns dialog/capability states; Kubernetes metrics inspector owns version, endpoint and quantity semantics. Adapter-specific metric catalogs may use extension providers; do not hardcode vendor configuration or install adapters. Existing #249 and merged plugin PR72/74 frame conventions are references, not redesigned workloads.

Visual review used the installed web-design-guidelines skill and its fetched source. Known visual limits: native fixture selector truncates its long state name, while each status appears fully in main content; native dialog shows a thin outer scrollbar. Screenshot 09 proves 760×720 footer fit; smaller widths not verified.

## Browser evidence and limits

13 reviewed screenshots: 12 at 1440×900 CSS pixels, DPR 1.25 (1800×1125 PNG), one at 760×720, DPR 1.25. Real clicks, selects, typing, add/remove rows, focus and Escape drove state. checks.json contains named booleans and screenshot filenames only. No browser errors recorded in successful dedicated capture run. Initial shared browser capture timed out; dedicated owned Chrome succeeded. No repository builds/tests/lint ran.

Prototype uses fixed synthetic responses. It does not execute selectors, authorize users, discover real adapters, evaluate quantities, validate full selector grammar, prove controller health, or verify autoscaling. Equality controls demonstrate a common request subset; full Kubernetes selector expressions require a production advanced request editor. Unknown arbitrary response bytes are not exercised; fixture JSON source is generated once and then read-only. No editable source claim, production round-trip claim, live action, mock approval or shipped feature is implied.

## Capture captions

01 Initial query: explicit namespace and no guessed metric.
02 Validation: missing metric, actionable error and focus.
03 Review: encoded read-only request with destination and consequence.
04 Values: multiple series, exact quantity and omitted window.
05 Source: read-only ExternalMetricValueList JSON.
06 Help: accessible contextual explanation, not a main-view wall.
07-loading: discovery pending.
07-missing: optional API absent.
07-denied: authorization denied, not an empty result.
07-unavailable: adapter error with draft retained.
07-unsupported: version boundary without conversion.
08 Empty: no matching series.
09 Narrow: 760×720 footer and request wrapping.
