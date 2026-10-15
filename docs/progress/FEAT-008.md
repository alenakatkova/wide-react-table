# FEAT-008 Theming with CSS variables

## Brainstorm notes

All colors, borders, spacing and fonts come from `--wide-table-*` variables with defaults. The library has no built-in dark theme.

From FEAT-004: setting `scrollbar-color` or `scrollbar-width` in the library CSS turns off the imitated classic scroll bars in Chromium browser tests. If theming colors the scroll bars, the browser test setup must change with it.
