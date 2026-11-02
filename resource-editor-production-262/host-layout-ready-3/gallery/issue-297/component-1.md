# Challenge lifecycle

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `acme.cert-manager.io/v1/challenges` (Challenge, Namespaced)
Ownership: controller

## inspect

![initial — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/initial.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-lifecycle — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/section-lifecycle.png)

![section-solver — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/section-solver.png)

![help-1 — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/help-1.png)

![keyboard-focus — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/keyboard-focus.png)

![safe-source — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/safe-source.png)

![source-form-roundtrip — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/source-form-roundtrip.png)

![narrow-fit — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/narrow-fit.png)

![boundary-denied — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/boundary-denied.png)

![boundary-unavailable — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/boundary-unavailable.png)

![boundary-absent — Challenge lifecycle, inspect](../../issue-297-component-1-inspect/boundary-absent.png)

</details>

## edit

![initial — Challenge lifecycle, edit](../../issue-297-component-1-edit/initial.png)

![blocked-local-submission — Challenge lifecycle, edit](../../issue-297-component-1-edit/blocked-local-submission.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-lifecycle — Challenge lifecycle, edit](../../issue-297-component-1-edit/section-lifecycle.png)

![section-solver — Challenge lifecycle, edit](../../issue-297-component-1-edit/section-solver.png)

![help-1 — Challenge lifecycle, edit](../../issue-297-component-1-edit/help-1.png)

![keyboard-focus — Challenge lifecycle, edit](../../issue-297-component-1-edit/keyboard-focus.png)

![safe-source — Challenge lifecycle, edit](../../issue-297-component-1-edit/safe-source.png)

![source-form-roundtrip — Challenge lifecycle, edit](../../issue-297-component-1-edit/source-form-roundtrip.png)

![narrow-fit — Challenge lifecycle, edit](../../issue-297-component-1-edit/narrow-fit.png)

![boundary-denied — Challenge lifecycle, edit](../../issue-297-component-1-edit/boundary-denied.png)

![boundary-unavailable — Challenge lifecycle, edit](../../issue-297-component-1-edit/boundary-unavailable.png)

![boundary-absent — Challenge lifecycle, edit](../../issue-297-component-1-edit/boundary-absent.png)

</details>

