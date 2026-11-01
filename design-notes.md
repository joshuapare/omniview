# RuntimeClass mock · issue 282

Design only. Native Kubernetes plugin owns this node.k8s.io/v1 form. No extension provider, dependency release, live mutation or mock approval is claimed.

## API and ownership
Pinned Kubernetes v1.35.0 / modules v0.35.0. RuntimeClass is cluster-scoped, stable v1 since 1.20. Administrator or cluster provisioner defines it. Handler names depend on node CRI configuration; schema/discovery does not prove node support. No namespace or status editor. Only handler and metadata identity are immutable here; overhead and scheduling are editable subject to authorization/admission. Provisioner ownership means inspect and route to owning configuration, never automatically overwrite.

Sources:
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L73020-L73741 (extracted node.v1 definitions in api-snapshot.json)
- https://github.com/kubernetes/api/blob/v0.35.0/node/v1/types.go
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/apis/node/validation/validation.go
- https://github.com/omniviewdev/omniview/issues/249
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74

## Exact field mapping
| Control | Owned path | Intent |
|---|---|---|
| Name | metadata.name | Required DNS subdomain; create only |
| Handler | handler | Required DNS label, lowercase, maximum 63 characters; create only |
| CPU / Memory quantity strings | overhead.podFixed.cpu / overhead.podFixed.memory | Measured fixed per-Pod overhead; blank omitted, no guessed defaults |
| Required node label rows | scheduling.nodeSelector[key] | AND equality; merged with Pod selector; conflict rejects Pod admission |
| Taint key | scheduling.tolerations[i].key | Empty only with Exists |
| Equal / Exists | scheduling.tolerations[i].operator | Exists omits value; branch draft retained in memory |
| Taint value | scheduling.tolerations[i].value | Only Equal emits value |
| Effect | scheduling.tolerations[i].effect | Blank omitted means all effects |
| Seconds | scheduling.tolerations[i].tolerationSeconds | Integer only for NoExecute; blank omitted means forever |
| Metadata labels | metadata.labels[key] | Not node selection |
| YAML | Exact raw source | Manual edits are retained byte-for-byte; guided patch/review blocked |

No inferred handler picker: API does not advertise configured CRI handlers. No fabricated node match count. No annotations displayed or captured. Custom resource overhead, annotations, unknown keys, alternate API versions and arbitrary valid quantities remain source-only. No object import or credential handling exists.

## UX and composition
1000×700 frame, 32px controls, 13px text, 20×24 padding, 180px navigation, visible destination/footer. Faithful standalone HTML composition, not shipped React. Reuse production Dialog, FormField/Input, Select, Tooltip/Popover, Table or EditableList, Button and existing Monaco editor. No new base-ui primitive required. Quantity parsing and resource rules stay in native adapter. Help opens on hover/focus/click; Escape dismisses help and restores anchor focus. Dialog cycles Tab. Review never submits or claims success.

## Browser evidence
16 final PNG states, 1440×900 CSS viewport @1.25 except narrow 760×650 @1.25. Dedicated Chrome profile used after shared-profile capture timeouts; no profile files published. All captures visually reviewed through contact sheet and scheduling full-size. Real clicks, typing, native selects, add/remove, help focus/Escape, mode switches, source edits and retry exercised. checks.json contains booleans and screenshot filenames only. No state injection drove captures. Synthetic previews only.

## Honest limits and review decisions
- No YAML AST parser installed in this isolated prototype. Generated fields share one draft; after ANY manual YAML edit, Form and Review deliberately stop. Invalid/unsupported source, comments and integer 9007199254740993 remain exact. Production must reuse existing lossless AST adapter rather than this bounded generator.
- Quantity validation demonstrates common nonnegative decimal/unit syntax, not complete Kubernetes quantity grammar. Label rows demonstrate unique nonempty keys, not complete API label validation. No server validation claimed.
- No node discovery is needed for freeform label/handler authoring; installed runtime support remains unverified. Capability scenarios distinguish missing API, denied create, and discovery unavailable. Retry is explicitly a fixture operation, not a live request.
- In-memory drafts only; localStorage contains explicit mode preference only. Scenario switch intentionally opens another fixture draft, not a production navigation promise.
- Existing arbitrary metadata/unknown fields require source-only import until production AST integration. No lossless round-trip claim for manual source.
- Standard modal close/dirty discard integration, server revision checks and full schema validation belong to production implementation; this mock keeps frame open and performs no writes.
- Reviewed known index.html using web-design-guidelines skill and freshly fetched guideline source. Native labelled controls, visible focus, reduced-motion-safe static UI, safe overflow and footer are present. HTML help buttons are composition demonstrations; production should use shared tooltip/popover ARIA wiring and actual dialog lifecycle.

Open locally with a static HTTP server; no install/build required. Select scenarios above frame. No executable workload defaults or companion resources exist.
