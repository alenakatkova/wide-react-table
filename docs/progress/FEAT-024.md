# FEAT-024 Keyboard navigation

## Brainstorm notes

The arrow keys move the focus between cells.

From FEAT-001: this feature covers all keyboard work of the table, also the scroll area:

- The scroll area takes focus with Tab, and the arrow keys, Page Up, Page Down, Home and End then scroll it.
- The focused scroll area needs a name for screen readers. One way: the new optional props `aria-label` and `aria-labelledby`, with `role="region"` on the scroll area. Another way: a `caption` prop that shows a visible title and names both the table and the scroll area. Both change the public API.
- The focused scroll area shows a visible focus outline (WCAG 2.2, 2.4.7 Focus Visible).
- When the table fits in its container and cannot scroll, the scroll area takes no focus, so there is no Tab stop that does nothing. `useOverlayScrollbarSpace` already measures whether the container can scroll. A table with no columns never takes focus.

From FEAT-001, known problem (found with the axe check of FEAT-004, in Chromium and WebKit): when `WideTable` scrolls, axe reports `scrollable-region-focusable` (serious, WCAG 2.1.1 Keyboard, level A) for `.wide-table-container`. Keyboard users cannot reach the scroll area, because it does not take focus. The FEAT-001 browser tests turn off this one rule with a comment that names this feature. This feature must turn it back on in those tests.
