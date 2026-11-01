# API Priority and Fairness — review mock #284

Interactive isolated HTML composition, not shipped React or a production editor. Followed approved #249 prototype workflow; no named mock skill was exposed. Reviewed with the installed web-design-guidelines skill and its fetched upstream rules. Both assigned resources are covered. No cluster connection, persistence, credentials, or mutation. Download index.html and open locally; no dependencies required.

## Sources and qualification

- [Issue 284](https://github.com/omniviewdev/omniview/issues/284), [Epic 262](https://github.com/omniviewdev/omniview/issues/262), [approved density #249](https://github.com/omniviewdev/omniview/issues/249), [PR72](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72), [PR74](https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74).
- [Kubernetes v1.35.0 OpenAPI](https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L64764-L66521): flowcontrol.apiserver.k8s.io/v1; k8s.io v0.35.0 baseline.
- [Pinned server validation](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/apis/flowcontrol/validation/validation.go): precedence 1 only exempt; Exempt type iff name exempt; mandatory spec protection; int32 and queue bounds.
- [Pinned FlowSchema strategy](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/registry/flowcontrol/flowschema/strategy.go), [priority strategy](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/registry/flowcontrol/prioritylevelconfiguration/strategy.go): cluster scope and separate status.
- [APF maintenance concepts](https://kubernetes.io/docs/concepts/cluster-administration/flow-control/#maintenance-of-the-mandatory-and-suggested-configuration-objects): mandatory versus suggested maintenance. Runtime discovery and separate create/update/get/list authorization remain required. Schema availability does not prove permission.

## Interaction and ownership

Native built-in provider; no add-on installation prerequisite. Use existing Kubernetes editor extension contract, not a new per-OSS host hardcode. Both resources are cluster-scoped. Name, kind, API version, server metadata and namespace are not editable on update. Ordinary policy specs can change; no invented immutable spec fields. Mandatory exempt/catch-all FlowSchemas have fixed specs. Mandatory catch-all priority is fixed. Mandatory exempt priority permits only spec.exempt tuning. Suggested objects may be reconciled: explicit opt-out sets metadata.annotations[apf.kubernetes.io/autoupdate-spec] to string false. No auto opt-out, companion priority object, or delete action. Custom objects must not acquire autoupdate-spec=true, which can cause their maintenance deletion.

Create and administrator-edit scenarios show tailored authoring. Mandatory objects show inspection. The exempt-tuning scenario applies only to PriorityLevelConfiguration. Scenario fixtures are independent demonstrations, not real object loading; suggested fixture naming is illustrative and not bootstrap-object detection. A production provider must classify names using pinned bootstrap sets, annotation and managed ownership, not the mock scenario picker.

## Field → control → manifest path

| Resource | Control | Owned path / behavior |
|---|---|---|
| Both | Name input | metadata.name; required DNS subdomain, locked on update |
| Both | Fixed destination/version | cluster preview-cluster; apiVersion=flowcontrol.apiserver.k8s.io/v1; kind; no namespace |
| FlowSchema | Precedence number + help | spec.matchingPrecedence; omitted stays omitted; server default 1000; ordinary range 2–10000 |
| FlowSchema | Fixture priority picker / exact-name fallback | spec.priorityLevelConfiguration.name; missing, denied and unavailable references differ; unresolved name stays possible, no implicit creation |
| FlowSchema | No distinguisher / User / Namespace | spec.distinguisherMethod omitted or .type=ByUser/ByNamespace |
| FlowSchema | Repeatable subject rows | spec.rules[0].subjects[].kind; branch user.name, group.name, serviceAccount.name and serviceAccount.namespace; only selected branch emitted |
| FlowSchema | Repeatable resource matches | spec.rules[0].resourceRules[].verbs, apiGroups, resources, namespaces; comma-entry token composition; empty API group means core string |
| FlowSchema | Cluster-scope checkbox | spec.rules[0].resourceRules[].clusterScope; namespace wildcard does not include namespace-less requests |
| FlowSchema | Non-resource branch | spec.rules[0].nonResourceRules[].verbs and nonResourceURLs; slash paths, trailing /*, sole wildcard |
| Priority | Fixed Limited type | spec.type=Limited for ordinary objects; Exempt iff singleton exempt |
| Priority | Shares, lendable %, borrowing % | spec.limited.nominalConcurrencyShares, lendablePercent, borrowingLimitPercent; blank omitted; explicit 0 preserved; borrowing may exceed 100 |
| Priority | Queue / Reject | spec.limited.limitResponse.type; Reject omits queuing; Queue restores local unsent queue controls |
| Priority | Queue count / hand size / length | spec.limited.limitResponse.queuing.queues, handSize, queueLengthLimit; blank delegates defaults 64/8/50; hand≤queues; server validates shuffle entropy |
| Exempt priority | Shares and lendable % only | spec.exempt.nominalConcurrencyShares and lendablePercent; fixed name/type; never limited/queue fields |
| Suggested bootstrap | Explicit ownership checkbox | metadata.annotations[apf.kubernetes.io/autoupdate-spec]="false" |
| Both | Read-only conditions | status.conditions[].type,status,reason,message,lastTransitionTime; no writable status or fabricated healthy condition |

Subject and request predicates follow API semantics: any subject AND any resource/non-resource request in a group; groups OR together. Guided prototype authors one group with repeatable subjects and both request families. Existing multi-group specs require source-only fallback, not flattening. Empty spec.rules is valid and matches no traffic; prototype's guided Review requires one request group as an authoring guard, not an API assertion.

## Draft/source boundary

Form controls retain local branch values when Queue/Reject switches; Reject's generated source omits forbidden queuing. Omitted numeric controls remain omitted; zero is distinct. Source edits remain exact, including comments, unknown fields and large integer text. Arbitrary source edits pause Form; no parser, AST migration, source-to-form conversion or lossless bidirectional claim. Returning to YAML restores the exact typed draft. Discard is explicit. No source mutation submission exists. Production must reuse PR72/74 leaf-level YAML AST patching for full fidelity, multi-group rules and unedited siblings. Metadata ownership labels are design requirements, not demonstrated arbitrary-object patch behavior. No source preference or draft persistence is implemented in this mock.

## Frame, reuse, accessibility

1000×700 desktop frame; 32px controls, 13px body, 180px navigation, 20×24px content padding, 16px grid gap. Fixed footer and internal scrolling. Narrow frame uses available viewport height; measured footer fit and no horizontal overflow at 700×900. Existing base-ui Input, Select, Checkbox, Button, Tooltip/Popover, ScrollArea, Alert and Tabs can compose these controls. This dependency-free HTML is a faithful isolated semantic composition, not imported base-ui. Resource-specific predicates and bootstrap rules remain provider-owned. No new generic primitive proposed. Labels, focus outlines, button controls, focus/click/hover help and Escape restore behavior were exercised. Validation summary is visible and focusable, but field-level error association and focus trapping remain production work.

## Captures and proof

All desktop captures use 1440×900 CSS at device scale 1.25 (1800×1125 PNG). 20-narrow uses 700×900 at 1.25. All captures were visually inspected in browser contact sheets; 04, 20 and 21 also inspected individually. Boolean proof is checks.json. Browser was driven by real fill/select/click/check/focus/keyboard/scroll interactions, not injected scenario state.

- 01: initial FlowSchema creation; 02: validation; 03: focused precedence help, followed by Escape closure.
- 04: user/service account subjects and resource/non-resource add branches; remove interactions exercised afterward. 21: scrolled URL-match control.
- 05: FlowSchema impact review; 06–07: unsupported source boundary and exact large scalar/comment preservation.
- 08: administrator edit with locked name. 09–10: suggested ownership opt-out and annotation-bearing review. 11: mandatory inspection.
- 12-empty, 12-refdenied, 12-refunavailable: distinct reference states with exact-name fallback. 12-denied and 12-unavailable: authorization and discovery boundaries.
- 13–16: priority Queue, hand-size error, Reject consequence, review with queuing omitted. Queue branch hand value retained when restored.
- 17–19: priority edit, exempt-only tuning, read-only disconnected status. 20: narrow footer and scroll containment.

## Limits / review decisions

Mock awaits user review; no acceptance checkbox or issue closure implied. Production discovery, authorization, admission/defaulting, bootstrap classification, conflicts, managed-field ownership and actual submissions are not exercised. Server-side validation remains authoritative, including shuffle-sharding entropy, full DNS length rules and complete verb validation. Existing multi-rule/unsupported source stays source-only. Capture fixtures contain no credentials, PEM, encoded secrets or embedded sensitive annotations. No raw sensitive view was opened. Initial shared browser capture timed out; a dedicated issue-only Chromium profile produced final proof. No repository build/test/lint/formatter ran.
