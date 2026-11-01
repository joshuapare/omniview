# Apps resource editor design · issue 266

Design preview only. No production React implementation, controller check, live connection, or mutation. Followed approved #249 interactive HTML workflow; no named mock skill was available. Reviewed with installed web-design-guidelines skill and fetched upstream rules. Native browser controls faithfully compose base-ui conventions; they are not shipped base-ui components.

## Coverage

- DaemonSet: create, populated RollingUpdate, count/percentage budgets, OnDelete consequence, edit identity/selector locks, placement/lifecycle, review, source and unsafe-source fallback.
- Standalone ReplicaSet: conditional create/edit, desired replicas, adoption consequence and review. Production must verify controller ownership before enabling this mode.
- Deployment-owned ReplicaSet: inspect only, owner reference, fixture status, owner context handoff, Scale action boundary and denied/unavailable/missing/empty/loading lookup states.
- ControllerRevision: inspect revision and controller owner; opaque data withheld; no ordinary create/edit, no status subresource; owner rollout boundary. Data immutability does not mean every metadata/revision API update is forbidden. The UI intentionally offers no direct updates.
- Deployment and StatefulSet remain shipped references, not redesigned.

## Field → control → exact owned path

All three resource kinds use apps/v1 and namespace scope. Identity is locked in edit. Create fixture namespace is explicitly preview, not an inferred production default.

| Resource | Field / control | Manifest path / behavior |
|---|---|---|
| DaemonSet, standalone ReplicaSet | Name / text | metadata.name; edit locked |
| Both | Namespace / fixed fixture destination | metadata.namespace; edit locked; production requires explicit namespace picker when no single destination exists |
| Both | Container image / text | spec.template.spec.containers[0].image; mock container name is main; no image inserted in empty create |
| Both | Linked app label / text | spec.selector.matchLabels.app and spec.template.metadata.labels.app; selector immutable on edit; guided editor locks this linked key |
| DaemonSet | Update strategy / choice | spec.updateStrategy.type; omitted, RollingUpdate, OnDelete |
| DaemonSet | Max unavailable / count or % | spec.updateStrategy.rollingUpdate.maxUnavailable; integer count or string percentage |
| DaemonSet | Max surge / count or % | spec.updateStrategy.rollingUpdate.maxSurge; integer count or string percentage |
| DaemonSet | History / nonnegative integer text | spec.revisionHistoryLimit; blank omitted; explicit zero retained |
| Both | Node OS / optional choice | spec.template.spec.nodeSelector["kubernetes.io/os"]; no constraint means omitted |
| Both | Minimum ready / integer seconds | spec.minReadySeconds; blank omitted |
| Standalone ReplicaSet | Desired replicas / integer text | spec.replicas; blank omitted, explicit zero integer |
| Both | Advanced source / textarea | Full raw document retained verbatim after manual edit; Form and Review locked, not parsed or normalized |
| Owned ReplicaSet | Owner / inspect row | metadata.ownerReferences where controller=true; handoff to existing Deployment inspector |
| Owned ReplicaSet | Desired / ready / inspect | spec.replicas, status.readyReplicas; fixture values, never permission or health proof |
| Owned ReplicaSet | Status / inspect | status.replicas, status.readyReplicas, status.availableReplicas; no status write |
| ControllerRevision | Revision / exact read-only integer | revision int64, never JavaScript numeric conversion of imported source |
| ControllerRevision | Owner / inspect | metadata.ownerReferences; no ownership detach/adopt |
| ControllerRevision | Payload / withheld | data opaque serialized state; no ordinary editor, raw capture, invented rollback, or projection writeback |
| Inspect interfaces | Source projection / read-only | Synthetic identity; annotation values and revision payload withheld; never a submission source |

Complex selectors, template labels beyond the linked key, multiple containers, ports, resources, probes, environment, volumes, tolerations, affinity and other Pod fields use advanced source in this mock. Production should reuse shipped WorkloadForm compositions, not establish a second Pod editor. Production must preserve every unedited sibling and unknown field via the existing AST patcher. This mock demonstrates exact unedited Form/source toggles and exact retention of manually edited invalid source, not a general lossless YAML parser. There is no array editing UI here; no add/remove interaction claim.

OnDelete retains hidden RollingUpdate branch drafts in memory but omits rollingUpdate from generated source until switching back. No hidden rollout or Pod deletion occurs. DaemonSet has no replicas or Scale endpoint. Both zero rollout budgets are locally rejected. Full Kubernetes name, selector, percentage bounds, Int32 limits, image syntax, Pod-spec and admission validation remain production responsibilities; this prototype does not claim server-valid payloads for arbitrary input.

## Ownership and safety

A schema or discovery result is not authorization. Production gates each operation on discovered apps/v1 serving, exact verbs, namespace, ownership, concurrency baseline and admission. Stable resources require no install-specific CRD or alpha feature gate. Do not infer controller availability from discovery. Gated status additions remain read-only and source-preserved.

Existing selectors are immutable. Do not silently delete/recreate resources or detach owner references. ReplicaSet template updates do not themselves roll existing Pods; replica count changes may remove Pods, and matching orphan Pods may be adopted. Use the owning Deployment for managed children. Direct standalone scaling must check HPA/field-manager ownership and use existing actions where appropriate.

Scale is autoscaling/v1 Scale served at deployments/scale, statefulsets/scale and replicasets/scale. It is not a standalone apps resource. No DaemonSet Scale. Keep existing action workflows; show destination, current/requested replicas, HPA conflicts and disruption consequences there. Revision rollback is an owner-specific workflow, not editing ControllerRevision.data. Revision pruning/deletion can remove rollback history; this mock intentionally provides no delete execution.

Credentials are never entered, fetched, revealed or persisted. Revision payload and annotation values are not shown. All references and status are fixture-only. No source draft persists. Only explicit Form/YAML preference uses issue-266-mode localStorage. Fixture selectors outside the working frame reset the selected scenario; they are a harness, not resource navigation.

## Composition and provider ownership

Use existing native Kubernetes provider for apps/v1; no third-party plugin needed. Reuse ResourceManifestEditor.tsx:1-90 (Button, SegmentedControl, CodeEditor, mode preference, draft inspection, source/redaction boundary), existing WorkloadForm, FormField/Input/Select, Tooltip/Popover, Dialog, section navigation and read-only tables. HTML dark tokens model semantic surface/border/text/accent roles. No new generic base-ui primitive proposed. Count/percentage parsing and ownership rules stay in Kubernetes adapter. Sent findings to #263/#264 workers.

Frame: 1000×700; controls 32px; body 13px; padding 20×24px; gaps 16px. Captures 01–19: 1440×900 CSS viewport, device scale 1.25, PNG 1800×1125. Capture20: 640×760 CSS viewport, scale1.25. Fixed footer, internal content scroll. All20 captures visually inspected. Early shared-browser capture timed out; successful proof used isolated Chrome profile in owned directory. Browser profile is excluded from publication. No repository build, lint, tests or formatter ran.

## Capture index

01 empty DaemonSet; 02 required errors and first-field focus; 03 rolling-update budgets; 04 focus help; 05 non-mutating review; 06 OnDelete warning; 07 placement/lifecycle; 08 source; 09 edit locks; 10 standalone ReplicaSet; 11 adoption/disruption review; 12 standalone edit; 13 invalid source retained with exact large integer; 14 Deployment-owned inspector; 15 denied lookup; 16 owner Scale boundary; 17 ControllerRevision inspector; 18 revision ownership; 19 rollout boundary; 20 narrow denied state with visible footer.

## Sources

- Pinned schema: https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L46540-L52055 ; fetched raw full document and inspected DaemonSetSpec, RollingUpdateDaemonSet, ReplicaSetSpec, ControllerRevision and namespaced resource/status/scale routes.
- Update validation: https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/apis/apps/validation/validation.go ; inspected ValidateDaemonSetSpecUpdate, ValidateReplicaSetUpdate and ValidateControllerRevisionUpdate. Selector immutability and data immutability derive from validation, not merely schema prose.
- Approved frame/workflow: https://github.com/omniviewdev/omniview/issues/249 ; https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72 ; https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74 .
- Shared intent: https://github.com/omniviewdev/omniview/issues/262 . Baseline k8s.io modules v0.35.0 / Kubernetes v1.35.0, not a latest-version claim.

## Review decisions and limits

Review whether standalone ReplicaSet create should remain behind an advanced entry point; proposed yes. Review whether owner handoff needs an existing host navigation action or a provider callback. Mock owner buttons show honest context-boundary views, not working production navigation. Unknown/denied owners must not unlock standalone editing. Source-only advanced fields need existing parser and schema safety before production submission. No production integration, real RBAC, admission, scheduler, rollout, scaling or reconciliation was exercised. Await mock review; issue remains open.
