# ACME lifecycle inspector design — issue 297

Design only. All objects, observations, names, solver references, and errors are synthetic. No cluster requests, mutations, DNS queries, HTTP probes, Secret reads, or controller commands run. Download index.html and open locally. capture.cjs records browser proof; its Playwright path is workstation-specific.

## Scope and ownership

Both Order and Challenge use acme.cert-manager.io/v1, namespaced, pinned cert-manager v1.18.2. They are generated lifecycle records, not ordinary authoring resources. Order is normally owned by CertificateRequest; Challenge by Order. Missing or unresolved owner does not grant permission to edit or invent a replacement. Certificate intent belongs upstream. No Create, Edit, Save, status update, retry issuance, delete, or finalizer removal is available. Review records a boundary and proposed handoff only, never a mutation. Existing owner navigation and diagnostic panels should be reused, not rebuilt.

CRD installation, served version, controller support, object reads, related-resource reads and RBAC are independent. Schema existence is not authorization or health. Production discovers each capability and preserves unresolved references. Unsupported versions retain original data without converting into this inspector. Missing CRD, denied read, unavailable discovery, empty related resources and unknown ownership have separate demonstrated states.

## Exact field → control → path mapping

All controls below are read-only observations unless explicitly called fixture controls. No manifest paths are owned for writing.

| Kind | Control | Manifest path |
| --- | --- | --- |
| Both | Locked identity and destination | apiVersion, kind, metadata.name, metadata.namespace |
| Both | Owner link / unresolved state | metadata.ownerReferences[].apiVersion/kind/name/uid/controller |
| Both | Issuer reference summary / existing navigation | spec.issuerRef.group/kind/name |
| Order | Requested identifier list | spec.dnsNames[], spec.ipAddresses[], spec.commonName |
| Order | Requested duration, omitted profile | spec.duration, spec.profile; absence remains absence |
| Order | Hidden CSR | spec.request; byte string never displayed |
| Order | State badge, safe reason, failure time | status.state, status.reason, status.failureTime |
| Order | Authorization rows | status.authorizations[i].identifier/wildcard/initialState |
| Order | Offered challenge types | status.authorizations[i].challenges[j].type |
| Order | Endpoint presence only, never fetched | status.url, status.finalizeURL, status.authorizations[i].url, status.authorizations[i].challenges[j].url |
| Order | Hidden ACME challenge data and certificate | status.authorizations[i].challenges[j].token, status.certificate |
| Challenge | Identifier and wildcard fact | spec.dnsName, spec.wildcard; wildcard identifier excludes *. |
| Challenge | Solver type | spec.type; HTTP-01 or DNS-01, unlike lowercase offered Order challenge types |
| Challenge | Processing and presented facts | status.processing, status.presented; presented does not prove self-check |
| Challenge | State / sanitized reason | status.state, status.reason |
| Challenge | Endpoint presence only | spec.url, spec.authorizationURL; never automatic external navigation |
| Challenge | Protected values | spec.token, spec.key; never displayed or fetched from fixtures |
| Challenge | DNS provider summary / Secret reference name and key only | spec.solver.dns01.cloudflare.apiTokenSecretRef.name/key in this fixture; other provider unions require provider-aware safe summaries |
| Challenge | HTTP class summary | spec.solver.http01.ingress.ingressClassName |
| Both | Redacted source projection | Read-only derived view, not a manifest, draft, save source, export or diff payload |
| Both | Owner-name handoff input | UI-only navigation intent; never a manifest path |
| Both | Fixture selectors | UI-only; never writes spec.type, solver or live capabilities |

The compact prototype renders representative DNS identifiers and an omitted profile. Remaining Order fields above are mapped for the production inspector, not claimed editable or exhaustively represented in its synthetic projection. IP identifiers, commonName, endpoint presence and certificate presence need production display coverage against discovered schema. Solver provider unions retain original source; no generic provider editor is proposed.

## Source and privacy boundary

No source authoring exists, so there is no form/YAML draft round-trip claim. The original object must remain untouched, including comments, unknown fields, omitted values, exact integers and unedited siblings. Projection omits credentials, CSR/certificate bytes, endpoint URLs, annotations and arbitrary solver payload. The textarea is an intentionally incomplete safe projection, not valid input for submission. Production reason strings require privacy filtering before display; mock reasons are fixed safe fixtures. No credential material is present in this prototype. No values or credentials persist. No explicit mode preference is needed for this inspect-only interface.

Order URL becomes immutable after initial controller population according to pinned API comments. The inspector locks all fields by ownership policy; it does not claim every spec field has a schema immutable rule. Kubernetes identity immutability and admission are additional constraints. Status is controller-owned. Schema enums can evolve; unknown state remains visible as unknown, never success. Timeline is a logical lifecycle snapshot, not fabricated event timestamps or a live event history. Initially valid authorization can reuse validation without creating a Challenge. Requested duration does not prove certificate validity or issuance.

## Frame, accessibility and reuse

Approved 1000×700 frame, 180px nav, 32px controls, 13px text, 20×24px content padding, 16px gaps. Narrow mode stacks facts and scrolls content internally with footer visible. Faithful isolated HTML composition, not shipped React. Production maps to base-ui Dialog, Button, Badge, FormField, Input, Select, Table, Tooltip/Popover and existing resource/diagnostic navigation. Colors illustrate semantic background, surface, border, muted, warning, error and accent tokens; production uses theme tokens. No new generic primitive needed.

Help opens via focus, hover and click; Escape hides help and restores trigger focus before any dialog action. Buttons and native select/input semantics support keyboard. Dialog Tab wrapping covers internal controls; fixture toolbar remains outside working frame. Production Dialog supplies full focus containment and opener restoration. Prototype has no close/reopen lifecycle and does not claim it. Validation is visible, announced and focuses owner input. No destructive action exists.

Used web-design-guidelines skill at /Users/joshuapare/.agents/skills/web-design-guidelines/SKILL.md and fetched its actual command.md source. Reviewed known prototype for labels, focus visibility, semantic actions, errors, overflow and dark native controls. No named mock-generation skill was available; used approved #249 interactive HTML workflow.

## Evidence and limits

18 screenshots: Order overview, help, authorizations; Challenge overview, status, DNS solver, HTTP solver; each kind's source projection; handoff validation and review; denied, missing, unavailable, unsupported, empty and unresolved-owner states; narrow layout. All inspected together in contact-sheet.png. Captures use 1440×900 at deviceScaleFactor 1.25 except explicitly narrow 680×800. Browser uses isolated owned Chrome profile and closes after proof. Boolean checks and screenshot filenames are in checks.json. Actual select/click/focus/Escape/fill interactions drive evidence; no injected application state.

Fixture data does not validate real CRDs, RBAC, controllers, certificates, DNS, propagation, health or production integration. Add/remove row interactions are not applicable: no writable repeated paths exist. Create/edit validation is intentionally unavailable; owner navigation validation demonstrates an honest non-resource action. No repository builds, tests, lint, formatter or shared dependency changes occurred. Optional cert-manager add-on editor provider should own this inspector; native Kubernetes provider supplies capability and safe generic fallback. Mock awaits review; no issue closure or approval claimed.

## Pinned primary references

- https://github.com/cert-manager/cert-manager/blob/v1.18.2/deploy/crds/crd-orders.yaml
- https://github.com/cert-manager/cert-manager/blob/v1.18.2/deploy/crds/crd-challenges.yaml
- https://github.com/cert-manager/cert-manager/blob/v1.18.2/pkg/apis/acme/v1/types_order.go
- https://github.com/cert-manager/cert-manager/blob/v1.18.2/pkg/apis/acme/v1/types_challenge.go
- https://github.com/omniviewdev/omniview/issues/262
- https://github.com/omniviewdev/omniview/issues/249
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74
