# Lease election participant

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `coordination.k8s.io/v1beta1/leasecandidates` (LeaseCandidate, Namespaced) · `coordination.k8s.io/v1alpha2/leasecandidates` (LeaseCandidate, Namespaced)
Ownership: controller

## inspect

![initial — Lease election participant, inspect](../../issue-281-component-1-inspect/initial.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-participant — Lease election participant, inspect](../../issue-281-component-1-inspect/section-participant.png)

![section-gate-and-ownership — Lease election participant, inspect](../../issue-281-component-1-inspect/section-gate-and-ownership.png)

![help-1 — Lease election participant, inspect](../../issue-281-component-1-inspect/help-1.png)

![keyboard-focus — Lease election participant, inspect](../../issue-281-component-1-inspect/keyboard-focus.png)

![safe-source — Lease election participant, inspect](../../issue-281-component-1-inspect/safe-source.png)

![source-form-roundtrip — Lease election participant, inspect](../../issue-281-component-1-inspect/source-form-roundtrip.png)

![narrow-fit — Lease election participant, inspect](../../issue-281-component-1-inspect/narrow-fit.png)

![boundary-leasecandidate-references-denied — Lease election participant, inspect](../../issue-281-component-1-inspect/boundary-leasecandidate-references-denied.png)

![boundary-leasecandidate-reference-api-absent — Lease election participant, inspect](../../issue-281-component-1-inspect/boundary-leasecandidate-reference-api-absent.png)

![boundary-leasecandidate-references-unavailable — Lease election participant, inspect](../../issue-281-component-1-inspect/boundary-leasecandidate-references-unavailable.png)

</details>

