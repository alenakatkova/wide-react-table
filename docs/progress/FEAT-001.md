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

PR 3: rename the "No columns" unit test and add the unit test for a table with no rows.

## Tasks

### PR 1: Basic table component (#3)

- [x] Typed column definitions and table props
- [x] Table rendering for any row data, with column widths and row keys
- [x] Demo with sample data

### PR 2: Fixed column widths, scrollable container and sticky header (#4)

- [x] Fixed column widths with `width` and `defaultColumnWidth`
- [x] `maxVisibleHeight`, with rows that scroll inside the container
- [x] Sticky header
- [x] Space for overlay scroll bars with `useOverlayScrollbarSpace`
- [x] "No columns" message

### PR 3: Browser tests for column widths and scrolling

- [x] Add `src/lib/WideTable/WideTable.browser.test.tsx` with one helper that runs the axe check with only `scrollable-region-focusable` turned off. Its comment names FEAT-024 (rule A-06).
- [x] Browser tests, each with the axe check: `FEAT-001: each column uses its own width or the default width` (with `width` and with `defaultColumnWidth`), `FEAT-001: columns without a width are 100 px wide when no default width is given`, `FEAT-001: the table width is the sum of the column widths`, `FEAT-001: with maxVisibleHeight in pixels, the rows scroll inside the container`, `FEAT-001: with maxVisibleHeight as a CSS length, the rows scroll inside the container` (`50vh` gives 400 px on the test page of 1280 x 800), `FEAT-001: the header stays visible while the rows scroll`, `FEAT-001: columns wider than the container scroll right inside it, and the page does not scroll`, `FEAT-001: each header cell stays above its column while the table scrolls right` and `FEAT-001: a value longer than its column is cut with an ellipsis, and the column keeps its width`.
- [ ] **In progress:** Unit tests: rename "shows a message instead of the table when there are no columns" to `FEAT-001: a table with no columns shows a "No columns" message`, and add `FEAT-001: a table with columns but no rows shows only its header`.
- [ ] Delete the 3 unit tests in "column widths", the 3 in "maxVisibleHeight", and the helper `getColWidths`.
- [ ] Fix any layout bug that the new tests find.

### PR 4: Browser tests for the scroll bar space

- [ ] Browser tests, each with the axe check: `FEAT-001: overlay scroll bars leave at least 15 px free after the last column and the last row` (with `imitateOverlayScrollbars()`, scrolled to the end in both directions) and `FEAT-001: classic scroll bars get no extra space next to them`.
- [ ] Delete the 4 unit tests in "overlay scroll bar space", `mockContainerLayout`, and the style that the test file adds for the container border.
- [ ] Fix any bug that the new tests find.
- [ ] Set `passes: true` and the status `done` in `docs/features.json`.

## Notes

- Browser tests of the real layout replace the 10 unit tests that check inline styles and CSS classes, in "column widths", "maxVisibleHeight" and "overlay scroll bar space". These unit tests check internal details, and a change of the DOM, for example by FEAT-003, would break them. The unit tests "renders the table headers and rows" and "shows a message instead of the table when there are no columns" stay.
- The overlay test uses the FEAT-004 helper `imitateOverlayScrollbars()`, which gives scroll bars of 0 px, so `WideTable` adds its space. 15 px is the widest overlay scroll bar in Chrome and Safari on macOS.
- There is no speed item. The scale goal of 500 columns x 100,000 rows needs virtual rendering, which comes with FEAT-005.
- Not part of this feature: a way for sighted users to see the full value of cut text, and a "No rows" message.
- The page does not expose whether the browser drew the "...". So the ellipsis test checks that the text is wider than its cell, and that the cell's computed `text-overflow` is `ellipsis`.
- After PR 4, no test checks that a table that does not scroll gets no extra space for scroll bars. One of the deleted unit tests covered this case.
- The fallback width of 100 px has its own browser test, apart from the test of `width` and `defaultColumnWidth`, so that each test checks one behavior.
- The browser tests that scroll first check that the scroll position really changed. Without this check, the header test passed even when the container could not scroll, because the header was then at the top anyway.
- Keyboard access to the scroll area is part of FEAT-024. Until then, the FEAT-001 browser tests turn off only the axe rule `scrollable-region-focusable`, with a comment that names FEAT-024, and FEAT-024 turns it back on. FEAT-024 stays `later`, so 1.0 may ship with a scroll area that keyboard users cannot reach.

## Rejected approaches

- Tab focus on the scroll area in this feature: all keyboard work goes into one later feature, FEAT-024.
- Browser tests that fail on `scrollable-region-focusable` until FEAT-024: every pull request would fail, and this feature could never be `done`.
- Moving FEAT-024 to `core`: it stays `later`.
- An extra browser test "a table that does not scroll gets no extra space": no acceptance item asks for it.
