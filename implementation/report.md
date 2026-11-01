# Filesystem explorer implementation

Tracking: https://github.com/omniviewdev/omniview/issues/240

## Delivery

Implemented in the `filesystem-explorer-design` CLI workspace, UI worktree. Source changes are local, not committed, merged, or released. Four subagents handled the shortcut component, tree viewport, explorer components, and showcase; parent integrated and verified the result.

- Public `FileTree`, `FileExplorer`, `FilePreview`, and optional `useFileSystem` provider controller.
- Public generic `ShortcutSummary` and `KeyChord`; semantic descriptions, alternatives, and platform-aware keycaps. These display shortcuts, not register them.
- Stable source-scoped IDs, typed metadata, independent hidden/text/metadata filtering, ordered provider projections, cancellable paging/search/content/actions, bounded paused updates, explicit reconciliation, and confirmed moves.
- Existing TreeList now honors effective row height and overscan, reveals offscreen keyboard targets, pins active descendants, and publishes reactive virtualizer snapshots. Partial sibling totals remain unknown until complete.
- Desktop rows 22px, text 13px, metadata 12px, icons 14px. Phone rows 34px and icons 16px. One 36px preview header. Optional editor and stylesheet load together.
- Watches begin from the established root revision. Obsolete subscription callbacks cannot overwrite current state. Permission failures remain branch-local; healthy branches continue updating after refresh. Preview refresh invalidates reused node objects.
- DiffViewer releases widgets before owned models, including StrictMode cleanup. Editor worker assets use relative module URLs in built consumers.
- Actual showcase covers Browse, Tree only, Image layers, Compare, Live watch, and seven provider states. Fixture actions write actual selected bytes or a JSON snapshot. Archive transport is unavailable, with an explicit reason; no fake tar export.

## Open on another WLAN device

http://192.168.68.55:48733/ — tap **File Explorer** in the navigation rail. This serves the production showcase build, not the earlier standalone HTML mock. The static service is persistent and bound to LAN interfaces; it does not expose Vite source-module endpoints. No backend proxy or real credentials are connected. Physical-phone reachability still depends on firewall/client isolation.

## Verification

- Base UI: 141 test files, 1,608 tests passed.
- Editors: 16 test files, 229 tests passed.
- Base UI, editors, and showcase typechecks passed; base UI, editors, and production showcase builds passed.
- Scoped lint: zero errors, one unsuppressed React Compiler/TanStack Virtual compatibility warning. The adapter exposes reactive snapshots; actual scrolling and keyboard reveal were exercised.
- Production Chromium smoke: 30 checks, 19 captures, zero page errors. Desktop, touch-emulated 390px phone, light and high-contrast dark themes, actual Monaco comparisons, paging/search, hidden files, multiselection, baseline content, real download/snapshot bytes, transfer cancellation, paused/manual/gap/live changes, stable-ID moves, and provider states.
- All captures reviewed as a contact sheet. Settled previews are captured except the intentional loading state. Offline capture precedes recovery.

### One local scale sample

The separate browser scale driver mounts the compiled public component. These are observations, not CI budgets or a comparison against VS Code. Fixture generation, React, caches, and driver overhead affect timings and retained heap.

| Measurement | Observed |
| --- | ---: |
| Supplied nodes | 100,000 |
| Visible projection | 50,001 |
| Initially mounted rows | 38 |
| Initial mount | 195.8 ms |
| End-key reveal | 48.3 ms |
| 1,001-change batch | 131.7 ms |
| Retained heap delta | 45,886,293 bytes |
| Phone mounted rows | 39 |
| Deep leaf | level 301 |
| Tree-only reads / watches / rich modules | 0 / 0 / 0 |

Index/projection rebuilding remains O(n) for changed data or scope; virtualization bounds mounted DOM, not the loaded cache. No constant-time update claim.

## Repository documentation

`packages/base-ui/docs/FILE_EXPLORER.md` contains the public API, composition example, provider ownership, snapshot/paging/watch contracts, filtering/search coverage, preview and action lifecycle, and shortcut API. Component status and `.changeset/filesystem-explorer.md` are updated. Storybook includes a lazily constructed 100,000-node story.

## Limits

Container/Kubernetes transports, registry credential discovery, OCI reconstruction/whiteout decoding, real archive transfer, and native integration remain outside this component task. Structural comparison and historical content belong to providers/consumers. Screen-reader software, mobile Safari, native Wails/WebView, real authorization, and physical-phone networking were not verified. Chromium touch emulation is not physical-device evidence.
