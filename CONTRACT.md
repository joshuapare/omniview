# Editor provider contract proposal

Design for review, not a public SDK or shipped feature. Interactive HTML composition, not production React. Two synthetic add-ons (Acme Operator, Northstar Studio) target the same fictional Widget. Kubernetes schema is the host fallback, not a third add-on. No CRD installation, cluster connection, mutation, credential retrieval, or permission check occurs.

## Pinned grounding

- Runtime types: https://github.com/omniviewdev/omniview/blob/008e307777797b520b01115476229b36c3b609b1/packages/omniviewdev-runtime/src/types/extensions.ts
- Registry: https://github.com/omniviewdev/omniview/blob/008e307777797b520b01115476229b36c3b609b1/packages/omniviewdev-runtime/src/extensions/registry.ts
- Editor: https://github.com/omniviewdev/omniview-plugin-kubernetes/blob/21f091f5653d80eb9036a0826cf8de8f89a17245/ui/src/components/kubernetes/manifest/ResourceManifestEditor.tsx
- Baseline and approved examples: https://github.com/omniviewdev/omniview/issues/262 and https://github.com/omniviewdev/omniview/issues/249; implementation references https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72 and https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74.

Existing store sorts plugin then contribution ID, rejects duplicate IDs, caches match IDs by context cache key, supports single/multiple resolution and subscriptions. Registry removes owned points/contributions. Existing editor dispatches built-in components directly and has explicit Secret raw disclosure. Proposed changes must reuse these mechanisms, not create a second registry. Current normalization trims names; it does not provide descriptor validation. No current public editor point is claimed.

## SDK proposal

Point ID **`kubernetes/resource/editor/v1`**, owned by Kubernetes plugin, registry mode `multiple`. Breaking protocol changes require a new point ID; additive optional fields retain v1. Host validates descriptor before registration. A provider cannot self-assign owner or overwrite another contribution. Runtime loader supplies authenticated plugin ID, normalizes point/contribution IDs through existing normalization, and namespaces contribution IDs using loader identity. Duplicate same-owner normalized IDs fail registration, not last-writer-wins.

```ts
// Proposed declarations; not an existing runtime export.
type GVK = Readonly<{ group: string; version: string; kind: string }>;
type EditorDescriptorV1 = {
  contractVersion: 1;
  gvk: GVK;                         // exact; core group is empty string
  resource: string;                 // discovered plural, never derive from kind
  scope: 'Namespaced' | 'Cluster';
  intents: readonly ('create' | 'edit' | 'inspect' | 'action')[];
  schemaRequirements: readonly {
    pointer: string; type: 'string' | 'integer' | 'boolean' | 'object' | 'array';
    required?: boolean;
  }[];
  requiredCapabilities: readonly string[];
  ownedPaths: readonly string[];    // RFC6901, no implicit wildcard grants
  sensitivePaths: readonly string[];
  cohort: { runtime: string; baseUI: string; protocol: 1 };
  render: EditorComponent;
};
const contribution: ExtensionRegistration<EditorDescriptorV1> = {
  extensionPointId: 'kubernetes/resource/editor/v1',
  registration: {
    id: 'widgets', label: 'Acme Operator',
    value: {
      contractVersion: 1,
      gvk: { group: 'widgets.preview.example', version: 'v1', kind: 'Widget' },
      resource: 'widgets', scope: 'Namespaced', intents: ['create', 'edit'],
      schemaRequirements: [{ pointer: '/spec/replicas', type: 'integer' }],
      requiredCapabilities: ['draft.patch.v1'],
      ownedPaths: ['/spec/replicas'], sensitivePaths: [],
      cohort: { runtime: '<exact compatible runtime cohort>', baseUI: '<exact compatible base-ui cohort>', protocol: 1 },
      render: WidgetEditor,
    },
  },
};
// Northstar exports the same exact descriptor with its own loader-owned ID and component.
```

Cohort strings above are schematic compatibility slots, not executable package versions. Implementations must use the host release's exact supported cohort, never guess a version. Author UI validates registration and shows rejection for protocol v2. Intent is separate from API verb: declared create support does not grant POST. Inspect and action descriptors cannot obtain generic save capability. Action providers use host-defined request protocols only.

## Resolution, choice and discovery

Use existing `list(context)` and subscriptions. Context cache key includes connection generation, exact GVK, plural, scope, intent, schema fingerprint, discovery/RBAC generation, feature capabilities and store version; never include credentials, source or resource content. Do not cache across clusters or permission revisions.

Resolution: compatible remembered explicit choice > compatible built-in tailored provider > one exact compatible add-on > explicit chooser for multiple equally applicable add-ons > schema/YAML fallback. A matching add-on never silently replaces a built-in. Chooser lists origin, owner, applicability and unavailable reason. Sorting remains registry plugin/ID order; rank policy lives in consumer selection, not registry mutation. Explicit user choice can select a compatible add-on instead of built-in. Persist IDs, intent and mode only; no draft, namespace, tokens or credentials. Stale preference does not override incompatibility.

Reject version aliases and guessed conversion. Exact served GVK, discovered plural/scope, required schema shapes and host-supported capabilities must match. Missing CRD means API absent; unknown controller state is not absence or health. Denied lookup is not empty; unavailable lookup permits unresolved existing references but never fabricated choices. Empty is a successful zero-result lookup. Removed API, unsupported schema, feature-gate unknown, denied verb and unavailable provider retain source and the familiar YAML frame. Unknown feature gates fail capability applicability, not destructive source parsing. Discovery loading must cancel stale results using generation identity. No inference from a published schema to usable RBAC or running controllers.

## Host draft and patch API

Host holds exact source, lossless YAML AST, baseline, revision, identity, sensitive classification and lifecycle. Providers receive immutable typed projections, opaque draft/session ID and scoped callbacks, not an unrestricted onChange string setter by default.

`patch({sessionId, expectedRevision, operations})` returns accepted/new revision, stale, forbidden-path, immutable, unsafe-source or invalid. Operations are set/remove at declared RFC6901 paths; values use explicit scalar type and exact decimal integer text, not JavaScript Number for wide integers. Host validates path overlap, schema shape, identity and current session before atomic AST patch. Comments, scalar spelling, number types, omitted fields, unedited siblings and unknown content outside owned nodes remain exact. Array edits require stable item identity or explicit whole-list ownership and conflict review. Removal is an explicit operation; blank local text never means delete. No YAML stringify/reparse replacement of whole source.

Pending local input is separate from committed source. Invalid partial numbers remain local with visible errors. Mode/provider/review switches block until apply or cancel; cancel drops only local fields. Host owns dirty status against baseline. Edit identity includes connection, group/version/resource, namespace, name, UID and baseline resourceVersion; immutable identity cannot be patched by provider. Create name/namespace may be entered only through host-owned identity controls before review. Cluster scope omits namespace. No automatic create/delete replacement.

Host performs final parse, local validation, current discovery/RBAC, admission and optimistic resourceVersion routing using existing create/update paths. Contributors cannot call a special bypass submit function. Server conflict preserves draft and offers baseline refresh plus explicit merge/review. Late async callbacks with old session/generation/revision fail. Provider validation is advisory; errors carry field IDs and safe codes, never raw sensitive source.

## Lifecycle/state diagram

```text
Open -> discover -> compatible -> selected -> editing -> local pending
                     |              |          |            |
                     |              |          +-- review <-- apply/cancel
                     |              |
                     |              +-- crash -> quarantined -> YAML / explicit retry
                     +-- no match / denied / unsupported ------> YAML
editing + provider switch -> pending guard -> remask -> dispose -> mount projection
editing + unload/HMR -> retain host draft -> revoke callbacks -> remask -> YAML/reselect
connection/resource change -> retain old session draft in memory -> new session
cancel/close -> confirm discard if dirty -> dispose -> erase in-memory drafts
```

Crash boundary quarantines the contribution for current session/generation; retry is explicit, not crash-loop remount. Unload removes contributions via existing registry cleanup, unsubscribes, aborts lookups, disposes editor handles and invalidates session tokens. HMR uses the same lifecycle; no stale patches. Connection/resource changes never silently apply old source to new destination. Require apply/cancel local fields; retain old dirty draft in memory until explicit discard or return. Recovery uses host source, not provider state. Mock buttons simulate these events; they do not load/unload real plugins.

## Sensitive projection and trust

Default provider reads are read-only, redacted projections. Redact declared/schema-sensitive values, Secret data/stringData, all Secret annotation values and embedded payloads, in both sides of diff, ARIA, errors, exports and telemetry. Projection carries a non-submittable type/tag; patch API rejects projected/redaction-marker writeback. Keep/replace/remove is explicit; unchanged values stay opaque and exact. Raw access requires separate user consent scoped to provider, resource session and revision. Revoke/remask on section/provider/mode switch, unload, HMR, connection/resource change and close. No global reveal. Mock has no raw value and deliberately refuses reveal; screenshot and accessible names contain no credential material.

These are trusted in-process plugins, **not a security sandbox**. A malicious installed UI plugin can escape API conventions. Host API least privilege and cohort checks prevent accidents, not malicious JavaScript. Permission controls remain real server RBAC. Do not market projection as isolation.

## Field/control mapping and ownership

| UI | Control | Owned path or contract | Intent/boundary |
|---|---|---|---|
| GVK/resource/scope | Descriptor fields | Descriptor `gvk`, `resource`, `scope` | Author registration; exact discovery match |
| Supported operations | Typed intent array | Descriptor `intents` | No implied verbs or permissions |
| Schema/capabilities | Requirements | Descriptor arrays | Pure applicability, no side-effect lookups |
| Name/namespace | Host text/reference controls | `/metadata/name`, `/metadata/namespace` | Create only; edit locked; cluster namespace omitted |
| Replicas | Exact integer string input | `/spec/replicas` | Mock edit, 0..2147483647; no default insertion |
| Editor cards | Explicit selection buttons | Provider ID only | Never patches manifest |
| Source | Host textarea surrogate | Complete source | Preserved; raw edits disable mock Form |
| Availability | Fixture select | No manifest path | States, not permissions discovery |
| Sensitive field | Masked keep state | Opaque sensitive handle | No read/writeback from projection |
| Review | Host action | No mutation | Destination, revision, ownership and safety |
| Recovery | Fixture event buttons | Session lifecycle | Source retained; no actual plugin unloading |

Mock patches only a bounded fixture line, not a general YAML AST. Exact comment, wide integer and string sibling preservation are exercised for that fixture; general lossless implementation remains a contract requirement, not proven production behavior. Invalid/manual source remains verbatim and form-unavailable. Create is specified by host identity contract and descriptor, not a second fake resource creation form.

## Reuse, accessibility and review

Compose existing Dialog/editor frame, SegmentedControl, FormField, Input, Select, Button, Tooltip/Popover, Table, Alert and existing Monaco surface. No new generic base-ui component, registry, inspector or private Kubernetes-component public export is proposed. Resource semantics stay in adapters. Compatibility uses shared runtime/base-ui cohort, semantic theme tokens and cleanup; no MUI/Emotion or legacy package sharing. Mock hardcoded palette faithfully illustrates approved proportions; production uses semantic tokens.

Visual review used installed `web-design-guidelines` skill and its fetched source https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md. Native controls, visible focus, labels, live status, keyboard help/Escape and narrow footer fit were inspected. HTML mock is an isolated frame, not a shipped modal; production must retain host focus trap and opener restoration. No repository tests/builds/lint ran. No #258 diagnostics inspector duplicated.

Open review decisions: approve point ID and policy order; settle exact released cohort at implementation; approve scoped raw-access type and stable list identity protocol. No implementation follow-up is claimed before review.
