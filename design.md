# Kyverno editor design — issue 327

Design proposal awaiting review. Interactive HTML composition, not production React. No controller or API requests. Synthetic preview-cluster / preview fixtures only. Followed #249 interactive workflow; no named mock skill was available. Reviewed known prototype against the fetched web-design-guidelines source. Reused approved 1000×700 frame, 32px controls, 13px body, 180px navigation, 20×24px content padding, 16px field gap, internal scroll and fixed footer. Visual review caught and fixed clipped Remove buttons.

## Source snapshot and API applicability

Kyverno v1.15.2 resolves through annotated tag 591e214e0e0e951bbfdc6b6d6e9bcd41cecfeae1 to commit f4ffc2d43d2d93b3daf3e5a9cb8a5d42738aba4b.
Primary directory: https://github.com/kyverno/kyverno/tree/f4ffc2d43d2d93b3daf3e5a9cb8a5d42738aba4b/config/crds/kyverno . Full release schema snapshots are bundled in sources/.

| Component | Guided version | Other served version | Scope | Boundary |
|---|---|---|---|---|
| Policy | v1 storage | v2beta1 | Namespaced | Create/edit candidate; namespaced resource match only |
| ClusterPolicy | v1 storage | v2beta1 | Cluster | Create/edit candidate; potentially cluster-wide impact |
| CleanupPolicy | v2 storage | v2beta1 | Namespaced | Destructive scheduled deletion within namespace |
| ClusterCleanupPolicy | v2 storage | v2beta1 | Cluster | Destructive scheduled deletion across allowed scope |
| PolicyException | v2beta1 storage | none | Namespaced | Feature/exception-namespace configuration prerequisite |
| GlobalContextEntry | v2alpha1 storage | none | Cluster | Alpha installation; background cache/call permissions prerequisite |
| UpdateRequest | v2 storage | v1beta1 | Namespaced | Controller work; inspect only, no ordinary create/edit/retry/status action |

Discovery, served schemas and verbs do not prove authorization, controller support or health. Kyverno admission/background controllers must support selected operation. Cleanup requires cleanup controller and its deletion permissions; generation/background mutation require background controller permissions. Exception feature enablement and configured namespace must be checked before authoring. These are requirements, not fixture capability claims.

Each source filename is kyverno.io_<plural>.yaml. Versions, scope and properties were read from these actual pinned files. No CRD CEL immutability constraint was found in the targeted schema search; this does not promise arbitrary updates pass Kyverno admission. Lock name, namespace, GVK and existing status/ownerReferences; preserve resourceVersion optimistic concurrency in production. Never delete/recreate to bypass rejected updates.

## Exact field → control → manifest mapping

Common name input → metadata.name. Namespace input → metadata.namespace for namespaced resources only. Cluster scope never emits metadata.namespace. Edit identity locks. Ownership selector is a fixture capability, not a manifest property; GitOps-owned objects route upstream and block direct review. No ownerReferences/status edits.

### Policy and ClusterPolicy

Rule name → spec.rules[0].name. Rule operation selects exactly one branch without emitting other operations. This guided example authors one rule; arbitrary additional rules remain source-only, not silently dropped.

- Match rows (kind and exact/wildcard name) → spec.rules[0].match.any[i].resources.kinds[0] and .names[0]. Each row is OR; fields within a row are AND. No matches means invalid, not match-all.
- Validate: failure action Select → spec.rules[0].validate.failureAction (Audit / Enforce); message → .validate.message; required label key/value-pattern → .validate.pattern.metadata.labels[key]. Enforce warns visibly about admission rejection.
- Mutate: label key/value → spec.rules[0].mutate.patchStrategicMerge.metadata.labels[key]. This is admission mutation, not a background mutation shortcut. Existing targets, foreach and JSON6902 remain advanced source.
- Generate: explicit name/namespace → .generate.name and .generate.namespace; this composed example explicitly generates a v1 ConfigMap, .generate.apiVersion and .kind. Synchronize Select → .generate.synchronize boolean; data key/value → .generate.data.data[key]. No implicit downstream object creation occurs in the mock. Production must present generation target and synchronization consequences in diff review.
- Advanced-only paths: .exclude, .match.all, resource selectors/namespaceSelectors/operations, subjects, roles, clusterRoles, .context[], .preconditions, verifyImages, podSecurity, CEL, foreach, clone/cloneList, generateExisting, mutateExistingOnPolicyUpdate and spec.webhookConfiguration. Preserve all these paths instead of normalizing into the label-rule subset.

### CleanupPolicy and ClusterCleanupPolicy

Cron input → spec.schedule. Propagation Select → spec.deletionPropagationPolicy: Foreground / Background / Orphan. Match rows → spec.match.any[i].resources.kinds[0] and .names[0]. Advanced source owns spec.exclude, spec.conditions and spec.context. No fabricated suspend, expiry, timezone or dry-run field. Cron syntax/controller evaluation requires production validation, not an invented execution preview. Namespace scope is not a promise that cluster-scoped kinds are eligible. Source/installed controller must qualify matches.

Show deletion consequences directly on scope and review. Broadened match, removed exclude, shortened schedule and propagation changes must appear in production diff. No run-now or delete action. No fake matched count, successful cleanup, rollback or undo.

### PolicyException

Policy reference → spec.exceptions[0].policyName: ClusterPolicy name, or namespace/name for Policy. Rule input → spec.exceptions[0].ruleNames[0]. Match rows → spec.match.any[i].resources.kinds[0] and .names[0]. Background behavior, conditions, podSecurity exceptions and additional exception/rule entries remain source-only. Do not expose a fictitious expiresAt field: no native expiry field exists in these schemas. A time-limited exception requires reviewed conditions plus compatible runtime context; expiration/removal is not automatically scheduled by this mock. Keep bypass consequence and no automatic expiry visible. Reference lookup must retain unresolved names and distinguish denied from empty.

### GlobalContextEntry

Source Select is an exclusive union: spec.kubernetesResource OR spec.apiCall.

- Resource group/version/plural/namespace inputs → spec.kubernetesResource.group, .version, .resource, .namespace. Empty namespace means all namespaces for namespaced resources; visible broad-scope warning.
- API path/method/refresh inputs → spec.apiCall.urlPath, .method GET/POST, .refreshInterval duration string. POST can cause writes; visible warning, never execute a test call.
- Advanced-only: .apiCall.data[].key/value, retryLimit, mutually exclusive service.url versus urlPath, service.headers and caBundle, spec.projections[].name/jmesPath. No headers, certificate material or resolved values exist in captures. If production supports sensitive source, use a separate redacted projection and explicit consent path; never feed projection back into source.

### UpdateRequest

Read-only inspection maps policy/rule/type/trigger to spec.policy, .rule, .requestType, .resource (apiVersion/kind/namespace/name). State/retries/generated resources map status.state, .retryCount, .generatedResources. Admission context, status.message, annotations and resolved request contents should stay out of default previews because they may carry sensitive data. Policy-reference action only reveals an offline reference boundary; no fake navigation success, retry, reset, status patch or generated-resource deletion. Source is read-only and deliberately contains only safe synthetic fields.

## Draft and mode contract

Forms serialize a bounded safe subset into YAML 1.2 using JSON flow values. Manual source edits lock guided Form; exact raw text remains in memory, including invalid documents, comments, unknown content and large integers. Browser checks prove raw preservation on demonstrated paths only. This is not a YAML parser or a lossless AST patch implementation. Returning to Form after manual editing never reserializes or discards raw source. Reset fixture is an explicit destructive reset of the mock draft. Only explicit mode preference persists under kyverno-mock-mode; resource values do not persist. There is no credential import/reveal flow.

Production should reuse the existing host-owned AST draft bridge from PR72/PR74 and provider applicability contracts from #263. Preserve unowned nodes, comments, exact scalar spelling/type, omission and sibling values. Unsupported versions/shapes remain source-only without conversion. A Kyverno add-on provider owns semantics, not built-in hardcoded OSS forms in the Kubernetes plugin. Capability changes cannot drop the draft.

## Reuse, accessibility and decisions

Compose installed Dialog, FormField, Input, Select, SegmentedControl, Button, Tooltip/Popover, Table, Collapsible and existing Monaco editor. HTML is an isolated visual approximation with semantic colors; production must use actual base-ui theme tokens. No generic base-ui primitive proposal is justified by this mock. Match/exclude predicates, cron semantics, Kyverno expression grammar and controller capabilities belong in the add-on adapter.

Native labeled inputs/selects and buttons support keyboard interaction. Visible focus ring, focus/hover/click help, Escape-first dismissal, live alert errors, direct safety notes and visible footer are demonstrated. Production must retain the real shared Dialog focus trap, opener restoration, accessible descriptions and nested portal behavior; this standalone composition is not evidence of those shipped behaviors.

## Browser evidence and limits

41 real-browser screenshots. 96 named boolean checks all passed. Standard captures: 1440×900 CSS pixels at device scale 1.25, yielding 1800×1125 PNG. Narrow screenshot: 720×760 CSS pixels at the same scale. Every screenshot was visually inspected in readable contact sheets; targeted full-size policy inspection found/fixed Remove clipping before final captures. Capture scripts drove actual fill/select/click/keyboard/hover actions without state injection. Browser closed after capture. No preview server was needed; local file pages and unique owned persistent profile provided isolation.

Evidence covers each kind; six authoring kinds have initial, invalid, populated, non-mutating review and edit identity captures. Policy includes validate/mutate/generate plus source fallback and unsupported version; GlobalContextEntry includes resource and API branches; UpdateRequest includes inspect/reference and read-only source; additional GitOps, help and narrow states. Availability states were interacted with for all six authoring kinds.

Limits: offline HTML, not installed add-on or production React. Local validation checks required groups rather than full DNS/cron/Kyverno grammar or all branch-required fields; no server validation or mutation exists. Edit examples demonstrate immutable identity, not live loaded-object merging. Source-only review is non-mutating and does not parse/validate manual source. Advanced-only fields remain manual source, not additional guided controls. No claim of full bidirectional AST editing, arbitrary schema coverage, RBAC implementation, controller reconciliation, secret-safe arbitrary import, or approved design. These are explicit mock boundaries requiring production integration and review, not success fallbacks.
