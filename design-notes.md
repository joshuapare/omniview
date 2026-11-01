# Calico backing CRD inspection mock

Design only; synthetic fixtures. All 22 kinds are inspection-first, not assumed generated. Calico v3.30.0 backing v1 CRDs. Public authoring redirects are requests, never proof of availability or permission. IPAMConfig is not public IPAMConfiguration.

Source: https://github.com/projectcalico/calico/blob/v3.30.0/manifests/crds.yaml

## BGPConfiguration
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 BGPConfiguration only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- asNumber: typed read-only integer display → spec.asNumber.
- nodeToNodeMeshEnabled: typed read-only boolean display → spec.nodeToNodeMeshEnabled.
- listenPort: typed read-only integer display → spec.listenPort.
- serviceClusterIPs: typed read-only array display → spec.serviceClusterIPs.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## BGPFilter
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 BGPFilter only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- importV4: typed read-only array display → spec.importV4.
- exportV4: typed read-only array display → spec.exportV4.
- importV6: typed read-only array display → spec.importV6.
- exportV6: typed read-only array display → spec.exportV6.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## BGPPeer
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 BGPPeer only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- peerIP: typed read-only string display → spec.peerIP.
- asNumber: typed read-only integer display → spec.asNumber.
- nodeSelector: typed read-only string display → spec.nodeSelector.
- filters: typed read-only array display → spec.filters.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## BlockAffinity
- API: crd.projectcalico.org/v1; Cluster.
- System storage record; no direct public authoring.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- cidr: typed read-only string display → spec.cidr.
- node: typed read-only string display → spec.node.
- state: typed read-only string display → spec.state.
- deleted: typed read-only string display → spec.deleted.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## CalicoNodeStatus
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 CalicoNodeStatus only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- node: typed read-only string display → spec.node.
- classes: typed read-only array display → spec.classes.
- updatePeriodSeconds: typed read-only integer display → spec.updatePeriodSeconds.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## ClusterInformation
- API: crd.projectcalico.org/v1; Cluster.
- System storage record; no direct public authoring.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- calicoVersion: typed read-only string display → spec.calicoVersion.
- clusterType: typed read-only string display → spec.clusterType.
- datastoreReady: typed read-only boolean display → spec.datastoreReady.
- variant: typed read-only string display → spec.variant.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## FelixConfiguration
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 FelixConfiguration only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- bpfEnabled: typed read-only boolean display → spec.bpfEnabled.
- iptablesBackend: typed read-only string display → spec.iptablesBackend.
- defaultEndpointToHostAction: typed read-only string display → spec.defaultEndpointToHostAction.
- failsafeInboundHostPorts: typed read-only array display → spec.failsafeInboundHostPorts.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## GlobalNetworkPolicy
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 GlobalNetworkPolicy only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- tier: typed read-only string display → spec.tier.
- order: typed read-only number display → spec.order.
- selector: typed read-only string display → spec.selector.
- ingress: typed read-only array display → spec.ingress.
- egress: typed read-only array display → spec.egress.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## GlobalNetworkSet
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 GlobalNetworkSet only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- nets: typed read-only array display → spec.nets.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## HostEndpoint
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 HostEndpoint only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- node: typed read-only string display → spec.node.
- interfaceName: typed read-only string display → spec.interfaceName.
- expectedIPs: typed read-only array display → spec.expectedIPs.
- ports: typed read-only array display → spec.ports.
- profiles: typed read-only array display → spec.profiles.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## IPAMBlock
- API: crd.projectcalico.org/v1; Cluster.
- System storage record; no direct public authoring.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- cidr: typed read-only string display → spec.cidr.
- affinity: typed read-only string display → spec.affinity.
- allocations: typed read-only array display → spec.allocations.
- unallocated: typed read-only array display → spec.unallocated.
- sequenceNumber: typed read-only integer display → spec.sequenceNumber.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## IPAMConfig
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 IPAMConfiguration only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- autoAllocateBlocks: typed read-only boolean display → spec.autoAllocateBlocks.
- strictAffinity: typed read-only boolean display → spec.strictAffinity.
- maxBlocksPerHost: typed read-only integer display → spec.maxBlocksPerHost.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## IPAMHandle
- API: crd.projectcalico.org/v1; Cluster.
- System storage record; no direct public authoring.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- handleID: typed read-only string display → spec.handleID.
- block: typed read-only object display → spec.block.
- deleted: typed read-only boolean display → spec.deleted.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## IPPool
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 IPPool only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- cidr: typed read-only string display → spec.cidr.
- blockSize: typed read-only integer display → spec.blockSize.
- natOutgoing: typed read-only boolean display → spec.natOutgoing.
- ipipMode: typed read-only string display → spec.ipipMode.
- vxlanMode: typed read-only string display → spec.vxlanMode.
- disabled: typed read-only boolean display → spec.disabled.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## IPReservation
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 IPReservation only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- reservedCIDRs: typed read-only array display → spec.reservedCIDRs.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## KubeControllersConfiguration
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 KubeControllersConfiguration only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- controllers: typed read-only object display → spec.controllers.
- healthChecks: typed read-only string display → spec.healthChecks.
- logSeverityScreen: typed read-only string display → spec.logSeverityScreen.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## NetworkPolicy
- API: crd.projectcalico.org/v1; Namespaced.
- Inspect backing record; route public authoring to projectcalico.org/v3 NetworkPolicy only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- tier: typed read-only string display → spec.tier.
- order: typed read-only number display → spec.order.
- selector: typed read-only string display → spec.selector.
- ingress: typed read-only array display → spec.ingress.
- egress: typed read-only array display → spec.egress.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## NetworkSet
- API: crd.projectcalico.org/v1; Namespaced.
- Inspect backing record; route public authoring to projectcalico.org/v3 NetworkSet only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- nets: typed read-only array display → spec.nets.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## StagedGlobalNetworkPolicy
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 StagedGlobalNetworkPolicy only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- stagedAction: typed read-only string display → spec.stagedAction.
- tier: typed read-only string display → spec.tier.
- selector: typed read-only string display → spec.selector.
- ingress: typed read-only array display → spec.ingress.
- egress: typed read-only array display → spec.egress.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## StagedKubernetesNetworkPolicy
- API: crd.projectcalico.org/v1; Namespaced.
- Inspect backing record; route public authoring to projectcalico.org/v3 StagedKubernetesNetworkPolicy only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- stagedAction: typed read-only string display → spec.stagedAction.
- podSelector: typed read-only object display → spec.podSelector.
- policyTypes: typed read-only array display → spec.policyTypes.
- ingress: typed read-only array display → spec.ingress.
- egress: typed read-only array display → spec.egress.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## StagedNetworkPolicy
- API: crd.projectcalico.org/v1; Namespaced.
- Inspect backing record; route public authoring to projectcalico.org/v3 StagedNetworkPolicy only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- stagedAction: typed read-only string display → spec.stagedAction.
- tier: typed read-only string display → spec.tier.
- selector: typed read-only string display → spec.selector.
- ingress: typed read-only array display → spec.ingress.
- egress: typed read-only array display → spec.egress.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## Tier
- API: crd.projectcalico.org/v1; Cluster.
- Inspect backing record; route public authoring to projectcalico.org/v3 Tier only after discovery and ownership checks.
- Identity, spec and status read-only. No create, update, delete, release, or status write.
- order: typed read-only number display → spec.order.
- defaultAction: typed read-only string display → spec.defaultAction.
- Advanced inventory covers every schema spec path; sensitive field names show redacted values only.

## Boundaries
Owned mutation paths: none. metadata.name, metadata.namespace, spec and status remain immutable in this interface. No hidden mutation, no public API installation, no ownership claim from missing ownerReferences. Field inventory is schema-derived, not a generic editing form. Scope follows pinned schema. Calico add-on provider should own this adapter, not Kubernetes core.

Source is a separate safe read-only fixture projection; not raw credentials and never parsed or submitted. Annotations, passwords and identifiers beyond synthetic fixture fields are not loaded. There is no editable draft and no lossless editing claim. Unknown-source fallback keeps exact typed scratch text in memory across views without parsing it.

Reuse: Dialog, Select, Tabs/SegmentedControl, Table, Badge, Input, Popover, Button, ScrollArea and existing CodeEditor. HTML composition only, not shipped React. No new base-ui primitive proposed. Help supports hover/focus/click and Escape restores focus.

Availability fixtures distinguish denied, missing API, unavailable lookup, empty lookup and unresolved ownership. Public destination review requires an explicit fixture match; no controller health, RBAC or real ownership inferred. Internal IPAM records route only to a diagnostic connection review, never release/edit.

Visual review used web-design-guidelines skill and fetched current source. No production tests/builds run. Real browser checks cover all captures, modes, help, request validation and narrow footer. Mock review still required.
