# Core v1 resource editor design — issue 265

Interactive HTML mock, not shipped React. All fixtures synthetic. No cluster connections or mutations. Approved #249 composition; no named mock skill exposed. Visual review used web-design-guidelines and its fetched command.md.

## API grounding
Kubernetes v1.35.0 / k8s.io v0.35.0. Primary source: https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json . api-snapshot.json retains pinned kind definitions. Inspected actual property names from fetched OpenAPI, including status ownership, deprecated Endpoints/ComponentStatus and ServiceAccount top-level automount field.
References: Epic #262, #249, plugin PR72 and PR74. Existing Pod, Service, ConfigMap, Secret and PVC forms are reference-only.

## Field mapping
All kinds use metadata.name; namespaced kinds fix metadata.namespace=preview. Edit locks identity. Labels rows own metadata.labels[key]. Status, generated metadata and ownerReferences remain outside authoring. Blank/Omit leaves a path absent. Quantities are strings, automount is boolean, replicas/ports are integers.

### Namespace
Cluster scope. Create and edit guided fields. Namespace deletion removes namespaced resources. Finalizers require a separate administrator review.

| Control | Manifest path |
|---|---|
| Pod security enforcement | `metadata.labels.pod-security.kubernetes.io/enforce` |
| Environment label | `metadata.labels.environment` |

Capture: screenshots/Namespace.png

### ServiceAccount
Namespace scope. Create and edit guided fields. Token issuance is a separate short-lived request. No token or legacy credential Secret is created.

| Control | Manifest path |
|---|---|
| Mount API credentials | `automountServiceAccountToken` |
| Image pull Secret reference | `imagePullSecrets[0].name` |
| Additional pull Secret | `imagePullSecrets[1].name` |

Capture: screenshots/ServiceAccount.png

### ResourceQuota
Namespace scope. Create and edit guided fields. Lower limits may block new workloads. Existing usage is controller-reported, not editable.

| Control | Manifest path |
|---|---|
| CPU requests | `spec.hard.requests.cpu` |
| Memory requests | `spec.hard.requests.memory` |
| Pod count | `spec.hard.pods` |
| Scope | `spec.scopes[0]` |
| Priority class scope value | `spec.scopeSelector.matchExpressions[0].values[0]` |

Capture: screenshots/ResourceQuota.png

### LimitRange
Namespace scope. Create and edit guided fields. Defaults affect new admissions, not running Pods. Container-only defaults hide for other types.

| Control | Manifest path |
|---|---|
| Applies to | `spec.limits[0].type` |
| Minimum memory | `spec.limits[0].min.memory` |
| Maximum memory | `spec.limits[0].max.memory` |
| Default memory limit | `spec.limits[0].default.memory` |
| Default memory request | `spec.limits[0].defaultRequest.memory` |
| Maximum CPU limit/request ratio | `spec.limits[0].maxLimitRequestRatio.cpu` |

Capture: screenshots/LimitRange.png

### PodTemplate
Namespace scope. Create and edit guided fields. Stores a template only. No Pod or workload controller is created.

| Control | Manifest path |
|---|---|
| Template application label | `template.metadata.labels.app` |
| Container name | `template.spec.containers[0].name` |
| Container image | `template.spec.containers[0].image` |
| CPU request | `template.spec.containers[0].resources.requests.cpu` |
| Service account | `template.spec.serviceAccountName` |

Capture: screenshots/PodTemplate.png

### PersistentVolume
Cluster scope. Conditional authoring after explicit ownership acknowledgment. Static administrator NFS example only. Delete reclaim policy can delete backing storage. Existing volume source is immutable.

| Control | Manifest path |
|---|---|
| Capacity | `spec.capacity.storage` |
| Access mode | `spec.accessModes[0]` |
| Volume mode | `spec.volumeMode` |
| Storage class | `spec.storageClassName` |
| NFS server | `spec.nfs.server` |
| NFS path | `spec.nfs.path` |
| Reclaim policy | `spec.persistentVolumeReclaimPolicy` |

Capture: screenshots/PersistentVolume.png

### ReplicationController
Namespace scope. Conditional authoring after explicit ownership acknowledgment. Legacy standalone controller only. Selector must match template labels. Scaling may create or terminate Pods.

| Control | Manifest path |
|---|---|
| Replicas | `spec.replicas` |
| Selector application | `spec.selector.app` |
| Template application label | `spec.template.metadata.labels.app` |
| Container name | `spec.template.spec.containers[0].name` |
| Container image | `spec.template.spec.containers[0].image` |

Capture: screenshots/ReplicationController.png

### Endpoints
Namespace scope. Conditional authoring after explicit ownership acknowledgment. Deprecated API. Manual endpoints only for selectorless Services. Addresses redirect traffic; controller-owned endpoints are inspect-only.

| Control | Manifest path |
|---|---|
| Ready address | `subsets[0].addresses[0].ip` |
| Not-ready address | `subsets[0].notReadyAddresses[0].ip` |
| Port name | `subsets[0].ports[0].name` |
| Port number | `subsets[0].ports[0].port` |
| Protocol | `subsets[0].ports[0].protocol` |

Capture: screenshots/Endpoints.png

### Node
Cluster scope. Inspect/action only. Kubelet registers Nodes. Drain requires eviction, PDB and local-data review. No Node creation or status editing.

| Control | Manifest path |
|---|---|
| Scheduling | `spec.unschedulable` |
| Taints | `spec.taints[]` |
| Conditions | `status.conditions[]` |

Capture: screenshots/Node.png

### Event
Namespace scope. Inspect/action only. Generated event record. Not durable audit history. No create, edit, or replay.

| Control | Manifest path |
|---|---|
| Reason | `reason` |
| Type | `type` |
| Object | `involvedObject` |
| Message | `message` |
| Count | `count` |
| Reporter | `reportingComponent` |

Capture: screenshots/Event.png

### ComponentStatus
Cluster scope. Inspect/action only. Deprecated health interface; no replacement health dashboard or fabricated healthy result.

| Control | Manifest path |
|---|---|
| API lifecycle | `kind` |
| Conditions | `conditions[]` |

Capture: screenshots/ComponentStatus.png

## Ownership and advanced boundaries
- Namespace: spec.finalizers and deletion status are not ordinary form fields. Finalize is a separate PUT subresource review; never auto-remove finalizers. Pod-security label changes can broaden/restrict admission and need production diff review.
- ServiceAccount: imagePullSecrets are same-namespace names only, no value fetch. secrets[] is retained/generated linkage, not legacy token authoring. TokenRequest needs audience, bounded expirationSeconds, optional boundObjectRef and POST-only confirmation; returned token must remain masked and memory-only. This mock connects to that workflow, does not mint tokens.
- ResourceQuota: hard quantities are requested limits; status.hard/used are controller observations. Scope selector uses scopeName PriorityClass, operator In, explicit values. Production validates scope combinations, resource applicability and supported quantity syntax.
- LimitRange: default/defaultRequest only for Container; Pod/PVC branches disable these controls. Multiple items and resource keys use advanced source, not implicit object replacement. Production enforces min <= defaultRequest <= default <= max when present and validates ratio.
- PodTemplate: actual template path is template.spec, not spec.template.spec. Existing multi-container Pod composition should embed here; this bounded mock shows one container. No executable image chosen by default.
- PersistentVolume: static NFS administrator path only; CSI/local/other unions stay source-only. Dynamic or controller-owned PVs inspect-only. NFS source and volumeMode lock in edit. Production also enforces capacity decreases, access changes, claimRef ownership, node affinity and driver immutability; no delete/recreate shortcut. Claim binding/status not fabricated.
- ReplicationController: standalone legacy only; source-only for controller ownership. Selector map differs from apps matchLabels. Scale is separate /scale operation, changing replicas may create/terminate Pods.
- Endpoints: manual selectorless-Service authoring only, no auto-companion Service. Controller ownership blocks writing. Multi-subset and object references stay advanced. Production validates IP addresses and forbidden loopback/link-local destinations. Deprecated, prefer EndpointSlice where applicable.
- Node: no normal Create. Registration/status belong to kubelet/controllers. Cordon maps spec.unschedulable; taint review maps spec.taints[]. Drain delegates existing workflow with eviction/PDB, grace, daemonset and local-data review. Proxy delegates existing guarded workflow. No action executes here.
- Event/ComponentStatus: generated/deprecated inspect-only. Missing health data is not healthy. Event links related object; no replay.

## Action integration inventory
Binding is POST-only top-level binding or pods/{name}/binding, not stored editable resource. Pod eviction is POST request; attach/exec/portforward are upgraded streams, logs GET, pod/service/node proxy routes remain existing interfaces. ephemeralcontainers and resize are guarded subresources (in-place resize GA 1.35), not unrestricted Pod edits. RC scale, serviceaccount token and namespace finalize use separate ownership/verb reviews. No terminal/log/diagnostics interface rebuilt.

## Source safety and limitations
Guided draft serializes valid JSON (YAML 1.2 subset). Form/source switches retain guided values and scalar distinctions. Manual source remains exact opaque text; guided Form and Review block rather than pretending to parse losslessly. Demonstrated invalid source retains comment and integer 9007199254740993 verbatim. No claim of AST-based editing unknown siblings. Production must reuse existing manifestDraft AST adapter. Mode preference persistence is intentionally not implemented here; no resource values or credentials persist. Single-row resource controls show bounded common paths, not API limits; unsupported fields stay source-only. Local validation covers name, RC count/selector, required workload container identity, PV capacity/NFS path, endpoint ports and ownership. Full API/admission validation remains production responsibility. No fake permission, health, provisioning or mutation success. Source input in this public fixture is synthetic nonsecret only; no sensitive values were entered or captured.

## Reuse and visual review
Faithful isolated HTML composition, not installed base-ui React. Production reuses Dialog, SegmentedControl, FormField, Input, Select, Table, Tooltip/Popover, Collapsible and existing manifest editor. String quantity plus unit/validation stays Kubernetes adapter-owned. Repeated labels use existing editable-row composition; no new generic component proposed. Compact1000x700 desktop frame,32px inputs,13px body,180px rail; smaller viewport scrolls internally. Field paths only display on focus; main view keeps concise warnings. Help opens hover/focus/click; Escape dismisses and restores help focus. Boundary: modal close/reopen opener restoration is not modeled.

All25 screenshots visually inspected in review.jpg; no clipping or sensitive data found. Narrow footer defect corrected before final capture. Dedicated per-issue Chrome profile used after shared-browser screenshot timeouts; profile is excluded from publication. Real browser input/select/click/add/remove, review, keyboard help, denied/unavailable/missing/empty/owner states and narrow geometry exercised. checks.json contains booleans and screenshot filenames only. No repository tests/build/lint ran.
