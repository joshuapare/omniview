# Pod metrics

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `metrics.k8s.io/v1beta1/pods` (PodMetrics, Namespaced)
Ownership: system

## inspect

![initial — Pod metrics, inspect](../../issue-291-component-1-inspect/initial.png)

![masked-fixture-request-result — Pod metrics, inspect](../../issue-291-component-1-inspect/masked-fixture-request-result.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-usage — Pod metrics, inspect](../../issue-291-component-1-inspect/section-usage.png)

![section-access-ownership — Pod metrics, inspect](../../issue-291-component-1-inspect/section-access-ownership.png)

![help-1 — Pod metrics, inspect](../../issue-291-component-1-inspect/help-1.png)

![keyboard-focus — Pod metrics, inspect](../../issue-291-component-1-inspect/keyboard-focus.png)

![safe-source — Pod metrics, inspect](../../issue-291-component-1-inspect/safe-source.png)

![source-form-roundtrip — Pod metrics, inspect](../../issue-291-component-1-inspect/source-form-roundtrip.png)

![narrow-fit — Pod metrics, inspect](../../issue-291-component-1-inspect/narrow-fit.png)

![ready-for-fixture-request — Pod metrics, inspect](../../issue-291-component-1-inspect/ready-for-fixture-request.png)

![boundary-denied — Pod metrics, inspect](../../issue-291-component-1-inspect/boundary-denied.png)

![boundary-absent — Pod metrics, inspect](../../issue-291-component-1-inspect/boundary-absent.png)

![boundary-unavailable — Pod metrics, inspect](../../issue-291-component-1-inspect/boundary-unavailable.png)

</details>

