# certificates.k8s.io design delivery

Design mock only; awaits review. No production code, real certificate material, API requests, or cluster connections. Approved #249 interactive HTML workflow; faithful isolated composition, not shipped React. Visual review used web-design-guidelines and its fetched upstream rules.

## Coverage and mapping

| Component | Control | Exact path / boundary |
|---|---|---|
| CSR v1, cluster scope | Name input | metadata.name; identity locked after create |
| CSR | Qualified signer input, contextual policy help | spec.signerName; immutable; no executable default; legacy-unknown forbidden in v1 |
| CSR | Safe fixture attachment, content always hidden | spec.request, PEM PKCS#10 bytes serialized as Base64; fixture flag does not parse/validate material |
| CSR | Optional integer seconds | spec.expirationSeconds; omitted if empty; 600..2147483647; not promised actual validity |
| CSR | Explicit usage selector plus add/remove rows | spec.usages[]; no automatic usage insertion in clean create |
| CSR inspect | Locked request controls | Entire spec immutable, including server-populated username, uid, groups, extra; requester identities hidden |
| CSR approval action | Approve/Deny choice, non-mutating review | certificatesigningrequests/approval, status.conditions entries Approved or Denied with status True; separate from ordinary object editing. Requires update on approval and approve on signer. Production must handle existing terminal conditions and prohibit contradictory transitions |
| CSR signing | Read-only state | status.certificate and status.conditions; signing controller owns status, separate sign permission; no generic status editor or issue action |
| ClusterTrustBundle v1beta1, cluster scope | Name, optional signer input | metadata.name and spec.signerName; object name locked in edit. Signer-linked name prefix translates / to :; unlinked names must not use a signer prefix |
| ClusterTrustBundle | Attach/replace/clear fixture material | spec.trustBundle; actual production import must validate CA PEM blocks, constraints, size and duplicates. No validity claim here |
| ClusterTrustBundle | Trust-change review | Update allowed with correct resource verbs; signer-bound writes additionally require attest on named signer. Consumers and projection are not created, enumerated or claimed healthy |
| PodCertificateRequest v1beta1, namespaced | Read-only Pod/signer/identity/lifetime summary | spec.signerName, podName, podUID, serviceAccountName, serviceAccountUID, nodeName, nodeUID, maxExpirationSeconds |
| PodCertificateRequest | Hidden material and annotation summary | spec.pkixPublicKey, proofOfPossession, unverifiedUserAnnotations; all spec immutable, kubelet ownership, no ordinary Create/Edit/Approve/Retry-Issue |
| PodCertificateRequest status | Lifecycle and issuance summary | status.conditions (Issued/Denied/Failed), certificateChain, notBefore, notAfter, beginRefreshAt; status belongs to signer. No key generation, renewal or volume rewrite |
| All | Read-only redacted YAML projection | Never parsed back or used as mutation source; material hidden, annotations excluded |
| All | API/access selector | Distinct not-served, denied, unavailable, empty, unsupported and loading fixtures; retry returns available state without resetting resource drafts |

Native built-in Kubernetes editor ownership fits these three resources; no external operator provider required. Discovery, served version, actual verbs, signer permissions and controller availability remain separate capability facts. Do not infer permission from schema or feature flags.

## Snapshot and prerequisites

Pinned Kubernetes v1.35.0 / k8s.io/api v0.35.0. Local API schema excerpt saved in api-snapshot.json for citations, not published because only prototype/evidence/design assets belong on asset branch.

- https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L56906-L60399
- https://github.com/kubernetes/api/blob/v0.35.0/certificates/v1/types.go
- https://github.com/kubernetes/api/blob/v0.35.0/certificates/v1beta1/types.go
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/features/kube_features.go

CSR v1 supported. ClusterTrustBundle beta gate default false since 1.33; served v1beta1 requires discovery/runtime configuration. v1alpha1 is conditional compatibility fallback, not a second kind or freely interchangeable source. ClusterTrustBundleProjection is separate and default false; no implicit mounting. PodCertificateRequest beta/default false in 1.35; depends on AuthorizeNodeWithSelectors. A schema does not prove a signer exists or supports issuance.

## Composition

Reuse existing Dialog, FormField, Input, NumberInput or string Input, Select/Combobox, Button, Tooltip/Popover, Collapsible, table/detail rows and shared Monaco boundary. Current prototype uses native HTML equivalents with 1000x700 frame, 32px controls, 13px body, 20x24 content padding, 16px gaps and internal scrolling. No new generic primitive required. Resource parsing and signer policy stay in Kubernetes adapter. Help supports hover/focus/click and Escape with focus restoration; local errors stay visible. No profile, cookie or cache is published.

## Browser evidence and exact limits

Real browser typing, selection, add/remove, attachment intent, invalid review, mode switch, signer-prefix error, edit locks, deny review, API/access choices, retry, help focus/Escape and narrow viewport were exercised. Captures use explicit 1440x900 @1.25; narrow 650x800 @1.25. Shared-browser capture timed out; discarded those captures and recaptured every state in dedicated Chrome profile. Every final screenshot visually inspected; contact overview plus full-size approval/source inspections. No page errors in dedicated run.

This deliberately safe mock stores only fixture attachment booleans, never PEM, credentials or Base64. Fixture attachments are not functional file import and never claim material validity. Read-only source is a redacted projection, not bidirectional YAML. No raw-source parser, unsupported-source import, comment/unknown-field preservation or production lossless serializer is claimed or demonstrated. Production must retain the authoritative original document and patch owned paths, preserve comments/exact scalars/unknown siblings, and fall back without overwriting unsupported source. Mode switches preserve demonstrated scalar fields and usage rows only. Mode preference is not persisted in this isolated mock; no resource draft persists. These limits require production follow-up after mock review, not approval or shipped status.

Pending design decisions: exact secure import/raw-editor confirmation flow, admission error mapping, capability refresh and approval transition handling in existing action infrastructure. No separate controller dashboards are proposed.
