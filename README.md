# External metrics providers — interactive design

A settings prototype for reusable Grafana connections, datasource selection, inherited metric mappings, and cluster-specific overrides.

## Explore

Serve this directory with any static HTTP server and open `prototype/index.html`.

| View | URL parameters |
| --- | --- |
| Grafana connections | `?tab=connections` |
| Connect to Grafana | `?tab=connections&connect=1` |
| Datasources | `?tab=datasources` |
| Global mappings | `?tab=mappings` |
| Kubernetes cluster metrics | `?view=cluster&cluster=production-eu` |
| Another datasource, same Grafana connection | `?view=cluster&cluster=staging-eu` |
| Another Grafana connection | `?view=cluster&cluster=production-us` |

Click **Kubernetes** to enter Cluster Settings → Metrics. Select a different cluster, change its provider/datasource, expand a mapping, or reset its override. Global settings remain separate. Changes are in-memory; reload resets fixtures.

## Boundaries

- Design prototype, not a shipped feature or a live Grafana connection.
- Sample data only. Do not enter real credentials.
- Authentication, query execution, datasource discovery, and secure storage are simulated. No token-generation or OAuth requests run.
- Native settings measurements and Kubernetes source layouts ground the UI. This is not a live Kubernetes settings screenshot.
- Metrics only. Future logs share the placement, not metric query semantics or credentials.

The reviewed local prototype passed 53 interaction checks. Screenshots are immutable design evidence, not performance measurements.

Brand and interface icons were extracted from `react-icons` (Simple Icons / Lucide); upstream icon licenses and trademarks apply.
