# AdmissionReview protocol inspector — issue 288

Design proposal awaiting review, not shipped React. Open index.html with inspector.js beside it, or serve this directory. No dependencies or build step. HTML faithfully composes the compact base-ui visual language; it does not import React components.

## Scope and source snapshot

Covers the sole unchecked component: AdmissionReview, request and response, admission.k8s.io/v1 and retained v1beta1. Baseline Kubernetes v1.35.0 / modules v0.35.0.

Primary sources read:
- https://github.com/kubernetes/api/blob/v0.35.0/admission/v1/register.go
- https://github.com/kubernetes/api/blob/v0.35.0/admission/v1/types.go
- https://github.com/kubernetes/api/blob/v0.35.0/admission/v1beta1/types.go

Also read Epic262, issue249 approved mock workflow and PR72/74 summaries. v1beta1 lifecycle comments explicitly say this API is never server served, used for outbound API-server requests. Retained schema is not a claim of negotiation support in an installed webhook. No feature gate or optional CRD installation applies to decoding the envelope; capture integration and webhook negotiated versions remain separately required.

## Ownership and intent

No Create, Edit, Save, Replay, resource endpoint, or ordinary CRUD authorization. AdmissionReview has no resource metadata identity or persistence scope. request.namespace describes the reviewed object, not AdmissionReview scope. API server produces request; webhook produces response. All real envelope fields are immutable to this inspector. Local fixture selectors and response-analysis controls are demonstrations only, never submitted. Response UID must correlate with request UID; matching permits local review only. Allowed is one webhook stage, not final admission success. Status is ignored when allowed is true. Patches use JSONPatch/RFC6902 and are not applied or decoded here.

Native Kubernetes plugin can own the envelope inspector. A capture provider must independently supply permission, availability, negotiated version, and privacy-safe data. This is not a reason to build a general capture dashboard or hardcode operator forms. No new base-ui primitive required.

## Exact path mapping

| Path | Control / display | Ownership and behavior |
| --- | --- | --- |
| apiVersion, kind | Version fixture picker; fixed kind | Inspect supported v1/v1beta1. vNext demonstrates unsupported projection with no review. |
| request.uid | Correlation readout | API-server owned, distinct from original user request identity. |
| request.kind.{group,version,kind} | Kind readout | Converted kind presented to webhook. |
| request.resource.{group,version,resource} | Resource readout | Converted resource, not an editor destination. |
| request.subResource | Readout | Omitted differs from a requested subresource. CONNECT fixture uses Pod exec. |
| request.requestKind, request.requestResource | Original-request readout | Optional equivalent-conversion source; no conversion indicated when absent in fixture. |
| request.requestSubResource | Original subresource readout | Retain independently of converted subResource. |
| request.name | Name readout | Empty CREATE name may mean server-generated name. Never invent one. |
| request.namespace | Context readout | Omission can represent a cluster-scoped request; fixture is preview namespace. |
| request.operation | Operation fixture selector | CREATE/UPDATE/DELETE/CONNECT. Not an action button. |
| request.dryRun | Omission-aware readout | Absent defaults false; no fabricated true value. |
| request.userInfo.{username,uid,groups,extra} | Withheld identity boundary | No names, values, credentials or groups in captures. |
| request.object | Payload presence readout | Incoming object withheld; absent in DELETE fixture. |
| request.oldObject | Payload presence readout | Prior object for UPDATE/DELETE; absent in CREATE fixture. |
| request.options | Withheld operation-specific options | RawExtension retained by transport owner, never reconstructed here. |
| response.uid | Local analysis input plus inline mismatch error | Must copy request UID. Input does not modify a real response. |
| response.allowed | Allowed/Denied fixture selector | Exact boolean in safe projection. |
| response.status | Status summary | Result status/reason/code; free text and details withheld. Ignored when allowed. |
| response.patch, response.patchType | Patch boundary and JSONPatch readout | Bytes/Base64 never shown, decoded or applied. |
| response.auditAnnotations | Withheld map | Both keys and values withheld. Webhook prefixes audit keys upstream. |
| response.warnings[] | Local fixture add/remove rows, content withheld | Atomic warning list. Recommended short warnings; upstream recommends 120 characters, may truncate over 256. |

All fields outside the summary stay with the transport owner. Safe Source is deliberately a read-only redacted projection, not raw source, an import format, or a mutation payload. No parsing, AST mutation, or lossless Form/YAML claim exists. Exact comments/numbers/types/unknown branches are not round-tripped because the inspector does not own or edit source. Local analysis choices persist only in memory across sections. No draft or mode is stored.

## Composition and review

Reuse Dialog/frame, section navigation, Select, Input, FormField/error, Button, Badge, Tooltip/Popover, and existing code surface for read-only projections. Kubernetes ownership and redaction stay in adapter. No generic control proposal needed. Frame is 1000x700, controls 32px, body 13px, content 20x24px. Native semantic inputs and buttons retain keyboard focus rings. Help opens on hover/focus/click; Escape closes it before any other action. This inspector is a standalone frame, not a production modal with an opener, so close/reopen and modal focus trap are not claimed.

Used available web-design-guidelines skill, fetched its current Vercel guideline source. No named mock skill was installed; followed approved249 interactive workflow. Source review improved UID escaping and aria-describedby. This is a bounded visual review, not WCAG certification. URL deep-link state and persisted mode preference do not exist in this isolated inspector; no authoring mode is exposed.

## Browser evidence

Real dedicated Chrome with issue-owned profile drove native clicks, typing, selection, keyboard Escape, warning add/remove, section changes and versions. Main captures: viewport1440x900, scale1.25, PNG1800x1125. Narrow capture:680x700, scale1.25. Every captured image visually inspected. checks.json records booleans only plus filenames. Initial shared-browser capture timed out; released owned tab and switched to dedicated Chrome. No shared Chrome terminated.

01 request UPDATE; 02 on-demand help; 03 mismatch validation/focus; 04 Denied status and warning row; 05 sensitive payload boundary; 06 noneditable safe projection; 07 nonmutating review; 08 retained beta version; 09 unsupported fallback; 10 loading/empty/denied/unavailable/missing capture-provider states; 11 CREATE unnamed; 12 DELETE presence rules; 13 CONNECT Pod subresource; 14 narrow footer fit.

## Honest limits and review decisions

Synthetic fixtures only. No live provider, real cluster, webhook installation check, authorization check, schema negotiation, full RawExtension viewer, request import, actual source storage or patch validation. Available/Denied describe mock capture access, not Kubernetes RBAC results. No raw reveal path exists, even for synthetic values. No source copying/export exists. Sensitive content was never introduced. Production must obtain explicit capture-provider contracts and apply default-deny redaction before any free text reaches UI. No final mutation success is claimed. User review must decide capture entry point and retention policy before implementation. Issue remains open; component checklist is not marked approved.
