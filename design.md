# StorageVersion inspection mock — issue 286

Design only; pending review. Interactive standalone HTML composition, not shipped React or a live Kubernetes client. Open index.html in a browser or serve this directory. Scenario selector sits outside the 1000×700 working frame. Browser proof uses an isolated Chrome profile, 1440×900 CSS pixels at 1.25 device scale; narrow proof uses 640×820 at 1.25.

## Classification and ownership

Only assigned component: `internal.apiserver.k8s.io/v1alpha1 StorageVersion`. Cluster scope. API-server bookkeeping, not an ordinary user-created resource. Native Kubernetes plugin owns this inspector; no third-party provider required. API-server instances own reports and status. Empty spec offers no user intent. Create, Edit, Delete, `/status` authoring, feature-gate changes and RBAC changes are deliberately absent, regardless of discovered write verbs. Review is a non-mutating ownership boundary, not a mutation confirmation. Refresh only resets synthetic fixture view and states that no request was sent.

Pinned Kubernetes v1.35.0 / modules v0.35.0. StorageVersionAPI is Alpha, default false, depends on APIServerIdentity. A missing discovery entry is not proof that the feature gate alone caused absence. Read denied, API unavailable, absent API, empty reports and unsupported representation remain separate states. Encoding agreement is reported evidence, never proof of completed storage migration or control-plane health.

## Exact mapping

All paths below are inspection-only; owned writable manifest paths: **none**.

| Field/path | Control/presentation | Boundary |
|---|---|---|
| `apiVersion`, `kind` | Footer version, heading, read-only source | Only v1alpha1 mapping supported |
| `metadata.name` | Fixed destination/resource label | `<group>.<resource>`; no rename; cluster-scoped |
| `metadata.generation` | Read-only source | No numeric parse/rewrite |
| `spec` | Ownership row, `spec: {}` source | Empty spec; not a form |
| `status.commonEncodingVersion` | Encoding badge or “Not reported” | Omission not replaced with a guessed version |
| `status.storageVersions[*].apiServerID` | Server table and local text filter | List-map keyed by apiServerID; no add/remove |
| `status.storageVersions[*].encodingVersion` | Encoding chip per row | A report, not desired state |
| `status.storageVersions[*].decodableVersions` | Compact version set | Must contain encoding and served versions; no user editing |
| `status.storageVersions[*].servedVersions` | Compact version set | Distinct from encoding and decoding |
| `status.conditions[*].type` | Conditions detail label | List-map keyed by type |
| `status.conditions[*].status` | True/False fixture observation | Real API also permits Unknown; not inferred from absence |
| `status.conditions[*].reason`, `.message` | Read-only condition detail | Fixture prose only; production strings need sensitive-content handling |
| `status.conditions[*].observedGeneration` | Exact read-only value | int64; no JS coercion/write path |
| `status.conditions[*].lastTransitionTime` | UTC observation time | Not a refresh timestamp |
| Other metadata / unknown fields | Original read-only source in production design | No form ownership or conversion; sensitive projection must be separate |

## Coverage and evidence

- 01-agreement.png — initial populated StorageVersion, per-server decode/serve/encode reports.
- 02-filter-empty.png — actual typing, no-match filter feedback, Clear filter exercised.
- 03-disagreement.png — differing server encodings; omitted common encoding.
- 04-conditions.png — condition fields and false agreement observation.
- 05-ownership.png — read-only identity/spec/status/feature-gate boundary.
- 06-boundary-review.png — non-mutating review, destination, manual-write consequence; Escape exercised.
- 07-source.png — advanced read-only snapshot, internal scrolling, fixed footer.
- 08-help.png — keyboard-opened accessible on-demand help; Escape closes and restores focus.
- 09-empty.png — no reports, agreement unknown.
- 09-missing.png — API not discovered, no gate enabling action.
- 09-denied.png — 403 distinct from missing discovery.
- 09-unavailable.png — 503, no stale status presented as current.
- 09-unsupported.png — unsupported version stops mapping; no conversion or write.
- 10-narrow.png — 640px viewport, no horizontal page overflow, visible footer.

No create/edit draft, validation form, reference mutation picker or add/remove interaction applies to this generated record. Local filter input, fixture branch selection, section switches, source navigation, refresh, review and keyboard help were exercised. Source string remained unchanged across section round-trip. This is not a lossless authoring implementation: no AST, invalid YAML parser, persistence, import or submission exists. Unsupported representation intentionally stops field rendering; raw unsupported responses are not captured. Production source fallback must retain original bytes and expose only a separately redacted read-only projection when safe. The prototype contains no credential or annotation data.

## Reuse

Follow approved issue 249 frame and PR72/PR74 interaction baseline, without a misleading Form/YAML authoring switch. Existing settings evidence: `omniview/ui/pages/settings/SettingsNav.tsx` imports base-ui NavList; `SettingsFormShell.tsx` uses Button; `SettingsEntries.tsx` composes IconButton with existing HintTooltip; `AiToolsSettingsPage.tsx` composes Select and TextField. Production composition: existing dialog/frame + NavList + Button/IconButton + TextField + Chip + table + HintTooltip. This prototype faithfully approximates semantics and density using HTML, not actual base-ui React. Colors are isolated approximations, not an assertion of exact runtime theme tokens. No new generic primitive needed; Kubernetes semantics stay in adapter/inspector.

## Sources and review

- [Pinned OpenAPI definitions and paths](https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L66522-L67434): StorageVersion, StorageVersionStatus, ServerStorageVersion and StorageVersionCondition definitions read directly from pinned JSON; collection/item/status endpoints confirm cluster scope.
- [Pinned feature definitions](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/features/kube_features.go#L2085-L2087) and [versioned gate defaults/dependency](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/features/versioned_kube_features.go): Alpha, default-off, APIServerIdentity dependency.
- [Epic262](https://github.com/omniviewdev/omniview/issues/262), [approved mock workflow249](https://github.com/omniviewdev/omniview/issues/249), [PR72](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72), [PR74](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74).
- Visual review used installed `web-design-guidelines` skill and fetched its actual Vercel guideline source. Reviewed known HTML for labeled controls, focus styles, semantic buttons/table, native modal focus, dark controls, internal scroll and responsive footer. No named mock skill was available; approved interactive HTML workflow used instead.

## Limits

All permissions, server reports, failures and timestamps are synthetic fixtures. No API discovery, RBAC check, health check, production behavior or persistence is proven. No repository builds/tests/lint ran. Real Kubernetes versions beyond the pin require discovery/schema checks. Design approval and production implementation remain open. Initial shared-browser captures timed out; published captures came from dedicated isolated Chrome, not shared browser. Browser profile/caches are excluded from publication.
