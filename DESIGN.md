# Autoscaling mock · issue 268

Design delivery only. Awaiting review; not shipped React, not cluster approval. Uses approved #249 interactive HTML workflow. No named mock skill was installed. Visual review used web-design-guidelines and its actual upstream command.md rules.

## Coverage and ownership

HorizontalPodAutoscaler: namespaced create/edit in autoscaling/v2, compatibility CPU-only v1, operator-owned inspection, denied edit, unavailable discovery. Status is controller-owned inspection. Scale is an autoscaling/v1 payload on a workload /scale endpoint, never a top-level collection or Create form. Native Kubernetes provider owns this editor; operator-specific source ownership belongs to installed extension providers, not hardcoded CRD forms. No new base-ui primitive proposed.

HPA name and namespace lock during guided edit. scaleTargetRef is mutable; changing it redirects scaling and requires diff review. Bounds, metrics, and behavior may change subject to actual admission. A sample operator-owned HPA is inspect-only, directing authors upstream. Discovery, actual verbs, RBAC and field ownership must be evaluated independently. No automatic force-ownership or delete/recreate path.

## Exact mapping

| Control | Owned path |
|---|---|
| Name / namespace | metadata.name / metadata.namespace; edit identity locked |
| Same-namespace target picker plus custom reference | spec.scaleTargetRef.{apiVersion,kind,name}; discovery must confirm /scale |
| Optional minimum / required maximum | spec.minReplicas / spec.maxReplicas, int32; blank minimum omitted |
| Add/remove metric | spec.metrics[i]; atomic list, explicit removal |
| Metric source | spec.metrics[i].type plus exactly one of resource/containerResource/pods/object/external |
| CPU/memory or custom resource name | resource.name or containerResource.name |
| Container | containerResource.container |
| Adapter metric name | pods.metric.name / object.metric.name / external.metric.name |
| Metric label rows | corresponding metric.selector.matchLabels[key]; matchExpressions retained through source |
| Described object | object.describedObject.{apiVersion,kind,name} |
| Utilization | target.type=Utilization; target.averageUtilization integer percent of requests |
| Average quantity | target.type=AverageValue; target.averageValue exact input string |
| Total quantity | target.type=Value; target.value exact input string; only Object/External |
| Direction sections | spec.behavior.scaleUp / scaleDown |
| Stabilization | direction.stabilizationWindowSeconds; integer 0–3600; blank omitted |
| Policy choice | direction.selectPolicy = Max / Min / Disabled; Omit deletes only that field |
| Repeatable policy | direction.policies[i].{type,value,periodSeconds}; Pods/Percent; positive amount, seconds 1–1800 |
| Tolerance | direction.tolerance; gated advanced source, guided control disabled when capability unknown |
| v1 CPU | spec.targetCPUUtilizationPercentage; no automatic v2 conversion |
| Status facts | status.observedGeneration/currentReplicas/desiredReplicas/currentMetrics/conditions/lastScaleTime; inspection only |
| Manual replica action | autoscaling/v1 Scale.spec.replicas on parent workload /scale; nonnegative int32; request review only |

No invented executable create defaults. Omitted metrics means API CPU default; omitted behavior means controller defaults. Zero minimum requires verified HPAScaleToZero plus Object or External metric. Tolerance requires HPAConfigurableTolerance. Metrics APIs/adapters and resource requests are prerequisites; selecting a reference proves none of their health. Multiple metrics use largest recommendation. Manual scaling may be overwritten by HPA. Bounds can affect capacity and cost.

## Composition

Faithful isolated HTML, not installed base-ui React. Production composition: FormField/Input, Select/Combobox for references and unions, FormSection/Collapsible, Table/repeated rows, Tooltip/Popover, shared Form/YAML frame. Source parsing, Kubernetes rules and exact quantities remain in provider adapter. No generic Kubernetes mega-widget needed. 1000×700 frame, 32px controls, 13px text; internal scroll and fixed visible footer; 680px narrow browser check.

## Source and safety limits

Prototype deliberately accepts only JSON-compatible YAML for guided synchronization. Other YAML, comments and long exact numbers stay verbatim in source; guided editing/review pauses rather than claiming lossless conversion. Form/YAML untouched roundtrip and unsupported comment/9007199254740993 preservation were browser-asserted. This is not a full YAML parser, duplicate-key detector or production AST patch implementation. Unknown JSON siblings survive ordinary edits but formatting does not survive subsequent form edits. No claim of complete schema validation. Source branch changes replace that metric branch; branch draft caching is not claimed. Source imports are synthetic-only and must not contain credentials or annotations with embedded sensitive data. Production needs established privacy-safe source projection and AST patch contract, plus full quantity validation and schema unsafe-shape checks before guided editing.

Only mode preference persists under mock268-mode. Drafts stay memory-only. Review sends nothing. Scale review uses fixture parent and no HTTP API request. Production must fetch latest /scale resourceVersion, authorize update separately, detect HPA ownership, and review destination before any request. Status snapshots do not prove health. Error UI is a compact alert; production should associate each field error and focus first invalid control. Tooltip supports focus/hover/click and Escape restoration; no full production modal lifecycle is claimed.

## Primary references

- Kubernetes v1.35.0 pinned OpenAPI: https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L52687-L54813 (issue citation); read actual autoscaling definition entries and scale payload.
- https://github.com/kubernetes/api/blob/v0.35.0/autoscaling/v2/types.go
- https://github.com/kubernetes/api/blob/v0.35.0/autoscaling/v1/types.go
- Baseline patterns: https://github.com/omniviewdev/omniview/issues/249 ; https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72 ; https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74
- Shared contract: https://github.com/omniviewdev/omniview/issues/262

## Browser proof

24 captured states, 1440×900 CSS @1.25 (1800×1125 PNG), plus narrow 680×850 CSS @1.25. Real inputs/selects/buttons, metric add/remove, all five source branches, behavior policy add/remove, local validation, review, help focus/Escape, source mode switch and unsupported raw retention exercised. Screenshots reviewed in contact sheet and six readable slices. Shared browser capture timed out; isolated Chrome profile succeeded. No profile/cache/cookie files published. No repo build/lint/test or live cluster operation performed.

Remaining review decisions: production lookup UX for arbitrary discovered scalable kinds; controller-owned upstream navigation; feature capability provenance; full metric selector composition; production AST and privacy projection integration. These are explicit production integration boundaries, not fake mock actions.
