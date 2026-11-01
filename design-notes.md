# Calico operator editor proposal — issue 305

Interactive HTML composition, not shipped React or approved design. Open index.html locally; no build, dependencies or server required. Fixture selectors sit outside the working frame. No live data, credentials, cluster connections or mutations.

## Sources and qualification

Pinned schema: https://github.com/projectcalico/calico/blob/v3.30.0/manifests/operator-crds.yaml . All seven kinds serve operator.tigera.io/v1 and are cluster scoped. Matching operator image v1.38.0 comes from https://github.com/projectcalico/calico/blob/v3.30.0/manifests/tigera-operator.yaml .

Cross-check types at https://github.com/tigera/operator/tree/v1.38.0/api/v1 and controllers at https://github.com/tigera/operator/tree/v1.38.0/pkg/controller . APIServer supports default and legacy tigera-secure names; new OSS configuration uses default. Goldmane/Whisker controllers fetch default. ImageSet name follows calico-<release> for OSS. GatewayAPI controller fetches default then legacy tigera-secure and rejects duplicates. Its controller waits for Installation variant; schema wording mentioning Enterprise does not justify declaring OSS unsupported. It reconciles CRDs create-only for PreferExisting, full reconciliation for Reconcile; CRDs intentionally have no owning CR and survive removal. Exact applicability still requires discovered API, supported installed operator, resolved Installation and real user verbs. This mock simulates those capabilities, not proves them.

TigeraStatus is operator-generated; the deployment grants the operator create/delete for it, unlike ordinary configuration kinds. Status conditions are Available, Progressing, Degraded and include reason/message/observedGeneration/lastTransitionTime. No status writer or fabricated creation interface is offered.

Approved layout/workflow sources: omniviewdev/omniview#249 and plugin PR72/74. Named mock skill unavailable; approved interactive HTML workflow used. Visual review used /Users/joshuapare/.agents/skills/web-design-guidelines/SKILL.md and its fetched web-interface-guidelines command.md.

## Field/control/path mapping

All identities map to metadata.name, locked during Edit. Singleton default remains locked in Create; ImageSet accepts calico-<release>. Cluster context is destination only; no metadata.namespace.

| Kind | Control | Owned path |
| --- | --- | --- |
| Installation | Platform choice; omission distinct | spec.kubernetesProvider |
| Installation | Linux dataplane choice | spec.calicoNetwork.linuxDataplane |
| Installation | BGP choice | spec.calicoNetwork.bgp |
| Installation | MTU whole-number bytes | spec.calicoNetwork.mtu |
| Installation | Registry string | spec.registry |
| Installation | Control-plane whole-number replicas | spec.controlPlaneReplicas |
| Installation | Add/remove CIDR and encapsulation rows | spec.calicoNetwork.ipPools[i].cidr, .encapsulation |
| APIServer | Ready-time seconds | spec.apiServerDeployment.spec.minReadySeconds |
| APIServer | Logging severity choice | spec.logging.apiServer.logSeverity |
| APIServer | PriorityClass reference name | spec.apiServerDeployment.spec.template.spec.priorityClassName |
| Goldmane | Ready-time seconds; PriorityClass | spec.goldmaneDeployment.spec.minReadySeconds; .template.spec.priorityClassName |
| Whisker | External notifications choice | spec.notifications |
| Whisker | Ready-time seconds; PriorityClass | spec.whiskerDeployment.spec.minReadySeconds; .template.spec.priorityClassName |
| ImageSet | Original image and sha256 digest rows | spec.images[i].image; .digest |
| GatewayAPI | Omit / PreferExisting / Reconcile | spec.crdManagement |
| TigeraStatus | Read-only component/condition/reason/message/generation | metadata.name; status.conditions[i].type/status/reason/message/observedGeneration |

Unexposed schema fields remain full-source territory, not missing resource components: Installation CNI/IPAM, autodetection, Windows, BGP export, node selectors, certificates, tolerations and component overrides; component Pod templates/resources; Gateway deployment, controller and certgen job customizations. Existing source remains whole. No claim all schema fields receive guided controls. Credential-bearing settings are excluded from fixtures and captures; no raw sensitive import support.

## Create/edit/ownership boundaries

Installation changes affect cluster networking. IP pools are operator reconciled: edit Installation rather than generated backing pools. Existing pool CIDR/block-size migrations need controller-specific validation; this mock does not promise in-place mutation, delete/recreate or migration. Omitted ipPools and explicit empty arrays differ; UI demonstrates omission plus explicit populated rows, not an empty-array command. Removing final mock row returns omission and is not a production migration contract.

APIServer is opt-in desired configuration; generated Deployment/APIService stays operator owned. Goldmane enables aggregation intent, not proven collection. Whisker depends on Installation and Goldmane; notification setting governs external banner fetches. No companion resources are silently authored by the editor. Operator reconciliation effects remain visible consequences.

ImageSet requires every deployed image, matching variant/release; a one-row screenshot shows editing, not a complete usable image inventory. Digest validation is local syntax only, not authenticity or registry access. Production must validate complete image coverage before submission.

GatewayAPI authors only supported installation configuration, not Gateway routes. Reconcile can affect shared CRDs; PreferExisting leaves updates to the administrator. Removal preserves CRDs, while implementation resources are owned by the GatewayAPI CR.

TigeraStatus is inspect-only, links back to Installation draft. No reconcile-now, health success, logs viewer or replacement dashboard invented.

Access fixtures separate Denied, API missing, Unavailable and GitOps-owned. Production needs actual verbs/field manager/owner context, not this selector. GitOps-owned configuration routes to its source rather than live editing. Existing omitted fields, unsupported versions, unknown content and invalid source must remain exact.

## Draft and reuse contract

Mock uses native HTML controls as faithful isolated base-ui composition: Dialog frame, SegmentedControl, FormField/Input/Select, Table plus Buttons for rows, Tooltip/Popover, section navigation, and existing CodeEditor in production. No new generic primitive or release proposed. Resource-specific semantics belong in a Calico add-on editor provider, not hardcoded Kubernetes built-ins. Provider must gate GVK/version, discovery, ownership and verbs; generic YAML fallback remains available.

One in-memory draft per kind, no values persisted. Blank controls omit fields. Form-generated source keeps entered numeric strings exact. Once manually changed, source remains verbatim and Form locks; this deliberately avoids fake AST losslessness. Source-only local review is blocked because no schema parser runs here. Production should use the existing lossless manifest AST patch contract to retain comments, omission, unknown fields, scalar types and sibling list fields. This mock proves exact manual-source retention, not supported arbitrary Form/YAML round trips.

## Evidence and review limits

21 real-browser captures; 1440x900 viewport at deviceScaleFactor 1.25 (PNG 1800x1125), except explicitly named narrow capture at 740x780. All inspected through review sheet plus corrected individual captures. Actual typing, native selects, clicks, add/remove rows, help and Escape drove states. No injected state. Browser profile isolated under owned directory and excluded from publication. checks.json has booleans and screenshot names only.

Visual guidelines review: compact visible footer, internal scrolling, labeled native controls, focus outlines, visible errors and safety notes, no explanatory main-view paragraphs. Explicit mode preference alone persists in mock-305-mode; reload checks confirm draft values do not persist. Known prototype limitations: no production focus trap/opener lifecycle, no real RBAC/discovery/admission or reference fetching, no live edit baseline/resourceVersion conflict resolution, no complete IPv6/CIDR validation or image inventory validation, and no mock approval. Fixture Edit changes intent and locks identity; it does not fetch existing configuration. These are mock limitations, not production acceptance waivers. No repository builds/tests/lint/formatters run.
