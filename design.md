# DRA resource editor mock — issue 283

Review candidate, not approved or production code. Approved #249 isolated interactive HTML workflow. No named mock skill available. Reviewed known prototype using web-design-guidelines skill and fetched upstream rules. Semantic HTML approximates base-ui Input, Select, Button, Tabs, Dialog, Alert and Table; no package install or production changes.

## Coverage and manifest ownership

| Component | Workflow | Control → exact path |
|---|---|---|
| DeviceClass v1, cluster | Create; mutable spec edit; name locked on edit | Name → metadata.name; CEL → spec.selectors[0].cel.expression; optional extended resource name → spec.extendedResourceName (DRAExtendedResource prerequisite) |
| ResourceClaimTemplate v1, namespace | Create requests; edit spec locked | Name/namespace → metadata; request name → spec.spec.devices.requests[i].name; class → .exactly.deviceClassName; allocation choice → .exactly.allocationMode; positive count → .exactly.count. Seed generated label → spec.metadata.labels.team. Entire spec immutable. |
| ResourceClaim standalone v1, namespace | Conditional user-authored create; existing spec immutable | Same request controls at spec.devices.requests[i]. Name/namespace → metadata. All branch omits count. FirstAvailable branch replaces exactly with firstAvailable[0] (name=preferred); multi-alternative source-only. |
| DeviceTaintRule v1alpha3, cluster | Alpha gated create/edit | Target no devices omits spec.deviceSelector; all devices emits {}; selected controls → spec.deviceSelector.driver/pool/device. Key/value/effect → spec.taint.key/value/effect. NoExecute consequence visible and repeated at review. timeAdded server-managed; status read-only. |
| ResourceSlice v1, cluster | Inspect only | Driver → spec.driver; pool/generation/count → spec.pool.name/generation/resourceSliceCount; device and capacity → spec.devices[].name/capacity. Driver-owned inventory, incomplete pool fixture (1 observed, 2 expected). No create/edit/status action. Driver, pool name, nodeName immutable by API. |
| ResourceClaim template-generated v1, namespace | Inspect only | metadata.ownerReferences → Pod owner reference; status.allocation/reservedFor/devices read-only boundaries. No ordinary spec edit or allocation button. Template/workload changes affect future generated claims. |

Additional API fields remain source-only: DeviceClass spec.config[].opaque.driver/parameters; selectors[1+]; claims constraints[].requests/matchAttribute, config[].requests/opaque, per-request selectors and gated adminAccess/tolerations/capacity; template labels/annotations. Driver-specific opaque schemas never become guessed forms. Tombstoned DeviceTaintRule selector class/CEL fields are not offered. No ResourcePoolStatusRequest: absent from pinned registrations/routes.

## Source and version evidence

- https://github.com/kubernetes/api/blob/v0.35.0/resource/v1/types.go — request union, count rules, immutable claim/template specs, mutable class, inventory ownership.
- https://github.com/kubernetes/api/blob/v0.35.0/resource/v1alpha3/types.go — taint selector omission versus empty, effects, conditions.
- https://github.com/kubernetes/api/blob/v0.35.0/resource/v1alpha3/register.go — only DeviceTaintRule and list registered.
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/registry/resource/rest/storage_resource.go — baseline four kinds in v1/v1beta1/v1beta2; alpha taint /status. Registration is not feature/authorization proof.
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/features/kube_features.go#L1244-L1246 — DRADeviceTaints prerequisite; issue snapshot specifies default-off. Attempt to fetch separate versioned_kube_features.go returned 404; no claim of independently verified versioned-default table.
- https://github.com/omniviewdev/omniview/issues/249 and plugin PR72/74 — compact frame, leaf-preserving production editor reference. This prototype does not claim production AST behavior.

## Interaction proof and safety

21 real browser captures: class; accessible help; template create/edit; invalid claim; All branch; review; immutable claim; broad NoExecute taint/review; inventory; generated claim; denied/missing/unavailable/gate/empty states; advanced; exact source fallback; source; narrow layout. 1440×900 CSS at DPR1.25 yields 1800×1125 images. Narrow 680×760 verified horizontal fit and visible footer. Help Escape restores focus. Add/remove, typed request fields, class references, count validation, section/mode changes and source preservation exercised. Browser fixture never connects to Kubernetes.

All screenshots visually inspected, including standalone inspection of contact-sheet failed image loads. Contact sheet is review aid only, not publication asset. No raw sensitive content exists in published captures. checks.json contains booleans and filenames only.

## Honest limits and review decisions

Source editor accepts YAML-compatible JSON; arbitrary source edits are kept verbatim and disable form projection. This preserves edited text, not a YAML AST round-trip. No claims for comments, huge integers, unknown siblings or scalar-type preservation through form patches. Unsupported/invalid text remains available without rewrite. Form-generated count currently uses JS Number; production must use exact scalar AST handling and API validation. Source review only checks JSON syntax, not Kubernetes schemas or CEL.

Guided controls deliberately cover common requests; complex configurations use honest source fallback, not complete guided schema coverage. Seed template label is read-only. FirstAvailable has one demonstration alternative; arbitrary ordered lists remain source-only. No fake controller health or allocation success. Inspect source is a minimal identity projection, not a fetched full driver/owner manifest. Availability blocks review; local draft controls remain editable. No persistent mode preference, draft, credentials or cookies are used by prototype. Production must persist explicit mode preference only and protect source identity/immutable paths. Footer stays visible; dense request row may require future stacked controls at very narrow widths.

Native DRA forms belong in Kubernetes built-in provider, with resource capability/ownership checks before selection. Driver-specific opaque configuration belongs to registered driver/add-on provider, not hardcoded vendor fields. No new base-ui primitive proposed: composed labeled controls suffice; source AST and discovery capability logic belong above base-ui. No approval, implementation, issue closure or release implied.
