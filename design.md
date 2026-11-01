# Authorization request tools — issue 276

Design mock only. All four components are covered; no persisted Create/Edit, list, watch, delete, patch, or status editor exists. Kubernetes plugin owns this built-in native adapter. No external provider installation is required. Real discovery and endpoint-specific POST authorization remain prerequisites; schema presence does not prove either.

## Sources

- Kubernetes v1.35.0 [pinned OpenAPI](https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L52288-L52686). Relevant definitions are saved in api-snapshot.json.
- [k8s.io/api v0.35.0 authorization/v1 types](https://github.com/kubernetes/api/blob/v0.35.0/authorization/v1/types.go).
- Approved frame and workflow: [249](https://github.com/omniviewdev/omniview/issues/249), plugin [72](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72), [74](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74).

## Component boundaries

| Component | Task / endpoint | Subject and scope |
|---|---|---|
| SubjectAccessReview | POST /apis/authorization.k8s.io/v1/subjectaccessreviews | Explicit supplied identity; cluster endpoint, resource namespace optional |
| LocalSubjectAccessReview | POST /apis/authorization.k8s.io/v1/namespaces/{namespace}/localsubjectaccessreviews | Explicit supplied identity; action resourceAttributes.namespace equals endpoint namespace. No non-resource branch |
| SelfSubjectAccessReview | POST /apis/authorization.k8s.io/v1/selfsubjectaccessreviews | Current authenticated identity; no user/groups/uid/extra controls |
| SelfSubjectRulesReview | POST /apis/authorization.k8s.io/v1/selfsubjectrulesreviews | Current identity; cluster endpoint with required spec.namespace |

No identity lookup, impersonation, permission grant, or actual resource action occurs. Blank groups are not inferred from username. Empty action namespace means all namespaces for namespaced resources and no namespace for cluster-scoped resources. No stored identity means no immutable object ID; revise request then review again. All status fields are server-owned.

## Exact control mapping

| Control | Request path | Boundary |
|---|---|---|
| Resource / URL branch | spec.resourceAttributes XOR spec.nonResourceAttributes | Branch drafts retained in memory; only selected branch projected |
| Namespace, API verb, group, version, resource plural, subresource, resource name | spec.resourceAttributes.{namespace,verb,group,version,resource,subresource,name} | Empty optional values omitted; core group empty; wildcard strings stay explicit |
| URL path, HTTP verb | spec.nonResourceAttributes.{path,verb} | Path starts with slash; not a resource verb |
| Subject, UID | spec.{user,uid} | Password inputs; projection redacts, self kinds forbid |
| Add/remove group row | spec.groups[i] | Password input; no membership lookup |
| Add/remove attribute value row | spec.extra[key][i] | Repeated keys mean array values; key and value masked; no credential import |
| Raw field/label selector | spec.resourceAttributes.{fieldSelector,labelSelector}.rawSelector | Can limit, never broaden access; structured requirements unsupported by Form |
| Source-only selector requirements | …{fieldSelector,labelSelector}.requirements[] {key,operator,values[]} | Unsupported-source boundary, not silently converted; rawSelector and requirements must not coexist |
| Effective rules namespace | spec.namespace | Required even though endpoint is cluster-scoped |
| Decision / reason / evaluation error | status.{allowed,denied,reason,evaluationError} | Inspect only. Both false means no opinion. allowed=true can coexist with evaluationError; allowed and denied cannot both be true |
| Resource rules table | status.resourceRules[].{verbs,apiGroups,resources,resourceNames} | Read-only; omitted/empty resourceNames means all; wildcards retained |
| Non-resource rules table | status.nonResourceRules[].{verbs,nonResourceURLs} | Read-only; URL glob semantics not inferred as arbitrary regex |
| Incomplete warning / evaluation error | status.{incomplete,evaluationError} | Show even when rules exist. Never authorize from this list; missing rule does not prove denied |

## Source, safety and reuse

Source textarea is an isolated mock, not Monaco or shipped React. Self-review YAML supports exact raw retention: any manual edit locks Form rather than claiming AST round trips. Unknown comments, exact large numeric spelling, and invalid syntax stay verbatim in the demonstrated self-review path. Identity-bearing reviews expose a separate read-only redacted projection, never a request source. No raw identity source import/reveal exists. Structured selectors and arbitrary imported identity documents require the production source adapter, not normalization by this mock. No generic CRUD fallback is offered for these POST-only kinds.

Use existing Dialog, FormField, Input, Select/Combobox, Button, Collapsible, Table, Tooltip/Popover and resource editor frame. HTML faithfully composes the approved 1000×700 / 32px / 13px / 20×24px frame. Production uses semantic base-ui tokens, existing focus trap and Monaco. No new base-ui primitive proposed. Resource-specific discriminated requests, selector validation, masking, and status interpretation stay outside base-ui.

## Browser evidence

All captures use real browser typing, selection, click, add/remove, focus and Escape. Corrected captures use dedicated Chrome profile and explicit viewport setup before each screenshot. Main captures are 1440×900 CSS at device scale 1.25 (1800×1125 PNG); narrow capture is 760×650 at 1.25. Each screenshot was visually inspected in a contact sheet; 19 additionally inspected directly. Boolean checks describe mock interactions only, not production API tests.

01 initial self; 02 required validation and focus; 03 advanced resource selector; 04 non-mutating review; 05 no opinion; 06 allowed plus evaluation error; 07 URL union; 08 masked subject/group composition; 09 namespaced local boundary; 10 redacted source; 11 rules request; 12 incomplete rules; 13 empty resource rules; 14 denied/unavailable/missing/loading; 15 unsupported Form boundary; 16 exact invalid-source retention; 17 on-demand help; 18 narrow footer; 19 masked extra attributes.

## Limits and review decisions

Fixture responses are explicitly independent from request drafts. No API call, permission determination, or status success is claimed. Empty-rules fixture has no resource rules but retains a non-resource rule, so it is not an assertion of zero permissions. Mock fields are bounded, with no server schema validation or real discovery lookup. Mode preference is not persisted in this isolated request tool. Selecting another kind resets the manually edited source; Form controls share in-memory task fields, not four stored objects. Draft retention is claimed only across sections/modes within one selected kind. Production should retain per-request source when changing kinds with confirmation. Prototype has no opener/close lifecycle or full modal focus trap; production must reuse existing Dialog behavior. These are honest mock limits, not shipped behavior. No builds, repository tests or live cluster actions ran.

Visual review used web-design-guidelines skill and fetched its actual source. Fixed add/remove focus by reopening the identity details. Remaining production integration decisions: identity-safe source access and selector requirement editor ownership. No mock approval requested by changing checkboxes; issue remains open for design review.
