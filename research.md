Read-only assignment forbids writing. Complete `research.md` content follows; main agent can save outside repo.

# Filesystem Explorer Research

Design research only. No production implementation, services, builds, tests, or formatters.

**Recommendation:** combine VS Code’s lightweight tree, Finder’s optional preview, and dive’s explicit layer context.

Observations below come from linked primary sources. Recommendations describe proposed component behavior, not verified product behavior.

## Comparison matrix

| Reference | Observed behavior | Adopt | Constraint / pitfall |
|---|---|---|---|
| [GitHub file tree][1] | Changed-file navigation; filename/folder filtering; optional tree visibility. Matching folders include descendants. | Clear change scope; direct file-to-diff navigation; visible filter state. | Changed-files tree is not complete filesystem. Never conflate both. |
| [GitHub ordering update][2] | Folders precede files; navigation expands collapsed target; reduced rerenders improve large reviews. | Stable folders-first ordering; reveal selected result. | Historical preview limits are not evidence of current limits. |
| [VS Code Tree API][3] | `getChildren`, `getTreeItem`, collapsible states, targeted refresh events. | Separate data loading from row presentation. Load children on expansion. | Unloaded is not empty. Async failure needs explicit state. |
| [VS Code list source][4] | Viewport render ranges, row cache, range-based insertion/removal, optional dynamic heights. | Fixed-height rows; window large visible lists; reuse row renderers. | Virtualization reduces DOM cost, not provider loading or search cost. |
| [VS Code item contract][5] | Stable IDs preserve state; URI and theme determine icons; tooltip/command resolve lazily. | Stable identity; cheap metadata icons; defer expensive detail. | Label-derived IDs lose state after rename. Lazy resolution cannot freely change presentation. |
| [dive][6] | Layer list beside cumulative filesystem; current-layer versus aggregated modification highlighting. | Layer selector plus explicit filesystem and change scopes. | Filesystem membership and highlighted change interval are separate concepts. |
| [Docker Desktop Files][7] | Running-container files; added/modified/deleted indicators; editor, download, deletion, drag/drop. | Live change badges; contextual preview and capability-based actions. | Documentation does not specify complete watch delivery or baseline semantics. |
| [Finder][8] | Optional preview contains content, metadata, quick actions; divider resizes or closes pane. | Optional, resizable preview; metadata remains useful without content. | Do not load preview content when pane is absent or closed. |
| [Windows File Explorer][9] | Navigation pane, compact view, multiple display modes, hidden-items toggle, contextual actions. | Compact density; explicit hidden toggle; discoverable action menu. | Hidden is provider metadata, not universally a leading dot. |
| [WAI-ARIA tree][10] | Hierarchical keyboard navigation; distinct focus and selection; explicit virtualized position metadata. | Full tree semantics and keyboard model. | Styling nested rows alone does not make accessible tree. |

## Proposed composition

**Recommendation:**

- `FileTree`: standalone navigation, expansion, selection, icons, status badges, loading and errors.
- `FilesystemExplorer`: composes toolbar, tree, resizable separator, optional preview, and optional contextual panels.
- Layer inspector supplies layer selection and comparison context without coupling those concepts to basic tree.
- Host supplies providers, metadata, capabilities, filters, preview rendering, and action handlers.
- Basic tree must not import editor, diff engine, image-layer decoder, watcher, or filesystem transport.
- Preserve one row implementation across simple, live, layer, and comparison views.

## Layer semantics: three independent questions

**Observation:** dive displays selected layer combined with preceding layers. Highlighting can represent current-layer or aggregated changes.[6]

**Recommendation:** expose these concepts separately:

| Question | UI label | Meaning |
|---|---|---|
| Which filesystem exists? | **Filesystem at layer N** | Result after applying layers 0 through N. |
| What changed here? | **Changes in layer N** | Difference between cumulative N−1 and cumulative N. |
| What changed across interval? | **Compare A → B** | Net difference between two specified filesystem states. |

Do not label cumulative filesystem as “Layer contents.” Raw layer archive and applied filesystem differ.

Net comparison can omit transient files added then deleted between endpoints. Historical activity requires separate history scope.

### Deleted files and whiteouts

**Observation:** OCI layers encode additions, modifications, and removals. Additions and modifications share archive representation.[11]

- `.wh.name` removes `name` from lower layers.
- Whiteout marker disappears from applied filesystem.
- `.wh..wh..opq` hides lower-layer children and descendants.
- Same-layer additions survive whiteouts.
- Opaque-whiteout semantics do not depend on archive entry ordering.[11]

**Recommendation:**

- Applied filesystem shows surviving entries, not raw `.wh.*` markers.
- Changes view represents deletions as tombstone rows at original paths.
- Tombstones show deletion layer, prior metadata, and baseline preview when available.
- Never offer current-side open/edit actions for deleted rows.
- Explain opaque directory removal without eagerly materializing every deleted descendant.
- Show known deletion counts only when provider can establish complete baseline.
- Offer raw archive markers only in explicitly named technical detail.
- Detect add versus modify using parent state, not archive entry alone.
- Distinguish metadata-only, content, and file-kind changes.

## Running pod versus image

**Recommendation:**

- Pin baseline to resolved image digest and platform, not mutable tag.
- Identify cluster, namespace, pod UID, container, and container generation.
- Display comparison direction: **Image → running container**.
- Treat pod container filesystems separately; pod is not one filesystem.
- Label mounts, projected secrets/configuration, and runtime-generated paths.
- Permit excluding mounted content, but expose exclusions in scope summary.
- Do not classify unreadable or unlisted paths as absent.
- Represent comparison as `added`, `modified`, `deleted`, `unchanged`, or `unknown`.
- Record whether content, metadata, or both established equality.
- Do not infer content equality from equal size and modification time alone.
- If runtime lacks snapshot isolation, label comparison “live, non-atomic.”
- A container restart invalidates runtime identity and relevant cached data.

These are design constraints, not claims about Docker Desktop’s implementation.

## Identity and moves

**Observation:** VS Code uses explicit IDs to preserve expansion and selection. Label changes break generated identity.[5]

**Observation:** Linux rename events can share cookies, but event pairs are non-atomic and may be incomplete.[12]

**Recommendation:**

- Separate row identity, path, source identity, and revision.
- Scope IDs by source; never reuse runtime identities across container generations.
- Keep stable ID on confirmed rename or move.
- Update path and parent without discarding selection.
- Preserve focus and scroll anchor while moving selected entry.
- Distinguish directory-entry identity from inode identity: hard links can share an inode.
- Do not infer rename solely from equal hashes.
- Without provider evidence, show deletion plus addition.
- Label optional similarity-based move detection as inferred.
- Historical endpoints may not offer identity continuity; comparison rows need separate keys.

## Search, hidden files, and incomplete loading

**Observation:** GitHub recursive trees can truncate at 100,000 entries or 7 MB. Documentation requires subtree fetching for completeness.[13]

**Recommendation:**

- Separate **Filter loaded entries** from **Search filesystem**.
- Loaded filtering must say its scope; zero loaded matches does not mean file absent.
- Provider search returns completeness, scope, exclusions, revision, and continuation.
- Display “Search incomplete,” “More results available,” or precise failure.
- Preserve ancestor paths for matching descendants.
- Declare whether folder-name matching includes all descendants, as GitHub’s documented filter does.[1]
- Do not recursively fetch entire filesystem merely to implement typing filter.
- Cancel superseded search and child requests; reject stale responses by context/revision.
- Hidden filtering consumes metadata: `hidden: true | false | unknown`.
- Source adapter may derive POSIX hidden metadata from names; generic tree must not hardcode that rule.
- Unknown hidden status must not silently remove entries.
- Keep hidden status independent from ignored, generated, system, deleted, and permission-denied states.
- Controlled filter values and callbacks must remain host-owned.
- Show active scope and filters even when toolbar controls are supplied by host.
- Restore pre-search expansion when clearing transient search expansion.

## Live changes and watch gaps

**Observation:** VS Code warns recursive watching costs resources. Folder events may omit descendant events; exclusions affect coverage.[14]

**Observation:** inotify can overflow and drop events. Documentation recommends cache reconciliation after inconsistencies.[12]

**Recommendation:**

- Watch only host-requested scope; do not silently create recursive watches per node.
- Expose coverage: recursive, loaded-directories-only, polling, or unsupported.
- Track `live`, `paused`, `stale`, `resyncing`, and `unavailable`.
- Carry cursor/sequence when provider supports ordering or resume.
- Bridge initial listing and subscription with provider revision guarantees.
- Without such guarantees, disclose possible gap and reconcile.
- Overflow, disconnect, restart, and invalid cursor mark affected data stale.
- Reconcile affected directories; preserve selection and expansion where identities survive.
- Treat parent deletion as subtree invalidation, not guaranteed child-event delivery.
- Batch updates; do not rerender entire tree per event.
- Keep fresh activity distinct from persistent comparison status.
- Pause live application while retaining stale badge and queued-change count where known.
- Never silently claim “up to date” after an unbridged watch gap.

## API constraints

Proposed contract responsibilities, not production signatures:

| Surface | Required information / behavior |
|---|---|
| Source context | Source ID, root, path semantics, capabilities, revision, optional snapshot token. |
| Entry | Stable row ID, parent ID, name, path/resource reference, kind, optional metadata. |
| Child listing | Parent, cursor, cancellation; entries, revision, continuation, completeness. |
| Child state | Unknown, loading, partial, loaded-empty, loaded-nonempty, failed. |
| Metadata | Optional size/time/mode/owner/hidden/link target; unknown remains distinct from zero or false. |
| Content | Explicit byte/range limit, cancellation, content version, encoding/type, truncation status. |
| Search | Query, scope, filters, cursor; coverage, exclusions, completeness, revision. |
| Comparison | Baseline and target contexts, direction, completeness, per-side presence and metadata. |
| Change row | Kind, evidence, old/new references; optional provider-confirmed move identity. |
| Watch | Coverage, cursor/revision, event batches, invalidation/gap signal, disposal. |
| Controlled state | Expansion, selection, active item, filters, sort, pane sizes; documented callbacks. |
| Actions | Capability checks; host handlers; disabled explanation rather than fake availability. |
| Icons | Cheap resolver from kind/name/metadata; fallback file/folder icons; no per-row content reads. |
| Reveal | Resolve ancestor chain without requiring complete recursive traversal. |

Cache keys must include source and revision context. Path alone cannot distinguish image, runtime, baseline, and target.

Represent symlinks explicitly. Do not follow automatically; avoid cycles and root escape.

Provider defines case sensitivity and path rules. Remote Linux paths must not inherit host macOS normalization.

## Accessibility

**Observation:** APG defines tree keyboard behavior and dynamic-loading position requirements.[10]

**Recommendation:**

- Name tree and preview regions.
- Use `tree`, `treeitem`, `group`, `aria-expanded`, and consistent selection semantics.
- Omit `aria-expanded` on leaves.
- Right expands or enters first child; Left collapses or focuses parent.
- Up/Down navigate visible rows; Home/End reach visible endpoints.
- Support type-ahead separately from filesystem search.
- Keep focus distinct from selection.
- Do not move focus into preview merely because selection changes.
- Virtualized rows provide `aria-level`, `aria-posinset`, and `aria-setsize`.
- Use unknown set-size semantics when sibling total is unavailable; never invent total.
- Keep active descendant mounted, or manage roving focus safely.
- Announce loading, errors, result completeness, and stale state without flooding live regions.
- Use text or accessible labels alongside change colors.
- Give separator keyboard resizing and accessible value.
- Restore focus to sensible visible ancestor when focused entry disappears.
- Avoid row actions adding dozens of unwanted tab stops.
- Multicolumn interactive cells may require treegrid semantics; do not casually extend basic tree.

## Minimal overhead and preview safety

**Observation:** VS Code renders viewport ranges and caches rows.[4] Its lazy item resolution defers tooltip/command work.[5]

**Recommendation:**

- Use fixed-height, single-line rows by default.
- Virtualize large visible projections, not every small tree automatically.
- Flatten expanded branches only; avoid rebuilding collapsed subtrees.
- Update affected parents and rows using stable IDs.
- Keep icons metadata-driven and cached; avoid dynamic imports per row.
- Defer content, hashing, thumbnails, and rich editor loading until requested.
- Cancel stale preview reads; never show previous file content under new filename.
- Show binary, too-large, truncated, denied, missing, and unsupported states explicitly.
- Escape content; sandbox rich previews; prohibit automatic remote resource loading.
- Never preview special devices, sockets, or FIFOs as ordinary files.

**Observation:** Microsoft disabled some untrusted previews after credential-leak risks.[15] Preview is security-sensitive, not passive decoration.

## Interactive mock scenarios

Mocks should exercise behavior, not merely show screenshots:

1. **Simple tree:** expand, collapse, keyboard navigation, hidden toggle, lazy load, empty directory, permission error.
2. **Compound explorer:** resize tree/preview; close/reopen preview; select text, binary, oversized, and deleted file.
3. **Layers:** move between layers; switch filesystem/change scopes; inspect explicit and opaque deletion.
4. **Live:** inject add/modify/delete/confirmed move; preserve selection; pause; simulate gap and reconciliation.
5. **Pod comparison:** image versus runtime; mount markers; unknown comparison; deletion preview from baseline.
6. **Incomplete search:** loaded-only matches, provider search, partial results, cancellation, reveal unloaded ancestor.
7. **Accessibility:** keyboard-only operation, focus restoration, virtualized position semantics, separator resizing.

Fixture should include dotfile, metadata-hidden non-dotfile, unknown hidden status, symlink, hard links, Unicode name, and file-kind replacement.

No production filesystem access is needed for design mocks. Clearly label simulated state.

## Primary sources

[1]: https://github.blog/changelog/2022-03-16-pull-request-file-tree-beta/
[2]: https://github.blog/changelog/2025-07-31-pull-request-files-changed-public-preview-experience-july-31-updates/
[3]: https://code.visualstudio.com/api/extension-guides/tree-view
[4]: https://github.com/microsoft/vscode/blob/main/src/vs/base/browser/ui/list/listView.ts#L963-L1005
[5]: https://github.com/microsoft/vscode/blob/main/src/vscode-dts/vscode.d.ts#L12235-L12350
[6]: https://github.com/wagoodman/dive#basic-features
[7]: https://docs.docker.com/desktop/use-desktop/container/#files
[8]: https://support.apple.com/guide/mac-help/use-the-preview-pane-in-the-finder-on-mac-mchl1e4644c2/mac
[9]: https://support.microsoft.com/en-gb/windows/experience/fileexplorer/file-explorer-in-windows
[10]: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
[11]: https://github.com/opencontainers/image-spec/blob/main/layer.md#whiteouts
[12]: https://man7.org/linux/man-pages/man7/inotify.7.html
[13]: https://docs.github.com/en/rest/git/trees#get-a-tree
[14]: https://github.com/microsoft/vscode/blob/main/src/vscode-dts/vscode.d.ts#L14187-L14245
[15]: https://support.microsoft.com/en-us/servicing/os/windows/docs/2025/10/file-explorer-automatically-disables-the-preview-feature-for-files-downloaded-from-the-internet

VS Code source anchors reference mutable `main`; line numbers can drift. GitHub announcements establish dated behavior, not current UI verification.