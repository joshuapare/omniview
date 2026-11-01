# Argo resource editors — issue 308

Interactive isolated HTML design, not production React, approval, or shipped support. Open index.html locally; no dependencies or server needed. Query `?kind=Rollout` selects a resource. Synthetic preview-cluster / preview fixtures only. No cluster requests, controller calls, credential import, default workload image, hidden companion creation, or mutation success.

## Grounding

Read Epic 262, issue 308, approved issue 249 examples and PR72/74 delivery references. Followed approved interactive mock workflow. Used installed web-design-guidelines skill and fetched its current command.md. No named mock skill was exposed.

Pinned API sources: Argo CD v3.1.0 manifests/crds; Workflows v3.7.3 manifests/base/crds/full; Rollouts v1.8.3 manifests/crds. `sources.json` records exact upstream URLs and Git blob IDs. `schema-notes.json` records scope, served/storage version and field types from those CRDs. All sixteen kinds use argoproj.io/v1alpha1; only ClusterWorkflowTemplate and ClusterAnalysisTemplate have cluster scope. ApplicationSet list elements preserve unknown object fields: `cluster` is a user-chosen generator variable, not a schema-declared cluster field. A CRD's presence proves neither permissions nor controller availability.

## Coverage and field/control paths

`field-map.json` is the complete machine-readable label → control → manifest-path map. Numeric path segments mean array indexes, not map keys. Controls omit untouched blank optional values. Repeatable rows change only their selected array; unknown source is not parsed or normalized.

| Kind | Tailored controls and exact owned paths | Boundary |
|---|---|---|
| Application | Project picker `spec.project`; repository/revision/path `spec.source.{repoURL,targetRevision,path}`; destination server/namespace `spec.destination.{server,namespace}`; sync-option rows `spec.syncPolicy.syncOptions[]` | Standalone create/edit; generated Application inspect-only, owner link and diff/sync handoff |
| ApplicationSet | List generator elements `spec.generators[0].list.elements[].cluster`; generated name `spec.template.metadata.name`; project, Git source and destination under `spec.template.spec` | Create/edit owner, never generated children; arbitrary generator branches retained in source |
| AppProject | Repository `spec.sourceRepos[0]`; destination server/namespace `spec.destinations[0]`; group/kind permission rows `spec.clusterResourceWhitelist[]` | Namespace-scoped authorization configuration; visible privilege-broadening warning; roles and policy strings stay source |
| WorkflowTemplate | Entrypoint `spec.entrypoint`; template name/image `spec.templates[0].{name,container.image}`; service-account picker `spec.serviceAccountName`; name/value rows `spec.arguments.parameters[]` | Create/edit reusable template, no implicit execution |
| ClusterWorkflowTemplate | Same template controls | Cluster scope, no namespace in manifest. Service account resolves at future execution namespace, not cluster scope |
| CronWorkflow | Schedule list `spec.schedules[]`; timezone `spec.timezone`; concurrency selector `spec.concurrencyPolicy`; suspend `spec.suspend`; template reference `spec.workflowSpec.workflowTemplateRef.name` | Create/edit schedule; unsuspending creates executions; Replace may terminate prior execution |
| WorkflowEventBinding | Expression `spec.event.selector`; name and clusterScope `spec.submit.workflowTemplateRef`; parameter name/event-expression `spec.submit.arguments.parameters[].{name,valueFrom.event}` | Workflows server event submission, not Argo Events; event reception and permissions not claimed |
| Rollout | Replicas `spec.replicas`; selector `spec.selector.matchLabels.app`; Pod label `spec.template.metadata.labels.app`; container name/image `spec.template.spec.containers[0]`; canary weights `spec.strategy.canary.steps[].setWeight` | Create/edit; selector locked on edit as conservative guided boundary; promote/abort dedicated adapter handoff |
| AnalysisTemplate | Metric name, interval, failure limit, success condition `spec.metrics[0].{name,interval,failureLimit,successCondition}`; Prometheus address/query `spec.metrics[0].provider.prometheus`; arguments `spec.args[]` | Create/edit template; provider credentials not loaded; expression validity not claimed |
| ClusterAnalysisTemplate | Same metric controls | Cluster scope; no namespace; execution provider context remains external |
| Workflow | Template name/clusterScope `spec.workflowTemplateRef`; arguments `spec.arguments.parameters[]` | Explicit standalone submission only; existing or controller-owned runs inspect-only; retry/resume/stop are action handoffs |
| AnalysisRun | Explicit inline metric and argument authoring as above | Deliberate standalone submission; existing/owned analysis inspect-only, status/results not editable |
| Experiment | Duration `spec.duration`; name/replicas/selector `spec.templates[0]`; Pod template labels/container `spec.templates[0].template`; analysis name/templateName rows `spec.analyses[]` | Deliberate standalone submission; existing/owned experiment inspect-only |
| WorkflowArtifactGCTask | Read-only `spec.artifactsByNode`, `status.artifactResultsByNode`, owner | No Create/edit, deletion retry or finalizer bypass; locations/payloads withheld |
| WorkflowTaskResult | Read-only root `progress`, `phase`, `outputs`, owner | Executor record; no spec/status invented; outputs withheld |
| WorkflowTaskSet | Read-only `spec.tasks`, `status.nodes`, owner | Controller/agent task protocol; no ordinary Create or editing |

All identities use metadata.name; namespaced drafts use metadata.namespace=preview. Edit locks name, and destination context stays visible. Scope and identity changes require a new draft in production; no delete/recreate shortcut. Ownership must also account for Argo tracking annotations/labels and field managers, not only ownerReferences. Existing managed fields, resourceVersion, admission restrictions and Git authority require provider-side checks. Mock intent selector is a fixture control, never a production permission bypass.

## Interaction and safety

1000×700 frame; 32px fields, 13px body, 20×24px content padding, 16px gaps. Native semantic controls faithfully compose intended base-ui Dialog, FormField, Input, Select, NumberInput, Table/EditableList, Collapsible, SegmentedControl, Tooltip/Popover. HTML is not shipped React. Semantic-token-like local CSS variables illustrate theme intent; production must use actual base-ui tokens. No new generic primitive required. Argo add-on providers should own forms, split by installed CD/Workflows/Rollouts project and matching GVK; no Kubernetes-plugin hardcoded portfolio.

No permanent instruction walls. Concise consequential warnings remain visible. Help opens on focus/hover/click; Escape dismisses help and restores help focus. Native buttons/selects handle keyboard activation. Inline name error sets aria-invalid and focuses name. Review validates only bounded local rules; it never certifies a valid or executable resource. Numeric non-negative integer checks and canary 0–100 checks are local guards, not schema validation.

Loading, empty, denied, unavailable, CRD missing and unsupported version have separate fixture states and block review; existing draft stays in memory. Discovery, authorization and controller health require real provider integration. Related actions merely explain action-adapter boundary; no fake success or endpoints.

Form and YAML share one in-memory draft. Generated source uses JSON syntax, a valid YAML subset. After any manual source edit, exact raw text remains intact and guided writes stop. Comments, large integers, quoted scalars and unsupported/invalid documents therefore survive verbatim across mode changes. This deliberately does NOT claim lossless AST parsing or safe guided writes after manual edits. Unknown source cannot silently become a regenerated document. Source projections for system/owned records are read-only, payload-withheld and never mutation sources. No credentials or annotations exist in fixtures or evidence. User-supplied arbitrary sensitive source is outside this mock; production needs the shared sensitive projection contract before enabling it.

Only explicit mode preference is eligible for localStorage. Drafts, names, parameters and credentials remain memory-only. Switches between kinds preserve their drafts during the page session. Reload discards drafts. No persistence of resource data.

## Evidence and limits

71 captured states include every distinct kind, 13 authoring/submission initial/populated/edit-or-inspect/review/rows paths, four conditional ownership states, three generated records, local validation, availability distinctions, help, source fallback/exact preservation and narrow layout. Main captures 1440×900 @1.25; narrow capture 680×800 @1.25. Every image reviewed in contact sheets; screenshots retain footer and internal scroll. Main long forms intentionally scroll; not every field fits simultaneously. `checks.json` contains named booleans and screenshot filenames only.

Manual typing, select choices, add/remove, help focus/hover/Escape, source typing and mode changes drove evidence. No page-state injection was used for capture. Source mapping extraction reads static field definitions only. Additional browser assertions cover explicit preference and numeric bounds. No repo builds/tests/linters/formatters run.

Limits: bounded local validation only, no expression evaluator, cron parser, DAG editor, full metric-provider union, Git generator union, artifact upload, resolved Secret values, full schema-aware round trips, live RBAC/discovery, server validation or controller actions. Those branches remain exact-source fallbacks, not fake form controls. Existing/edit fixtures reuse the synthetic in-memory draft, not fetched objects. Captures prove mock behavior only. Production needs focus trapping/opener restoration, revision-aware save, actual plugin adapters and real authorization before implementation approval. Browser evidence and design await user review; no issue checkbox changed and issue remains open.
