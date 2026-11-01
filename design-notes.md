# Group snapshot editors — issue 326

Design proposal only. Interactive standalone HTML composition, not shipped React. All references are synthetic; no cluster requests or storage actions occur. Awaiting review, not approval.

## Source and ownership

Pinned baseline: CSI external-snapshotter v8.2.0, `groupsnapshot.storage.k8s.io/v1beta1`.

Primary CRDs:
- https://github.com/kubernetes-csi/external-snapshotter/blob/v8.2.0/client/config/crd/groupsnapshot.storage.k8s.io_volumegroupsnapshotclasses.yaml
- https://github.com/kubernetes-csi/external-snapshotter/blob/v8.2.0/client/config/crd/groupsnapshot.storage.k8s.io_volumegroupsnapshots.yaml
- https://github.com/kubernetes-csi/external-snapshotter/blob/v8.2.0/client/config/crd/groupsnapshot.storage.k8s.io_volumegroupsnapshotcontents.yaml

Requires group snapshot controller, enabled group snapshot feature, compatible CSI driver, installed served version and actual verbs. Schema discovery does not establish any of these. This is a separate API group from ordinary VolumeSnapshot.

Proposed provider: optional CSI snapshot add-on registering exact GVKs through extension-provider contract, not hardcoded OSS forms in Kubernetes plugin. Host owns destination, capability checks, revision lifetime, shared source and native mutation route. Adapter owns selector rules, import semantics and controller ownership. Unknown versions remain source-only.

## Field / control / manifest mapping

| Component | Control | Owned path / boundary |
| --- | --- | --- |
| All kinds | Name input | metadata.name; locked on edit |
| VolumeGroupSnapshot | Namespace input | metadata.namespace; namespaced; locked on edit |
| VolumeGroupSnapshot | Class picker with explicit omission | spec.volumeGroupSnapshotClassName; omission requests default; empty string is not encoded |
| VolumeGroupSnapshot | Source choice | Exactly one spec.source.selector or spec.source.volumeGroupSnapshotContentName |
| VolumeGroupSnapshot | Label key/value | spec.source.selector.matchLabels[key]; immutable once created |
| VolumeGroupSnapshot | Existing-content picker | spec.source.volumeGroupSnapshotContentName; immutable once created |
| VolumeGroupSnapshot | Advanced source-only expressions | spec.source.selector.matchExpressions[].key/operator/values; In/NotIn require values; Exists/DoesNotExist omit values; no pretend structured support |
| VolumeGroupSnapshotClass | CSI driver picker | driver, root field, not spec.driver |
| VolumeGroupSnapshotClass | Retain/Delete choice | deletionPolicy, root field; no inferred default |
| VolumeGroupSnapshotClass | Add/remove masked parameter rows | parameters[key], string values; driver-specific semantics not guessed |
| Pre-provisioned VolumeGroupSnapshotContent | Driver picker | spec.driver; must match CSI driver name |
| Pre-provisioned VolumeGroupSnapshotContent | Deletion policy | spec.deletionPolicy; required for import |
| Pre-provisioned VolumeGroupSnapshotContent | Group handle | spec.source.groupSnapshotHandles.volumeGroupSnapshotHandle; immutable |
| Pre-provisioned VolumeGroupSnapshotContent | Member-handle rows | spec.source.groupSnapshotHandles.volumeSnapshotHandles[]; immutable; no physical creation |
| Pre-provisioned VolumeGroupSnapshotContent | Binding name/namespace | spec.volumeGroupSnapshotRef.name / namespace; immutable ownership boundary |
| Pre-provisioned VolumeGroupSnapshotContent | Expert source-only reference fields | spec.volumeGroupSnapshotRef.apiVersion/kind/uid/resourceVersion/fieldPath; preserve, never invent |
| Pre-provisioned VolumeGroupSnapshotContent | Optional expert class | spec.volumeGroupSnapshotClassName; may be omitted for import; source-only |
| Generated VolumeGroupSnapshotContent | Inspect only source/binding | spec.source.volumeHandles[], spec.driver, spec.volumeGroupSnapshotRef, spec.volumeGroupSnapshotClassName; not ordinary Create |
| Generated VolumeGroupSnapshotContent | Explicit policy review | spec.deletionPolicy only; actual edit authorization required; controller policy must not be silently replaced |
| Snapshot/content | Read-only readiness/binding | status.readyToUse (omitted means unknown), status.creationTime, status.error.{message,time}; no status authoring |
| Content | Member inspect links | status.volumeSnapshotHandlePairList[].volumeHandle/snapshotHandle and status.volumeGroupSnapshotHandle; links to existing inspector, not new dashboard |

Class CRD does not declare CEL immutability for driver/parameters/deletionPolicy. Do not fabricate schema locks; actual server/controller validation remains authoritative. Snapshot source immutable. Content source and binding are treated as immutable by source documentation; reference CRD validation explicitly requires both name and namespace. Dynamic class required by documented provisioning semantics. Import uses groupSnapshotHandles, never simultaneous volumeHandles. Metadata labels/annotations and unowned source fields belong to existing advanced/source surface, not a new editor implementation.

## Interaction and safety

1000×700 compact frame, 32px fields, 13px body, 180px navigation, internal scroll and fixed footer. Ordinary engineer path chooses source, namespace and class; administrator path exposes driver policy, parameters and explicit physical-handle import. Retain/Delete consequences remain visible and repeat in non-mutating review. Import creates only a proposed content representation; no implicit group or storage snapshots. Consumers must verify bidirectional references before use. Fixture membership is a candidate preview, not selection execution or proof of group consistency.

Mode changes retain bounded form data. Manual source edits are preserved verbatim, including comments, an exact large integer and invalid syntax; Form/review lock rather than parse/rewrite. Restore is explicit and destructive. This mock does not implement YAML AST patching, arbitrary safe roundtrips, source persistence across resource switches, or a production encoder. The production implementation must reuse existing lossless draft engine. No draft or credential persistence. Explicit view preference is not persisted in this standalone mock. Parameters remain masked in Form; no credential or raw sensitive captures were made. Do not put real credentials into prototype; source/review are bounded fixture previews, not a production secret-redaction engine.

Availability fixtures distinguish missing API, permission denied, unknown controller/driver support, and successful empty lookup. Each blocks review without deleting form values. No successful create/save toast, fake health, member readiness or binding verification.

## Reuse and review

Faithful isolated HTML composition follows approved #249 workflow; no named mock skill was available. Production should compose existing base-ui Dialog, SegmentedControl, FormField, Input, Select, Tooltip/Popover, Collapsible and editable rows, plus existing Monaco and AST draft engine. No new generic primitive requested. Resource-specific label queries and physical-handle validation stay in provider adapter.

Used web-design-guidelines skill instructions. Its prescribed upstream command.md URL returned 404; automated guideline-source review unavailable. Manual review checked labels, focus outline, responsive scroll, footer visibility and meaningful safety messages. All 23 captured states inspected on contact sheet. Browser runs used isolated Chrome profile, 1440×900 at 1.25; narrow 650×740 at 1.25. No repository build/test/lint ran.

## Evidence and limits

checks.json contains named booleans and screenshot filenames only. Captures cover empty/populated snapshot, validation, help, advanced source, exact unsupported draft, edit locks, bind-existing source, class parameter/policy/edit/review, import invalid/populated/member rows/edit/review, generated content/member inspection/policy review, four capability states and narrow viewport.

Known mock limits: modal does not implement production focus trapping, close/opener lifecycle or remembered mode. Selectors expose one guided matchLabel, with expressions honestly source-only. Import edit conservatively locks driver alongside immutable handles. Local name/required checks are illustrative, not complete server validation. No live controller, discovery, RBAC, admission, driver consistency, readiness, storage deletion or successful mutation was verified.

Final safety correction: generated inspection uses Inspect wording and policy review displays only the deletionPolicy patch. Parameter-containing source/review uses a read-only redacted projection, never written into source. Capture 21 proves this projection. Availability screens retain older generic frame wording, but disable review and clearly show missing/denied/unknown/empty boundaries. All 24 screenshots were visually reviewed.
