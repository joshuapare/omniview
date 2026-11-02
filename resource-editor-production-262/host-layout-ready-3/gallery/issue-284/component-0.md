# API request routing

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `flowcontrol.apiserver.k8s.io/v1/flowschemas` (FlowSchema, Cluster)
Ownership: declarative

## create

![initial — API request routing, create](../../issue-284-component-0-create/initial.png)

![held-local-submission — API request routing, create](../../issue-284-component-0-create/held-local-submission.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-routing — API request routing, create](../../issue-284-component-0-create/section-routing.png)

![section-matching — API request routing, create](../../issue-284-component-0-create/section-matching.png)

![section-status — API request routing, create](../../issue-284-component-0-create/section-status.png)

![keyboard-focus — API request routing, create](../../issue-284-component-0-create/keyboard-focus.png)

![safe-source — API request routing, create](../../issue-284-component-0-create/safe-source.png)

![source-form-roundtrip — API request routing, create](../../issue-284-component-0-create/source-form-roundtrip.png)

![narrow-fit — API request routing, create](../../issue-284-component-0-create/narrow-fit.png)

![boundary-priority-lookup-denied — API request routing, create](../../issue-284-component-0-create/boundary-priority-lookup-denied.png)

![boundary-priority-lookup-unavailable — API request routing, create](../../issue-284-component-0-create/boundary-priority-lookup-unavailable.png)

![boundary-priority-lookup-api-absent — API request routing, create](../../issue-284-component-0-create/boundary-priority-lookup-api-absent.png)

![boundary-policy-update-denied — API request routing, create](../../issue-284-component-0-create/boundary-policy-update-denied.png)

</details>

## edit

![initial — API request routing, edit](../../issue-284-component-0-edit/initial.png)

![held-local-submission — API request routing, edit](../../issue-284-component-0-edit/held-local-submission.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-routing — API request routing, edit](../../issue-284-component-0-edit/section-routing.png)

![section-matching — API request routing, edit](../../issue-284-component-0-edit/section-matching.png)

![section-status — API request routing, edit](../../issue-284-component-0-edit/section-status.png)

![help-1 — API request routing, edit](../../issue-284-component-0-edit/help-1.png)

![help-2 — API request routing, edit](../../issue-284-component-0-edit/help-2.png)

![help-3 — API request routing, edit](../../issue-284-component-0-edit/help-3.png)

![keyboard-focus — API request routing, edit](../../issue-284-component-0-edit/keyboard-focus.png)

![safe-source — API request routing, edit](../../issue-284-component-0-edit/safe-source.png)

![source-form-roundtrip — API request routing, edit](../../issue-284-component-0-edit/source-form-roundtrip.png)

![narrow-fit — API request routing, edit](../../issue-284-component-0-edit/narrow-fit.png)

![typed-local-edit — API request routing, edit](../../issue-284-component-0-edit/typed-local-edit.png)

![boundary-priority-lookup-denied — API request routing, edit](../../issue-284-component-0-edit/boundary-priority-lookup-denied.png)

![boundary-priority-lookup-unavailable — API request routing, edit](../../issue-284-component-0-edit/boundary-priority-lookup-unavailable.png)

![boundary-priority-lookup-api-absent — API request routing, edit](../../issue-284-component-0-edit/boundary-priority-lookup-api-absent.png)

![boundary-policy-update-denied — API request routing, edit](../../issue-284-component-0-edit/boundary-policy-update-denied.png)

</details>

## inspect

![initial — API request routing, inspect](../../issue-284-component-0-inspect/initial.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-routing — API request routing, inspect](../../issue-284-component-0-inspect/section-routing.png)

![section-matching — API request routing, inspect](../../issue-284-component-0-inspect/section-matching.png)

![section-status — API request routing, inspect](../../issue-284-component-0-inspect/section-status.png)

![help-1 — API request routing, inspect](../../issue-284-component-0-inspect/help-1.png)

![help-2 — API request routing, inspect](../../issue-284-component-0-inspect/help-2.png)

![help-3 — API request routing, inspect](../../issue-284-component-0-inspect/help-3.png)

![keyboard-focus — API request routing, inspect](../../issue-284-component-0-inspect/keyboard-focus.png)

![safe-source — API request routing, inspect](../../issue-284-component-0-inspect/safe-source.png)

![source-form-roundtrip — API request routing, inspect](../../issue-284-component-0-inspect/source-form-roundtrip.png)

![narrow-fit — API request routing, inspect](../../issue-284-component-0-inspect/narrow-fit.png)

![boundary-priority-lookup-denied — API request routing, inspect](../../issue-284-component-0-inspect/boundary-priority-lookup-denied.png)

![boundary-priority-lookup-unavailable — API request routing, inspect](../../issue-284-component-0-inspect/boundary-priority-lookup-unavailable.png)

![boundary-priority-lookup-api-absent — API request routing, inspect](../../issue-284-component-0-inspect/boundary-priority-lookup-api-absent.png)

![boundary-policy-update-denied — API request routing, inspect](../../issue-284-component-0-inspect/boundary-policy-update-denied.png)

</details>

