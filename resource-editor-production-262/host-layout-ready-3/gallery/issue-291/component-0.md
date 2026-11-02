# Node metrics

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `metrics.k8s.io/v1beta1/nodes` (NodeMetrics, Cluster)
Ownership: system

## inspect

![initial — Node metrics, inspect](../../issue-291-component-0-inspect/initial.png)

![masked-fixture-request-result — Node metrics, inspect](../../issue-291-component-0-inspect/masked-fixture-request-result.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-usage — Node metrics, inspect](../../issue-291-component-0-inspect/section-usage.png)

![section-access-ownership — Node metrics, inspect](../../issue-291-component-0-inspect/section-access-ownership.png)

![help-1 — Node metrics, inspect](../../issue-291-component-0-inspect/help-1.png)

![keyboard-focus — Node metrics, inspect](../../issue-291-component-0-inspect/keyboard-focus.png)

![safe-source — Node metrics, inspect](../../issue-291-component-0-inspect/safe-source.png)

![source-form-roundtrip — Node metrics, inspect](../../issue-291-component-0-inspect/source-form-roundtrip.png)

![narrow-fit — Node metrics, inspect](../../issue-291-component-0-inspect/narrow-fit.png)

![ready-for-fixture-request — Node metrics, inspect](../../issue-291-component-0-inspect/ready-for-fixture-request.png)

![boundary-denied — Node metrics, inspect](../../issue-291-component-0-inspect/boundary-denied.png)

![boundary-absent — Node metrics, inspect](../../issue-291-component-0-inspect/boundary-absent.png)

![boundary-unavailable — Node metrics, inspect](../../issue-291-component-0-inspect/boundary-unavailable.png)

</details>

