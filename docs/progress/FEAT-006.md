# FEAT-006 Data pipeline and state model

## Brainstorm notes

The app passes all rows. Rows go through fixed steps in the browser: search, filter, sort, paginate. A server mode can take over these steps later.

From FEAT-004: at the scale goal, the app's rows alone can take about 1 GB, for example when every cell is a decimal number. So search, filter and sort must not copy rows. They work with a list of row positions. See the memory note in FEAT-005.
