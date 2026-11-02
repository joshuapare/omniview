# Request a ServiceAccount token

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `authentication.k8s.io/v1/serviceaccounts/token` (TokenRequest, Namespaced)
Ownership: declarative

## action

![initial — Request a ServiceAccount token, action](../../issue-275-component-2-action/initial.png)

![masked-fixture-request-result — Request a ServiceAccount token, action](../../issue-275-component-2-action/masked-fixture-request-result.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-token-request — Request a ServiceAccount token, action](../../issue-275-component-2-action/section-token-request.png)

![help-1 — Request a ServiceAccount token, action](../../issue-275-component-2-action/help-1.png)

![keyboard-focus — Request a ServiceAccount token, action](../../issue-275-component-2-action/keyboard-focus.png)

![safe-source — Request a ServiceAccount token, action](../../issue-275-component-2-action/safe-source.png)

![source-form-roundtrip — Request a ServiceAccount token, action](../../issue-275-component-2-action/source-form-roundtrip.png)

![narrow-fit — Request a ServiceAccount token, action](../../issue-275-component-2-action/narrow-fit.png)

![ready-for-fixture-request — Request a ServiceAccount token, action](../../issue-275-component-2-action/ready-for-fixture-request.png)

![boundary-tokenrequest-reference-denied — Request a ServiceAccount token, action](../../issue-275-component-2-action/boundary-tokenrequest-reference-denied.png)

</details>

