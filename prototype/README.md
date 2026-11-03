# Rich activity notifications — interactive design proposal

Design artifact only. All infrastructure data and execution are simulated. No SDK changes are implemented here.

## Run

Download this directory, then run:

```sh
python3 -m http.server 18769 --bind 127.0.0.1
```

Open `http://127.0.0.1:18769/` for stable review states, or `http://127.0.0.1:18769/?motion=live` for timed rollout and resize transitions.

Use the three scenario buttons. Dismiss a toast, then open the bell to inspect retained activity. Low disk alert → Expand disk → parameter form → explicit submit → tracked operation. Rollout → Pause rollout → confirmation demonstrates a distinct provider action, not cancellation. View resource opens a simulated destination. Escape closes overlays; Cmd/Ctrl+J toggles the center.

`window.__mock.state` exposes simulated state. `window.__mock.freezeAt(ms)` freezes CSS animation offsets, not task timers.

## Evidence

Eight screenshots were captured with Chromium at a 1440×900 CSS viewport and 1.25 device scale. Real mouse/keyboard input exercised operation start, dismiss/reopen, warning, form submission, resource destination, indeterminate AWS progress, and pause confirmation. Live timers exercised rollout and resize completion. Browser reported no page errors after capture. `activity-flow.mp4` records actual prototype interaction; `activity-flow.gif` is its inline issue preview.

## Grounding and limits

Uses installed base-ui dark surface tokens, actual react-icons SVG exports, and source-defined 38px header / 24px footer. No running main-native or main-dev instance was available for live application pixel capture. Header bell placement and right-edge center are explicit design proposals; current app has footer entry points. Scenario connection/resource names and all telemetry are invented examples.

This is not production UI: no backend execution, persistence across reload/restart, authorization, actual resource routing, rule evaluation, real cancellation, focus trap, working filter tabs, or notification preferences. Only the default guest-filesystem expansion path was exercised; alternate parameter selection is illustrative. Retention in this prototype means retaining an operation after hiding its toast, not durable disk storage. The GitHub issue specifies the real contracts and acceptance criteria.
