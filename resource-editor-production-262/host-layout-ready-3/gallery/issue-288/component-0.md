# AdmissionReview protocol inspector

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `admission.k8s.io/v1/` (AdmissionReview, Cluster) · `admission.k8s.io/v1beta1/` (AdmissionReview, Cluster)
Ownership: unknown

## inspect

![initial — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/initial.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-request — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/section-request.png)

![section-response — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/section-response.png)

![section-payload-boundaries — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/section-payload-boundaries.png)

![section-exchange-check — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/section-exchange-check.png)

![help-1 — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/help-1.png)

![keyboard-focus — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/keyboard-focus.png)

![safe-source — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/safe-source.png)

![source-form-roundtrip — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/source-form-roundtrip.png)

![narrow-fit — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/narrow-fit.png)

![boundary-denied — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/boundary-denied.png)

![boundary-absentcapture — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/boundary-absentcapture.png)

![boundary-unknownsibling — AdmissionReview protocol inspector, inspect](../../issue-288-component-0-inspect/boundary-unknownsibling.png)

</details>

