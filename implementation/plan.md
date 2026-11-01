## Implementation plan: approved explorer + reusable shortcut summary

Visual review approved. Implement in existing `filesystem-explorer-design` workspace (`f889cfc6-a139-4d77-aac3-8733bd1849b5`), UI feature worktree. Source was clean before implementation. Stop managed watchers during concurrent edits; perform builds and runtime verification after integration.

### Public API decisions

- `ShortcutSummary` displays reusable command/description lists; `KeyChord` displays consistent keyboard/mouse keycaps. Display only: no global shortcut registration.
- `FileTree<TMetadata>` wraps existing TreeList with stable source-scoped IDs, file semantics, independent metadata/hidden/text filtering, lazy branch state, icons, and row metadata. It accepts supplied nodes without requiring a provider, editor, or watch subscription.
- `FileExplorer<TMetadata>` is a ready-made composed surface with controlled state, toolbar/actions, optional context panel, resizable tree, optional preview, status, and sync feedback. Named slots/props avoid a second mandatory state/context framework.
- `FilePreview<TMetadata>` provides the approved single 36px header plus optional metadata/content; consumers supply rich preview rendering.
- Optional `useFileSystem` adapts explicit provider I/O: cancellable child paging, bounded reads, provider search with completeness, batched watch events, gap handling, bounded paused queue, and capability-driven actions with progress/cancellation.
- Shared contracts live in `packages/base-ui/src/components/file-explorer/types.ts`. Provider owns path semantics, comparison/layer computation, authorization, credentials, and transport. No container/Kubernetes SDK integration in this component task.

### Parallel work ownership

| Owner | Slice | Paths |
| --- | --- | --- |
| ShortcutSummary agent | Reusable keycaps, shortcut summary, stories, behavior coverage | `packages/base-ui/src/components/shortcut-summary/` |
| TreeViewport agent | Existing TreeList density/overscan and virtualized keyboard/ARIA corrections | `components/tree-list/`, existing list virtualizer helper |
| FileComponents agent | FileTree, FileExplorer, FilePreview, component CSS/stories/behavior coverage | `components/file-explorer/`, excluding parent contracts/hook |
| ExplorerShowcase agent | Real interactive public-component showcase and deterministic in-memory provider | `apps/showcase/src/demos/file-explorer/` |
| Integration owner | Shared types, provider hook, exports, integration, checks, docs/changelog, issue | Shared entry points only |

No subagent runs builds/tests/lint/formatters while siblings edit. Shared leaf contracts are fixed before handoff; changes require coordination. All production code remains in the CLI-created feature worktrees.

### Ordered acceptance

1. **Shortcut reuse:** generic list with descriptions, platform-aware Mod labels, alternate chords, consistent accessible keycaps, SSR-safe platform behavior. Use it in explorer and a non-explorer story.
2. **Tree correctness:** compact desktop 22px rows/13px text; 34px phone rows; correct virtual estimates and overscan. Keyboard End/Home/typeahead reveals unmounted entries; truthful virtualized hierarchy metadata.
3. **Minimal tree:** no editor/content/watch requirement, no recursive fetch for loaded filtering, independent hidden/metadata filters even when query is empty.
4. **Provider state:** isolated source/revision, stale async responses rejected, paging does not mistake unknown for empty, changed preview reads cancelled, special files/symlinks not automatically read.
5. **Live updates:** preserve IDs across confirmed moves; apply add/modify/remove batches; manual Refresh drains queued changes without enabling Live sync; overflow/gap cannot silently claim current data.
6. **Real showcase:** Browse, tree-only shortcuts, layers/cumulative vs changes, image/runtime text comparison, live updates/manual refresh/interruption, permission/empty/binary/large/missing capability states. Use actual components and real fixture-provider actions, no HTML mock implementation copied into production.
7. **Evidence:** targeted behavior regressions, package typecheck/build, live Vite showcase driven by browser input at desktop/phone sizes and supported themes. Inspect large-tree mounted-row bounds, keyboard reveal, event bursts, and deferred-content behavior. Report measured evidence, not assumed optimization.
8. **Delivery:** public exports, caller migrations in existing file-explorer demo, documentation and changeset, tracking issue with screenshots/runtime evidence and exact remaining platform limits.

Production container transport, registry credentials, OCI archive decoding, and backend filesystem authorization remain explicitly outside this UI component scope. No compatibility shims, no fake completed actions, and no production stubs.
