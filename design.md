# Filesystem explorer: design scope for review

Status: interactive design proposal, not approved production API. Tracking: https://github.com/omniviewdev/omniview/issues/240.

## Decision

Build two reusable surfaces: `FileTree` and compound `FileExplorer`. Reuse existing base-ui `TreeList` interaction machinery and `ResizableSplitPane`; do not introduce a second generic tree engine. A simple file tree must not require content loading, watchers, Monaco, diff calculation, container clients, or image-layer parsing.

The interactive HTML demonstrates component behavior with explicit local fixtures. The eventual React implementation must not copy its full-DOM rerender strategy, path-based fixture identity, or hardcoded content. Prototype is a design artifact, not production scaffolding.

## Component boundaries

| Surface | Owns | Does not own |
| --- | --- | --- |
| `FileTree<TMeta>` | File icons, tree rows, expansion, selection, focus, branch state, optional metadata decorations | Network access, content, layer computation, credentials |
| `FileExplorer.Root<TMeta>` | Shared controlled state and source context | Background subscriptions without explicit host attachment |
| `.Toolbar`, `.Breadcrumbs`, `.Status` | Ready-made location, scope, search/filter, freshness, and actions | Provider path normalization, authorization |
| `.Tree` | Reuses `FileTree` | Separate row or selection engine |
| `.Preview` | Optional consumer-rendered content and metadata; bounded loading states | Required editor dependency |
| `.Layout` | Ready-made resizable tree/preview layout; nested split only when needed | Mandatory pane allocations in tree-only use |
| `.ContextPanel` | Optional layer list, comparison scope, or application-specific metadata | Container registry integration |

A directory contents table can reuse `DataTable` when consumers need sortable size, owner, date, or permissions columns. It is not required to mount beside every tree. Avoid creating a treegrid without its full accessibility contract.

## Proposed data and provider contract

Illustrative types describe responsibilities, not final exported signatures. Review mocks before committing API names.

```ts
type SourceRef = {
  id: string;
  revision: string;
  rootId: string;
  pathStyle: 'posix' | 'windows' | 'opaque';
};

type FileNode<TMeta> = {
  id: string; // Stable directory-entry identity, scoped to source.
  parentId: string | null;
  name: string;
  path: string;
  kind: 'directory' | 'file' | 'symlink' | 'device' | 'socket' | 'fifo' | 'unknown';
  hidden?: boolean;
  size?: number;
  modifiedAt?: number;
  mode?: number;
  owner?: { uid?: number; gid?: number; user?: string; group?: string };
  linkTarget?: string;
  metadata: TMeta;
};

type ChildPage<TMeta> = {
  entries: readonly FileNode<TMeta>[];
  revision: string;
  complete: boolean;
  nextCursor?: string;
};

type FileProvider<TMeta> = {
  listChildren(request: {
    source: SourceRef;
    parentId: string;
    cursor?: string;
    signal: AbortSignal;
  }): Promise<ChildPage<TMeta>>;
  // Optional capabilities: search, bounded read, reveal, watch, actions.
};
```

Optional capabilities need discriminated availability with explanations: `supported`, `unavailable(reason)`, or `unknown`. Node-specific permissions can narrow source-level capabilities. Missing metadata is unknown, never zero, empty, or false by default.

- **Child state:** unloaded, loading, partial, loaded-empty, loaded, failed. Preserve continuation and per-branch errors.
- **Controlled state:** expanded IDs, selected IDs, active ID, location, query, sort, hidden visibility, custom filter model, selected snapshot, preview visibility. Provide default state only where existing TreeList conventions already allow it.
- **Metadata filters:** typed `TMeta`; host-controlled filter model and indexed predicate/projection. Apply metadata predicates independently of text query, including an empty query. Never use a fake search string to trigger filtering. Ancestors survive when descendants match. The layer list demonstrates an external control changing metadata scope without adding layer controls to the tree.
- **Search:** loaded-only filtering is synchronous projection over cached data. Optional provider search returns revision, coverage, completeness, exclusions, continuation, and ancestor references. Do not recursively fetch a source to implement typing.
- **Content:** optional bounded byte/range requests, cancellation, revision, MIME/encoding, truncation. Cancel stale reads on selection/source changes. Escape text and do not automatically fetch remote resources. Special files never use ordinary file reads.
- **Icons:** host-supplied resolver from file kind, extension, and metadata. Cached fallback file/folder/link icons; no content inspection per row. Existing `FileTable` uses `LuFolder` and `LuFile`; no general file-icon resolver was found. Extension and custom mappings remain explicit resolver policy.
- **Watch:** adapter supplies batched upsert/remove/move/invalidate events with source revision, cursor/sequence, coverage, and gap notification. Disposer and cancellation remain explicit. UI preserves stable IDs, expansion, and scroll anchor. Pause view does not claim transport paused. Bound queues; overflow enters stale/resync state.
- **Compare:** provider computes aligned structural changes. Each side has source/revision and presence `present | absent | unknown`. Change includes evidence (`content`, `metadata`, `both`, `unknown`). Equal size/time is not proof of content equality. Confirmed rename can preserve identity; otherwise represent add/remove.
- **Actions:** host callbacks plus capability state, never embedded transport. Export archive availability does not gate browsing. Container tar requirements belong to provider diagnostics. Credentials and authorization stay outside tree metadata.

## Layer semantics

Three separate contexts: applied filesystem at layer N; changes introduced by N; net comparison A → B. The layer mock defaults to changes, with a cumulative-filesystem toggle. Cumulative mode must not show deletion tombstones as existing files. Deleted rows expose prior metadata/content only. Provider applies OCI whiteouts and opaque-directory semantics before supplying the tree; base-ui never reconstructs images.

Running-container comparison must identify resolved image digest/platform, pod UID/container generation, comparison direction, mount exclusions, and whether reads were non-atomic. Mounted files and unknown/unreadable results need distinct statuses, not false additions/deletions. Mock uses a named, small fixture and is not a real registry or Kubernetes connection.

## Performance invariants and verification plan

These are requirements, not measured results:

1. Virtualize large visible projections; fixed-height rows by default. Work scales with visible expanded branches, not total recursive filesystem size.
2. No recursive listing, hashing, thumbnails, or previews on ordinary tree mount. No watch subscription unless supplied.
3. Batch patches and update affected parent indexes. Keep selection updates from rebuilding all node metadata.
4. Cache by source + revision + node ID. Avoid sorting full tree on every event. Defer expensive custom metadata indexing to host or explicit filter model updates.
5. Closed preview unmounts pane and cancels reads. Editors remain optional consumer imports.
6. Preserve keyboard active row under virtualization; provide `aria-level`, `aria-posinset`, `aria-setsize`, and unknown totals honestly.
7. Before implementation acceptance, measure 100k cached nodes with 50k visible, deep chains, wide sibling sets, and burst updates. Record mounted rows, frame latency, filtering latency, allocations, and retained heap. Establish budgets on the chosen reference device before claiming optimization.

Existing `TreeList` has declared virtualization parameters that are not fully wired through: viewport estimate is hardcoded to 36 and overscan is omitted. Its viewport subscribes broadly. Repair those seams within existing primitives if needed; do not advertise current behavior as already optimized for this feature.

## Visual and interaction acceptance

- [ ] Standalone tree and composed explorer share row semantics and controlled state.
- [ ] Select, multi-select, expand/collapse, type-ahead, Home/End, arrows, Enter, Escape, and focus restoration work without opening content unnecessarily.
- [ ] Tree/preview resizes and preview closes without residual separator or read work.
- [ ] Loaded filtering preserves ancestors, distinguishes no matches from empty, and labels partial coverage.
- [ ] External metadata scope works without text query; hidden filtering remains independent.
- [ ] Layers distinguish changes from cumulative membership; deleted preview reads baseline only.
- [ ] Compare identifies both endpoints; added/deleted/unknown/binary sides do not fabricate empty text.
- [ ] Watch add/modify/delete/confirmed rename keeps stable state; paused view and sequence gap show honest freshness.
- [ ] Permission, loading, empty, disconnected, binary, oversized, and missing capability states are distinct.
- [ ] Archive unavailable does not block tree navigation; real transfer progress/cancel/errors use supplied action contract.
- [ ] Narrow layouts remain usable; light/dark/high-contrast and reduced-height layouts receive production review.
- [ ] Provider adapters never leak registry credentials, kubeconfig, or secret content into metadata or screenshots.

## Grounding and limits

Owned workspace: `f889cfc6-a139-4d77-aac3-8733bd1849b5`, generation `60d27bb7-edd8-4f77-bb93-497b4abe08c4`. CLI authenticated instance inspection and browser immutable identity agreed. Actual app captured at its browser endpoint; no real plugin or cluster was connected. Header 38px and footer 24px follow source. Sampled header/footer `#141517` and tab/content `#0e0f11`; foreground, border, accent values read from running base-ui tokens. Real Lucide/react-icons SVGs extracted with skill script. Mock shell is simplified presentation context, not a proposal to replace host navigation.

The prototype covers design flows with representative data, not every filesystem kind, OCI archive, or transport failure. Layer 0–2 historical file contents, permission/empty/loading panels, exports, downloads, retries, and watch events are explicitly illustrative. No production performance, screen-reader, native WebView, mobile Safari, backend transport, or archive interoperability claim follows from screenshots. Mobile Chromium input and viewport checks verify phone layout only; actual phone/WLAN access still depends on network client isolation and host firewall.

Research sources and exact reuse paths: [research.md](research.md), [inventory.md](inventory.md).
