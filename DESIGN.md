# Experimental Gateway API editors — issue 295

Design proposal, not production React, approval, or shipped support. Self-contained HTML follows #249's interactive mock workflow. No named mock skill was available. Reviewed known prototype against `/Users/joshuapare/.agents/skills/web-design-guidelines/SKILL.md` and its fetched upstream guideline source. Native semantic controls faithfully illustrate composition; colors are isolated mock equivalents, not a new production token system.

## Source and applicability

Gateway API v1.4.0 Experimental snapshot, commit `5e5891a5adad272363de782eb02a042166f1913c`:

- [XListenerSet schema](https://github.com/kubernetes-sigs/gateway-api/blob/5e5891a5adad272363de782eb02a042166f1913c/config/crd/experimental/gateway.networking.x-k8s.io_xlistenersets.yaml)
- [XBackendTrafficPolicy schema](https://github.com/kubernetes-sigs/gateway-api/blob/5e5891a5adad272363de782eb02a042166f1913c/config/crd/experimental/gateway.networking.x-k8s.io_xbackendtrafficpolicies.yaml)
- [XMesh schema](https://github.com/kubernetes-sigs/gateway-api/blob/5e5891a5adad272363de782eb02a042166f1913c/config/crd/experimental/gateway.networking.x-k8s.io_xmeshes.yaml)

All three use `gateway.networking.x-k8s.io/v1alpha1`, served/storage true, and have a separate controller-owned `/status` subresource. X prefixes are intentional. XListenerSet and XBackendTrafficPolicy are namespaced. XMesh is cluster-scoped. CRD availability, served version, actual create/patch verbs and authorization, and implementation support must all be known before production authoring. Discovery alone proves none of those. Synthetic Create scenario means prerequisites are explicitly assumed for design, not discovered.

Read Epic262, issue295, approved issue249 examples, and merged plugin PR72/PR74 receipts. Retain established shared editor frame and submission contracts. Optional Gateway API add-on provider should own these exact GVKs, not a hardcoded Kubernetes-plugin catalogue. Unknown versions use host source fallback; never rename X kinds automatically.

## Complete resource coverage and boundaries

| Component | Create / edit | Immutable / ownership | Review consequence |
|---|---|---|---|
| XListenerSet | Attach one or more named listeners to an existing Gateway; edit listeners and parent reference | Name and namespace locked in edit; no additional spec immutability asserted by this snapshot. Controller owns status. GitOps ownership blocks local takeover. | Parent must explicitly permit ListenerSet attachment; default is not allowed. Listener changes may expose traffic and conflict with parent/siblings. No automatic Gateway edits. |
| XBackendTrafficPolicy | Select local backend targets; optional retry budget and session persistence | Identity locked on edit. Spec not presented as immutable. Status controller-owned. No Service port targeting. | Rejected retries return 503 after budget exhaustion; affinity changes can affect sessions. No HTTPRoute retry configuration is created. |
| XMesh | Explicit controller identity and optional implementation parameters | Cluster-scoped. `spec.controllerName` is immutable by CEL `self == oldSelf`; identity also locked. Description/parameters remain editable subject to admission. | Mesh-wide controller configuration, not installation of a mesh, membership enrolment, or controller deployment. |

## Field → control → manifest ownership

Blank optional controls omit properties; no implicit companions. JSON syntax shown in Source is valid YAML 1.2, explicitly labeled. Safe, demonstrated form-to-source-to-form paths retain values. These are new synthetic drafts, not an AST losslessness implementation.

| Resource | Control | Exact owned path |
|---|---|---|
| All | Name; locked in edit | `metadata.name` |
| Namespaced kinds | Visible preview destination; locked fixture namespace | `metadata.namespace` |
| XListenerSet | Existing Gateway picker | `spec.parentRef.name`; omitted namespace means local. Advanced source permits `.group`, `.kind`, `.namespace`. |
| XListenerSet | Add/remove listener rows | `spec.listeners[]` (1–64, map key `name`) |
| XListenerSet | Listener name | `spec.listeners[i].name`; unique within this set, not across all sibling sets |
| XListenerSet | Protocol select | `spec.listeners[i].protocol` |
| XListenerSet | Integer port | `spec.listeners[i].port` (0–65535); blank omits; zero or omission requests implementation allocation, never a guaranteed port |
| XListenerSet | Optional hostname | `spec.listeners[i].hostname`; blank omits/all-hosts; not emitted for TCP/UDP |
| XListenerSet | Same / All route namespace choice | `spec.listeners[i].allowedRoutes.namespaces.from`; All exposes a visible cross-namespace attachment consequence |
| XListenerSet | TLS mode | `spec.listeners[i].tls.mode`; HTTPS Terminate only; TLS Terminate/Passthrough; HTTP/TCP/UDP omit TLS |
| XListenerSet | Existing TLS Secret picker | `spec.listeners[i].tls.certificateRefs[0].name`; names only, no Secret data fetched |
| XBackendTrafficPolicy | Add/remove same-namespace Service targets | `spec.targetRefs[i].{group,kind,name}`; core group empty string and kind Service explicit; 1–16 unique triples; no namespace or sectionName member |
| XBackendTrafficPolicy | Retry budget percentage | `spec.retryConstraint.budget.percent`, integer 0–100 |
| XBackendTrafficPolicy | Budget duration | `spec.retryConstraint.budget.interval`, string duration, 1s–1h |
| XBackendTrafficPolicy | Minimum retry count and interval | `spec.retryConstraint.minRetryRate.{count,interval}`; count 1–1000000; rate interval >0 and ≤1h |
| XBackendTrafficPolicy | Omit / Cookie / Header branch | `spec.sessionPersistence.type`; omission means no sessionPersistence object, not an inserted Cookie default |
| XBackendTrafficPolicy | Session token name | `spec.sessionPersistence.sessionName`, up to 128 characters; token NAME only, no token value |
| XBackendTrafficPolicy | Absolute / idle timeout strings | `spec.sessionPersistence.{absoluteTimeout,idleTimeout}` |
| XBackendTrafficPolicy | Session / Permanent cookie lifetime | `spec.sessionPersistence.cookieConfig.lifetimeType`; Permanent requires absoluteTimeout; Header omits cookieConfig |
| XMesh | Controller domain/path | `spec.controllerName`; required and locked on edit |
| XMesh | Short description | `spec.description`, maximum 64 characters |
| XMesh | Omit / existing parameter resource branch | `spec.parametersRef` object or absence |
| XMesh | Parameters reference fields | `spec.parametersRef.{group,kind,name,namespace}`; core group empty. Namespace required for namespaced referents and omitted for cluster referents. Never guess scope from resource name. |

### Advanced/source ownership, without invented forms

XListenerSet source additionally retains custom protocols, parent reference group/kind/namespace, route kind groups/kinds, Selector namespace policy including `matchLabels` and `matchExpressions`, multiple or non-Secret certificate references including namespaces, and TLS `options` string map (maximum 16 properties). Selector rules AND together; In/NotIn require values, Exists/DoesNotExist forbid values. Cross-namespace certificate references require a grant in the target namespace. Grants for the parent are not inherited by a ListenerSet. TLS options and nonstandard certificates are implementation-specific; no certificate validity, reference authorization, or reconciliation is inferred.

XBackendTrafficPolicy source supports other discovered backend kinds, such as ServiceImport or implementation-specific backends, without guessing support. Target references have no Service-port attachment in this snapshot. API defaults include budget 20%/10s and minimum retry rate 10/1s; blank UI does not materialize those defaults. Header persistence is Extended. Cookie session name support is implementation-specific.

XMesh parameter kinds and scope are implementation-specific. No parameters means omission. Invalid/missing/unsupported parameters can produce Accepted=False/InvalidParameters; preview never fabricates that controller result.

All unknown source, comments, scalar types, omitted values, and exact large integers are retained verbatim **after manual source edits** because the prototype does not parse or rewrite them. Form and Review become unavailable. No claim of editable bidirectional arbitrary YAML, preservation of imported object siblings through form edits, or API validation is made. Production must reuse the existing lossless manifest draft adapter before enabling those paths. The raw invalid/future-version fixture demonstrates preservation rather than conversion.

## Interaction and visual evidence

Reference frame 1000×700, 32px controls, 13px body, 20×24px content padding, 16px gaps. Persistent destination/footer; main content scrolls internally. Capture viewport 1440×900 at 1.25 (1800×1125 physical pixels). Narrow capture 720×760 at 1.25 checks horizontal fit and footer visibility.

- 01–07: Listener initial, validation, populated HTTPS/TLS reference and All-route consequence, help, source, non-mutating review, identity-locked edit.
- 08–12: Policy initial, Permanent-cookie error, populated retry/session controls, consequence review, edit.
- 13–17: Mesh initial, required-controller error, parameter reference, mesh-wide consequence review, immutable-controller edit.
- 18–19: Controller status inspection boundary; exact invalid/unsupported source retained with Form/Review locked.
- 20-* : GitOps ownership, missing CRD, denied write, unknown controller support. Each blocks authoring distinctly.
- 21-* : Empty Gateway choices versus denied lookup. Neither becomes a fabricated permission or healthy Gateway.
- 22: Narrow-window internal scroll/footer check.

Real browser actions include typing, native selects, listener/target add/remove, Form/YAML, section switches, focus help, click help, Escape dismissal/focus restoration, validation, and source-only fallback. Checks contain named booleans and screenshot filenames only. All captured states were visually reviewed, including refined validation recaptures. No screenshots contain credential values, PEM, Base64 credentials, annotations, usernames, or passwords. No live connection, cluster mutation, or remote resource request occurred.

## Reuse and gaps

Inspected actual installed `kubernetes/ui/node_modules/@omniviewdev/base-ui/dist/index.d.ts`: Dialog 1776–1811, FormField 2302–2326, Input 2467–2500, NumberInput 2878–2926, Popover 2965–3018, SegmentedControl 4119–4142, Select 4144–4296, Tooltip 5341–5384. Compose these plus Button, Collapsible, existing reference-picker and manifest editor patterns. Keep Kubernetes/reference/grant/attachment/duration rules in add-on provider. No new generic base-ui primitive is justified here.

Guideline review caught offscreen validation summaries; moved errors above controls and recaptured. Native labels, visible focus, accessible help, Escape behavior, explicit warnings, and scrolling were inspected. HTML is a faithful isolated composition, not shipped React. Full host modal focus-trapping/opener lifecycle, real async loading/reference errors, and production accessibility audit are not proven.

## Honest limits and review decisions

- Local validation demonstrates names, required references, listener uniqueness/port range, budget percentage, Permanent-cookie requirement, controller shape and description length. It is not complete pinned CEL/OpenAPI validation; full duration grammar/ranges, target uniqueness/max counts, compatibility/conflicts, DNS validation, implementation-specific capabilities and parameter scope must use production adapters/server admission. Review remains a draft preview, never a success claim.
- Advanced fields use editable source-only fallback rather than pretending unsupported structures have a lossless form parser. No sensitive source import/reveal workflow exists.
- Fixtures use one namespace and same-namespace Gateway/Secret/Service picks. Cross-namespace advanced values are not verified against RBAC/grants.
- Ownership and capability scenarios are explicit fixture states. Status unavailable means unavailable, not empty/healthy.
- Only explicit mode preference is stored; source and field values stay in memory. Resource/scenario fixture switches start fresh drafts intentionally.
- User must review these mocks before issue checkboxes or implementation follow-ups. Issue stays open.
