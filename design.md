# APIService editor design — issue 280

Design mock only; not approved, shipped, or connected to a cluster. Covers the single unchecked component, APIService, including self-managed remote registration, local registration, auto-managed inspection, availability and capability boundaries. Synthetic fixture selection sits outside the working frame.

## API snapshot and authority

- Kubernetes v1.35.0 [OpenAPI endpoints](https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L45627-L46539): cluster-scoped `apiregistration.k8s.io/v1` APIService; ordinary create/get/list/update/patch and separate status endpoint. Discovery is not authorization.
- [kube-aggregator v0.35.0 API types](https://github.com/kubernetes/kube-aggregator/blob/v0.35.0/pkg/apis/apiregistration/v1/types.go): Service reference, TLS trust, priorities, controller-owned conditions.
- [Pinned validation](https://github.com/kubernetes/kube-aggregator/blob/v0.35.0/pkg/apis/apiregistration/validation/validation.go): exact name relationship; only v1 permits empty group; group priority 1–20000 and version priority 1–1000 inclusive. Validation code comparison is authoritative despite error wording saying “less than”. Explicit Service port 1–65535. Local handling forbids CA and insecure TLS. CA and insecure are mutually exclusive.
- [Autoregistration controller](https://github.com/kubernetes/kube-aggregator/blob/v0.35.0/pkg/controllers/autoregister/autoregister_controller.go): auto-managed identity is not a safe ordinary edit target.
- Approved composition references: [#249](https://github.com/omniviewdev/omniview/issues/249), [PR72](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72), [PR74](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74).

No additional feature gate applies to stable v1 authoring. Aggregation must be served/configured, selected service must exist, authorization must allow each operation, and the backing aggregated server must support its claimed API. None is established by this mock. Native Kubernetes provider should own this editor; aggregated service resources belong to their own discovered schemas/providers.

## Field → control → exact ownership

| Field | Control | Manifest path / behavior |
| --- | --- | --- |
| Group | DNS text | `spec.group`; empty allowed only with v1 |
| Version | DNS-label text | `spec.version` |
| Registration name | Derived display | `metadata.name = version + '.' + group`; immutable on edit |
| Group discovery rank | Bounded integer | `spec.groupPriorityMinimum`, required, no chosen default |
| Version rank | Bounded integer | `spec.versionPriority`, required, no chosen default |
| Remote/local | Select | Remote `spec.service` object; local omits whole object and TLS properties |
| Service namespace | Reference selector | `spec.service.namespace`; NOT APIService namespace |
| Service name | Reference selector | `spec.service.name`; fixture choices only, no companion creation |
| Service port | Optional bounded integer | `spec.service.port`; blank omits, API defaults to 443 |
| System trust | TLS select | Omit `spec.caBundle` and `spec.insecureSkipTLSVerify` |
| Custom CA | Explicit unavailable import branch | Production: upload exact PEM bytes to byte-valued `spec.caBundle`, serialized Base64. Keep existing bytes by default, explicit replace/remove, masked filename-only representation. Mock accepts no material and blocks review in this branch. Never infer certificate validity. |
| Insecure TLS | Consequential TLS branch | `spec.insecureSkipTLSVerify: true`; omit CA; visible interception warning and review |
| Labels | Add/remove key/value rows | `metadata.labels[key]`, string values; remove only selected key |
| Annotations / unfamiliar metadata | Source-only boundary | Preserve all unowned paths; never normalize embedded annotation content. Mock imports no existing annotations. |
| Availability | Read-only condition display | `status.conditions[]`: type/status/reason/message/lastTransitionTime; no status mutation. Fixture omits message and transition value rather than inventing health. |

Edit locks group/version because changing either alone violates immutable `metadata.name` relationship; this is a derived invariant, not a separate spec immutable declaration. Other spec fields may change subject to admission and ownership. Auto-managed fixture disables fields and review. Production ownership must inspect real managedFields/ownerReferences/automanagement metadata, distinguish field ownership conflicts, and never assume all APIService objects are controller-owned.

## UX and source contract

1000×700 desktop frame, 180px section rail, 32px controls, 13px text, 20×24 content padding, 16px gaps. Height contracts on small windows; internal scroll retains footer. HTML faithfully composes intended semantic base-ui controls; no React controls or new shared release shipped. Reuse Dialog, SegmentedControl, FormField, Input, NumberInput, Select/Combobox, Tooltip/Popover, Table and Buttons. Resource rules stay in Kubernetes adapter; no new generic primitive proposed.

Help opens by focus/hover/click, Escape dismisses before any modal action and restores help trigger focus. Main view retains consequential warnings. Validation is local and focuses an alert summary; field-level association remains a production design improvement. Mode changes never mutate a cluster.

Form state generates bounded YAML. Label insertion/removal, omission and TLS/local branches affect exact documented paths. Manual YAML edits remain byte-for-byte in memory across Form/YAML switches, including invalid input, comments and the integer 9007199254740993. Form intentionally locks after any manual source edit. This is not a demonstrated bidirectional lossless YAML AST editor. Production must reuse existing manifestDraft AST leaf patches and preserve comments, unknown values, scalar types and siblings; do not replace it with this generator. No draft, credential, mode preference or source is persisted by this isolated mock. Production explicit mode preference remains inherited from shared frame, not redesigned here.

Remote/local switching retains branch drafts in memory but omits inactive paths from projection. Custom CA is honestly unavailable, not a fake upload. No raw PEM, credential, annotations or private material appears in screenshots, accessible names, logs or checks. Review is destination-aware and non-mutating; no Apply or fake success exists.

## Capture coverage

All desktop captures: 1440×900 CSS pixels at 1.25 device scale (1800×1125 raster). Narrow capture: 760×800 at 1.25. Inputs, clicks, native selects, add/remove, help focus/Escape and source editing were driven in a real isolated Chrome process. Every image reviewed in contact sheet. Narrow footer bounds: y697, height59, within 800px viewport. No horizontal document overflow observed.

1. `01-create.png`: clean APIService registration, no guessed values.
2. `02-validation.png`: required/range failures, focused alert.
3. `03-help.png`: contextual priority help, keyboard focus.
4. `04-service-tls.png`: existing Service, explicit 8443, insecure TLS warning.
5. `05-review.png`: destination, routing/TLS consequence; no mutation.
6. `06-local.png`: local omission boundary; no handler installation claim.
7. `06b-labels.png`: tailored metadata row creation/edit; removal exercised afterward.
8. `07-edit.png`: immutable identity, mutable priorities.
9. `08-managed.png`: auto-managed inspect-only ownership.
10. `09-availability.png`: controller-owned False condition and denied reference lookup.
11. `10-source-fallback.png`: manually edited raw source blocks Form.
12. `11-raw-source.png`: exact invalid source/comment/large integer retained.
13. `12-denied.png`: denied authorization, no inferred object.
14. `12-absent.png`: missing discovery distinct from failure.
15. `12-unavailable.png`: discovery failure distinct from empty resources; retry retains draft.
16. `13-narrow.png`: responsive internal frame and visible footer.

## Review and limits

Used installed web-design-guidelines skill and fetched its actual upstream rules. No named mock-generation skill was exposed; followed approved #249 workflow. Review found footer overflow at narrow size; corrected height budget and recaptured all states. Remaining deliberate mock limits: no production focus trap/close lifecycle, no YAML parser/AST patcher, no secure CA import, no persisted preference, simplified fixture lookup rather than live namespace-filtered discovery, no server validation/RBAC/reachability/health checks. Initial shared browser screenshot attempts timed out; dedicated Chrome PID16988 resolved capture. Only final successful captures are published. No repository builds, tests, formatters, source changes or live mutations ran.

Open review decisions: should auto-managed administrators receive an explicit source-only escalation outside this mock? Should local authoring be admin-only in initial product rollout? Both require capability/ownership review, not guessed permission.
