# External Secrets generator editors — issue 319

Interactive design proposal, not shipped code or approved mocks. Uses the approved #249 standalone HTML workflow. The named mock skill was unavailable. Reviewed known prototype using web-design-guidelines and its fetched rule source.

## API and ownership

Pinned External Secrets Operator v0.20.1 CRDs are included verbatim. All seventeen resources serve generators.external-secrets.io/v1alpha1. ClusterGenerator is cluster-scoped; sixteen kinds are namespaced. The pinned schemas contain no field-level immutability validation; resource identity remains immutable on edit. Admission, controller policy, installation flags, permissions and field managers may add restrictions. Discovery does not prove support or permission. No status editor.

GeneratorState is controller-managed. resource is the generator snapshot used for cleanup, state is opaque controller data, and garbageCollectionDeadline can affect deletion. The inspect view withholds both payloads and does not offer ordinary create/edit/delete. Owner-managed instances of every authorable kind use the same inspect boundary.

ClusterGenerator requires one generator member matching spec.kind. The pinned enum excludes MFA despite a schema mfaSpec member: do not invent supported cluster MFA creation. GithubAccessToken spelling is exact. Fake is test data, not a production secret recommendation. UUID has no spec parameters, not a fake settings form. ACR scope omission returns full-scope refresh token, not least-privilege behavior.

## Field mapping and tailored workflows

coverage.json lists every leaf path, source, type, control and capture per kind. Configure sections are curated: registry/cloud identity; organization/service federation; AWS region/role/scope; GitHub app/install IDs/repositories/permissions; Grafana service-account role; MFA seed reference/timing; password constraints; SSH algorithm/key size/comment; Vault path/method/result; Webhook endpoint/method/JSONPath; Fake masked static pairs; UUID no settings. Authentication branches and reference compositions are progressive. Advanced contains optional provider fields without fabricating defaults.

Identity maps to metadata.name and metadata.namespace; scope is not a spec field. Name is locked on edit. Required controls show schema requirements; omitted options are not filled with executable defaults. Field help shows pinned descriptions. Secret references select metadata names only and never resolve secret data. Explicit reference namespaces are shown exactly where schema supports them.

## Reuse / provider ownership

Production should compose installed base-ui Dialog, SegmentedControl, FormField, Input, NumberInput, Select/Combobox, Collapsible, EditableList/Table, Tooltip and Popover. This HTML mock faithfully sketches density, not imported React. No new generic primitive or package release proposed. An External Secrets add-on provider should own semantics, applicable GVK/version checks, parsing and validation. Host/Kubernetes integration retains draft lifecycle, identity, discovery, RBAC, mutation routing and unsupported fallback.

## Draft and safety boundary

Only explicit mode preference persists, under `omniview.mock.issue319.mode`, with exactly `form` or `yaml`. Resource values, source drafts and credentials never persist. No cluster/cloud access, mutation endpoints or generated results. Bounded Form emits YAML-compatible JSON with lexical integer preservation. Manual source edits preserve exact text, including invalid syntax, and lock Form. This is not a bidirectional AST implementation or proof of arbitrary unknown-field round trips. Production must reuse the existing lossless manifest draft bridge rather than this mock serializer. Secret-bearing projections mask values, are read-only and never replace real source. Reviews show owned paths, never values.

## Browser proof

Captured with isolated issue319 Chrome profile. Real typing, selects, clicks, section changes, add/remove rows, help and Escape drove states. Desktop viewport verified 1440×900 at 1.25; PNGs are 1800×1125. Narrow check uses 620×900 at 1.25. Internal scrolling and footer remain available. Every published capture was visually inspected, including contact sheets. checks.json contains named booleans and screenshot filenames only. No repository build, lint or tests run. Browser fixture checks do not prove controller/admission behavior.

## Explicit limits and review decisions

The standalone mock uses a bounded source serializer, not the production AST. It conservatively locks Form after manual source edits. Map pairs currently use a single row draft; nested object arrays and arbitrary extension payloads need the exact source fallback rather than pretending a typed serializer is complete. Validation demonstrates naming/password sums and ClusterGenerator matching; full recursive schema/admission validation is not claimed. Capability states are explicit fixture banners, not live discovery or genuinely permission-filtered results. Help is click/keyboard accessible; hover-only triggering is not implemented. These limits remain visible for design review; no component checklist is checked or issue closed.

## Explicit mode preference proof

Real Form/Source clicks store only `form` or `yaml`. Resource changes, reload and browser close/reopen retain that explicit choice. GeneratorState inspection, controller-owned restrictions and invalid-source Form locking do not overwrite preference. Browser checks prove transient draft/source values do not survive reload or reopen. Capture `26-mode-preference.png` shows the Source view restored by reload, with a fresh fixture draft rather than the prior invalid source. All seventeen resource interfaces remain available. Mode preference belongs solely to this issue's isolated local origin and dedicated key; no production or global preference changes.
