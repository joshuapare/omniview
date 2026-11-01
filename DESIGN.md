# Kyverno CEL policies — design review, not shipped support

Issue: https://github.com/omniviewdev/omniview/issues/328

Self-contained HTML composition. Open `index.html` locally in Chrome. No dependencies, network, API requests, credential import, or backend. All reference/destination data are synthetic. Policy kind and intent selectors are mock controls, not proposed extra production toolbar requirements.

## Grounding

- Read Epic #262, issue #328, approved #249 discussion and plugin PR72/PR74. Used the approved interactive mock workflow; no named mock-generation skill was available.
- Visual review used `/Users/joshuapare/.agents/skills/web-design-guidelines/SKILL.md` and its actual Vercel Web Interface Guidelines source. Reviewed this prototype for native labels, focus, keyboard access, field errors, dark selects, native dialog containment, compact sizing and overflow. Production must replace this isolated CSS composition with actual semantic tokens and installed components.
- Kyverno **v1.15.2**, resolved commit **f4ffc2d43d2d93b3daf3e5a9cb8a5d42738aba4b**. All six CRDs serve `policies.kyverno.io/v1alpha1`. These are alpha definitions, not later stable schemas.
- [Pinned CRD directory](https://github.com/kyverno/kyverno/tree/f4ffc2d43d2d93b3daf3e5a9cb8a5d42738aba4b/config/crds/policies.kyverno.io).
- Exact per-kind files: `policies.kyverno.io_validatingpolicies.yaml`, `_mutatingpolicies.yaml`, `_generatingpolicies.yaml`, `_deletingpolicies.yaml`, `_imagevalidatingpolicies.yaml`, `_policyexceptions.yaml` (each prefix `policies.kyverno.io`).
- [Pinned image expression precedent](https://github.com/kyverno/kyverno/blob/f4ffc2d43d2d93b3daf3e5a9cb8a5d42738aba4b/test/cli/test-image-validating-policy/sample-policy/policy.yaml). No embedded certificates or credentials from this example were copied into the prototype.

## Coverage and ownership

| Kind | Scope | Authoring design | Evidence |
|---|---|---|---|
| ValidatingPolicy | Cluster | Create/edit validation expression, message, enforcement action | 01–07, 23 |
| MutatingPolicy | Cluster | Create/edit ApplyConfiguration versus JSONPatch CEL; explicit existing-resource evaluation | 08–10 |
| GeneratingPolicy | Cluster | Create/edit CEL resource list; trigger existing, synchronization, downstream policy-deletion flag | 11–13 |
| DeletingPolicy | Cluster | Create/edit Cron schedule, propagation, required explicit deletion condition | 14–16 |
| ImageValidatingPolicy | Cluster | Create/edit image glob, Cosign keyless trust identity, verification expression and action | 17–19 |
| PolicyException | Namespaced | Create/edit policy reference kind/name and scoped exception condition | 20–22, 29 |

Recommend a **Kyverno add-on editor provider** owning these exact GVKs and version checks, not hardcoded OSS forms in the core Kubernetes plugin. Generic host handles discovery, verbs, permission, draft lifetime and fallback. Provider owns CEL context, schema paths and consequences. Availability assumes no controller health; installed schema alone never grants create or update.

Identity (`apiVersion`, `kind`, `metadata.name`, and exception namespace) locks on edit. No additional immutable spec fields were established by these CRD snapshots; production must inspect installed rules/admission and preserve unchanged data. Status, generated policy data and managedFields are read-only. GitOps-owned fixture intentionally blocks local authoring; do not force-apply or transfer ownership. Review does not create, update, synchronize, generate, verify images or delete anything.

## Field → control → owned path

All paths below are relative to the resource. The mock serializes only the demonstrated supported subset. It does not replace a production owned-path YAML AST adapter.

| Input | Control | Path |
|---|---|---|
| Name | String input; locked on edit | `metadata.name` |
| Exception namespace | String destination; locked on edit | `metadata.namespace` |
| Target group/version/plural/operation | Compact row editor with Add/Remove | `spec.matchConstraints.resourceRules[i].apiGroups[]`, `.apiVersions[]`, `.resources[]`, `.operations[]` |
| Variable name/expression | Repeatable paired CEL rows | `spec.variables[i].name`, `.expression` |
| Validation | CEL text editor | `spec.validations[0].expression` |
| Failure message | String input | `spec.validations[0].message`; blank omitted |
| Violation action | Select `Audit`, `Warn`, `Deny` | `spec.validationActions[]` |
| Mutation strategy | Discriminated select | `spec.mutations[0].patchType` |
| Apply expression | CEL text editor | `spec.mutations[0].applyConfiguration.expression` |
| JSONPatch expression | CEL text editor | `spec.mutations[0].jsonPatch.expression`; opposite branch omitted |
| Existing mutations | Explicit checkbox | `spec.evaluation.mutateExisting.enabled`; unchecked omitted |
| Generation expression | CEL list editor | `spec.generate[0].expression` |
| Existing generation | Checkbox | `spec.evaluation.generateExisting.enabled` |
| Synchronize | Checkbox with visible overwrite warning | `spec.evaluation.synchronize.enabled` |
| Downstream orphan flag | Checkbox | `spec.evaluation.orphanDownstreamOnPolicyDelete.enabled` |
| Deletion schedule | Cron string | `spec.schedule` |
| Dependent handling | Foreground/Background/Orphan select | `spec.deletionPropagationPolicy` |
| Deletion condition | CEL text editor | `spec.conditions[0].name` = `delete-scope`, `.expression` |
| Image glob | Glob input | `spec.matchImageReferences[0].glob` |
| Attestor name | String | `spec.attestors[0].name` |
| OIDC issuer/subject | Exact-match trust identity inputs | `spec.attestors[0].cosign.keyless.identities[0].issuer`, `.subject` |
| Image verification expression | CEL editor | `spec.validations[0].expression` |
| Exception policy kind/name | Kind select plus unresolved reference text | `spec.policyRefs[0].kind`, `.name` |
| Exception condition | CEL text editor | `spec.matchConditions[0].name` = `exception-scope`, `.expression` |

PolicyException here is **not** `kyverno.io/PolicyException`. Namespace is a resource destination, not a fabricated expiration or guaranteed scope of policy effects. No expiry field is invented. Empty conditions can broaden bypass; mock conservatively requires one condition before review.

### Source-only advanced mapping

These are explicitly unsupported guided branches, retained by the raw-source fallback rather than silently normalized:

- Validation/image: `spec.auditAnnotations[]`, `.autogen`, `.evaluation`, `.failurePolicy`, `.matchConditions[]`, `.webhookConfiguration`, additional `.validations[]` and multi-action arrays.
- Mutation: `.autogen`, `.evaluation.admission`, `.failurePolicy`, `.matchConditions[]`, `.reinvocationPolicy`, `.targetMatchConstraints`, `.webhookConfiguration`, additional `.mutations[]`.
- Generation: `.evaluation.admission`, `.matchConditions[]`, `.webhookConfiguration`, additional `.generate[]`.
- Deletion: additional `.conditions[]`, `.variables[]`; schedule parsing and controller scheduling remain authoritative.
- Image: `.attestations[]`, Cosign key/certificate, Notary trust, regex identities/roots, `.credentials`, `.images[]`, `.matchImageReferences[].expression`, `.validationConfigurations.{mutateDigest,required,verifyDigest}`. Registry Secret names refer to the Kyverno namespace; resolved values must never be fetched for a reference picker. No certificate material is present in captures.
- Target matching: `matchConstraints.namespaceSelector`, `.objectSelector`, `.excludeResourceRules`, `.matchPolicy`, `.resourceRules[].scope`, multi-value rule arrays. Use typed selectors and scoped pickers in production; do not imply the current simple row editor is their implementation.
- Exception: additional `.policyRefs[]`, `.matchConditions[]`; no generic Kyverno rule-name or legacy exception match fields are inferred.

## UX and safety

1000×700 compact frame; 32px controls; 13px body; 20×24px content padding; 16px gaps; 180px navigation. Internal scrolling keeps actions and destination visible. Detailed CEL help opens on hover, focus or click. Escape dismisses help before dialog and restores help focus. Native dialog provides modal keyboard containment. Field errors stay visible, announce via role=alert and focus the relevant control. Consequences stay visible without relying on tooltips.

Create starts without executable expressions, resource names or target rules. `Audit` is an explicit mock design choice, not a claimed API default. No fixture expression is executed or type-checked. Review requires a name, expression, explicit target and relevant kind-specific fields. Local validation is intentionally narrower than API/CEL validation. Deletion, existing-resource mutation, synchronization, policy bypass and image denial have visible warnings.

Missing API, denied permission, lookup unavailable, successful empty lookup and unsupported version have distinct fixture states. Each disables Review. The empty state is a conservative authoring gate in this mock, not a universal rule for every policy kind. Draft data remain in memory. No successful mutation or controller status is fabricated.

### Source preservation boundary

Form → YAML shows the current supported draft. Returning without source edits retains fields. Any manual raw edit locks Form **and Review**; exact comments, invalid syntax and numeric spelling remain in the raw textarea. Switching kinds preserves separate in-memory raw drafts. Restore requires explicit discard confirmation. The source is never parsed or rebuilt after manual edits. This is an honest fallback, **not a lossless bidirectional YAML implementation**. Unknown fields/comments/omission preservation during subsequent form edits is a production requirement, not proven here.

Only explicit mode preference persists under `mock328-mode`. Names, source, trust details and other draft values never enter storage. Cancel confirms discarding all in-memory drafts. No raw sensitive view exists in the fixture; no credentials, PEM, annotations or Base64 credential values appear in evidence.

## Reuse

Compose existing base-ui Dialog, SegmentedControl, FormField, Input, Select, TextArea, Checkbox, Tooltip/Popover, Collapsible and compact row/list patterns. Use existing Monaco source editor in production. This prototype uses native HTML and isolated CSS, not shipped React/base-ui. No new generic primitive, base-ui release or CEL framework is proposed. CEL completion contexts and policy matching remain provider concerns. A production reference picker needs permission-aware unresolved/empty/loading handling, not a new Kubernetes-specific base-ui component.

## Browser proof and captions

`checks.json`: named booleans and screenshot filenames only. Real browser input/select/click/add/remove/focus/Escape drove states; no capture-state injection. Isolated Chrome profile lived only under this issue directory and is excluded from publication. 32 main captures use 1440×900 CSS pixels, DPR 1.25 (1800×1125 PNG); one narrow capture uses 700×760 at DPR 1.25. All screenshots visually inspected, including corrected image verification captures.

| Files | Caption |
|---|---|
| 01 | Empty validation authoring |
| 02 | Required-name error and focus |
| 03 | Explicit target after add/remove |
| 04 | Named CEL variable after add/remove |
| 05 | Keyboard-focus help |
| 06–07 | Non-mutating validation review and generated source |
| 08–10 | JSONPatch mutation, locked edit identity, review |
| 11–13 | Generation lifecycle controls, review, edit |
| 14–16 | Scheduled deletion consequences, review, edit |
| 17–19 | Cosign keyless identity, signature-verification expression, review/edit |
| 20–22 | Namespaced scoped exception, review/edit |
| 23 | Existing validation fixture identity lock |
| 24 | GitOps-owned inspect boundary |
| 25-* | Missing/denied/unavailable/empty/unsupported capability states |
| 26–27 | Unsafe-source Form lock and unchanged raw fallback |
| 28 | Narrow-window source and persistent footer |
| 29 | Exception identity/namespace edit lock |

## Honest limits and review decisions

- No real provider registration, cluster discovery, RBAC, controller installation, CEL compilation, server admission, reconciliation, signature verification, deletion, generation or production source patching was exercised.
- Guided controls cover the common branch for each of six kinds; advanced branches remain exact raw-source inspection/edit fallback with authoring review blocked. This is not a complete schema editor.
- The generation CRD's `orphanDownstreamOnPolicyDelete` description is confusingly worded relative to its name. The mock maps the named flag directly and makes no downstream deletion guarantee. Confirm controller semantics before production copy or save.
- Production review should replace the long JSON preview with a semantic change summary plus diff while retaining exact source. Current preview scrolls and never claims saved state.
- Production must preserve the existing approved lossless Form/YAML contract using the shared AST draft adapter rather than copying this bounded serializer.
- Trust configuration, deletion and exception authoring need permission-aware review by the relevant administrators. No approval is claimed. Issue remains open; checklist remains for human mock review.
