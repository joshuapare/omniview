# Reusable resource-form composition proposal — #264

Design only; not approved, shipped React, a package export, or evidence of cluster behavior. Open `index.html` locally or serve this directory with any static server. No build or dependency installation. All data is synthetic and all actions are local. Named mock skill unavailable; followed approved #249 interactive workflow. Reviewed prototype against the installed `web-design-guidelines` skill and its fetched upstream rules.

## Audit and decision

Read installed host `node_modules/@omniviewdev/base-ui/package.json` (0.7.0), its `dist/index.d.ts`, and `@omniviewdev/editors/dist/index.d.ts`. This is an installed-host inventory, not a claim that all sibling workspaces resolve the same package version. Exact APIs verified: FormField takes string `label`, `htmlFor`, optional `description`, `error`, `required`, `size`; Input exposes compound Label/Description/Error/Control; Input.Control supports start/endDecorator and mono; EditableList controls editingKey/onEditingKeyChange/onCommit/onCancel/validateItem/editable; CodeEditor controls value/onChange/language/filename/readOnly/onDiagnostics.

**No new base-ui export proposed.** A string-only FormField label does not justify another field framework: compose Input.Label with Tooltip/Popover trigger, descriptions and errors. EditableList owns editing sessions, not array insertion/reordering: consumer composes buttons and stable keys. Existing primitives suffice. These are proposed consumer composition contracts, not declarations of shipped higher-level components.

| Family | Existing composition | Group reuse | Boundary / gap decision |
|---|---|---|---|
| Field/help | Input.Root, Label, Control, Error; Tooltip/Popover | batch #267 schedule, storage #272 capacity | Error stays inline; terminology on demand. No new label API required. |
| Repeated key/value rows | EditableList, Input, Button, List | core #265 metadata, RBAC #273 rules | Adapter owns array/map semantics and stable row identity. No generic schema form. |
| Exact text plus unit | Input.Control with endDecorator + Select | autoscaling #268 targets, storage #272 capacity | Never NumberInput for exact quantities; parser belongs to plugin. |
| Discriminated values | SegmentedControl/Select + Input | apps #266 count/percent, networking #270 named/numeric ports | Branch value and original scalar type remain adapter-owned. |
| References | Select/Combobox + status + retry Button | apps #266 Service, Gateway #294 backend | Lookup scope, cross-namespace grants and selected-object resolution are not base-ui concerns. |
| Schedule | Input + timezone Select + Popover | batch #267, Argo #308 | Cron dialect/timezone semantics belong to adapter. No executable default. |
| Conditions | List/Table + Badge + read-only details | Gateway #294, cert-manager #296 | Display observed values only; no Ready inference. |
| Sensitive intent | Select/Buttons, masked Input, file input, confirmation Dialog | core #265 Secret, External Secrets #318 | Keep/replace/remove is domain state, not visibility state. No global reveal. |
| Expression/rule/patch | editors CodeEditor + language adapter | admissionregistration #278 CEL, Kyverno #327 policy | CEL parser, JSON Patch operations and Kubernetes paths stay outside base-ui. |
| Capability/fallback | Alert/Badge/Button + shared resource frame | metrics #291, apiregistration #280 | Origin, discovery, ownership, RBAC and representation remain independent inputs. |

## Controlled composition contracts

All proposed consumer compositions use `size='lg'` for 32px controls in this frame, 13px text, 16px gaps, 20×24px padding. Use actual theme tokens in production; isolated HTML approximates dark tokens. `id`, `labelledBy`, `describedBy`, `errorId`, `disabled`, `readOnly` and externally supplied error are required composition inputs where relevant. Validation remains consumer-owned, including server admission.

- Field/help: controlled string `value`, `onValueChange(text)`, optional `helpOpen`/`onHelpOpenChange`. Label targets input ID. Error ID is in aria-describedby, aria-invalid reflects error. Help trigger has a separate accessible name. Hover/focus/click opens; Escape dismisses help before its owning dialog; focus remains on trigger. Native dialog traps focus and restores opener. Help is never the only location for safety/errors.
- Rows: controlled `items: {id:string,...}[]`; `onInsert(afterId)`, `onRemove(id)`, `onMove(id,beforeId)`, `onCommit(id,values)`, `onCancel(id)`. Add focuses first cell; remove focuses next/previous row or Add; move retains focus on moved row. Up/down buttons provide keyboard alternative to drag. Disabled/readOnly disables all mutation actions but permits inspection. Map key duplicates are consumer errors; UI reorder of maps has no Kubernetes semantic meaning.
- Exact quantity: `{text:string, unit:string, presence:'omitted'|'present'}`; `onChange(next)` emits strings, never a float. Blank optional input means omission only after explicit edit. Original scalar tag, spelling and sibling paths remain in AST. Units, range and request/limit rules are adapter validation. Input has a label; unit Select has its own label. No numeric coercion or implicit zero.
- Discriminated input: `{branch:string, branches:Record<string,unknown>, originalNode:opaque}`; `onBranchChange`, `onBranchValueChange`. Switching branches preserves each draft in memory until explicit discard. Only selected branch serializes after adapter validates. Incompatible shapes remain source-owned. Prototype clears the switched target as a bounded illustration; production branch preservation is a contract, not proved here.
- References: `{selection:opaque|null, queryState:'loading'|'ready'|'empty'|'denied'|'failed', missingSelected:boolean}` with `onSelect`, `onRetry`, `onQueryChange`. Never convert a selected-but-missing object to empty. Combobox must support arrows, Enter, Escape; portal stays inside modal ownership. Read-only permits inspecting unresolved names. Namespace is explicit and independent of table filtering. Reference permission is not create permission.
- Schedule: controlled exact schedule text and optional timezone string, change events separate; validate using the API group's cron dialect. Native typing/paste works. Do not compute a next-run promise without a supported parser and explicit timezone. Conditions use immutable observed `{type,status,reason,message,lastTransitionTime,observedGeneration}` snapshots; keyboard details expansion, no field mutations.
- Sensitive: `{intent:'keep'|'replace'|'remove', replacement:opaque, visibility:'masked'|'explicitRaw', readGeneration:number, pending:boolean}`; `onReplace`, `onRemove`, `onCancel`, `onVisibilityChange`, `onReadStart/Complete/Cancel`. Keep preserves original AST and encoding. Revealing never sets dirty. Removal requires visible consequence and final review, not silent deletion. Mode/context/diff/close remasks. File completion checks generation and lifetime; pending blocks submission. Cancel invalidates stale reads. Sensitive bytes never enter aria labels, diagnostics, screenshots, persistence or logs. Multiline bytes enter via local file or separate explicitly consented raw editor; safe default stays masked. Redacted source is a read-only projection and never submitted.
- Editors: `value:string`, `onChange`, `language`, `filename`, `readOnly`, adapter diagnostics. Omit onChange for read-only projections. CodeEditor filename must have isolated resource/draft identity; destroy models on lifetime end. CEL/JSON Patch/policy validation supplied by adapter. Only supported leaf AST nodes may be patched. Comments, unknown content, unedited siblings, tags, omissions and exact numbers stay intact. Invalid/unsafe source remains exact with Form unavailable. Never parse and stringify an entire manifest for a small edit.

## Exact path/control mapping

These are representative consumer mappings, not one generic authored resource.

| Interaction | Owned path | Mode / boundary |
|---|---|---|
| Name text | metadata.name | Create required; edit immutable. generateName-only workflows require a resource adapter, not this fixture. |
| Namespace reference | metadata.namespace | Create explicit for namespaced kinds; immutable edit; absent for cluster scope. Cluster connection is destination context, not a manifest field. |
| Label rows | metadata.labels[key] | Adapter patches selected map entry; annotation/unknown siblings untouched. |
| Optional annotation | metadata.annotations[consumer-selected-key] | Mock is layout only; key selection and sensitive annotation policy remain consumer-owned. |
| Exact storage text + unit | PersistentVolumeClaim spec.resources.requests.storage | Blank omitted; no numeric conversion. Existing bound-claim/no-shrink rules owned by core adapter. |
| Named/numeric target | Service spec.ports[i].targetPort | Preserve string/integer distinction; numeric range 1–65535; do not rewrite name/protocol/other siblings. |
| Service picker | StatefulSet spec.serviceName | Create reference; immutable edit; no implicit Service creation. |
| Match expression | LabelSelector.matchExpressions[i].key/operator/values | Root supplied by consumer, e.g. NetworkPolicy spec.podSelector. Exists/DoesNotExist omits values after explicit edit; preserve dormant branch draft. |
| Schedule/timezone | CronJob spec.schedule, spec.timeZone | Exact text; no next-run/controller-health claim. |
| Conditions | status.conditions[i].type/status/reason/message/lastTransitionTime/observedGeneration | Inspection only, no status authoring. |
| Sensitive entry | Secret data[key] or stringData[key] | Keep original node/encoding; replace explicit; remove explicit. Projection never mutation source. |
| CEL | ValidatingAdmissionPolicy spec.validations[i].expression | Text editor; API CEL semantics adapter-owned. |
| JSON Patch | AdmissionResponse.patch decoded locally | Protocol action/inspection, not ordinary persisted resource Create. Base64 transport and sensitive projections stay outside generic editor. |
| Policy document | Kyverno ClusterPolicy spec.rules[i] | Resource adapter owns structured scope; not a universal YAML property form. |
| Source fallback | Entire original document | Exact in-memory text; no normalization or automatic conversion. |

## Capability and representation admission

Capability result is a product, not a single Boolean: origin(native/aggregated/CRD/unknown), discovered group/version/resource, scope, verbs, per-action authorization, schema completeness, ownership, interface(authorable/read-only/request-only), availability and feature support. Origin alone never grants a verb. Missing version, absent feature, denied operation and failed discovery have separate visible states. A failed lookup is not an empty list. Generated objects link to owner inspection, not fake Create. Request protocols offer request review only. Unknown groups retain generic source/provider fallback once independently admitted; this fixture conservatively disables Create because no discovery is supplied.

Pinned apimachinery registration includes Table, TableOptions, PartialObjectMetadata and PartialObjectMetadataList. They are negotiated representations/options, not new ordinary authored kinds. Table columns/rows may contain partial or absent objects: fetch an admitted full object before editing. PartialObjectMetadata contains metadata, not empty spec/status. Lists own items and opaque list metadata; continuation/resourceVersion are retained, not authored. Incomplete schema does not authorize pruning unknown fields. Removed extensions APIs, audit transport and component-config files remain outside ordinary creation. Inspector mock intentionally shows no Create action.

## Evidence and limits

43 initial reviewed captures, plus focused lifecycle/source-projection captures if present in checks.json. Desktop 1440×900, DPR1.25; narrow 640×760 DPR1.25. Actual browser typing, selects, add/remove/reorder, help focus/Escape, review/Escape, pending cancellation and source mode switching exercised. All screenshot files are enumerated in checks.json; reviewed contact sheets remain local and are not publication assets. Chrome uses an isolated profile excluded from publication.

This is a control laboratory, not replacement group-specific forms. Source text round-trip is exact in this bounded source pane; Form deliberately refuses manual source rather than pretending to parse losslessly. No production AST, API schema validation, controller reconciliation, RBAC discovery, native modal, actual Monaco, real file decoding or raw reveal was verified. The file chooser demonstrates layout; pending read is explicitly simulated. CEL and policy parsers are unavailable and say so. JSON Patch check is structural only. Sensitive multiline/raw replacement is specified above but intentionally not exposed as an unmasked textarea. Sections other than source/label rows are independent fixture demonstrations, not a cross-section serialized resource. Explicit source Reset discards its fixture draft; production reset/cancel must use the existing lifecycle confirmation. Existing modal focus trap/restoration must be reused; laboratory root is a region, nested review provides its own bounded trap. Some recommended ARIA error-ID links and branch persistence remain production composition requirements, not claims about this HTML. No package release is needed or proposed.

Visual review found and fixed undersized compound-row inputs and stale identity errors. Screenshot source pane uses internal scrolling; footer remains visible. No raw sensitive capture or credentials, live connection, cluster/cloud mutation, production edit, dependency install, repository build/test/lint/format, issue closure, or approval claim.

## Sources

- https://github.com/omniviewdev/omniview/issues/264
- https://github.com/omniviewdev/omniview/issues/262
- https://github.com/omniviewdev/omniview/issues/249
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74
- https://github.com/kubernetes/apimachinery/blob/v0.35.0/pkg/apis/meta/v1/register.go
- https://github.com/kubernetes/apimachinery/blob/v0.35.0/pkg/apis/meta/v1/types.go
- https://github.com/kubernetes/api/tree/v0.35.0
- https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md (review source, fetched during this work)
