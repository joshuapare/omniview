# networking.k8s.io — design delivery for #270

Design only. Faithful isolated HTML composition, not shipped React. No cluster connection or mutation. All values are synthetic preview fixtures. Ingress remains the existing reference from PR74; no redesign.

## Scope and source grounding

Baseline: Kubernetes v1.35.0, k8s.io/api v0.35.0. Use networking.k8s.io/v1 for all four components. Deprecated v1beta1 IPAddress/ServiceCIDR representations are source-only compatibility, not duplicate resources. Production must discover served versions and actual authorized verbs independently. NetworkPolicy enforcement requires an enforcing network plugin; IngressClass does not install a controller. ServiceCIDR/IPAddress applicability depends on installed allocator configuration and discovery, never schema presence alone.

Pinned primary sources:
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L67435-L73019
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/staging/src/k8s.io/api/networking/v1/types.go
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/apis/networking/validation/validation.go
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/registry/networking/servicecidr/strategy.go
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/registry/networking/ipaddress/strategy.go

Important schema/implementation distinction: OpenAPI describes ServiceCIDR.cidrs as immutable, but v1.35 ValidateServiceCIDRUpdate explicitly permits adding an opposite-family second CIDR to a one-CIDR object. Existing CIDRs cannot change or be removed. Mock demonstrates that append, not replacement.

Grounding: Epic262, approved #249 interactive mock workflow, plugin PR72 and PR74. Density follows 1000×700 frame, 32px controls, 13px text, 24×20px main padding, 16px grid gaps. Existing base-ui Dialog, FormField, Input, Select, Checkbox, Button, SegmentedControl, Table/EditableList, Collapsible, Tooltip/Popover compose this UI. Production should reuse existing ResourceManifestEditor and leaf-path manifestDraft AST behavior. No new generic control or dependency is proposed. Native Kubernetes provider owns these forms; add-on registry is unnecessary for this group.

## Field → control → owned manifest path

| Resource | Control | Exact path and semantics |
|---|---|---|
| All authoring | Name input | metadata.name; required, locked on edit. NetworkPolicy additionally fixes metadata.namespace to explicit preview destination. Other three kinds are cluster scoped. |
| All authoring | Repeated label key/value inputs | metadata.labels[key]; metadata labels never change pod/namespace selectors. Annotation values are not surfaced or fetched. |
| IngressClass | Controller input | spec.controller; domain-prefixed path, max 250; immutable on edit. Controller string is configuration, not health. |
| IngressClass | Default checkbox | metadata.annotations["ingressclass.kubernetes.io/is-default-class"] = string "true" when enabled; fresh create omits when untouched. Production must preserve existing explicit false/omission until changed. Multiple defaults can reject classless Ingress creation. |
| IngressClass | Optional reference enable | spec.parameters; no companion resource creation. |
| IngressClass | Group, kind, name | spec.parameters.apiGroup (blank omits/core), .kind, .name; unresolved reference remains explicit, no validity claim. |
| IngressClass | Cluster/Namespace scope select | spec.parameters.scope; Namespace requires .namespace, Cluster omits .namespace. Blank group is distinct from a third-party group. |
| NetworkPolicy | All-Pods checkbox or key/equals | spec.podSelector = {} for all Pods in destination namespace; otherwise .matchLabels[key] = string. Expressions/multiple target labels remain source-only. |
| NetworkPolicy | Ingress/Egress checkboxes | spec.policyTypes[] explicit directions; at least one. Disabled direction omitted in new composed draft. Production must not silently delete hidden existing rules. |
| NetworkPolicy | Add/remove incoming/outgoing rule | spec.ingress[i] / spec.egress[i]; rules OR together, not ordered firewall priorities. Empty direction array adds isolation without allowances from this policy. Other policies remain additive. |
| NetworkPolicy | Same namespace Pods | .ingress[i].from[j].podSelector.matchLabels.app or .egress[i].to[j]…; no namespaceSelector means policy namespace. |
| NetworkPolicy | Namespaces + Pods | same peer adds .namespaceSelector.matchLabels.team; both selectors AND within one peer. Separate peers/rules OR. |
| NetworkPolicy | IP block + exception | peer.ipBlock.cidr and .except[]; mutually exclusive with selectors. Prototype exposes one exception; arbitrary exception lists retain source-only fallback. Production must validate canonical CIDRs, exception containment, and full selectors. |
| NetworkPolicy | All sources peer | from: [] / to: []; matches all peers, explicitly consequential. |
| NetworkPolicy | Number/Named select and port | rule.ports[i].port as integer or quoted string; no inference from digit-shaped names. Empty port omits ports: all destination ports. |
| NetworkPolicy | Protocol select | rule.ports[i].protocol = TCP/UDP/SCTP when port row supplied. |
| NetworkPolicy | Optional end port | rule.ports[i].endPort integer only with numeric start, inclusive, 1–65535 and end≥start. Named branch omits endPort but retains its local branch draft. |
| ServiceCIDR | First and optional second CIDR | spec.cidrs[0..1]; at most two, one per IP family. Existing first locked. v1.35 append second-family path supported; no replacement/removal. |
| ServiceCIDR | Status inspector | status.conditions read-only, fixture says Not fetched. No fabricated Ready, overlap, capacity or allocator-health result. |
| IPAddress | Canonical IP name | metadata.name read-only; actual API requires canonical IPv4/RFC5952 IPv6 naming. No ordinary create/edit/delete actions. |
| IPAddress | Parent inspector | spec.parentRef.group/resource/namespace/name read-only; fixture references core services preview/preview-api. ParentRef immutable. Button displays reference only, does not fake navigation/fetch. |

## Draft and safety contract

Prototype composes only the shown field subset for fresh fixture drafts. It is not a lossless YAML parser. Any manual YAML edit retains the complete source string and locks guided editing, including invalid source. Exact comment/large-integer/invalid-source preservation was exercised across YAML→Form fallback→YAML. No claim of editable imported AST round trips, unedited sibling patching, or server admission validation. Production must use existing AST adapter for supported documents and keep unsupported versions/shapes intact. Source review is unvalidated and non-mutating.

Explicit mode alone uses localStorage key mock270-mode; names, drafts, labels and references never persist. Resource/intent fixture selectors intentionally load a fresh fixture rather than acting as production navigation. No credential inputs, resolved Secret data, raw annotations, PEM, or tokens exist. Source contains only the synthetic non-sensitive draft. No live actions or successful submission UI.

Denied, unavailable, not-discovered, loading and empty-reference states remain distinct. Fixture capability selection does not prove actual RBAC. New range or policy review exposes consequences without claiming controller/CNI health. IPAddress has inspect-only source; there is no direct allocator mutation or delete/recreate workaround.

## Browser evidence and visual review

Dedicated Chrome profile owned by issue270; initial shared-browser screenshot timeout was avoided by isolated launch. Full-size captures use explicitly set 1440×900 viewport at device scale 1.25 (PNG 1800×1125); narrow capture uses 760×700 at 1.25. All numbered captures visually inspected using contact sheets and corrected range/source/help captures. Footer fits narrow viewport; inner sections scroll. Some long forms require internal scrolling; supplemental detail captures show lower controls. No repository build/lint/tests ran. Browser exercises are mock-only evidence, not production tests.

Capture groups: 01–07 NetworkPolicy initial/errors/peer/source/review/fallback; 08–11 IngressClass invalid/parameters/review/edit; 12–15 ServiceCIDR edit/family validation/dual-stack/review; 16–17 IPAddress inspect/source; 18–21 denied/unavailable/not-discovered/loading; 22 policy edit; 23 empty reference; 24 narrow; 25 accessible help; 26–27 egress IPBlock/named port/source; 28 metadata; 29 policy ownership; 30 ServiceCIDR status; 31 permitted opposite-family append review.

## Honest limits and review decisions

Local validators are intentionally partial: no complete DNS/selector grammar, IPv6 canonicalization, CIDR containment/overlap, discovery authorization, admission/defaulting, controller availability, or CNI traffic simulation. Production requires canonical validators and actual discovery/authorization data. A single app/team selector pair illustrates peer composition; expert expressions, multiple peers/ports per rule, arbitrary selectors, annotations and unowned content belong in intact source fallback, not silently normalized into this bounded composer. The authoring adapter must not impose these mock composition limits on Kubernetes.

No mock approval, shipped implementation, release, issue closure, or completed production acceptance criteria is claimed. Review requests: confirm administrator entry placement; choose reference lookup presentation for controller-specific parameters; confirm append-only ServiceCIDR affordance against installed version validation.
