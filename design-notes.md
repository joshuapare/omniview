# Coordination editors — #281

Design proposal awaiting review. Isolated HTML composition, not shipped React. Uses approved #249 workflow; no named mock skill was available. Visual review used web-design-guidelines and its current upstream command.md. No production source, dependency, cluster or cloud changes.

## Scope and ownership

All three unchecked components have distinct interfaces:

1. **Lease / explicit application ownership**: conditional guided create/edit. Namespace-scoped `coordination.k8s.io/v1`. Explicit ownership acknowledgement is required for local review. Production must independently establish the application's coordination contract, discovered version, requested verb, authorization and current object revision. A checkbox is not authorization. No owner reference or managed-field record alone proves exclusive ownership. Name and namespace lock in edit; no LeaseSpec field is schema-immutable, but writer-owned fields remain inappropriate for generic edits.
2. **Lease / heartbeat or election**: read-only holder, renewal, acquisition, duration, transition and coordinated-strategy inspection. No ordinary Create, Edit, Delete, takeover or renew action. No freshness, elected-health or controller-readiness conclusion. The election fixture represents the same writer-owned boundary as node heartbeat records; it is not a separate resource kind.
3. **LeaseCandidate / gated**: namespace-scoped read-only election participant inspection. `v1beta1` and `v1alpha2` are distinct served-version fixtures, not interchangeable assumptions. CoordinatedLeaderElection is Beta and default false in Kubernetes v1.35. Enabled gate, enabled API serving, permissions, candidate writer and coordinator operation remain separate prerequisites. `spec.leaseName` is immutable. Participants own renewals; coordinator owns ping requests. No manual ping, renew or forced-election action.

Native Kubernetes adapter owns these semantics. No third-party provider or new base-ui primitive is required. Unknown versions retain source inspection rather than a guessed form. No status editor: these resources have spec records, not an invented status workflow.

## Exact field → control → path map

| Field | Guided control / inspector | Owned manifest path and boundary |
|---|---|---|
| Version/kind | Fixed GVK destination | `apiVersion`, `kind`; not form-editable |
| Name | Text input; locked in edit | `metadata.name`; Lease DNS subdomain; server validation remains authoritative |
| Namespace | Text destination; locked in edit | `metadata.namespace`; explicit preview fixture destination |
| Application ownership | Required acknowledgement + accessible help | UI eligibility only; writes no annotation, owner reference or manifest field |
| Holder | Optional text input / read-only value | `spec.holderIdentity`; coordinated holder must equal elected candidate metadata.name |
| Takeover wait | Optional integer text input, seconds | `spec.leaseDurationSeconds`; positive int32, blank removes field; no guessed initial duration |
| Acquisition | Advanced RFC3339 UTC text input / inspector | `spec.acquireTime`, MicroTime; blank omits |
| Renewal | Advanced RFC3339 UTC text input / inspector | `spec.renewTime`, MicroTime; blank omits; no running renewal process |
| Transitions | Advanced nonnegative integer text input / inspector | `spec.leaseTransitions`; nonnegative int32, blank omits, zero distinct |
| Strategy | Source-only on app draft; inspection elsewhere | `spec.strategy`; gated. Built-in `OldestEmulationVersion` plus permitted qualified custom strategies must not be normalized to one guessed enum |
| Preferred holder | Source-only / read-only value; fixture omitted | `spec.preferredHolder`; only meaningful with strategy; not a force-takeover control |
| Candidate lease reference | Read-only same-namespace name | `spec.leaseName`; immutable after create; reference display does not claim target exists |
| Binary version | Read-only semantic version | `spec.binaryVersion`; required, no leading v |
| Emulation version | Read-only semantic version | `spec.emulationVersion`; <= binaryVersion, required for OldestEmulationVersion |
| Candidate ping | Read-only timestamp | `spec.pingTime`; coordinator request, not an end-user action |
| Candidate renewal | Read-only timestamp | `spec.renewTime`; participant response |
| Labels, annotations, owner references, managed fields, unknown content | Unsupported source retained; no generic ownership rewrite | Never inferred from acknowledgement. No annotation values occur in fixtures or captures. Production source/diff projections must redact all annotation values before capture |
| UID/resourceVersion/server metadata | Not authoring controls | Preserve fetched baseline/revision during actual contextual update; no mock network save |

## Interaction and source contract

1000×700 frame, 32px fields, 13px body, 20×24px content padding, 16px column gaps. Internal scrolling and persistent footer. Main view contains labels, short safety consequences and errors, not explanatory walls. Ownership help opens by hover/focus/click; Escape dismisses help and retains help-button focus. Native keyboard inputs/selects/details work without pointer-only gestures.

One in-memory string is the source draft. Guided changes patch the bounded fixture's individual lines. Source modes preserve its comment, untouched string scalar `9007199254740993`, unedited siblings and explicit optional omission. **This is not a general YAML AST implementation.** Any manual source edit locks Form and review, preserving the exact raw string, including invalid content. No parser falsely claims safe round trips. No arbitrary-source import or raw sensitive capture exists. Production should reuse the shipped AST patcher, not this bounded string patcher.

Only explicit Form/YAML preference persists in `mock-281-mode`. Drafts and fixture edits never persist. Changing inspection sections retains the application draft. Reopening/reloading discards that draft, while preference remains. No create/update/delete requests exist. Review is local and non-mutating; no success toast or simulated API success.

No add/remove participant editing exists: participant membership is writer-owned. Optional timing/counter fields support clear-to-omit, not placeholder values. Strategy/preferred holder intentionally require advanced source knowledge and verified coordination prerequisites.

## Reuse evidence

Read installed `kubernetes/ui/src/components/kubernetes/manifest/ResourceFormFields.tsx:1-74`: existing `Button`, `Input.Root/Control`, `Select`, `Help`, `Field`, `Choice`, `Section`; `WorkloadForm.tsx:66-85` demonstrates leaf patching and integer BigInt/omission. Preserve existing editor/frame and installed tooltip/portal, segmented mode, collapsible, table and error conventions in production. HTML uses faithful isolated composition and palette literals; production must use semantic tokens. No new generic date/time, ownership, election or Kubernetes mega-control is proposed.

## Captures and browser evidence

All desktop PNG captures use real Chromium at 1440×900 CSS pixels, scale 1.25 (1800×1125 pixels). Narrow capture uses 660×740 CSS, scale 1.25. Every screenshot was visually reviewed. Actual typing, checkbox, section/mode clicks, details expansion, focus/help/Escape, read-only identity checks, malformed-source entry, optional clear, select changes and retry drove states. No state injection or raw sensitive observation occurred. Browser runtime errors: none. Named checks are booleans only, with screenshot filenames.

- `01-application-create.png`: initial authoring eligibility and no guessed holder/duration.
- `02-local-validation.png`: ownership and required-name errors.
- `03-ownership-help.png`: populated create, expanded timing and keyboard-focused ownership help.
- `04-nonmutating-review.png`: destination and disruption consequence.
- `05-application-edit.png`: name/namespace locked.
- `06-source-draft.png`: one supported source, comment and exact quoted scalar.
- `07-unsupported-source.png`: manual invalid YAML retained; no destructive conversion.
- `08-heartbeat-election-inspect.png`: holder/renewal ownership boundary.
- `08b-heartbeat-source.png`: read-only actual fixture source.
- `09-candidate-inspect.png`: participant/version/timing fields and gate boundary.
- `09b-candidate-source.png`: read-only candidate source.
- `10-missing.png`: API not served, distinct from denial.
- `10-denied.png`: authorization failure, no object values.
- `10-unavailable.png`: discovery failure with fixture retry.
- `10-empty.png`: valid empty list, no inference about controllers.
- `10-alpha.png`: explicit v1alpha2 fallback.
- `11-narrow-inspect.png`: internal scroll, no page overflow, footer stays visible.

Default shared-browser captures timed out and changed viewport unexpectedly. Closed only this worker's shared tab, then captured successfully in a dedicated Chrome process/profile inside this issue directory. No profile/cache/cookie files are published.

## Pinned primary sources

- [OpenAPI v1.35.0](https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L60400-L62991): LeaseSpec and v1beta1/v1alpha2 LeaseCandidateSpec, preserved in source-snapshot.json.
- [Feature gate history](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/features/kube_features.go): genericfeatures.CoordinatedLeaderElection is Alpha/default false from 1.31; Beta/default false from 1.33.
- [Lease v1 types](https://github.com/kubernetes/kubernetes/blob/v1.35.0/staging/src/k8s.io/api/coordination/v1/types.go): pointer omission and coordinated holder semantics.
- [Candidate v1beta1 types](https://github.com/kubernetes/kubernetes/blob/v1.35.0/staging/src/k8s.io/api/coordination/v1beta1/types.go): immutable reference, required versions and participant protocol.
- [Validation](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/apis/coordination/validation/validation.go): positive duration, nonnegative transitions, custom strategy validation, preferred-holder dependency, candidate version checks and immutable leaseName.
- [Lease strategy](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/registry/coordination/lease/strategy.go) and [candidate strategy](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/registry/coordination/leasecandidate/strategy.go): both namespace-scoped and revision-sensitive; gated field dropping is not proof of support.
- Approved frame/workflow: [#249](https://github.com/omniviewdev/omniview/issues/249), [PR72](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72), [PR74](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74).

## Honest limits / review decisions

No host plugin mount, server validation, live discovery/RBAC, controller health, clock-skew/expiry inference, watch updates, conflict resolution or mutations were exercised. Local name/time checks are bounded illustrations, not exhaustive Kubernetes validation. Production must use the existing dialog's focus trap, close/dirty-confirm and opener restoration; this isolated prototype has no close lifecycle. Arbitrary manually edited YAML intentionally never returns to editable Form. Ownership eligibility policy and permitted application contracts require design review. No API schema alone establishes the right to edit a running coordinator's data. These limits do not hide any assigned component; all three have working local, capture-backed designs. Issue remains open for review.
