# CSI driver

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `storage.k8s.io/v1/csidrivers` (CSIDriver, Cluster)
Ownership: conditional

## create

![initial — CSI driver, create](../../issue-272-component-2-create/initial.png)

![held-local-submission — CSI driver, create](../../issue-272-component-2-create/held-local-submission.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-capabilities — CSI driver, create](../../issue-272-component-2-create/section-capabilities.png)

![section-token-delivery — CSI driver, create](../../issue-272-component-2-create/section-token-delivery.png)

![section-availability — CSI driver, create](../../issue-272-component-2-create/section-availability.png)

![keyboard-focus — CSI driver, create](../../issue-272-component-2-create/keyboard-focus.png)

![safe-source — CSI driver, create](../../issue-272-component-2-create/safe-source.png)

![source-form-roundtrip — CSI driver, create](../../issue-272-component-2-create/source-form-roundtrip.png)

![narrow-fit — CSI driver, create](../../issue-272-component-2-create/narrow-fit.png)

![boundary-unknown-ownership — CSI driver, create](../../issue-272-component-2-create/boundary-unknown-ownership.png)

![boundary-update-denied — CSI driver, create](../../issue-272-component-2-create/boundary-update-denied.png)

![boundary-schema-unavailable — CSI driver, create](../../issue-272-component-2-create/boundary-schema-unavailable.png)

![boundary-feature-unknown — CSI driver, create](../../issue-272-component-2-create/boundary-feature-unknown.png)

</details>

## edit

![initial — CSI driver, edit](../../issue-272-component-2-edit/initial.png)

![held-local-submission — CSI driver, edit](../../issue-272-component-2-edit/held-local-submission.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-capabilities — CSI driver, edit](../../issue-272-component-2-edit/section-capabilities.png)

![section-token-delivery — CSI driver, edit](../../issue-272-component-2-edit/section-token-delivery.png)

![section-availability — CSI driver, edit](../../issue-272-component-2-edit/section-availability.png)

![keyboard-focus — CSI driver, edit](../../issue-272-component-2-edit/keyboard-focus.png)

![safe-source — CSI driver, edit](../../issue-272-component-2-edit/safe-source.png)

![source-form-roundtrip — CSI driver, edit](../../issue-272-component-2-edit/source-form-roundtrip.png)

![narrow-fit — CSI driver, edit](../../issue-272-component-2-edit/narrow-fit.png)

![typed-local-edit — CSI driver, edit](../../issue-272-component-2-edit/typed-local-edit.png)

![boundary-unknown-ownership — CSI driver, edit](../../issue-272-component-2-edit/boundary-unknown-ownership.png)

![boundary-update-denied — CSI driver, edit](../../issue-272-component-2-edit/boundary-update-denied.png)

![boundary-schema-unavailable — CSI driver, edit](../../issue-272-component-2-edit/boundary-schema-unavailable.png)

![boundary-feature-unknown — CSI driver, edit](../../issue-272-component-2-edit/boundary-feature-unknown.png)

</details>

## inspect

![initial — CSI driver, inspect](../../issue-272-component-2-inspect/initial.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-capabilities — CSI driver, inspect](../../issue-272-component-2-inspect/section-capabilities.png)

![section-token-delivery — CSI driver, inspect](../../issue-272-component-2-inspect/section-token-delivery.png)

![section-availability — CSI driver, inspect](../../issue-272-component-2-inspect/section-availability.png)

![keyboard-focus — CSI driver, inspect](../../issue-272-component-2-inspect/keyboard-focus.png)

![safe-source — CSI driver, inspect](../../issue-272-component-2-inspect/safe-source.png)

![source-form-roundtrip — CSI driver, inspect](../../issue-272-component-2-inspect/source-form-roundtrip.png)

![narrow-fit — CSI driver, inspect](../../issue-272-component-2-inspect/narrow-fit.png)

![boundary-unknown-ownership — CSI driver, inspect](../../issue-272-component-2-inspect/boundary-unknown-ownership.png)

![boundary-update-denied — CSI driver, inspect](../../issue-272-component-2-inspect/boundary-update-denied.png)

![boundary-schema-unavailable — CSI driver, inspect](../../issue-272-component-2-inspect/boundary-schema-unavailable.png)

![boundary-feature-unknown — CSI driver, inspect](../../issue-272-component-2-inspect/boundary-feature-unknown.png)

</details>

