# Calico public API editor mocks — issue 303

Design only; awaits review. No production changes or live cluster requests. Approved #249 isolated HTML prototype workflow; no named mock skill claimed. Reviewed known prototype against fetched web-interface-guidelines. Semantic native controls stand in for base-ui Input, Select, Button, Checkbox, Tooltip/Popover, section navigation and modal frame. No new generic primitive proposed.

## Source snapshot
Calico v3.30.0 resolves to 572a32dd9b2f9784d66d74712d5ec2e703d25083. API group projectcalico.org/v3. Registration: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/register.go . Storage: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/apiserver/pkg/registry/projectcalico/rest/storage_calico.go . Resource overview: https://docs.tigera.io/calico/3.30/reference/resources/overview . Individual source files below are pinned by same commit. Public aggregated API installation, resource/verb authorization, owning field manager, and staged controller capability need separate admission checks. Registration is not enforcement proof. Node and WorkloadEndpoint excluded.

## Shared ownership and behavior
Calico add-on provider, not hardcoded Kubernetes host. Namespaced: NetworkPolicy, NetworkSet, StagedNetworkPolicy, StagedKubernetesNetworkPolicy. Other listed resources cluster-scoped. Edit locks metadata.name and metadata.namespace. IPPool CIDR and blockSize additionally lock. Profiles split independent authoring and managed inspect-only (namespace/service-account derived records must remain managed). BlockAffinity and ClusterInformation inspect only; no create/edit/delete. Generated status never submitted. CalicoNodeStatus authors subscription spec only; agent/BGP/routes generated separately. KubeControllers runningConfig and environment overrides read-only; unavailable is not healthy. HostEndpoint automatic ownership follows controller. Configuration resources need installation-specific field ownership checks; default singleton identity for IPAM/KubeControllers, default or node-specific BGP/Felix restrictions require admission. Mock does not invent controller permissions.

## Exact control mapping
All entries below own only stated spec paths; common identity controls own metadata.name and metadata.namespace. Repeated rules use ingress/egress[i].action, protocol, source.selector, destination.ports; advanced source retains remaining Rule fields. Calico selectors are expressions, never Kubernetes matchLabels. StagedKubernetesNetworkPolicy instead uses podSelector.matchLabels and Kubernetes ports/peers; no Calico actions. List rows preserve entered ordering. BGP filter row order is evaluation order. Empty/unset selection omits optional values. No executable defaults inserted.

### NetworkPolicy
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/networkpolicy.go

- Endpoint selector → selector composition → `spec.selector`
- Tier → ref:default,security composition → `spec.tier`
- Order → number composition → `spec.order`
- Directions → list composition → `spec.types`
- Ingress rules → rules composition → `spec.ingress`
- Egress rules → rules composition → `spec.egress`

Remaining pinned spec fields use explicit source-only editing: spec.tier, spec.order, spec.ingress, spec.egress, spec.selector, spec.types, spec.serviceAccountSelector, spec.performanceHints.
Capture: NetworkPolicy.png; NetworkPolicy-edit.png. 

### GlobalNetworkPolicy
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/globalnetworkpolicy.go

- Endpoint selector → selector composition → `spec.selector`
- Namespace selector → selector composition → `spec.namespaceSelector`
- Tier → ref:default,security composition → `spec.tier`
- Order → number composition → `spec.order`
- Ingress rules → rules composition → `spec.ingress`
- Egress rules → rules composition → `spec.egress`
- Pre-DNAT → bool composition → `spec.preDNAT`
- Forward traffic → bool composition → `spec.applyOnForward`
- Untracked traffic → bool composition → `spec.doNotTrack`

Remaining pinned spec fields use explicit source-only editing: spec.tier, spec.order, spec.ingress, spec.egress, spec.selector, spec.types, spec.doNotTrack, spec.preDNAT, spec.applyOnForward, spec.serviceAccountSelector, spec.namespaceSelector, spec.performanceHints.
Capture: GlobalNetworkPolicy.png; GlobalNetworkPolicy-edit.png. 

### NetworkSet
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/networkset.go

- Networks → list composition → `spec.nets`

Remaining pinned spec fields use explicit source-only editing: spec.nets.
Capture: NetworkSet.png; NetworkSet-edit.png. 

### GlobalNetworkSet
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/globalnetworkset.go

- Networks → list composition → `spec.nets`

Remaining pinned spec fields use explicit source-only editing: spec.nets.
Capture: GlobalNetworkSet.png; GlobalNetworkSet-edit.png. 

### HostEndpoint
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/hostendpoint.go

- Node → ref:preview-node-a,preview-node-b composition → `spec.node`
- Interface → text composition → `spec.interfaceName`
- Expected IPs → list composition → `spec.expectedIPs`
- Profiles in order → list composition → `spec.profiles`
- Named ports → ports composition → `spec.ports`

Remaining pinned spec fields use explicit source-only editing: spec.node, spec.interfaceName, spec.expectedIPs, spec.profiles, spec.ports.
Capture: HostEndpoint.png; HostEndpoint-edit.png. 

### IPPool
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/ippool.go

- Pool CIDR → cidr composition → `spec.cidr`
- Block prefix length → number composition → `spec.blockSize`
- IP-in-IP → ref:Never,Always,CrossSubnet composition → `spec.ipipMode`
- VXLAN → ref:Never,Always,CrossSubnet composition → `spec.vxlanMode`
- Masquerade outgoing → bool composition → `spec.natOutgoing`
- Stop new allocations → bool composition → `spec.disabled`
- Eligible nodes → selector composition → `spec.nodeSelector`
- Assignment → ref:Automatic,Manual composition → `spec.assignmentMode`
- Allowed uses → list composition → `spec.allowedUses`
- Disable BGP export → bool composition → `spec.disableBGPExport`

Remaining pinned spec fields use explicit source-only editing: spec.cidr, spec.vxlanMode, spec.ipipMode, spec.natOutgoing, spec.disabled, spec.disableBGPExport, spec.blockSize, spec.nodeSelector, spec.ipip, spec.nat-outgoing, spec.allowedUses, spec.assignmentMode.
Capture: IPPool.png; IPPool-edit.png. 

### IPReservation
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/ipreservation.go

- Reserved IPs or CIDRs → list composition → `spec.reservedCIDRs`

Remaining pinned spec fields use explicit source-only editing: spec.reservedCIDRs.
Capture: IPReservation.png; IPReservation-edit.png. 

### BGPConfiguration
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/bgpconfig.go

- Autonomous system → number composition → `spec.asNumber`
- Node mesh → bool composition → `spec.nodeToNodeMeshEnabled`
- Listen port → number composition → `spec.listenPort`
- Advertised service CIDRs → cidrrows composition → `spec.serviceClusterIPs`
- Communities → pairs composition → `spec.communities`
- Prefix advertisements → prefix composition → `spec.prefixAdvertisements`
- Log level → ref:Info,Warning,Error composition → `spec.logSeverityScreen`

Remaining pinned spec fields use explicit source-only editing: spec.logSeverityScreen, spec.nodeToNodeMeshEnabled, spec.asNumber, spec.serviceLoadBalancerIPs, spec.serviceExternalIPs, spec.serviceClusterIPs, spec.communities, spec.prefixAdvertisements, spec.listenPort, spec.nodeMeshPassword, spec.nodeMeshMaxRestartTime, spec.bindMode, spec.ignoredInterfaces, spec.localWorkloadPeeringIPV4, spec.localWorkloadPeeringIPV6.
Capture: BGPConfiguration.png; BGPConfiguration-edit.png. 

### BGPFilter
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/bgpfilter.go

- Import IPv4 → filters composition → `spec.importV4`
- Export IPv4 → filters composition → `spec.exportV4`
- Import IPv6 → filters composition → `spec.importV6`
- Export IPv6 → filters composition → `spec.exportV6`

Remaining pinned spec fields use explicit source-only editing: spec.exportV4, spec.importV4, spec.exportV6, spec.importV6.
Capture: BGPFilter.png; BGPFilter-edit.png. 

### BGPPeer
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/bgppeer.go

- Local nodes → selector composition → `spec.nodeSelector`
- Peer address → text composition → `spec.peerIP`
- Peer AS number → number composition → `spec.asNumber`
- Peer nodes alternative → selector composition → `spec.peerSelector`
- Ordered filters → list composition → `spec.filters`
- Source address → ref:UseNodeIP,None composition → `spec.sourceAddress`
- Password Secret reference → text composition → `spec.password.secretKeyRef.name`
- Secret key reference → text composition → `spec.password.secretKeyRef.key`

Remaining pinned spec fields use explicit source-only editing: spec.node, spec.nodeSelector, spec.peerIP, spec.asNumber, spec.peerSelector, spec.keepOriginalNextHop, spec.password, spec.sourceAddress, spec.maxRestartTime, spec.numAllowedLocalASNumbers, spec.ttlSecurity, spec.reachableBy, spec.filters, spec.localWorkloadSelector.
Capture: BGPPeer.png; BGPPeer-edit.png. 

### FelixConfiguration
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/felixconfig.go

- Screen log level → ref:Info,Warning,Error,Debug composition → `spec.logSeverityScreen`
- IPv6 support → bool composition → `spec.ipv6Support`
- iptables backend → ref:Auto,Legacy,NFT composition → `spec.iptablesBackend`
- Workload to host → ref:Drop,Accept,Return composition → `spec.defaultEndpointToHostAction`
- WireGuard IPv4 → bool composition → `spec.wireguardEnabled`
- Metrics endpoint → bool composition → `spec.prometheusMetricsEnabled`
- Inbound failsafes → protoports composition → `spec.failsafeInboundHostPorts`

Remaining pinned spec fields use explicit source-only editing: spec.useInternalDataplaneDriver, spec.dataplaneDriver, spec.dataplaneWatchdogTimeout, spec.ipv6Support, spec.routeRefreshInterval, spec.interfaceRefreshInterval, spec.iptablesRefreshInterval, spec.iptablesPostWriteCheckInterval, spec.iptablesLockFilePath, spec.iptablesLockTimeout, spec.iptablesLockProbeInterval, spec.featureDetectOverride, spec.featureGates, spec.ipsetsRefreshInterval, spec.maxIpsetSize, spec.iptablesBackend, spec.xdpRefreshInterval, spec.netlinkTimeout, spec.metadataAddr, spec.metadataPort, spec.openstackRegion, spec.interfacePrefix, spec.interfaceExclude, spec.chainInsertMode, spec.defaultEndpointToHostAction, spec.iptablesFilterAllowAction, spec.iptablesMangleAllowAction, spec.iptablesFilterDenyAction, spec.logPrefix, spec.logFilePath, spec.logSeverityFile, spec.logSeverityScreen, spec.logSeveritySys, spec.logDebugFilenameRegex, spec.ipipEnabled, spec.ipipMTU, spec.vxlanEnabled, spec.vxlanMTU, spec.vxlanMTUV6, spec.vxlanPort, spec.vxlanVNI, spec.allowVXLANPacketsFromWorkloads, spec.allowIPIPPacketsFromWorkloads, spec.reportingInterval, spec.reportingTTL, spec.endpointReportingEnabled, spec.endpointReportingDelay, spec.endpointStatusPathPrefix, spec.iptablesMarkMask, spec.disableConntrackInvalidCheck, spec.healthEnabled, spec.healthHost, spec.healthPort, spec.healthTimeoutOverrides, spec.prometheusMetricsEnabled, spec.prometheusMetricsHost, spec.prometheusMetricsPort, spec.prometheusGoMetricsEnabled, spec.prometheusProcessMetricsEnabled, spec.prometheusWireGuardMetricsEnabled, spec.failsafeInboundHostPorts, spec.failsafeOutboundHostPorts, spec.kubeNodePortRanges, spec.policySyncPathPrefix, spec.usageReportingEnabled, spec.usageReportingInitialDelay, spec.usageReportingInterval, spec.natPortRange, spec.natOutgoingAddress, spec.deviceRouteSourceAddress, spec.deviceRouteSourceAddressIPv6, spec.deviceRouteProtocol, spec.removeExternalRoutes, spec.ipForwarding, spec.externalNodesList, spec.debugMemoryProfilePath, spec.debugDisableLogDropping, spec.debugSimulateCalcGraphHangAfter, spec.debugSimulateDataplaneHangAfter, spec.debugSimulateDataplaneApplyDelay, spec.debugHost, spec.debugPort, spec.iptablesNATOutgoingInterfaceFilter, spec.sidecarAccelerationEnabled, spec.xdpEnabled, spec.genericXDPEnabled, spec.nftablesMode, spec.nftablesRefreshInterval, spec.nftablesFilterAllowAction, spec.nftablesMangleAllowAction, spec.nftablesFilterDenyAction, spec.nftablesMarkMask, spec.bpfEnabled, spec.bpfDisableUnprivileged, spec.bpfLogLevel, spec.bpfConntrackLogLevel, spec.bpfConntrackMode, spec.bpfConntrackTimeouts, spec.bpfLogFilters, spec.bpfCTLBLogFilter, spec.bpfDataIfacePattern, spec.bpfL3IfacePattern, spec.bpfConnectTimeLoadBalancingEnabled, spec.bpfConnectTimeLoadBalancing, spec.bpfHostNetworkedNATWithoutCTLB, spec.bpfExternalServiceMode, spec.bpfDSROptoutCIDRs, spec.bpfExtToServiceConnmark, spec.bpfKubeProxyIptablesCleanupEnabled, spec.bpfKubeProxyMinSyncPeriod, spec.bpfKubeProxyEndpointSlicesEnabled, spec.bpfPSNATPorts, spec.bpfMapSizeNATFrontend, spec.bpfMapSizeNATBackend, spec.bpfMapSizeNATAffinity, spec.bpfMapSizeRoute, spec.bpfMapSizeConntrack, spec.bpfMapSizePerCpuConntrack, spec.bpfMapSizeConntrackScaling, spec.bpfMapSizeConntrackCleanupQueue, spec.bpfMapSizeIPSets, spec.bpfMapSizeIfState, spec.bpfHostConntrackBypass, spec.bpfEnforceRPF, spec.bpfPolicyDebugEnabled, spec.bpfForceTrackPacketsFromIfaces, spec.bpfDisableGROForIfaces, spec.bpfExcludeCIDRsFromNAT, spec.bpfExportBufferSizeMB, spec.flowLogsPolicyEvaluationMode, spec.bpfRedirectToPeer, spec.flowLogsFlushInterval, spec.flowLogsCollectorDebugTrace, spec.flowLogsGoldmaneServer, spec.bpfProfiling, spec.routeSource, spec.routeTableRanges, spec.routeTableRange, spec.routeSyncDisabled, spec.wireguardEnabled, spec.wireguardEnabledV6, spec.wireguardThreadingEnabled, spec.wireguardListeningPort, spec.wireguardListeningPortV6, spec.wireguardRoutingRulePriority, spec.wireguardInterfaceName, spec.wireguardInterfaceNameV6, spec.wireguardMTU, spec.wireguardMTUV6, spec.wireguardHostEncryptionEnabled, spec.wireguardKeepAlive, spec.awsSrcDstCheck, spec.serviceLoopPrevention, spec.workloadSourceSpoofing, spec.mtuIfacePattern, spec.floatingIPs, spec.windowsManageFirewallRules, spec.goGCThreshold, spec.goMemoryLimitMB, spec.goMaxProcs.
Capture: FelixConfiguration.png; FelixConfiguration-edit.png. 

### KubeControllersConfiguration
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/kubecontrollersconfig.go

- Health checks → ref:Enabled,Disabled composition → `spec.healthChecks`
- Screen log level → ref:Info,Warning,Error composition → `spec.logSeverityScreen`
- Copy node labels → ref:Enabled,Disabled composition → `spec.controllers.node.syncLabels`
- Automatic host endpoints → ref:Enabled,Disabled composition → `spec.controllers.node.hostEndpoint.autoCreate`
- Load balancer allocation → ref:AllServices,RequestedServicesOnly composition → `spec.controllers.loadBalancer.assignIPs`

Remaining pinned spec fields use explicit source-only editing: spec.logSeverityScreen, spec.healthChecks, spec.etcdV3CompactionPeriod, spec.prometheusMetricsPort, spec.controllers, spec.debugProfilePort.
Capture: KubeControllersConfiguration.png; KubeControllersConfiguration-edit.png. 

### IPAMConfiguration
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/ipamconfig.go

- Prevent borrowing addresses → bool composition → `spec.strictAffinity`
- Maximum blocks per host → number composition → `spec.maxBlocksPerHost`

Remaining pinned spec fields use explicit source-only editing: spec.strictAffinity, spec.maxBlocksPerHost.
Capture: IPAMConfiguration.png; IPAMConfiguration-edit.png. 

### Tier
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/tier.go

- Tier order → number composition → `spec.order`
- Fall-through action → ref:Deny,Pass composition → `spec.defaultAction`

Remaining pinned spec fields use explicit source-only editing: spec.order, spec.defaultAction.
Capture: Tier.png; Tier-edit.png. 

### CalicoNodeStatus
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/nodestatus.go

- Node → ref:preview-node-a,preview-node-b composition → `spec.node`
- Diagnostic classes → list composition → `spec.classes`
- Update interval (seconds) → number composition → `spec.updatePeriodSeconds`

Remaining pinned spec fields use explicit source-only editing: spec.node, spec.classes, spec.updatePeriodSeconds.
Capture: CalicoNodeStatus.png; CalicoNodeStatus-edit.png. 

### Profile
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/profile.go

- Labels to apply → pairs composition → `spec.labelsToApply`
- Ingress rules → rules composition → `spec.ingress`
- Egress rules → rules composition → `spec.egress`

Remaining pinned spec fields use explicit source-only editing: spec.ingress, spec.egress, spec.labelsToApply.
Capture: Profile.png; Profile-edit.png. 

### BlockAffinity
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/blockaffinity.go

- Node → text composition → `spec.node`
- Block → text composition → `spec.cidr`
- State → text composition → `spec.state`
- Pending deletion → bool composition → `spec.deleted`

Remaining pinned spec fields use explicit source-only editing: spec.state, spec.node, spec.cidr, spec.deleted.
Capture: BlockAffinity.png; BlockAffinity-edit.png. Both captures are inspect boundaries, not edit forms.

### ClusterInformation
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/clusterinfo.go

- Version → text composition → `spec.calicoVersion`
- Cluster type → text composition → `spec.clusterType`
- Datastore ready → bool composition → `spec.datastoreReady`
- Variant → text composition → `spec.variant`

Remaining pinned spec fields use explicit source-only editing: spec.clusterGUID, spec.clusterType, spec.calicoVersion, spec.datastoreReady, spec.variant.
Capture: ClusterInformation.png; ClusterInformation-edit.png. Both captures are inspect boundaries, not edit forms.

### StagedNetworkPolicy
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/stagednetworkpolicy.go

- Staged action → ref:Set,Delete,Learn composition → `spec.stagedAction`
- Endpoint selector → selector composition → `spec.selector`
- Tier → ref:default,security composition → `spec.tier`
- Order → number composition → `spec.order`
- Directions → list composition → `spec.types`
- Ingress rules → rules composition → `spec.ingress`
- Egress rules → rules composition → `spec.egress`

Remaining pinned spec fields use explicit source-only editing: spec.stagedAction, spec.tier, spec.order, spec.ingress, spec.egress, spec.selector, spec.types, spec.serviceAccountSelector, spec.performanceHints.
Capture: StagedNetworkPolicy.png; StagedNetworkPolicy-edit.png. 

### StagedGlobalNetworkPolicy
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/stagedglobalnetworkpolicy.go

- Staged action → ref:Set,Delete,Learn composition → `spec.stagedAction`
- Endpoint selector → selector composition → `spec.selector`
- Namespace selector → selector composition → `spec.namespaceSelector`
- Tier → ref:default,security composition → `spec.tier`
- Order → number composition → `spec.order`
- Ingress rules → rules composition → `spec.ingress`
- Egress rules → rules composition → `spec.egress`
- Pre-DNAT → bool composition → `spec.preDNAT`
- Forward traffic → bool composition → `spec.applyOnForward`
- Untracked traffic → bool composition → `spec.doNotTrack`

Remaining pinned spec fields use explicit source-only editing: spec.stagedAction, spec.tier, spec.order, spec.ingress, spec.egress, spec.selector, spec.types, spec.doNotTrack, spec.preDNAT, spec.applyOnForward, spec.serviceAccountSelector, spec.namespaceSelector, spec.performanceHints.
Capture: StagedGlobalNetworkPolicy.png; StagedGlobalNetworkPolicy-edit.png. 

### StagedKubernetesNetworkPolicy
Source: https://github.com/projectcalico/calico/blob/572a32dd9b2f9784d66d74712d5ec2e703d25083/api/pkg/apis/projectcalico/v3/stagedkubernetesnetworkpolicy.go

- Staged action → ref:Set,Delete composition → `spec.stagedAction`
- Pod labels → pairs composition → `spec.podSelector.matchLabels`
- Directions → list composition → `spec.policyTypes`
- Ingress peers and ports → k8srules composition → `spec.ingress`
- Egress peers and ports → k8srules composition → `spec.egress`

Remaining pinned spec fields use explicit source-only editing: spec.stagedAction, spec.podSelector, spec.ingress, spec.egress, spec.policyTypes.
Capture: StagedKubernetesNetworkPolicy.png; StagedKubernetesNetworkPolicy-edit.png. 

## Advanced and source contract
Prototype deliberately does not ship a YAML AST engine. Form values render YAML with JSON-compatible flow content. Editing source switches that resource permanently to source-only within draft session. Exact comments, unknown keys, scalar spellings and large integers remain unchanged across mode switches because no parsing/conversion occurs. Unsupported or invalid source can be repaired in place; Form never overwrites it. This is not evidence of production leaf-level lossless AST patching. No draft or credentials stored in browser persistence. Explicit persistent mode preference is a production integration requirement, not implemented in isolated mock. No raw password input; BGPPeer uses unresolved Secret name/key references only. No resolved values, annotations or credential material captured.

## Browser proof and limits
1440×900 at device scale 1.25; narrow 640×900. Boolean checks cover all identity locks, pool immutable fields, add/remove, actual typing/selects, help open/Escape/focus, source preservation, invalid CIDR blocking, non-mutating review, ownership, API missing, denied, unknown capability and empty references, narrow footer/overflow. Gallery visually inspected. No runtime page errors observed in final browser. Native controls provide keyboard focus. Browser viewport needed explicit setViewport after open ignored requested dimensions. No build, lint, repository tests or live mutation run.

These mocks demonstrate tailored common-task controls plus full explicit advanced source coverage, not exhaustive API validation. Selector parsing, CIDR overlap/IPAM capacity checks, tier existence, BGP capability restrictions, reference authorization, real source AST patching, optimistic revision checks and production control integration remain admission/integration requirements. BGP filters expose action/CIDR/operator; prefix length/source/interface remain source-only. Felix's long expert configuration remains source-only beyond selected common controls. Staged Kubernetes peers remain source-only beyond pod labels and ports. Review never claims admission or enforcement. No approval or release claimed.

## Visual review
Compact 1000×700 frame; 32px controls; 13px body; 20×24px content padding; 16px grid gaps. Necessary traffic warnings visible; terminology help click/keyboard accessible. Remaining gap: one global resource help rather than per-field hover help. No animation; native focus outline; scrollable content and persistent footer.
