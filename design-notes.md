# Istio resource editor design — issue 298

Review-only interactive HTML composition, not shipped React or an installed mock skill. Follows approved #249 compact mock workflow. Visual review used the installed `web-design-guidelines` skill and fetched Vercel Web Interface Guidelines. All data is synthetic. No API mutation handler exists.

## Source and scope

Primary CRD source: [Istio 1.27.0 snapshot](https://github.com/istio/istio/blob/d40ceca3e9dfe95569e4be89f5e8176fe0dcff12/manifests/charts/base/files/crd-all.gen.yaml). The local `api-snapshot.yaml` preserves the cited release snapshot for review.

All nine kinds are Namespaced. Preferred displayed versions: VirtualService, DestinationRule, Gateway, ServiceEntry, Sidecar, WorkloadGroup, WorkloadEntry use `networking.istio.io/v1`; ProxyConfig uses `v1beta1`; EnvoyFilter uses `v1alpha3`. The first seven also serve v1alpha3 and v1beta1 in this snapshot. No arbitrary v1 upgrade is offered for ProxyConfig or EnvoyFilter.

Prerequisites: discover the actual CRD and served schema, establish installed Istio/controller compatibility, and admit user permissions per namespace and verb. These are unknown in this offline mock. Discovery alone proves neither permission nor functioning controllers. EnvoyFilter acknowledgement means a human will check compatibility, not that compatibility passed.

Read Epic262, #249 and plugin PR72/PR74. Preserve their production AST patching, optimistic revision and mutation routes during later integration; this HTML mock does not reimplement or validate those production systems.

## Coverage and boundaries

| Component | Authoring boundary | Captures |
|---|---|---|
| VirtualService | Manual create/edit, ordered HTTP match, destination weights and resilience | VirtualService.png, weighted-routes.png, validation.png, review.png |
| DestinationRule | Manual create/edit, host, subsets, load balancing, TLS and connection resilience | DestinationRule.png, DestinationRule-review.png |
| Istio Gateway | Manual create/edit, workload selector, listener/hosts and credential reference only | Gateway.png, Gateway-review.png |
| ServiceEntry | Manual create/edit, external/internal registry, DNS/static choice and endpoints | ServiceEntry.png, ServiceEntry-review.png |
| Sidecar | Manual create/edit, workload selector, ingress/egress and outbound mode | Sidecar.png, Sidecar-review.png |
| WorkloadGroup | Manual create/edit, VM template, service account, labels, readiness and template ports | WorkloadGroup.png, WorkloadGroup-review.png |
| ProxyConfig | Manual create/edit, selector, concurrency, image flavor and safe preview environment value | ProxyConfig.png, ProxyConfig-review.png |
| WorkloadEntry: manual | Manual create/edit only when ownership permits | WorkloadEntry.png, manual-entry-edit.png, WorkloadEntry-review.png |
| WorkloadEntry: registered | Inspect owner/address, no mutation or ownership takeover | generated-entry.png |
| EnvoyFilter | Advanced version-sensitive patch, explicit compatibility-review gate | EnvoyFilter.png, envoy-compatibility-block.png, EnvoyFilter-review.png |

Shared captures: source.png, unsupported-source.png, denied.png, unavailable.png, help.png, narrow.png. Every preferred kind was opened and captured; every manual kind reached a non-mutating review in a real browser. Repeatable sections were added and removed for each applicable kind. VirtualService split 70/30 passed while total 70 blocked. EnvoyFilter gate blocked before acknowledgement.

## Field → control → manifest path

All manual forms: name text → `metadata.name`; fixed namespace destination → `metadata.namespace`. Edit locks both identity fields. Status, owner references and controller-managed metadata are never editable. No additional generic spec immutability is invented; actual admission remains authoritative.

| Kind | Controls → owned paths |
|---|---|
| VirtualService | Host text → `spec.hosts[0]`; gateway reference text → `spec.gateways[0]`; prefix match → `spec.http[0].match[0].uri.prefix`; destination/subset text and numeric weight → `spec.http[0].route[i].destination.{host,subset}` and `.weight`; timeout duration text → `spec.http[0].timeout`; attempts number → `spec.http[0].retries.attempts` |
| DestinationRule | Host text → `spec.host`; subset rows → `spec.subsets[i].name` and `.labels.version`; policy selects → `spec.trafficPolicy.loadBalancer.simple` and `.tls.mode`; numeric connection/error limits → `spec.trafficPolicy.connectionPool.tcp.maxConnections` and `.outlierDetection.consecutive5xxErrors` |
| Gateway | Workload-label text → `spec.selector.istio`; server name → `spec.servers[0].name`; listener rows → `spec.servers[i].port.{name,number,protocol}` and `.hosts[0]`; TLS mode select → `spec.servers[0].tls.mode`; unresolved credential-name text → `.tls.credentialName`. HTTP source omits TLS. No resolved Secret values are fetched or shown. |
| ServiceEntry | Host → `spec.hosts[0]`; location/resolution selects → `spec.{location,resolution}`; port fields → `spec.ports[0].{number,name,protocol}`; address rows → `spec.endpoints[i].address` |
| Sidecar | App label → `spec.workloadSelector.labels.app`; egress-host rows → `spec.egress[0].hosts[i]`; outbound select → `spec.outboundTrafficPolicy.mode`; ingress port/protocol → `spec.ingress[0].port.{number,protocol}`; local endpoint → `spec.ingress[0].defaultEndpoint` |
| WorkloadGroup | VM address/account/network/locality → `spec.template.{address,serviceAccount,network,locality}`; app label → `spec.metadata.labels.app`; readiness path/port → `spec.probe.httpGet.{path,port}`; optional metrics port row → `spec.template.ports.metrics` |
| ProxyConfig | App label → `spec.selector.matchLabels.app`; numeric workers → `spec.concurrency`; image choice → `spec.image.imageType`; preview environment value → `spec.environmentVariables.PREVIEW_MODE` |
| WorkloadEntry | Address → `spec.address`; numeric HTTP port → `spec.ports.http`; app label → `spec.labels.app`; network/locality/account → `spec.{network,locality,serviceAccount}`; numeric weight → `spec.weight` |
| EnvoyFilter | Workload app → `spec.workloadSelector.labels.app`; regex → `spec.configPatches[0].match.proxy.proxyVersion`; context choice → `.match.context`; apply target and operation choices → `spec.configPatches[i].applyTo` and `.patch.operation`; JSON object input → `.patch.value` |

Additional schema fields and alternate match branches remain expert-source concerns rather than a property dump. Choices shown are a common subset, not an exhaustive enum inventory. Fixture values are illustrative, never executable production defaults.

## Source safety and exactness

The Source view emits structured JSON, a valid Kubernetes document format, not a YAML parser. Numeric guided controls map to numeric values. Empty optional values are omitted. Editing the source scratchpad preserves its exact string, including comments, unsupported syntax, unknown properties and the demonstrated large integer spelling. Returning to Form locks guided editing instead of coercing or discarding unknown text. This is an honest unavailable projection, **not** lossless two-way YAML AST editing. It does not submit source. Unknown-source round trip was checked by exact private equality, with only boolean evidence retained.

Later production integration must use the existing AST editor from PR72/PR74 for shared Form/YAML drafts, preserve omitted defaults and untouched siblings, and store only explicit mode preference. This mock persists only explicit Form/Source preference. A real-browser reload restored Source, and storage contained only the preference key. No draft or credential persistence exists.

## UI reuse and ownership

Faithful isolated composition of existing base-ui semantics: Input, NumberInput, Select, Button, Dialog, compact navigation, inline error and warning, repeatable field rows, and help dialog with native Escape/focus restoration. No dependency install or shared component change. 1000×700 frame; 32px base controls; 13px body; 20×24 content padding; 16px grid gaps. Help text appears only on demand; safety consequences remain visible. Field paths appear only while editing a field.

No new generic base-ui primitive is required. Existing row composition suffices. Resource-specific host/subset/weight/Envoy semantics belong to an Istio add-on form provider, not hardcoded Kubernetes baseline forms. Provider contracts should supply group/version/schema matching, ownership admission and capability/RBAC states while reusing the host frame.

## Honest limits and review decisions

- Offline HTML mock, not production React, admission validation or a live controller check.
- Reference fields accept unresolved names; no fabricated list/health/permission data. Production should compose existing namespaced reference pickers and distinguish empty, denied and unavailable discovery.
- EnvoyFilter compatibility acknowledgement is a design gate, not a successful compatibility test. Additional patch/match combinations need real schema-aware validation during production integration.
- The mock demonstrates common manual paths, not all Istio fields or all cross-field API constraints. In particular, protocol-dependent TLS, probe branches, endpoint resolution constraints and selector collisions require production admission-aware behavior.
- Source edits intentionally disable Form projection; no source-to-form normalization or falsely lossless claim.
- Registered WorkloadEntry inspection uses synthetic ownership; no action executes. Generation/ownership must be resolved from real evidence, never inferred solely from kind.
- No credentials, PEM, raw annotations, real namespaces, cluster identifiers or live requests appear in captures.
- Browser evidence verifies this prototype only. All mocks await user review; no issue checkbox or closure indicates approval.
