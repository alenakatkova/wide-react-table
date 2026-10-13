# Progress

Work progress for the features in [docs/features.json](docs/features.json): tasks and notes from the work on each feature, and the reasons for dropped features.

## FEAT-001 Base layout

Status `done`, `passes: false`. The feature is built, but its acceptance items are not all covered by tests whose names start with `FEAT-001:`.

### Tasks

- [ ] Add the `FEAT-001:` prefix to the three unit tests in `column widths`. They cover the item "Each column uses its own width or the default width, and the table width is the sum of the column widths".
- [ ] Add the `FEAT-001:` prefix to the unit test "shows a message instead of the table when there are no columns". It covers the item "A table with no columns shows a "No columns" message".
- [ ] Add a browser test: with `maxVisibleHeight`, rows scroll inside the container. Needs `FEAT-004`.
- [ ] Add a browser test: the header stays visible while rows scroll. Needs `FEAT-004`.
- [ ] Add a browser test: overlay scroll bars do not cover the last column or the last row when scrolled to the end. Needs `FEAT-004`.
- [ ] Set `passes: true` in `docs/features.json` when all tests above pass.

### Open questions

- The unit tests in `maxVisibleHeight` and `overlay scroll bar space` check styles and CSS classes, not the real layout. Do they stay as extra tests, or do the browser tests replace them?
- Headless browsers hide scroll bars. How can a browser test show that an overlay scroll bar does not cover the content?
