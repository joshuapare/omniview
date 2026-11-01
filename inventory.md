# inventory.md

Research complete. Reuse `TreeList`, `ResizableSplitPane`, and `DataTable`; keep editor previews optional.

**Artifact status:** Content supplied below. No file written: assignment’s read-only constraint forbids writes.

## Scope and evidence

Source inspection only. No repo changes, services, builds, tests, or formatters.

Exact source roots:

- **UI:** `/Users/joshuapare/Repos/omniviewdev/ui/main`
- **Host:** `/Users/joshuapare/Repos/omniviewdev/omniview`

Paths below use these roots explicitly through `UI/` and `Host/` prefixes.

Observations describe inspected code. Recommendations describe proposed design, not existing APIs.

## Public package surface

| Source | Observation |
|---|---|
| `UI/packages/base-ui/package.json:16-22` | Public imports expose package root and `styles.css`; no component subpath exports. |
| `UI/packages/base-ui/src/index.ts:1-19` | Root imports theme CSS; exports components, themes, styling types, status helpers, debounce hooks. |
| `UI/packages/base-ui/src/components/index.ts:1-100` | Exports all primitives listed below. |
| `UI/packages/editors/package.json:16-22` | Editors expose package root and `styles.css`; no editor-specific subpath exports. |
| `UI/packages/editors/src/index.ts:1-9` | Exports editor components, theme helpers, schema registry, and `setupMonacoWorkers`. |
| `UI/packages/editors/src/components/index.ts:1-38` | Exports `CodeEditor`, `DiffViewer`, `MarkdownPreview`, `ObjectInspector`, terminal, command palette, and CEL editor. |

**Recommendation:** Use public package exports. Do not rely on source-directory imports in production.

## Primitive inventory

### Tree

**Sources**

- `UI/packages/base-ui/src/components/tree-list/types.ts:164-258`
- `UI/packages/base-ui/src/components/tree-list/index.ts:1-15`
- `UI/packages/base-ui/src/components/tree-list/TreeList.tsx:295-500,1044-1088`
- `UI/packages/base-ui/src/components/tree-list/hooks/useTreeState.ts:35-105`
- `UI/packages/base-ui/src/components/tree-list/hooks/useTreeFlattener.ts:1-230`
- `UI/packages/base-ui/src/components/tree-list/TreeList.module.css:8-65,133-153`

**Observed API**

`TreeList.Root<TItem>` accepts:

- `items`, `itemKey`, `getChildren`, `isBranch`, `renderItem`.
- `getTextValue`, `isItemSelectable`.
- Controlled/default expansion, selection, active key, and filter text.
- `selectionMode`: `none | single | multiple`.
- `selectionBehavior`: `replace | toggle`.
- `loadChildren(key, item): Promise<void>` and `onLoadError`.
- `virtualized`, declared `overscan`, declared `estimatedItemSize`.
- `filterFn(item, filterText)`.
- `indentation`, `indentGuide`: `none | rail | connectors`.
- `loading`, `error`.
- Optional sibling ordering and drag reorder.

Compound parts:

`Root`, `Viewport`, `Item`, `ReorderableItem`, `ItemDragHandle`, `ItemIndent`, `ItemToggle`, `ItemIcon`, `ItemLabel`, `ItemDescription`, `ItemMeta`, `ItemBadge`, `ItemActions`, `Empty`, `Loading`.

Exported hooks:

`useTreeItem`, `useTreeConfig`, `useTreeStoreContext`, `useTreeActions`.

Actions include expansion, selection, `expandAllAsync`, and collapse-all.

**Limitations**

- `getChildren() === undefined` means unloaded; `[]` means loaded-empty.
- Supply explicit `isBranch` for unloaded directories. Default branch detection depends on returned children.
- Filtering scans loaded descendants, retains ancestor paths, and displays matching branches expanded.
- Built-in filtering activates only when `filterText` is nonempty.
- Filtering does not discover unloaded descendants through a remote search API.
- **Declared virtualization tuning is not wired through.** Viewport hardcodes `estimatedItemSize: 36`; it omits root `overscan`.
- Viewport subscribes to full store snapshots, including selection and loading changes.
- Unfiltered flattening skips collapsed descendants but still allocates visible-node records and ancestor arrays.
- No filesystem metadata, layer semantics, change aggregation, or content fetching exists in this generic tree.

**Reuse**

Use as filesystem navigation engine. Wrap file semantics without duplicating selection, expansion, focus, or indentation machinery.

### Resizable panes

**Source**

`UI/packages/base-ui/src/components/resizable-split-pane/ResizableSplitPane.tsx:14-32,83-240,246-282`

**Observed API**

```ts
direction?: 'horizontal' | 'vertical';
defaultSize?: number;
minSize?: number;
maxSize?: number;
reverse?: boolean;
handleLabel?: string;
onResize?: (size: number) => void;
children: [ReactNode, ReactNode];
```

- Horizontal means side-by-side; vertical means stacked.
- Defaults: sized pane 200px; minimum 100px.
- `reverse` sizes second pane.
- Pointer drag changes DOM CSS variable directly.
- Separator supports arrow keys, Home, bounded End, and double-click reset.

**Limitations**

- No controlled `size` prop.
- No built-in collapse, persistence, resize-end callback, or percentage sizing.
- Exactly two children.
- Public export is `ResizableSplitPane`, not a `.Pane`/`.Handle` compound API.
- `onResize` fires during dragging; avoid expensive parent work there.

**Reuse**

Compose nested splits for navigation, directory contents, and optional preview. Keep split persistence outside primitive.

### Tables and virtualization

**Sources**

- `UI/packages/base-ui/src/components/data-table/types.ts:20-91`
- `UI/packages/base-ui/src/components/data-table/DataTable.tsx:27-122`
- `UI/packages/base-ui/src/components/data-table/DataTableVirtualBody.tsx:86-106,221-259`
- `UI/packages/base-ui/src/components/list/hooks/useListVirtualizer.ts:1-48`

**Observed API**

`useDataTable` supports:

- Generic columns and stable `getRowId`.
- Sorting, column/global filtering, selection, expansion, pagination.
- Column resize, order, pinning, visibility.
- Controlled state slices and corresponding callbacks.
- `getSubRows`, expansion/selectability predicates.
- Manual sorting, filtering, pagination, grouping, and expansion.
- Optional persistence key.

`DataTable` parts:

`Root`, `Container`, `Header`, `Body`, `VirtualBody`, `Footer`, `Toolbar`, `ColumnVisibility`, `Pagination`, `Empty`, `Loading`, `ExpansionToggle`.

`VirtualBody` accepts:

- `estimateRowSize`, `overscan`, `fixedRowHeight`.
- `estimateExpandedRowSize`, `renderExpandedRow`.
- `onRowClick`, `getRowProps`.

Uses TanStack Virtual. Expanded detail slots receive dynamic measurements.

**Limitations**

- Virtualized detail content unmounts outside virtual range.
- Fetch/cache ownership must remain outside row detail components.
- Row-click is pointer convenience; source explicitly requires equivalent native controls.
- No filesystem-specific columns, metadata model, or comparison semantics.

**Reuse**

Use for large directories, layer tables, and changed-file lists. Enable only needed features.

### Existing file table and icons

**Sources**

- `UI/packages/base-ui/src/components/file-table/FileTableContext.tsx:4-23`
- `UI/packages/base-ui/src/components/file-table/FileTable.tsx:27-43,64-189,218-240`
- `UI/packages/base-ui/src/components/file-table/FileTable.module.css:56-67`
- `UI/packages/base-ui/src/components/icon-button/IconButton.tsx:6-18`

**Observed API**

```ts
interface FileTableItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: string;
  extension?: string;
  children?: FileTableItem[];
}
```

Root supports `items`, `onNavigate`, `onSelect`, `selectedId`, parent navigation, and initial sort.

Custom columns accept accessor, sort accessor/function, width, alignment, and monospace styling.

Built-in columns: icon, filename, actions, size, type, modified.

Rows select on click. Folder rows navigate on double-click.

Icons use `LuFolder` and `LuFile` from `react-icons/lu`, sized 14px.

**Limitations**

- Body renders every row using `.map`; no virtualization.
- Built-in columns remain fixed.
- Item type excludes symlinks, devices, sockets, and other filesystem kinds.
- No exported general `FileIcon` resolver found.
- `IconButton` wraps button behavior; it does not resolve icon names or file types.

**Reuse**

Borrow visual conventions and formatting. Prefer `DataTable` for reusable large-directory explorer contents.

### Search and filtering

**Sources**

- `UI/packages/base-ui/src/components/search-input/SearchInput.tsx:17-47`
- `UI/packages/base-ui/src/components/filter-bar/FilterBar.tsx:44-46,73-76,121-123,150-152,185-189`
- `UI/packages/base-ui/src/components/find-bar/FindBar.tsx:18-37,65-80`
- `UI/packages/base-ui/src/index.ts:18-19`

**Observed APIs**

`SearchInput`:

- Controlled `value`/`onValueChange` or `defaultValue`.
- Clear behavior, decorators, input styling, `rootProps`.
- Clear button restores input focus.

`FilterBar`:

- `Chip` with removal callback.
- `Add` and `Clear` controls.
- Presentation and callbacks, not filtering engine.

`FindBar`:

- Controlled open/query state.
- Match count/current match.
- Next/previous.
- Case, regex, whole-word toggles.
- Optional replace controls.
- Enter/Shift+Enter navigation; Escape closes.

Public debounce hooks exist.

**Limitations**

- These primitives do not define metadata predicates or directory search semantics.
- `FindBar` receives match results; it does not compute them.
- `TreeList.filterFn` alone cannot implement hidden-file filtering when search text is empty.

**Reuse**

Keep one controlled filesystem filter model outside visual controls. Filter loaded entries before tree/table consumption.

### Editors and diff

**Sources**

- `UI/packages/editors/src/components/code-editor/CodeEditor.tsx:61-141,197-210`
- `UI/packages/editors/src/components/diff-viewer/DiffViewer.tsx:7-23,48-77,80-124`
- `UI/packages/editors/package.json:47-60`

**Observed APIs**

`CodeEditor`:

- Controlled text `value`; optional `onChange`.
- Filename/model identity, explicit language.
- `readOnly`, line numbers, minimap, wrapping, tab size.
- Diagnostics, suggestions, syntax highlighting.
- Mount, diagnostic, cursor callbacks.
- Width, height, borderless embedding.
- Handle exposes editor, Monaco, focus, diagnostics, and debug state.

`DiffViewer`:

```ts
original: string;
modified: string;
language?: string;
mode?: 'side-by-side' | 'inline';
readOnly?: boolean;
height?: string | number;
bordered?: boolean;
className?: string;
```

Defaults to read-only, side-by-side. Owns and disposes two Monaco text models.

**Limitations**

- Both import Monaco directly.
- Diff compares supplied strings; no filesystem comparison, binary diff, or metadata comparison.
- Diff has no labels, content-fetch API, editable change callback, or editor handle.
- `CodeEditor` requires explicit `readOnly` for read-only enforcement; omitting `onChange` is not sufficient design intent.
- Worker setup is separately exported.

**Reuse**

Expose preview render slot. Load editor package only for selected text content. Keep base explorer independent of Monaco.

### Breadcrumbs

**Source**

`UI/packages/base-ui/src/components/breadcrumbs/Breadcrumbs.tsx:16-36,40-95`

**Observed API**

- `separator`, `maxItems`, `itemsBeforeCollapse`, `itemsAfterCollapse`, `size`.
- Defaults: eight visible items; one before and one after collapse.
- `Breadcrumbs.Item` supports link or current-page presentation.
- Active item sets `aria-current="page"`.

**Limitations**

- No path parsing, filesystem navigation state, or editable path field.
- Non-link item renders spans, not native button behavior.

**Reuse**

Build crumbs from adapter-provided path segments. Use actual links where navigation has URLs.

### Context menus

**Source**

`UI/packages/base-ui/src/components/context-menu/ContextMenu.tsx:53-97,370-393`

**Observed API**

Base UI-backed compound parts:

`Root`, `Trigger`, `Portal`, `Backdrop`, `Positioner`, `Popup`, `Arrow`, `Group`, `GroupLabel`, `Item`, `LinkItem`, checkbox/radio parts, submenu parts, `Separator`.

Decorated items support start/end decorators.

**Limitations**

No filesystem action policy, capability checking, or source-specific command dispatch.

**Reuse**

Render actions supplied by host adapter. Also expose important actions through visible controls.

### Empty, loading, and errors

**Sources**

- `UI/packages/base-ui/src/components/empty-state/EmptyState.tsx:5-32`
- `UI/packages/base-ui/src/components/banner/Banner.tsx:8-24,90-110`
- `UI/packages/base-ui/src/components/tree-list/types.ts:246-249`
- `UI/packages/base-ui/src/components/index.ts:33,58,60,72`

**Observed APIs**

`EmptyState`: required title; optional icon, description, action, size.

`Banner`: styled compound alert with icon, title, content, actions, and close parts. Default role is `alert`.

Tree supports error content, loading state, and lazy-load error callback.

Public primitives include `Skeleton`, `Spinner`, and `Toast`.

No dedicated exported `ErrorState`, `ErrorBoundary`, or filesystem explorer found through export and filename searches.

**Reuse**

Distinguish empty directory, no matches, inaccessible directory, unloaded state, and disconnected source.

Use `EmptyState` for empty views; use `Banner` for recoverable source errors without hiding existing content.

## Theme tokens and density

**Sources**

- `UI/packages/base-ui/src/theme/styles.css:89-191,377-381,541-586,634-636`
- `UI/packages/base-ui/src/theme/styles.css:706-750,830-873,945-988`
- `UI/packages/base-ui/src/theme/styles.css:1285-1290,1393-1396,1676-1681,1791-1794`
- `UI/packages/base-ui/src/theme/ThemeProvider.tsx:68-87`
- `UI/packages/base-ui/src/theme/types.ts:8-27`
- `UI/packages/base-ui/src/theme/index.ts:1-26`

**Observed tokens**

| Purpose | Tokens |
|---|---|
| Surfaces | `--ov-color-bg-base`, `--ov-color-bg-surface`, `--ov-color-bg-surface-raised` |
| Text | `--ov-color-fg-default`, `--ov-color-fg-muted`, `--ov-color-fg-subtle` |
| Borders | `--ov-color-border-default`, `--ov-color-border-muted`, `--ov-color-border-control` |
| Interaction | `--ov-color-state-hover`, `--ov-color-state-selected`, `--ov-color-state-focus-ring` |
| Status | `--ov-color-success`, `--ov-color-warning`, `--ov-color-danger`, associated soft tokens |
| Diff | `--ov-color-diff-insert-bg`, `--ov-color-diff-remove-bg` |
| Typography | `--ov-font-sans`, `--ov-font-mono`, `--ov-font-size-body`, `--ov-font-size-caption` |
| Spacing | `--ov-space-1`, `--ov-space-1-5`, `--ov-space-2`, `--ov-space-3`, `--ov-space-4` |
| Shape/motion | `--ov-radius-control`, `--ov-duration-interactive`, `--ov-ease-standard` |

Theme provider accepts `themeId`, fallback, registry, root element, initial density, and initial motion.

Theme density is `compact | comfortable`; tree also has its own `default` density option.

Tree compact rows use 22px semantic height. Tree default rows follow density-overridden medium tokens. `TreeList.Root` accepts `density="compact"` independently of `size="sm"`; small size applies 13px item text, while the body token defaults to 14px and caption token to 12px. Sources: `TreeList.module.css:35-43,54-58,145-153`, `types.ts:198`, and `theme/styles.css:91-95,120-121,386-390`.

**Recommendation**

Use semantic tokens, not copied palette values. Test mock layouts across light, dark, and high-contrast designs.

Explorer decision: use compact density plus small size for desktop (22px rows, 13px text, 14px icons). Keep 12px desktop secondary metadata. Retain 34px mock phone rows and 16px phone icons. This is component-scoped styling, not a global theme change. The existing 36px virtualization estimate must be wired to effective row height before compact virtualized production acceptance.

Use `--ov-font-mono` for paths and metadata. DiffViewer currently references `--ov-font-family-mono` with monospace fallback.

## Host shell dimensions

| Exact source | Observed constraint |
|---|---|
| `Host/ui/layouts/core/main/WorkspaceShell.tsx:20-28` | Header 38px; footer 24px; sidebar explicitly 0px. |
| `Host/ui/layouts/core/main/WorkspaceShell.module.css:5-25` | Matching global header/footer variables; `100dvh`; shrinking, clipped main region. |
| `Host/ui/layouts/core/main/Header/index.tsx:26-30` | macOS controls reserve 68px when platform/fullscreen conditions require it. |
| `Host/ui/layouts/core/main/Header/Header.module.css:53-65` | Search area flex basis 600px; can shrink. |
| `Host/ui/layouts/core/main/Container/Container.module.css:1-17` | Flex content; zero minimum dimensions; hidden overflow. |
| `Host/ui/layouts/core/main/BottomDrawer/index.tsx:20-29,56-71` | Drawer minimum 32px; expanded height state; bounded by viewport height. |
| `Host/ui/providers/BottomDrawer/windowContext.ts:4` | Default expanded drawer height 550px. |
| `Host/ui/layouts/core/main/BottomDrawer/BottomDrawer.module.css:21-24` | Drawer container hidden at widths ≤599px. |

**Recommendation**

Mocks should place explorer inside remaining content area, not full viewport. Include compressed-height state with expanded bottom drawer.

Explorer needs its own scroll regions and `min-width: 0; min-height: 0`.

## Proposed component boundaries

These names are recommendations, not current exports.

| Boundary | Responsibility | Excludes |
|---|---|---|
| `FilesystemTree` | Generic file tree, lazy branches, controlled selection/expansion, row metadata and decorations. | Panes, toolbar, content loading, Monaco, layer computation. |
| `FilesystemExplorer.Root` | Share controlled location, selection, filter, source context across optional parts. | Network clients and container-runtime APIs. |
| `.Toolbar` | Navigation actions and composed search/filter controls. | Filtering algorithm ownership. |
| `.Breadcrumbs` | Render supplied location segments. | Path normalization and routing policy. |
| `.Navigation` | Compose `FilesystemTree`. | Duplicate tree state engine. |
| `.Contents` | Directory or changed-file table using `DataTable`. | Mandatory rendering when tree-only mode suffices. |
| `.Preview` | Host-rendered selected entry preview and preview states. | Hard editor dependency. |
| `.Status` | Counts, source state, comparison summary. | Background polling. |
| Optional layer controls | Layer selection and impact summary. | Image history fetch and overlay reconstruction. |

**Architecture**

Host adapter owns filesystem snapshots, metadata, content loading, comparisons, and subscriptions.

Controlled explorer state connects navigation, table, breadcrumbs, filters, and preview.

Existing primitives own rendering, keyboard interaction, layout, and virtualization.

## Reuse plan and scenario requirements

### Simple tree

- Compose only `FilesystemTree`.
- Preserve stable entry keys across refreshes.
- Supply explicit directory predicate and lazy children.
- Avoid table, split-pane, editor, and layer-controller mounts.

### Compound explorer

- Compose navigation and contents through one split.
- Add optional preview through nested split.
- Omit preview pane and separator entirely when preview is closed.
- Keep selected-entry content cache outside preview component.

### Layer exploration

- Adapter supplies layer identity and per-entry layer/change metadata.
- Layer control selects snapshot or impact view.
- Reuse tree/table renderers with badges and metadata columns.
- Do not place image overlay reconstruction inside base-ui.

### Live changes

- Adapter delivers immutable patches with stable keys.
- Preserve selection and expansion where entries remain.
- Show source freshness/disconnection separately from directory errors.
- Avoid full-tree expansion or content loading on refresh.

### Running pod versus image

- Adapter supplies aligned path entries and explicit comparison status.
- Distinguish added, removed, content-changed, and metadata-only changes.
- Use table/tree badges for structural comparison.
- Use `DiffViewer` only when both selected sides provide suitable text.
- Render explicit missing-side and binary states; do not synthesize empty content as equivalent data.

### Metadata-driven hidden filtering

- Store hidden classification in supplied metadata.
- Keep `showHidden`, query, kinds, and change status controlled by host.
- Apply hidden predicate before text ancestor retention.
- Do not let matching hidden descendants reappear through ancestor-preserving search.
- Do not use synthetic nonempty `filterText` to activate metadata filtering.
- State whether search covers loaded entries or provider-wide results.

### Minimal overhead

- No editor dependency in tree core.
- No DnD activation unless ordering is requested.
- No automatic recursive fetch for ordinary expansion.
- Virtualize large navigation and contents views.
- Keep callbacks and entry identities stable.
- Treat root tree virtualization tuning as unsupported until wiring changes.
- Keep content subscriptions and caches outside virtualized rows.

## Design mock acceptance surface

Interactive mocks should demonstrate:

1. Tree-only navigation, keyboard selection, expansion, and lazy-loading states.
2. Resizable compound layout with preview open/closed.
3. Layer selection with changed-file details.
4. Live entry additions, removals, and preserved selection.
5. Pod/image comparison with inline and side-by-side text views.
6. Controlled hidden filtering, including hidden matching descendants.
7. Empty directory, no matches, denied access, binary preview, and disconnected source.
8. Narrow widths and reduced height under host drawer.
9. Large-result scrolling without mounting every directory row.

No runtime behavior or performance was exercised. Findings derive from source only.