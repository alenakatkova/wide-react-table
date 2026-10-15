# FEAT-005 Virtual rendering

## Brainstorm notes

The table shows 500 columns x 100,000 rows and meets the scale goals.

From FEAT-004: the full-scale speed goals (first render, and dropped frames while scrolling down and right) become acceptance items of this feature, measured with `pnpm bench`.

From FEAT-004, memory at full scale (estimates, to be measured on the first full-scale run): with a decimal number in every cell, the numbers alone take about 600 MB, because Chrome stores each decimal number as a separate object of about 12 bytes. The pointers to them inside the rows add about 200 MB. On top of that come the row objects themselves. Measured in Node: rows from `JSON.parse` keep a fast, small form up to about 127 properties, and with more they are stored as hash tables, which are slower and larger. So at 500 columns, real rows are hash tables, and the total is about 1 GB or more. Chrome's engine version can differ a little from Node's. One Chrome tab on a desktop has about 4 GB for JavaScript, so this fits, but the engine's memory cleanup can pause the page, and Safari on iPhone and iPad and phones in general close tabs much earlier. `/grill` decides whether the scale goal stays as it is, whether the table should also accept data by column (for example one `Float64Array` per number column, about 400 MB), or whether server-side data mode (FEAT-028) moves up.
