# FEAT-005 Virtual rendering

## Brainstorm notes

The table shows 500 columns x 100,000 rows and meets the scale goals.

From FEAT-004: the full-scale speed goals (first render, and dropped frames while scrolling down and right) become acceptance items of this feature, measured with `pnpm bench`.

From FEAT-004, memory at full scale (estimates, to be measured on the first full-scale run): data with decimal numbers in every cell takes about 1 GB for the numbers alone, because Chrome stores each decimal number as a separate object in memory. This does not count the row objects themselves. Rows with 500 properties may be stored as hash tables, which are slower and larger, so the real amount can be several times higher. One Chrome tab on a desktop has about 4 GB for JavaScript, so this fits, but the engine's memory cleanup can pause the page, and Safari on iPhone and iPad and phones in general close tabs much earlier. `/grill` decides whether the scale goal stays as it is, whether the table should also accept data by column (for example one `Float64Array` per number column, about 400 MB), or whether server-side data mode (FEAT-028) moves up.
