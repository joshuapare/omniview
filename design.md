# Admission registration editor designs — issue 278

Design mock only; pending review. No production source, shared package, cluster request or admission action changed.

## Scope and primary evidence

Kubernetes v1.35.0 / modules v0.35.0. All six resources are cluster-scoped authorable configuration objects, not AdmissionReview request envelopes. First four use admissionregistration.k8s.io/v1. MutatingAdmissionPolicy and MutatingAdmissionPolicyBinding use v1beta1 with v1alpha1 retained only through source fallback; MutatingAdmissionPolicy gate defaults false in v1.35. Source schema is not discovery or authorization.

- [Pinned OpenAPI](https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L39153-L44713). Extracted admissionregistration definitions: api-snapshot.json.
- [Feature defaults](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/features/kube_features.go#L2050-L2053).
- [Validation](https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/apis/admissionregistration/validation/validation.go).
- [Approved #249 workflow](https://github.com/omniviewdev/omniview/issues/249#issuecomment-6562273697), [Epic262](https://github.com/omniviewdev/omniview/issues/262), plugin PR72/74.

## Ownership, create/edit and safety

Native baseline adapter owns these forms; register exact GVK/version/capability through #263 contract, not a catch-all API prefix. Third-party operators can own managed instances. User-authored create/edit is distinct from fixture Managed inspect-only. Immutable object identity stays locked in Edit: metadata.name, group/version/kind and cluster scope. Spec/webhook fields are not globally immutable; real admission and resourceVersion conflict handling remain authoritative. Do not invent delete/recreate. Server metadata, status, type-check warnings, conditions and observedGeneration are inspection only. Only ValidatingAdmissionPolicy exposes status here.

Discovery unknown, API unavailable, and permission denied remain distinct and block Review. Gate-off unavailable differs from authorable gated fixture. Neither discovery nor gate presence proves update rights. Reference choices are explicitly synthetic and never imply controller/service health, CA trust, CEL validity or namespace authorization. No companion policies/bindings/Services/parameters are created. Review gives destination, changed paths, blocking/bypass/mutation consequences and no success claim.

## Exact field → control → manifest ownership

Every path below is relative to complete manifest. W means webhooks[i]; M means spec.matchConstraints for policies, spec.matchResources for bindings, or W for webhook selectors. Source-only means preserved and not normalized in production, not an invented guided editor.

| Resource / field | Control | Owned manifest path |
|---|---|---|
| All identity / metadata | Name; team label | metadata.name; metadata.labels.team |
| Scope / API identity | Read-only context | no namespace member; apiVersion; kind |
| Protected metadata | Inspect/source boundary | metadata.annotations; ownerReferences; managedFields; uid; resourceVersion |
| Both webhook configurations | Repeatable webhook rows | webhooks[i] |
| Webhook DNS identity | text | W.name |
| Client endpoint | exclusive Service / HTTPS URL | W.clientConfig.service OR W.clientConfig.url |
| Service reference | namespace and Service pickers; port integer; path | W.clientConfig.service.namespace/name/port/path |
| Trust | no-material-loaded inspection/help | W.clientConfig.caBundle source-only; omitted uses API-server roots |
| Side effects | explicit None / NoneOnDryRun | W.sideEffects |
| Protocol versions | ordered version text list | W.admissionReviewVersions[] |
| Failure / timeout | Omitted / Fail / Ignore; seconds 1–30 | W.failurePolicy; W.timeoutSeconds |
| Mutating webhook reinvocation | Omitted / Never / IfNeeded | W.reinvocationPolicy |
| Match include | operations/groups/versions/resources lists; scope choice | W.rules[i].operations/apiGroups/apiVersions/resources/scope; policy M.resourceRules[i].same |
| Policy named match | name list | M.resourceRules[i].resourceNames[] |
| Match selectors | explicit label equality controls | M.namespaceSelector.matchLabels.environment; M.objectSelector.matchLabels.team |
| Match equivalence | Omitted / Equivalent / Exact | M.matchPolicy |
| Exclusions | expanded resource list; other rule members source-only | M.excludeResourceRules[i].resources |
| Match condition | name + CEL | W.matchConditions[i].name/expression or spec.matchConditions[i].name/expression |
| Validating policy logic | CEL, failure message, reason, message CEL | spec.validations[i].expression/message/reason/messageExpression |
| Policy parameters | API version + kind | spec.paramKind.apiVersion/kind |
| Variables | name + CEL | spec.variables[i].name/expression |
| Validation audit | key + CEL | spec.auditAnnotations[i].key/valueExpression |
| Policy evaluation failure | Omitted / Fail / Ignore | spec.failurePolicy |
| Mutating policy logic | ApplyConfiguration / JSONPatch selector + CEL | spec.mutations[i].patchType; .applyConfiguration.expression OR .jsonPatch.expression |
| Mutating policy reinvocation | explicit Never / IfNeeded | spec.reinvocationPolicy |
| Both bindings | existing policy reference | spec.policyName |
| Validating binding enforcement | Deny / Warn / Audit checkboxes | spec.validationActions[]; Deny + Warn invalid |
| Both binding parameters | Omitted / Name / Label Selector | spec.paramRef.name OR .selector.matchLabels.team |
| Parameter scope / missing action | namespace; explicit Allow / Deny | spec.paramRef.namespace; .parameterNotFoundAction |
| Policy status | read-only unavailable fixture | status.observedGeneration/typeChecking.expressionWarnings/conditions |

Binding matching intersects policy matching. Exclusions win. Wildcard resources do not imply all subresources. Name/selector and service/URL branches must stay mutually exclusive while retaining inactive branch drafts locally. Parameter namespace omission depends on paramKind scope; do not silently choose a namespace. CEL is not compiled or server-evaluated here. MatchConditions cannot use policy variables. Mutating policies accept only CREATE/UPDATE/CONNECT operations under API validation, not DELETE. Production picker must constrain those operations.

## Reuse and visual review

Faithful isolated HTML composition, not shipped React. Approved 1000×700 frame, 180px navigation, 32px controls, 13px body, 20×24px padding, 16px gaps. Native labels/selects/buttons/details compose intended base-ui FormField/Input/Select/Checkbox/Popover/Collapsible/EditableList/SegmentedControl equivalents. Existing ResourceFormFields.tsx imports Button/Input/Select and composes field errors/help at lines1–73. Reuse that architecture and shared manifest AST rather than installing a schema-form framework. No new generic primitive required; CEL and admission rules belong to native adapter.

Used actual web-design-guidelines skill at /Users/joshuapare/.agents/skills/web-design-guidelines/SKILL.md and fetched its linked rule source. Reviewed known index.html. Fixed focus reopening, disabled-state contrast and narrow footer. No named mock skill was installed; used approved #249 workflow.

## Browser evidence and limits

All PNGs are actual isolated Chrome captures; 1440×900 CSS at1.25 except 23-narrow at720×860 at1.25. Each capture was inspected visually. Initial shared browser capture timed out; switched to dedicated owned chrome-profile. Profile/cache is not published. Browser inputs, selections, checkboxes, help, Escape, add/remove, source editing and scenario navigation drove states; no state injection.

checks.json contains only named booleans and screenshot filenames. Preservation proof covers fixture comment, exact 9007199254740993 token, untouched form fields, invalid source bytes, exclusive parameter projection and removed rule omission. No blanket arbitrary YAML losslessness claim: bounded mock projects edited owned values to YAML flow objects, and any manual source edit makes Form unavailable. Production must use existing AST draft, including unknown siblings, omission, types and comments. Fixture values are examples, never recommended executable defaults.

The prototype demonstrates one/two rows and fixed label keys rather than a full generic list editor. Other selector operators, arbitrary metadata, full exclusion rule detail, multiple variables/audit annotations and alpha-version conversion require safe source path, not guessed normalization. CA upload/reveal is deliberately unavailable; no PEM or Base64 material was loaded or captured. YAML contains synthetic nonsensitive fixtures only; no import or raw sensitive source capture was exercised. Form source projection is a bounded interaction aid, not an executable manifest validator. Full required-field/CEL/union validation, request failure/conflict lifetimes, source recovery, focus trap, modal close/opener restoration and production API requests are not verified. Mode-only preference persists; drafts never persist. User review remains required; issue stays open.

## Capture captions

- 01-create-identity.png: create identity
- 02-MutatingWebhookConfiguration.png: MutatingWebhookConfiguration
- 03-ValidatingWebhookConfiguration.png: ValidatingWebhookConfiguration
- 04-ValidatingAdmissionPolicy.png: ValidatingAdmissionPolicy
- 05-ValidatingAdmissionPolicyBinding.png: ValidatingAdmissionPolicyBinding
- 06-MutatingAdmissionPolicy.png: MutatingAdmissionPolicy
- 07-MutatingAdmissionPolicyBinding.png: MutatingAdmissionPolicyBinding
- 08-invalid-actions.png: invalid actions
- 09-parameter-selector.png: parameter selector
- 10-review.png: review
- 11-edit-identity.png: edit identity
- 12-matching-rules.png: matching rules
- 13-help.png: help
- 14-source.png: source
- 15-source-fallback.png: source fallback
- 16-json-patch.png: json patch
- 17-advanced.png: advanced
- 18-status.png: status
- 19-Managed.png: Managed
- 19-Denied.png: Denied
- 19-Unavailable.png: Unavailable
- 19-Discovery-unknown.png: Discovery unknown
- 20-gate-unavailable.png: gate unavailable
- 21-url-client.png: url client
- 22-invalid-timeout.png: invalid timeout
- 23-narrow.png: narrow
- 24-webhook-help-closed.png: webhook help closed
