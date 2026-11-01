# Filesystem explorer implementation

Tracking: https://github.com/omniviewdev/omniview/issues/240

## Delivery

Merged into `omniviewdev/ui` main through https://github.com/omniviewdev/ui/pull/92 at `45ff5dbfecb5becbf84a763c22cc028e63071b35` on 2026-11-01. Verified source head was `eb29a8d3955033e9ce5fa682ba83e8aa4fdc7462`, including main `61bf9c2`. All seven hosted checks passed; CodeRabbit skipped the final incremental review, and all nine prior review threads were addressed. No admin override was needed. No package release is claimed. Four initial subagents built the component slices; four additional subagents helped address review and mainline integration, with parent verification.

- Public `FileTree`, `FileExplorer`, `FilePreview`, and optional `useFileSystem` provider controller.
- Public generic `ShortcutSummary` and `KeyChord`; semantic descriptions, alternatives, and platform-aware keycaps. These display shortcuts, not register them.
- Stable source-scoped IDs, typed metadata, independent hidden/text/metadata filtering, ordered provider projections, cancellable paging/search/content/actions, bounded paused updates, explicit reconciliation, and confirmed moves.
- Existing TreeList now honors effective row height and overscan, reveals offscreen keyboard targets, pins active descendants, and publishes reactive virtualizer snapshots. Partial sibling totals remain unknown until complete.
- Desktop rows 22px, text 13px, metadata 12px, icons 14px. Phone rows 34px and icons 16px. One 36px preview header. Optional editor and stylesheet load together.
- Watches begin from the established root revision. Obsolete subscription callbacks cannot overwrite current state. Permission failures remain branch-local; healthy branches continue updating after refresh. Preview refresh invalidates reused node objects.
- DiffViewer releases widgets before owned models, including StrictMode cleanup. Editor worker assets use relative module URLs in built consumers.
- Actual showcase covers Browse, Tree only, Image layers, Compare, Live watch, and seven provider states. Fixture actions write actual selected bytes or a JSON snapshot. Archive transport is unavailable, with an explicit reason; no fake tar export.
- Integrated mainline resource-navigation activation, controlled state, and independent drag-source pinning without replacing the explorer's Enter/double-click-only open contract. Committed active descendants prevent opening filtered-out controlled entries.
- Listing coverage survives continuation loading/errors. Unknown-destination events cannot create fictitious complete branches; incompatible revisions require explicit Refresh instead of automatic retry loops.
- Manual scroll remains stable across sizing-only and append-only changes; explicit keyboard navigation still reveals the active row.
- Uncached moves invalidate listed destinations instead of falsely retaining complete listings. Outside-view directory requests settle as errors instead of permanent loading.
- Removed unsupported logical assignments. Installed React Compiler 1.0.0 diagnostics now report successful compilation of `useTreeStore` and `TreeListViewport`, with no errors in the two probed modules.

## Open on another WLAN device

http://192.168.68.55:48733/ — tap **File Explorer** in the navigation rail. This serves the production showcase build, not the earlier standalone HTML mock. The static service is persistent and bound to LAN interfaces; it does not expose Vite source-module endpoints. No backend proxy or real credentials are connected. Physical-phone reachability still depends on firewall/client isolation.

## Verification

- Base UI: 147 test files, 1,675 tests passed.
- Editors: 16 test files, 229 tests passed.
- Base UI, editors, and showcase typechecks passed; base UI, editors, and production showcase builds passed.
- Scoped lint: zero errors, one unsuppressed React Compiler/TanStack Virtual compatibility warning. The adapter exposes reactive snapshots; actual scrolling and keyboard reveal were exercised.
- Production Chromium smoke: 31 checks, 20 captures, zero page errors. Desktop, touch-emulated 390px phone, light and high-contrast dark themes, actual Monaco comparisons, paging/search, hidden files, multiselection, baseline content, real download/snapshot bytes, transfer cancellation, paused/manual/gap/live changes, stable-ID moves, stale-directory reconciliation, and provider states.
- All captures reviewed as a contact sheet. Settled previews are captured except the intentional loading state. Offline capture precedes recovery.
- Eight compiled-component checks cover scale, scroll-away preservation through responsive sizing, Windows Meta labels, and explicit opening with filtered controlled focus. Both browser receipts report zero page errors.

### One local scale sample

The separate browser scale driver mounts the compiled public component. These are observations, not CI budgets or a comparison against VS Code. Fixture generation, React, caches, and driver overhead affect timings and retained heap.

| Measurement | Observed |
| --- | ---: |
| Supplied nodes | 100,000 |
| Visible projection | 50,001 |
| Initially mounted rows | 38 |
| Initial mount | 156.9 ms |
| End-key reveal | 30.2 ms |
| 1,001-change batch | 100.0 ms |
| Retained heap delta | 42,631,578 bytes |
| Phone mounted rows | 29 |
| Deep leaf | level 301 |
| Tree-only reads / watches / rich modules | 0 / 0 / 0 |

Index/projection rebuilding remains O(n) for changed data or scope; virtualization bounds mounted DOM, not the loaded cache. No constant-time update claim.

## Repository documentation

`packages/base-ui/docs/FILE_EXPLORER.md` contains the public API, composition example, provider ownership, snapshot/paging/watch contracts, filtering/search coverage, preview and action lifecycle, and shortcut API. Component status and `.changeset/filesystem-explorer.md` are updated. Storybook includes a lazily constructed 100,000-node story.

## Limits

Container/Kubernetes transports, registry credential discovery, OCI reconstruction/whiteout decoding, real archive transfer, and native integration remain outside this component task. Structural comparison and historical content belong to providers/consumers. Screen-reader software, mobile Safari, native Wails/WebView, real authorization, and physical-phone networking were not verified. Chromium touch emulation is not physical-device evidence.
