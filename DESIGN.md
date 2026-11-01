# Crossplane resource editor mock · issue 320

Interactive standalone HTML composition, not shipped React/base-ui. Approved #249 workflow; no named mock skill installed. Reviewed using web-design-guidelines and its fetched source. All fixtures are synthetic. Serve this directory using a static HTTP server and open index.html. No dependencies, network APIs, credentials, persistence, or mutation endpoints.

## Source qualification
Pinned API: https://github.com/crossplane/crossplane/tree/v2.0.0/cluster/crds
- https://github.com/crossplane/crossplane/blob/v2.0.0/cluster/crds/apiextensions.crossplane.io_compositeresourcedefinitions.yaml (blob 3e34b2fe6e6dcc364d2c23c9e55e2001f2a0bb73)
- https://github.com/crossplane/crossplane/blob/v2.0.0/cluster/crds/apiextensions.crossplane.io_compositionrevisions.yaml (blob 69f026ccd652d8dedebd516076afcd5a9870fdf0)
- https://github.com/crossplane/crossplane/blob/v2.0.0/cluster/crds/apiextensions.crossplane.io_compositions.yaml (blob 3bfe167e7157cdb70eafbc63240a3649d08a3f1f)
- https://github.com/crossplane/crossplane/blob/v2.0.0/cluster/crds/apiextensions.crossplane.io_environmentconfigs.yaml (blob 6e5fdb7603815c67781d4405bb627cde29441c23)
- https://github.com/crossplane/crossplane/blob/v2.0.0/cluster/crds/apiextensions.crossplane.io_managedresourceactivationpolicies.yaml (blob 73a4eced799a91a50b5b26a3c3a4514ef7af2e7a)
- https://github.com/crossplane/crossplane/blob/v2.0.0/cluster/crds/apiextensions.crossplane.io_managedresourcedefinitions.yaml (blob a4f119fa234757a3350c9e93cfe51f51aba5f8cf)
- https://github.com/crossplane/crossplane/blob/v2.0.0/cluster/crds/apiextensions.crossplane.io_usages.yaml (blob c3b6afe5c31eec110802a1efe73ceec957bd6966)

All seven CRDs are cluster-scoped. This does not imply composite instances are cluster-scoped. XRD uses v2, with Namespaced or Cluster composites. Deprecated v1 supports LegacyCluster; legacy claims/connection-secret keys are not supported in v2. These deprecated paths remain unsupported-source fallback, not a fabricated v2 control. Composition/CompositionRevision use v1; EnvironmentConfig v1beta1; MRAP/MRD v1alpha1; legacy Usage v1beta1 (also served deprecated v1alpha1). Discovery, controller installation, feature flags, admission and RBAC must be established separately. MRD requires provider installation and managed-resource activation support. Legacy Usage requires discovery plus appropriate protection controller. No controller health is inferred.

## Field → control → ownership
|Component|Controls and exact manifest paths|Mode and boundary|
|---|---|---|
|Common authoring|Name input → metadata.name; cluster destination shown outside manifest|Create and edit; name locked on edit; no namespace field|
|CompositeResourceDefinition|Group → spec.group; Kind/Plural → spec.names.kind/plural; scope selector → spec.scope; version → spec.versions[0].name; toggles → served/referenceable; schema fragment → spec.versions[0].schema.openAPIV3Schema; Manual/Automatic → spec.defaultCompositionUpdatePolicy|Create/edit. group, names, scope immutable. spec.enforcedCompositionRef immutable when set. Definition changes can change generated APIs. Additional versions and conversion stay expert source. No implicit claim/secret|
|Composition|Type inputs → spec.compositeTypeRef.apiVersion/kind; step rows → spec.pipeline[*].step; function reference fixture selector → spec.pipeline[*].functionRef.name; add/remove → spec.pipeline|Create/edit; type reference immutable. spec.mode is Pipeline only. One to 99 unique steps required by schema. Function installation/health unresolved. input, credentials, requirements and writeConnectionSecretsToNamespace remain expert source|
|EnvironmentConfig|Typed scalar rows → data.region (string), data.replicas (number), data.featureEnabled (boolean); Add Key → data.keyN|Create/edit. data is top-level, not spec.data. Nested objects, arrays and null use source. Environment config does not create or select a function automatically|
|ManagedResourceActivationPolicy|Name/prefix rows → spec.activate[*]; add/remove|Create/edit; at least one activation. Prefix wildcard supported, not regex. No discovered matches or inferred deactivation. status.activated and status.conditions read-only|
|Usage|Target inputs → spec.of.apiVersion/kind/resourceRef.name; reason → spec.reason; replay checkbox → spec.replayDeletion; Add Using Resource → spec.by.apiVersion/kind/resourceRef.name, then source|Conditional legacy create/edit. of required; by or reason required. resourceSelector.matchLabels/matchControllerRef expert source. Deletion protection and replay consequence visible. No target resolution|
|CompositionRevision|Owner, spec.revision, spec.compositeTypeRef, spec.pipeline inspection; owner link opens Composition fixture|Generated snapshot inspection only. No Create, spec/status edit or deletion. Revision update policy belongs to XRD/XR, not revision|
|ManagedResourceDefinition|ProviderRevision owner; spec.group/names/scope/versions/state inspect; Draft Activation Policy opens MRAP fixture|Provider-generated inspection only. Immutable group/names/scope; spec.state may move Inactive→Active, never Active→Inactive. No direct toggle or fabricated success|

## Expert-source limits
JSON is a valid YAML subset. This prototype parses JSON only. Invalid YAML and unsupported shapes remain byte-for-byte in source and block form projection; it does not claim general YAML/comment parsing. Leaf patches retain untouched bytes, demonstrated with an unknown large numeric token and scalar string. Array add/remove replaces the owned array; schema editing replaces only the schema subtree; Add Using Resource replaces owned spec object. These operations do not promise untouched formatting inside the replaced subtree. Source changes are never persisted. Explicit mode stays in memory only. Source is not an admission validator, permission proof, immutable-field bypass fix, or sensitive-data redaction system. Do not import real or synthetic secret material. Production must reuse existing AST editor, redacted projection, source validation, focus/error handling, mode preference and permission infrastructure. No raw sensitive values exist in supplied fixtures/captures.

## Reuse and extension ownership
Crossplane add-on form provider should own these semantics under #263, not host Kubernetes hardcoding. Compose existing Input, Select, Checkbox, Button, Tooltip/Popover, Tabs, Dialog, CodeEditor, reference picker and repeatable rows from base-ui. Native HTML mirrors semantic controls here; no base-ui package was imported. No new base-ui primitive proposed. Pipeline semantics, XRD schema and activation matching stay in Crossplane provider. Existing #249 shared editor must supply YAML AST preservation, secret masking, focus trap, source-only fallback and permission gating in implementation.

## Evidence and visual review
1440×900 CSS viewport with 1.25 DPR produces 1800×1125 images. Native browser viewport initially ignored requested options; raw page.setViewport fixed it and dimensions were measured. Narrow check at 700×900: no document horizontal overflow; footer fits. Every screenshot was visually inspected in contact sheets; review also inspected full-sized XRD consequence view. Inputs, selects, add/remove, source toggles, invalid/unsupported source, immutable controls, help click/keyboard Escape, owner/action navigation and availability branches were exercised. No repository build/tests/lint ran.

Known review gaps: standalone mock has native confirm discard dialogs; browser wrapper auto-dismissed some discard prompts, so later resource runs used fresh isolated tabs rather than claiming successful discard acceptance. Help uses click or keyboard activation, not hover. Validation is local illustrative coverage, not full CRD/CEL validation. Source optional fields remain expert controls rather than exhaustive guided widgets. Fixture function choices are not discovery. Production source immutability and permission enforcement remain required. No live API operations or claims of approval.

## Captures
- 01-xrd-create.png
- 02-xrd-edit.png
- 03-xrd-help.png
- 04-xrd-schema.png
- 05-source.png
- 06-invalid-source.png
- 07-validation.png
- 08-xrd-review.png
- 09-composition-pipeline.png
- 10-composition-review.png
- 11-environment-data.png
- 12-environment-review.png
- 13-activation-patterns.png
- 14-activation-review.png
- 15-legacy-usage.png
- 16-usage-review.png
- 17-generated-revision.png
- 18-managed-definition.png
- 19-api-missing.png
- 19-discovery-unavailable.png
- 19-no-references.png
- 19-permission-denied.png
- 20-advanced.png
- 21-narrow.png
- 22-composition-edit.png
- 23-edit-EnvironmentConfig.png
- 23-edit-ManagedResourceActivationPolicy.png
- 23-edit-Usage.png
- 24-unsupported-shape.png
