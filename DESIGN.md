# Crossplane protection — issue 323 design

Review proposal only. No production implementation, cluster connection, mutation, controller-health claim, or mock approval.

## Coverage

All four issue components: manual Usage create/edit, manual ClusterUsage create/edit, generated Usage inspection/ownership handoff, generated ClusterUsage inspection/ownership handoff. Duplicated kinds are ownership cases, not distinct APIs. Both serve `protection.crossplane.io/v1beta1`. Usage is namespaced; ClusterUsage is cluster-scoped. This is not legacy `apiextensions.crossplane.io/Usage`.

## Pinned sources

Crossplane v2.0.0 resolves to `b639502e2f93680ff83417a0f517ec459ce079cc`.

- [Usage CRD](https://github.com/crossplane/crossplane/blob/b639502e2f93680ff83417a0f517ec459ce079cc/cluster/crds/protection.crossplane.io_usages.yaml)
- [ClusterUsage CRD](https://github.com/crossplane/crossplane/blob/b639502e2f93680ff83417a0f517ec459ce079cc/cluster/crds/protection.crossplane.io_clusterusages.yaml)
- [Deletion admission boundary](https://github.com/crossplane/crossplane/blob/b639502e2f93680ff83417a0f517ec459ce079cc/internal/webhook/protection/usage/handler.go)
- [Beta usages feature](https://github.com/crossplane/crossplane/blob/b639502e2f93680ff83417a0f517ec459ce079cc/internal/features/features.go)
- [Approved frame and capture workflow](https://github.com/omniviewdev/omniview/issues/249), merged plugin PR72 and PR74 read as references.

The requested versioned documentation URL redirects to latest v2.4. Latest docs were contextual only; pinned CRDs and source govern this proposal. Do not infer the latest provider-deletion-protection flag exists in v2.0.0. Installation needs matching CRDs, enabled Usage support, controller and deletion webhook configuration, actual discovery verbs, RBAC, and admission. Schema discovery alone proves none of these.

## Exact mapping

| Control | Owned manifest path | Boundary |
|---|---|---|
| Relationship name | `metadata.name` | Required; identity locked in edit |
| Destination namespace | `metadata.namespace` | Usage only; locked in edit; no namespace on ClusterUsage |
| Used resource type | `spec.of.apiVersion`, `spec.of.kind` | Fixture: ConfigMap/v1 or Provider/pkg.crossplane.io/v1; arbitrary GVK retained through source |
| Used named picker | `spec.of.resourceRef.name` | Block deletion of this resource |
| Used namespace override | `spec.of.resourceRef.namespace` or `spec.of.resourceSelector.namespace` | Usage only; omit for same namespace; requires `by` for cross-namespace |
| Dependency purpose | Presence of `spec.by` | Reason-only omits `by`; dependency includes using resource |
| Using resource type | `spec.by.apiVersion`, `spec.by.kind` | Fixture: Deployment/apps/v1 or Configuration/pkg.crossplane.io/v1 |
| Using named picker | `spec.by.resourceRef.name` | No namespace property on `by`; same Usage namespace or cluster scope |
| Selection branch | `spec.of.resourceRef` versus `.resourceSelector`; same for `by` | Reference wins if both already exist; never silently delete either from imported source |
| Selector rows | `spec.{of,by}.resourceSelector.matchLabels[key]` | Add/remove explicit map entries; fixture shares one label draft, not production independent selectors |
| Match controller | `spec.{of,by}.resourceSelector.matchControllerRef` | True only when selected; false omitted |
| Protection reason | `spec.reason` | Required by guided reason-only branch; schema requires presence of `by` or `reason` |
| Replay deletion | `spec.replayDeletion` | True explicitly; untouched false omitted; consequential warning and review |
| Ownership inspector | `metadata.ownerReferences` | Read-only integration context; no mutation |
| Conditions | `status.conditions[]` | Read-only; fixture unavailable, never invented Ready |
| Source | Complete document | Manual text preserved verbatim; not parsed or submitted |

Spec identity fields have no `oldSelf` immutability rule in these pinned CRDs. Do not falsely label the entire spec immutable. Production must protect controller-resolved references, controller metadata, owner references, revision conflicts, and managed-field ownership. Manual changes to relationship targets remove one protection and establish another, subject to actual admission. No delete/recreate shortcut.

## Safety and source contract

Manual authoring is conditional on ownership and discovered create/update rights. Generated relationships offer inspection and owner handoff review only. Owner handoff is descriptive integration boundary, not a pretend functioning link or controller action. Removal is not executed. Replay warns that removing a relationship may trigger deletion after a prior blocked attempt. Graph is proposed relationship, not evidence of actual enforcement.

One in-memory source draft backs bounded Form output. After any manual YAML edit, Form blocks rather than overwrite unsupported content. Exact comments, arbitrary integer digits, invalid text and unedited source remain intact across mode switches. This does NOT demonstrate editable YAML-to-Form AST round trips. Raw review is textual and unvalidated; it never implies an accepted API payload. Production must reuse existing owned-path AST draft service, not this string generator. Only explicit mock mode preference persists; resource drafts never persist. No credential values, imports, annotations, or secrets appear in fixtures.

## Frame, reuse and review

Faithful isolated HTML composition, not shipped React. 1000×700 frame, 32px controls, 13px body, 20×24px content padding, 16px gaps, persistent destination/footer. Internal scrolling handles overflow. Hover/focus/click help; Escape dismisses help. Missing API, denied lookup, empty lookup, and unavailable lookup remain distinct.

Reuse approved base-ui Dialog, FormField, Input, Select/Combobox, Checkbox, Table, Button, SegmentedControl, Tooltip/Popover and existing source editor. Dependency graph is adapter-owned read-only composition, not a base-ui graph proposal. No new primitive or shared release required. Crossplane add-on editor provider should own resource rules; no ecosystem hardcoding into Kubernetes plugin. Existing extension-provider contract can select exact GVK and ownership capability.

Reviewed owned prototype with installed `web-design-guidelines` skill and fetched current guideline source. Native controls have labels, keyboard behavior, explicit focus rings, dark native select styling and visible errors. No animation. Production Dialog must supply full focus trap, close confirmation, opener restoration and tooltip placement; this prototype intentionally has no close/navigation workflow. This is a known runtime/accessibility limit, not production-ready dialog code.

## Evidence

`checks.json` records booleans and screenshot names only. Driver uses actual typing/selects/clicks/keyboard and isolated Chrome profile. 20 original captures plus one ClusterUsage edit capture = 21 screenshots. Main captures use viewport 1440×900, scale 1.25; narrow capture uses 700×780, scale 1.25. All captures visually inspected via contact sheet, with final narrow and cluster edit inspected full size. Initial narrow Chromium resize capture showed compositor tiling; replaced with fresh fixed-size isolated context and GPU disabled. No raw sensitive views were created.

Observed checks: required validation, help Escape, non-mutating review, identity lock, label add/remove, unsupported Form block, exact raw and invalid source retention, generated disabled controls, narrow no horizontal overflow, footer visibility, zero runtime errors, and only mode preference persisted.

Limits: fixed fixture GVK pairs and one shared selector row draft; no real references, arbitrary GVK combobox, controller resolution, API validation, metadata editor, server conflict flow or live operations. Source fallback preserves these inputs without claiming guided representation. No repository builds/tests/lint/formatters run. Browser evidence proves mock interactions only.

## Screenshot captions

01 Usage blank manual authoring; 02 required error; 03 on-demand help; 04 namespaced dependency with explicit used namespace; 05 replay consequence; 06 non-mutating review; 07 manual Usage edit identity lock; 08 cluster-scoped authoring; 09 selector rows and controller matching; 10 exact source text; 11 unsupported Form fallback; 12 generated Usage inspection; 13 ownership boundary; 14 generated ClusterUsage inspection; 15 owner handoff preview; 16-denied/empty/unavailable/missing distinct capability states; 17 narrow internal scroll/footer; 18 manual ClusterUsage edit.
