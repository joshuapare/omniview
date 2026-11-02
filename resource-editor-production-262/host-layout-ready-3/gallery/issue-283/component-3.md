# Device taint rule

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `resource.k8s.io/v1alpha3/devicetaintrules` (DeviceTaintRule, Cluster)
Ownership: declarative

## create

![initial — Device taint rule, create](../../issue-283-component-3-create/initial.png)

![held-local-submission — Device taint rule, create](../../issue-283-component-3-create/held-local-submission.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-target-taint — Device taint rule, create](../../issue-283-component-3-create/section-target-taint.png)

![section-eviction-status — Device taint rule, create](../../issue-283-component-3-create/section-eviction-status.png)

![keyboard-focus — Device taint rule, create](../../issue-283-component-3-create/keyboard-focus.png)

![safe-source — Device taint rule, create](../../issue-283-component-3-create/safe-source.png)

![source-form-roundtrip — Device taint rule, create](../../issue-283-component-3-create/source-form-roundtrip.png)

![narrow-fit — Device taint rule, create](../../issue-283-component-3-create/narrow-fit.png)

![boundary-taint-gate-unknown — Device taint rule, create](../../issue-283-component-3-create/boundary-taint-gate-unknown.png)

![boundary-taint-denied — Device taint rule, create](../../issue-283-component-3-create/boundary-taint-denied.png)

</details>

## edit

![initial — Device taint rule, edit](../../issue-283-component-3-edit/initial.png)

![held-local-submission — Device taint rule, edit](../../issue-283-component-3-edit/held-local-submission.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-target-taint — Device taint rule, edit](../../issue-283-component-3-edit/section-target-taint.png)

![section-eviction-status — Device taint rule, edit](../../issue-283-component-3-edit/section-eviction-status.png)

![keyboard-focus — Device taint rule, edit](../../issue-283-component-3-edit/keyboard-focus.png)

![safe-source — Device taint rule, edit](../../issue-283-component-3-edit/safe-source.png)

![source-form-roundtrip — Device taint rule, edit](../../issue-283-component-3-edit/source-form-roundtrip.png)

![narrow-fit — Device taint rule, edit](../../issue-283-component-3-edit/narrow-fit.png)

![typed-local-edit — Device taint rule, edit](../../issue-283-component-3-edit/typed-local-edit.png)

![boundary-taint-gate-unknown — Device taint rule, edit](../../issue-283-component-3-edit/boundary-taint-gate-unknown.png)

![boundary-taint-denied — Device taint rule, edit](../../issue-283-component-3-edit/boundary-taint-denied.png)

</details>

## inspect

![initial — Device taint rule, inspect](../../issue-283-component-3-inspect/initial.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-target-taint — Device taint rule, inspect](../../issue-283-component-3-inspect/section-target-taint.png)

![section-eviction-status — Device taint rule, inspect](../../issue-283-component-3-inspect/section-eviction-status.png)

![keyboard-focus — Device taint rule, inspect](../../issue-283-component-3-inspect/keyboard-focus.png)

![safe-source — Device taint rule, inspect](../../issue-283-component-3-inspect/safe-source.png)

![source-form-roundtrip — Device taint rule, inspect](../../issue-283-component-3-inspect/source-form-roundtrip.png)

![narrow-fit — Device taint rule, inspect](../../issue-283-component-3-inspect/narrow-fit.png)

![boundary-taint-gate-unknown — Device taint rule, inspect](../../issue-283-component-3-inspect/boundary-taint-gate-unknown.png)

![boundary-taint-denied — Device taint rule, inspect](../../issue-283-component-3-inspect/boundary-taint-denied.png)

</details>

