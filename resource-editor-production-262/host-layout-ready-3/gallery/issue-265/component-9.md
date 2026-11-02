# Event inspection

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `core/v1/events` (Event, Namespaced)
Ownership: controller

## inspect

![initial — Event inspection, inspect](../../issue-265-component-9-inspect/initial.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-configuration — Event inspection, inspect](../../issue-265-component-9-inspect/section-configuration.png)

![help-1 — Event inspection, inspect](../../issue-265-component-9-inspect/help-1.png)

![keyboard-focus — Event inspection, inspect](../../issue-265-component-9-inspect/keyboard-focus.png)

![safe-source — Event inspection, inspect](../../issue-265-component-9-inspect/safe-source.png)

![source-form-roundtrip — Event inspection, inspect](../../issue-265-component-9-inspect/source-form-roundtrip.png)

![narrow-fit — Event inspection, inspect](../../issue-265-component-9-inspect/narrow-fit.png)

![boundary-denied — Event inspection, inspect](../../issue-265-component-9-inspect/boundary-denied.png)

![boundary-unknown-schema — Event inspection, inspect](../../issue-265-component-9-inspect/boundary-unknown-schema.png)

![boundary-controller-owned — Event inspection, inspect](../../issue-265-component-9-inspect/boundary-controller-owned.png)

![boundary-unknown-ownership — Event inspection, inspect](../../issue-265-component-9-inspect/boundary-unknown-ownership.png)

</details>

