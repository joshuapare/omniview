# Ownership applicability addendum

Native and ecosystem providers require a host ownership classification in addition to GVK, schema, discovery and RBAC. An available POST verb does not establish safe user authoring. Context must distinguish user-managed, controller-managed, system record, generated, protocol-only, and unknown ownership. Create/edit capabilities require the applicable ownership policy; unknown ownership stays inspect/YAML without a fabricated save claim. Do not infer ownership from labels or permissions alone.

Concrete cross-group finding from #281 design: Lease authoring requires explicit application ownership. Heartbeat/election Leases and all LeaseCandidate views are inspect-only. LeaseCandidate served versions and default-off coordinated leader election gates require discovery; leaseName immutability must be enforced by the adapter. These semantics belong in Kubernetes adapters, not base-ui or registry.

Capability eligibility is therefore the intersection of exact applicability, schema safety, operation intent, ownership policy, lifecycle identity, discovered verbs and current authorization. Provider declarations can narrow, never widen, host policy.
