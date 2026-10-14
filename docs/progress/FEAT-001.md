# FEAT-001 Base layout

## Acceptance

- Each column uses its own width or the default width, and the table width is the sum of the column widths
- With maxVisibleHeight, rows scroll inside the container
- The header stays visible while rows scroll
- Overlay scroll bars do not cover the last column or the last row when scrolled to the end
- A table with no columns shows a "No columns" message

## Next step

Add the `FEAT-001:` prefix to the unit tests that cover acceptance items. The browser tests wait for `FEAT-004`.

## Tasks

- [ ] Add the `FEAT-001:` prefix to the three unit tests in `column widths`. They cover the item "Each column uses its own width or the default width, and the table width is the sum of the column widths".
- [ ] Add the `FEAT-001:` prefix to the unit test "shows a message instead of the table when there are no columns". It covers the item "A table with no columns shows a "No columns" message".
- [ ] Add a browser test: with `maxVisibleHeight`, rows scroll inside the container. Needs `FEAT-004`.
- [ ] Add a browser test: the header stays visible while rows scroll. Needs `FEAT-004`.
- [ ] Add a browser test: overlay scroll bars do not cover the last column or the last row when scrolled to the end. Needs `FEAT-004`.
- [ ] Set `passes: true` in `docs/features.json` when all tests above pass.

## Notes

- Open question: the unit tests in `maxVisibleHeight` and `overlay scroll bar space` check styles and CSS classes, not the real layout. Do they stay as extra tests, or do the browser tests replace them?
- Open question: headless browsers hide scroll bars. How can a browser test show that an overlay scroll bar does not cover the content?
