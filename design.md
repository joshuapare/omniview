# Batch editor design — issue 267

Design proposal, not shipped React or approved mocks. Standalone HTML composition follows #249, PR72 and PR74. Both resources are namespaced `batch/v1`, Kubernetes v1.35.0 / modules v0.35.0. No live connections, requests, installs or production edits.

## Resource-specific workflow

Job: name → executable Pod template → completions/parallelism, retries, deadline, cleanup → non-mutating review. Standalone existing Job locks identity, image, restart policy, arguments and completion mode. Completions are conservatively locked: elastic Indexed Job updates may be legal when parallelism/completions change together; production can qualify that case rather than misrepresenting every completion update as forbidden. Suspended-never-started Jobs can allow qualified scheduling directives; this mock does not expose them. No delete/recreate shortcut.

CronJob: schedule/timezone, overlap policy, missed-start deadline, successful/failed history retention, future suspension. Template edits apply to future Jobs only. Replace cancels prior active Job. Forbid skips overlap rather than queues. Suspend does not stop existing Jobs; resumption can process missed starts. Zero retention/TTL has deletion consequences; omission remains distinct from zero. No next-run forecast, controller health or guaranteed execution. Scheduling can create duplicate or missed Jobs; applications must be idempotent.

CronJob-owned Job: inspect only, owner navigation opens saved CronJob fixture. Production authorization may allow direct Job changes, but guided owner-first boundary avoids implying template edits rewrite generated Jobs. Status stays read-only/unfetched.

Run now: saved CronJob only. Separate Job creation workflow, not dedicated endpoint. Requires GET CronJob and CREATE Jobs in same namespace; capture source revision and review template snapshot/new name. Manual Jobs are not protected by CronJob scheduling concurrency or suspension. Owner-reference/adoption policy remains explicit integration decision; mock neither invents ownership nor sends a POST.

## Exact field → control → manifest path

`J` means `spec` for Job and `spec.jobTemplate.spec` for CronJob. Path prefixes are resource-specific, not shared schema guesses.

| Field | Control | Owned path / boundary |
|---|---|---|
| Name | DNS label text | `metadata.name`; locked on edit |
| Destination | visible fixture namespace | `metadata.namespace`; fixed preview context, not arbitrary default |
| Schedule | cron string | CronJob `spec.schedule`; five fields/macros locally screened; server remains authoritative |
| Timezone | select, omit/Etc/UTC/New York/London | CronJob `spec.timeZone`; omission uses controller local timezone, production needs full IANA picker/custom retained value |
| Overlap | select | CronJob `spec.concurrencyPolicy`: omitted/Allow/Forbid/Replace |
| Missed-start deadline | optional integer seconds | CronJob `spec.startingDeadlineSeconds` |
| Successful/failed history | optional integer counts | CronJob `spec.successfulJobsHistoryLimit`, `spec.failedJobsHistoryLimit` |
| Suspend | checkbox | Job `spec.suspend`; CronJob `spec.suspend`, never template suspend |
| Image | text | `J.template.spec.containers[0].image` |
| Container identity | synthetic `worker` | `J.template.spec.containers[0].name`; single-container bounded mock |
| Restart policy | required explicit select | `J.template.spec.restartPolicy`, Never/OnFailure only |
| Arguments | repeatable add/remove text rows | `J.template.spec.containers[0].args[i]`, strings with order preserved |
| Concurrent Pods | optional integer | `J.parallelism` |
| Completions | optional integer | `J.completions`; Indexed requires explicit value |
| Retry limit | optional integer | `J.backoffLimit` |
| Active deadline | optional positive seconds | `J.activeDeadlineSeconds` |
| Finished cleanup | optional nonnegative seconds | `J.ttlSecondsAfterFinished`; zero means immediate eligibility |
| Completion tracking | omit/NonIndexed/Indexed | `J.completionMode`; existing Job locked |
| Advanced metadata | source only | object metadata vs `J.template.metadata` vs CronJob `spec.jobTemplate.metadata` stay distinct |
| Manual selectors | source only | `J.manualSelector`, `J.selector`; do not invent selector labels |
| Indexed policy | source only | `J.backoffLimitPerIndex`, `J.maxFailedIndexes`, `J.successPolicy`; per-index backoff requires Indexed + Never, immutable where specified |
| Failure/replacement | source only | `J.podFailurePolicy`, `J.podReplacementPolicy`; failure policy incompatible with OnFailure, requires Failed replacement |
| External controller | source only | `J.managedBy`; immutable; installation/controller support not inferred |
| Additional Pod fields | source only | `J.template.spec` containers, resources, reference names, placement, volumes; never resolves credential values |
| Status | honest unavailable facts | `status.*` read-only; no status patch |

## Source fidelity and scope limits

Generated form→YAML→form paths preserve this bounded form draft and omitted optional numeric fields. Manual source editing preserves the raw string verbatim, then blocks Form and Review. Tested comment, exact integer 9007199254740993 and invalid syntax together. No fake parser, no claim of arbitrary lossless bidirectional support. Production must reuse existing AST leaf patching for unknown fields, comments, scalar types, omission and unedited siblings. Prototype edit fixtures are deliberately bounded, not imported objects. Source does not persist; only explicit mode preference uses mock267-mode localStorage. Fixture scenario selectors intentionally start separate fixture drafts.

Local cron validation is structural, not comprehensive syntax/range validation. Numeric API int32/int64 bounds, indexed coupled limits, full policies, admission, discovery and RBAC remain production integration work. Review is not server validation. No successful mutation UI exists. Run-now review has no submit action. No raw credentials, annotations or reference resolved values are captured. No global reveal/import is offered.

## Reuse and review

Compose existing base-ui Dialog, SegmentedControl, FormField, Input, Select/Combobox, NumberInput, Checkbox, Button, Tooltip/Popover, Collapsible and native compact row composition. Reuse installed manifest source editor/AST path contracts in production. This standalone HTML faithfully sketches visual semantics with illustrative CSS colors; production uses semantic tokens. No generic primitive or new dependency is required. Native Kubernetes provider owns these built-in adapters; no OSS CRD hardcoding or provider API change proposed.

1000×700 frame, 180px navigation, 32px controls, 13px body, 20×24px content padding. Help supports hover/focus/click and Escape; Tab wraps frame. Safety and errors remain visible. Applied web-design-guidelines skill from actual installed SKILL.md and freshly fetched vercel-labs guideline source. Labels, keyboard controls, explicit focus, scroll, dark selects and overflow inspected. No animation. Missing host close/opener lifecycle is an explicit standalone-mock limit, not claimed focus restoration proof.

## Primary sources and reference grounding

- https://github.com/kubernetes/kubernetes/blob/v1.35.0/api/openapi-spec/swagger.json#L54814-L56905 — JobSpec, CronJobSpec and JobTemplateSpec read from pinned snapshot.
- https://github.com/kubernetes/kubernetes/blob/v1.35.0/pkg/apis/batch/validation/validation.go — ValidateJobSpecUpdate immutability and conditional scheduling/completions boundaries.
- https://github.com/omniviewdev/omniview/issues/262
- https://github.com/omniviewdev/omniview/issues/249
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/72
- https://github.com/omniviewdev/omniview-plugin-kubernetes/pull/74
- https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md

## Browser evidence

18 captures; standard 1440×900 CSS pixels @1.25 (PNG1800×1125), narrow760×740 @1.25. Dedicated issue-owned Chrome used after shared browser screenshot timeout; no shared browser killed. Real typing, selecting, add/remove, checkbox, navigation, help and Escape actions. All 16 initial captures visually reviewed together; final two individually reviewed. Narrow footer fits and horizontal overflow absent. checks.json contains named booleans and filenames only. No production build/lint/tests, server validation or live API requests. Screenshots are synthetic fixture designs, not host-plugin captures.

Captions: 01 blank Job; 02 actionable missing fields; 03 executable template and argument row; 04 Indexed execution/cleanup/suspend; 05 generated YAML; 06 non-mutating Job review; 07 immutable Job edit; 08 CronJob-owned inspection; 09 schedule/help/Replace/suspend; 10 future-template review; 11 separate manual Job workflow; 12 unsupported raw-source retention; 13 denied update; 14 unavailable discovery; 15 read-only unfetched status; 16 narrow footer; 17 CronJob creation; 18 expert source boundary.
