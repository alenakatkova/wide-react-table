# FEAT-001 Base layout

## Acceptance

- Each column uses its own width or the default width, and the table width is the sum of the column widths.
- With `maxVisibleHeight`, as pixels or as a CSS length such as `50vh`, the rows scroll inside the container.
- The header stays visible while the rows scroll.
- When the columns are wider than the container, the table scrolls right inside its container, and the page does not scroll.
- While the table scrolls right, each header cell stays above its column.
- A value longer than its column is cut with an ellipsis, and the column keeps its width.
- Overlay scroll bars do not cover the last column or the last row: after a scroll to the end, at least 15 px stay free to the right of the last column and below the last row.
- With classic scroll bars, the table adds no extra space next to them.
- A table with columns but no rows shows only its header.
- A table with no columns shows a "No columns" message.

## Next step

Plan again: acceptance items changed.

## Tasks

- [ ] Add the `FEAT-001:` prefix to the three unit tests in `column widths`. They cover the item "Each column uses its own width or the default width, and the table width is the sum of the column widths".
- [ ] Add the `FEAT-001:` prefix to the unit test "shows a message instead of the table when there are no columns". It covers the item "A table with no columns shows a "No columns" message".
- [ ] Add a browser test: with `maxVisibleHeight`, rows scroll inside the container. Needs `FEAT-004`.
- [ ] Add a browser test: the header stays visible while rows scroll. Needs `FEAT-004`.
- [ ] Add a browser test: overlay scroll bars do not cover the last column or the last row when scrolled to the end. Needs `FEAT-004`.
- [ ] Set `passes: true` in `docs/features.json` when all tests above pass.

## Notes

- Browser tests of the real layout replace the 10 unit tests that check inline styles and CSS classes, in "column widths", "maxVisibleHeight" and "overlay scroll bar space". These unit tests check internal details, and a change of the DOM, for example by FEAT-003, would break them. The unit tests "renders the table headers and rows" and "shows a message instead of the table when there are no columns" stay.
- The overlay test uses the FEAT-004 helper `imitateOverlayScrollbars()`, which gives scroll bars of 0 px, so `WideTable` adds its space. 15 px is the widest overlay scroll bar in Chrome and Safari on macOS.
- There is no speed item. The scale goal of 500 columns x 100,000 rows needs virtual rendering, which comes with FEAT-005.
- Not part of this feature: a way for sighted users to see the full value of cut text, and a "No rows" message.
- Keyboard access to the scroll area is part of FEAT-024. Until then, the FEAT-001 browser tests turn off only the axe rule `scrollable-region-focusable`, with a comment that names FEAT-024, and FEAT-024 turns it back on. FEAT-024 stays `later`, so 1.0 may ship with a scroll area that keyboard users cannot reach.

## Rejected approaches

- Tab focus on the scroll area in this feature: all keyboard work goes into one later feature, FEAT-024.
- Browser tests that fail on `scrollable-region-focusable` until FEAT-024: every pull request would fail, and this feature could never be `done`.
- Moving FEAT-024 to `core`: it stays `later`.
