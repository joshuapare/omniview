# KEDA event subscription editor proposal

Design only, awaiting review. Isolated HTML composition, not shipped React. Followed #249 interactive workflow and reviewed against the web-design-guidelines skill and fetched guideline source. No named mock skill was available. No production source, dependency, cluster, cloud, installation, or mutation was touched.

## Source and API boundary

KEDA v2.18.0, commit 559e73850876f0c1d2fe915f9c23904608e5e235:
- https://github.com/kedacore/keda/blob/559e73850876f0c1d2fe915f9c23904608e5e235/config/crd/bases/eventing.keda.sh_cloudeventsources.yaml
- https://github.com/kedacore/keda/blob/559e73850876f0c1d2fe915f9c23904608e5e235/config/crd/bases/eventing.keda.sh_clustercloudeventsources.yaml
- https://keda.sh/docs/2.18/operate/cloud-events/

Both serve/store eventing.keda.sh/v1alpha1 and expose a status subresource. CloudEventSource is namespaced; ClusterCloudEventSource is cluster-scoped. They are subscriptions, never emitted-event payloads. CloudEvents support is experimental. Installation/schema discovery does not establish RBAC, controller support, health, or delivery. Documentation has an inconsistent Azure example spelling; pinned CRD field azureEventGridTopic is authoritative here. Destination HTTP and Azure branches are independent, not an invented oneOf.

## Exact field and control mapping

| Control | Owned path | Create / edit behavior |
|---|---|---|
| Resource selector | apiVersion, kind | Context; not editable within an existing object's identity |
| Name | metadata.name | Required create; locked edit |
| Namespace | metadata.namespace | Required namespaced create; locked edit; absent for cluster resource |
| HTTP toggle and URL | spec.destination.http; spec.destination.http.uri | Optional independent destination; preserve typed value when toggled off and back on |
| Event Grid toggle and endpoint | spec.destination.azureEventGridTopic; spec.destination.azureEventGridTopic.endpoint | Independent destination; require reference for proposed guided review |
| Authentication scope and reference picker | spec.authenticationRef.kind; spec.authenticationRef.name | TriggerAuthentication or ClusterTriggerAuthentication; no resolved values or companion creation |
| Include / exclude checkboxes | spec.eventSubscription.includedEventTypes[]; spec.eventSubscription.excludedEventTypes[] | All 12 pinned enum values; empty lists omitted; overlap warned |
| Cluster identity override | spec.clusterName | Optional; absent unless entered; no guessed default |
| Observed state | status.conditions[].type/status/reason/message | Inspect only; unavailable fixture, never synthesized Active |
| YAML editor | Entire exact local source string | Manual changes remain source-only and block form/review |

No spec immutability CEL is declared in these pinned schemas. Name/namespace/kind identity stays locked in edit. The prototype does not claim controller-side validation. Review's at-least-one-sink, HTTP(S) URL, no URL credentials/query/fragment, and Event Grid authentication checks are guided safety policy, stricter than CRD string types. API admission remains authoritative in production. Include/exclude behavior follows documentation; overlap is discouraged, not a schema error.

## Ownership, availability, and consequences

Propose a KEDA add-on form provider, not hardcoded OSS forms in the Kubernetes plugin. User-owned subscriptions support guided create/edit. GitOps-owned fixtures refuse direct edit and point to owning repository. Production must derive ownership from actual source/managed-field context, not infer it from kind. Request permissions separately for each resource and verb; missing API, denied RBAC, unavailable discovery, and empty reference list have distinct visible states.

A cluster subscription can deliver events across namespaces. Review surfaces cluster/namespace, sink endpoints, references, selected filters, and external delivery consequences. No test event, sink probe, installation, authentication resource creation, or API submission exists in this mock.

ClusterCloudEventSource with namespaced TriggerAuthentication needs explicit operator namespace resolution before production guided authoring. The prototype flags this case but does not resolve it. Cluster authentication is the demonstrated supported fixture. No claim that arbitrary reference existence proves permission or valid auth.

## Reuse and visual review

1000×700 compact frame; 32px controls, 13px body, 20×24px content padding, 16px grid gaps, internal scroll, visible footer. Compose existing base-ui Dialog, SegmentedControl, FormField, Input, Select, Checkbox, Tooltip/Popover and Collapsible in production. The mock uses faithful standalone HTML, not actual base-ui imports. Resource semantics stay in provider. No new generic primitive is needed. Production should reuse existing YAML AST editor and native focus management rather than copy this textarea/mock routing.

Help works on hover/focus/click and Escape. Visible errors and consequences do not depend on help. Keyboard native inputs work; focus moves to first field on invalid review. Design guideline review found no unlabeled controls or missing focus ring. Limit: this standalone section is not a native modal and does not demonstrate full focus trap, opener restoration, or dialog dismissal. Error summary is compact but not yet per-field production errors.

## Evidence and limits

Nineteen actual browser captures; captions.json maps every filename. All reviewed visually. Standard captures: 1440×900 CSS pixels, scale 1.25 (1800×1125 output). Narrow capture: 720×800 at 1.25. Browser initially ignored viewport option; explicit page viewport fixed it before all captures. No runtime errors observed. No shared browser profile used.

Source is deliberately bounded. Form serialization does not parse arbitrary YAML. Once manual source changes, preserve the entire string exactly and lock Form and review. Demonstrated invalid source contains a comment and 9007199254740993, preserved byte-for-byte across mode changes. This does NOT prove bidirectional AST patching, unknown sibling edits, annotations, aliases, typed scalars, or lossless production submission. Production must reuse existing exact AST behavior. No redacted projection exists or is submitted. Credentials are never loaded, resolved, or captured. URL examples use reserved .invalid domains.

No draft or credentials persist. Only explicit Form/YAML preference persists locally; reload restores that preference without restoring draft values. Production must reuse existing host preference. Fixture selector deliberately replaces local draft; it is an external test control, not a proposed product navigation. No actual create/save, network authorization, event delivery, controller observation, installation, or reconciliation was verified. Review awaits user approval; no issue checkbox is marked complete.
