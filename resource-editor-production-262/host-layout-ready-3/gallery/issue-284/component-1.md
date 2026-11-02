# API concurrency policy

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `flowcontrol.apiserver.k8s.io/v1/prioritylevelconfigurations` (PriorityLevelConfiguration, Cluster)
Ownership: declarative

## create

![initial — API concurrency policy, create](../../issue-284-component-1-create/initial.png)

![held-local-submission — API concurrency policy, create](../../issue-284-component-1-create/held-local-submission.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-capacity-and-overload — API concurrency policy, create](../../issue-284-component-1-create/section-capacity-and-overload.png)

![section-capacity-and-overload-advanced — API concurrency policy, create](../../issue-284-component-1-create/section-capacity-and-overload-advanced.png)

![section-status — API concurrency policy, create](../../issue-284-component-1-create/section-status.png)

![keyboard-focus — API concurrency policy, create](../../issue-284-component-1-create/keyboard-focus.png)

![safe-source — API concurrency policy, create](../../issue-284-component-1-create/safe-source.png)

![source-form-roundtrip — API concurrency policy, create](../../issue-284-component-1-create/source-form-roundtrip.png)

![narrow-fit — API concurrency policy, create](../../issue-284-component-1-create/narrow-fit.png)

</details>

## edit

![initial — API concurrency policy, edit](../../issue-284-component-1-edit/initial.png)

![held-local-submission — API concurrency policy, edit](../../issue-284-component-1-edit/held-local-submission.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-capacity-and-overload — API concurrency policy, edit](../../issue-284-component-1-edit/section-capacity-and-overload.png)

![section-capacity-and-overload-advanced — API concurrency policy, edit](../../issue-284-component-1-edit/section-capacity-and-overload-advanced.png)

![section-status — API concurrency policy, edit](../../issue-284-component-1-edit/section-status.png)

![help-1 — API concurrency policy, edit](../../issue-284-component-1-edit/help-1.png)

![help-2 — API concurrency policy, edit](../../issue-284-component-1-edit/help-2.png)

![help-3 — API concurrency policy, edit](../../issue-284-component-1-edit/help-3.png)

![keyboard-focus — API concurrency policy, edit](../../issue-284-component-1-edit/keyboard-focus.png)

![safe-source — API concurrency policy, edit](../../issue-284-component-1-edit/safe-source.png)

![source-form-roundtrip — API concurrency policy, edit](../../issue-284-component-1-edit/source-form-roundtrip.png)

![narrow-fit — API concurrency policy, edit](../../issue-284-component-1-edit/narrow-fit.png)

![typed-local-edit — API concurrency policy, edit](../../issue-284-component-1-edit/typed-local-edit.png)

</details>

## inspect

![initial — API concurrency policy, inspect](../../issue-284-component-1-inspect/initial.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-capacity-and-overload — API concurrency policy, inspect](../../issue-284-component-1-inspect/section-capacity-and-overload.png)

![section-capacity-and-overload-advanced — API concurrency policy, inspect](../../issue-284-component-1-inspect/section-capacity-and-overload-advanced.png)

![section-status — API concurrency policy, inspect](../../issue-284-component-1-inspect/section-status.png)

![help-1 — API concurrency policy, inspect](../../issue-284-component-1-inspect/help-1.png)

![help-2 — API concurrency policy, inspect](../../issue-284-component-1-inspect/help-2.png)

![help-3 — API concurrency policy, inspect](../../issue-284-component-1-inspect/help-3.png)

![keyboard-focus — API concurrency policy, inspect](../../issue-284-component-1-inspect/keyboard-focus.png)

![safe-source — API concurrency policy, inspect](../../issue-284-component-1-inspect/safe-source.png)

![source-form-roundtrip — API concurrency policy, inspect](../../issue-284-component-1-inspect/source-form-roundtrip.png)

![narrow-fit — API concurrency policy, inspect](../../issue-284-component-1-inspect/narrow-fit.png)

</details>

