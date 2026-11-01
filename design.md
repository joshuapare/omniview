# Scheduling resource editors — issue 274

Design only. Isolated HTML composition, not shipped React. Synthetic preview-cluster / preview fixtures. No live connections or mutations. Followed approved #249 workflow, not a named mock skill. Reviewed known prototype against web-design-guidelines and its fetched primary guidelines.

## Coverage and owned fields

| Resource / control | Manifest path | Boundary |
|---|---|---|
| Both: name | metadata.name | DNS subdomain; locked in edit |
| Workload namespace | metadata.namespace | Fixed preview destination in mock; namespaced API |
| PriorityClass integer | value | int32, user maximum 1000000000; immutable |
| Preemption selector | preemptionPolicy | omitted / Never / PreemptLowerPriority; immutable |
| Global-default checkbox | globalDefault | false omitted for new mock drafts; mutable; affects future classless Pods |
| Description | description | optional string; mutable |
| Controller selector | spec.controllerRef.apiGroup, .kind, .name | optional same-namespace typed reference; immutable once set; not ownerReferences |
| Group name / add / remove | spec.podGroups[i].name | 1–8 groups; unique DNS labels; entire array immutable after creation |
| Basic policy | spec.podGroups[i].policy.basic: {} | Exactly one policy branch |
| Gang policy + minimum | spec.podGroups[i].policy.gang.minCount | Positive int32; GangScheduling required; inactive minimum draft preserved |
| Manual source | exact source text | Any manual edit locks Form; invalid text, comments, exact large integers remain verbatim |

PriorityClass scheduling.k8s.io/v1 is cluster-scoped. Workload scheduling.k8s.io/v1alpha1 is namespaced and requires served API plus default-off GenericWorkload. GangScheduling separately defaults off and depends on GenericWorkload. Embedded PodGroup is not independently creatable. Native Kubernetes editor provider owns these forms; no third-party ownership registration is needed. Controller-owned objects inspect only; modify originating definition. PriorityClass system- identities remain reserved, and bootstrap system classes should inspect rather than encourage recreation.

## Shared composition

Compose existing Dialog, SegmentedControl, FormField, Input, NumberInput, Select/Combobox, TextArea, Tooltip/Popover, Table/repeatable rows and Buttons. No generic component proposal required. Keep policy unions, feature gates, typed references and validation in Kubernetes adapter. Mock uses faithful standalone HTML, fixed synthetic lookup choices, semantic-style dark colors and approved 1000×700 / 32px / 13px density. Production must use actual base-ui tokens/components and existing editor focus lifecycle.

## Source snapshot

- https://github.com/kubernetes/api/blob/v0.35.0/scheduling/v1alpha1/types.go — exact Workload/controller/embedded PodGroup shape, limits and immutability.
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/apis/scheduling/validation/validation.go — PriorityClass update restrictions and user bounds; Workload union/count/immutability validation.
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/registry/scheduling/rest/storage_scheduling.go — served storage and GenericWorkload gating; bootstrap classes.
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/features/kube_features.go — default-off gates, GangScheduling dependency.
- Approved frame/workflow: https://github.com/omniviewdev/omniview/issues/249 and plugin PR72 / PR74 linked there; Epic262 contract read.

## Capture captions

01 PriorityClass empty create; 02 required errors; 03 keyboard-accessible help; 04 global-default/preemption review; 05 immutable PriorityClass edit; 06 Workload Basic/Gang embedded rows; 07 Workload non-mutating review; 08 immutable Workload edit; 09 controller-owned inspect; 10 API missing; 11 mutation denied; 12 discovery unavailable; 13 GangScheduling disabled; 14 exact manual unsupported/invalid source; 15 safe Form fallback; 16 narrow frame/footer.

## Evidence and limits

Real isolated Chrome interactions drive captures at 1440×900, device scale 1.25; narrow capture uses 700×760. checks.json contains booleans and screenshot filenames. Source/branch preservation, errors, immutable controls, row removal, capability blocks and footer fit exercised. Captures visually reviewed. Shared browser screenshot calls timed out; dedicated installed Chrome via Playwright produced final evidence. No repo checks ran.

This mock deliberately does not claim bidirectional lossless YAML AST edits. Manual source remains editable, but Form and Review lock after edits. Production must reuse shipped AST draft handling to preserve unknown fields, omission, scalar types and unedited siblings. Prototype has no persistence at all, including mode preference; production should reuse explicit mode preference without persisting drafts. Metadata maps, arbitrary typed-reference input, lookup loading/empty/unresolved UI, managedFields conflicts, system bootstrap inspect fixture, full focus trapping and server validation are integration requirements, not demonstrated production behavior. No API discovery, RBAC, scheduler health or mutation result is real. Review cannot submit. Unsupported versions must retain source and avoid this pinned form. Approval remains pending.
