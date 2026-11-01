# Strimzi editor design — issue 331

Design proposal, not shipped React, approval, or a production mutation tool. Open `index.html` locally; no dependencies or network needed. Fixtures use preview-cluster / preview. HTML composition follows #249; no named mock skill was available. Reviewed against the installed web-design-guidelines skill and fetched Vercel guideline source.

## Sources and scope

Strimzi 0.47.0 resolves to `40b9fa269ba87283bb0651711557922b14d715b3`. Primary schemas: https://github.com/strimzi/strimzi-kafka-operator/tree/40b9fa269ba87283bb0651711557922b14d715b3/install/cluster-operator . `api-snapshot.json` records the public CRDs inspected. All nine kinds are namespaced; these mocks target `kafka.strimzi.io/v1beta2`. KafkaTopic and KafkaUser additionally expose older schema entries; those are not silently converted. Legacy KafkaMirrorMaker and KafkaConnectS2I are excluded.

Exact labels, paths, control types, repeated-row columns and consequences are in `field-mapping.json`. All resources share name → metadata.name, namespace → metadata.namespace; identity locks on edit. Status and generated workloads never become editable. Fields absent from controls remain an advanced source concern, not invented defaults.

## Resource-specific ownership and tasks

| Kind | Authoring and boundary | Distinct task controls |
| --- | --- | --- |
| Kafka | Create/edit a user-owned cluster; KRaft and node-pool enablement explicit. No pools created implicitly. | Version, metadata version, listener name/port/type/TLS rows; annotations for KRaft/node pools |
| KafkaNodePool | User-owned pool linked by strimzi.io/cluster. Edit locks role/storage type/class conservatively; not a declaration that every lock is API immutability. | Replica count, broker/controller roles, storage type, exact quantity string, class, deleteClaim |
| KafkaConnect | User-owned workers; connector CR authoring requires explicit use-connector-resources annotation. | Bootstrap servers, replicas/version, worker config rows, enablement branch |
| KafkaConnector | Requires matching enabled Connect cluster and installed class; no capability inferred from CRD alone. | Class, tasksMax, state running/paused/stopped, config rows; separate restart annotation request review |
| KafkaTopic | Requires Topic Operator. Topic name locks on edit. Partitions cannot decrease; replication changes require supported operator/Cruise Control path. | Partitions, replication factor, topic config rows |
| KafkaUser | Requires User Operator and matching cluster authentication/authorization. Generated credential Secret remains outside editor. | TLS/SCRAM/external TLS choice; simple ACL resource/name/pattern/operations/host rows |
| KafkaBridge | User-owned bridge; HTTP service exposure is not authentication and no Ingress is made. | Bootstrap servers, replicas, HTTP port, CORS origin rows |
| KafkaMirrorMaker2 | User-owned replication runtime; aliases must resolve within explicit cluster connections. | Connect alias, source→target direction, topic/group patterns, cluster alias/bootstrap rows |
| KafkaRebalance authoring | Explicit user-managed branch only. Cruise Control required. Existing identity remains locked in the edit fixture. | full/add-brokers/remove-brokers, broker IDs, byte/s throttle, ordered goals |
| KafkaRebalance inspection/actions | Default entry and controller-owned branch. Never ordinary Create by default. | Proposal unavailable state; owner inspection; request/refresh/approve/stop annotation boundary. Approval blocked without current proposal. |

KafkaRebalance `spec.brokers` and roles/ACL operations represent arrays in the eventual adapter; scalar-looking controls do not establish YAML scalar types. `field-mapping.json` explicitly names array paths. Listener TLS and deleteClaim are booleans. Replica counts, ports, partition counts, tasks and throttle need exact integer codecs. No actual manifest encoder exists here.

## Reuse and provider decision

An optional Strimzi add-on provider should own these GVKs, not a built-in Kubernetes mega-form. Discover actual served version, fields, verbs, namespace, feature enablement and ownership on each invocation. Unknown versions keep host generic/schema/source fallback; deny/missing/unavailable/empty stay distinct. Discovery never proves operator health or authorization.

Compose installed base-ui Dialog, FormField, Input, Select/Combobox, NumberInput, SegmentedControl, Table, Button, Collapsible, Tooltip and Popover. Use the host Monaco/source and manifest AST adapter for real authoring. This isolated mock uses native HTML and a textarea, not those shipped React controls. No generic component proposal is needed; resource rules belong to the Strimzi adapter. The #249 1000×700 frame, 32px controls, 13px text, 20×24 padding and 180px rail are retained. Narrow view collapses fields and internally scrolls without hiding the footer.

## Source, safety and evidence limits

The YAML tab is explicitly a **design projection**, not a submit-ready encoded Kubernetes object. It lists owned paths without claiming AST serialization. Manual source text stays verbatim across Form/YAML; Form blocks after manual edits instead of claiming a lossless parser. This proves exact retention of a comment, unknown field, large integer and invalid input, not production bidirectional preservation. Resource-kind switching starts that kind's source projection; raw-source retention across resource switching is not claimed. Production must use existing lossless manifest draft/AST machinery for exact comments, omission, scalar types, arrays and unedited siblings.

Only explicit mode preference persists. Drafts and credentials do not persist. Credentials are never entered or fetched; authentication controls select method only. Config tables demonstrate non-sensitive strings, not a safe arbitrary sensitive-data importer. No raw credentials, PEM, tokens, Base64 credentials, annotation payloads or generated Secret values appear in captures.

Review means local non-mutating preview. Validation is intentionally bounded: name syntax, positive integer fields, topic partition decrease and MM2 alias matching. This is not full Strimzi schema validation, admission, permission verification, controller health, installed-class verification, reconciliation or execution. Required operator fields need schema-aware validation in production. Reference text inputs model unresolved references; production should compose same-namespace Combobox pickers with distinct loading/empty/denied/unavailable states. Sensitive source import and arbitrary config editing require redaction-safe access paths before implementation.

All nine distinct kinds plus the second KafkaRebalance ownership component have browser captures. Thirty-six screenshots include initial, populated, per-kind configuration/review, edit identity locks, local errors, raw source retention, action boundaries, four availability states and narrow fit. Browser used isolated profile and real clicks, typing, native selects, add/remove and keyboard Help/Escape. All screenshots were visually reviewed in contact groups. `checks.json` contains booleans and filenames only; these checks describe this prototype, not production behavior. Capture output is 1440×900 @1.25 except the explicitly named 680×800 narrow capture. No live cluster/cloud action, repository test/build/lint or dependency installation ran.

## Review decisions

Confirm conservative pool edit locks versus installed operator-supported transitions. Confirm supported topic replication workflow and Cruise Control discovery. Select production reference resolution for bootstrap endpoints and external aliases without fetching secrets. Rebalance request creation deserves a distinct user-managed intent label rather than reusing the mock's Edit fixture selector. These are design review questions, not hidden capabilities or approval claims.
