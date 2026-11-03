# Compact activity notifications — interactive design proposal

All infrastructure data and execution are simulated. No production source or SDK change is implemented here.

## Run

```sh
python3 -m http.server 18769 --bind 127.0.0.1
```

Open `/` for stable screenshots, `/?motion=live` for timed progress, or `/?history=1` to include two compact historical rows in the center. Parameters can be combined.

Click **Roll out**. Collapse the notification using its chevron. Dismiss it with X to leave footer-only activity. Click the footer **1 OPERATION** chip to reopen the lower-right center with a collapsed task row. Expand the row to review phase, context, metrics, and actions. Minimize the center to return to footer-only mode.

The footer bell opens the same center with the All filter. The operation chip opens its active-task filter. An already-displayed task remains in the open center when it completes, without forcing expansion. Footer becomes **1 RECENT**. The prototype holds one current task; the production feature must support multiple independently identified tasks.

Use the toolbar's **•••** mock-scenario menu for Low disk alert or AWS scaling. Low disk → Expand disk → reviewed parameters → explicit submit starts a simulated resize. Secondary information lives in Rule details / Requirements disclosures. Only the irreversible-growth warning remains inline. No unsupported-cancel placeholders.

Escape hides overlays without cancelling work. Cmd/Ctrl+J toggles the center. Resource links and pause confirmation are simulated. `window.__mock.state` exposes state; `window.__mock.freezeAt(ms)` freezes CSS animation offsets, not timers.

## Source-grounded layout

- Existing footer: 24px tall, left operation chip, right notification bell.
- Existing notification-center anchor: 12px right, 36px bottom; width 480px; max height 560px with scrolling, not fixed height.
- Measured single-task center: 480×82px collapsed / 480×177px expanded.
- Measured task toast: 360×52px collapsed / 360×147px expanded.
- No header bell, full-height drawer, large metric tiles, permanent filter tabs, scenario explanation card, or explanatory product prose.
- Actual installed base-ui dark surface tokens and react-icons exports; source-defined 38px header. Footer chip typography/placement follows Footer.module.css.

## Captured flow

1. `01-rollout-progress.png`: single rollout, compact expanded toast.
2. `10-collapsed-rollout.png`: title/count/progress only.
3. `11-footer-only-rollout.png`: no overlay, active footer chip and bell remain.
4. `12-footer-reopened-center.png`: chip reopens the anchored center with a collapsed row.
5. `02-durable-notification-center.png`: expand one center row.
6. `14-collapsed-live-progress.png`: collapsed row updates from 4/6 to 5/6 without expanding.
7. `07-rollout-complete.png`, `15-footer-completed.png`: completion in place, then footer-only recent activity.
8. `03`–`06`, `08`: low-disk alert, compact parameter form, resize phases, indeterminate AWS scaling, and resize success.

`activity-flow.mp4` records actual prototype input: rollout → collapse → footer only → reopen → completion → low-disk review → resize phases. GIF is its inline preview. Static completion screenshots separately show terminal states. `09-existing-error-center.png` is unchanged evidence from the previous audit of actual imported notification components; it is not a proposed mock.

## Verification and limits

Chromium viewport 1440×900 CSS pixels, device scale 1.25. Real input exercised collapse/expand, dismissal without cancellation, both footer entry points, center minimization, alert forms, help disclosures, resource destination, pause, and AWS indeterminate progress. Timers exercised live updates and terminal state without automatic expansion. Browser reported no page errors after the completed flow. Screenshots and decoded movie/GIF frames were visually reviewed.

No running full-app pixel match, backend execution, actual resource routing, persistent storage, authorization, rule evaluator, native window, real cancellation, focus trap, or notification preferences is claimed. Names and telemetry are invented. Local state supports one scenario at a time. Large-history scrolling, multi-task admission, provider reconciliation, and durable alerts remain specified in the issue, not implemented by this mock. No device beyond the captured desktop viewport was verified.
