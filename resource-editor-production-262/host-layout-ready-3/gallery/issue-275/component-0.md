# Review a bearer token

Actual production components with local fixture transport. No live resource reads or mutations. Creating/Submitting is held at the fixture boundary; denied, unavailable and immutable states are not presented as successful mutations.

Targets: `authentication.k8s.io/v1/tokenreviews` (TokenReview, Cluster)
Ownership: declarative

## action

![initial — Review a bearer token, action](../../issue-275-component-0-action/initial.png)

![masked-fixture-request-result — Review a bearer token, action](../../issue-275-component-0-action/masked-fixture-request-result.png)

<details><summary>Sections, help, source, keyboard, narrow layout and boundary evidence</summary>

![section-token-review — Review a bearer token, action](../../issue-275-component-0-action/section-token-review.png)

![help-1 — Review a bearer token, action](../../issue-275-component-0-action/help-1.png)

![help-2 — Review a bearer token, action](../../issue-275-component-0-action/help-2.png)

![keyboard-focus — Review a bearer token, action](../../issue-275-component-0-action/keyboard-focus.png)

![safe-source — Review a bearer token, action](../../issue-275-component-0-action/safe-source.png)

![source-form-roundtrip — Review a bearer token, action](../../issue-275-component-0-action/source-form-roundtrip.png)

![narrow-fit — Review a bearer token, action](../../issue-275-component-0-action/narrow-fit.png)

![ready-for-fixture-request — Review a bearer token, action](../../issue-275-component-0-action/ready-for-fixture-request.png)

![boundary-tokenreview-denied — Review a bearer token, action](../../issue-275-component-0-action/boundary-tokenreview-denied.png)

![boundary-tokenreview-unsupported-shape — Review a bearer token, action](../../issue-275-component-0-action/boundary-tokenreview-unsupported-shape.png)

</details>

