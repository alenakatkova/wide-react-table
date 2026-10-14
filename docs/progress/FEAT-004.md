# FEAT-004 Test setup for browser and speed tests

## Acceptance

- A browser test can read the real size of a rendered element, and it passes in Chromium, Firefox and WebKit.
- `pnpm test:browser` runs only `*.browser.test.tsx` files, and `pnpm test:run` runs no `*.browser.test.tsx` files.
- A browser test that chooses classic scroll bars sees a scroll bar that is wider than 0px on a container that scrolls.
- A browser test that chooses overlay scroll bars sees a scroll bar that is 0px wide on a container that scrolls.
- The axe helper fails the test when the rendered UI has a WCAG 2.2 A or AA problem, for example a button with no label.
- The axe helper passes when the rendered UI has no such problem.
- The axe helper can turn off one named rule, and it still finds problems from the other rules.
- The data generator makes the requested number of columns and rows, with text, numbers, dates and empty values.
- The data generator makes the same data for the same seed, and different data for a different seed.
- `pnpm bench` measures the first render time of a table of a given size in Chromium, with the CPU slowed by 2x.
- `pnpm bench` measures the share of dropped frames during a 5-second steady scroll down, and during a 5-second steady scroll right, and reports them separately.
- Each measurement runs 5 times, and the result is the median.
- The result table shows, for each measurement: its name, which starts with a feature id; the median; the goal; and pass or fail. It also shows the machine's CPU and memory.
- `pnpm bench` exits with an error when a measurement misses its goal.
- A measurement that runs longer than 60 seconds is stopped and reported as failed.
- A later feature can add a measurement with its own name and goal without changing the benchmark code.
- On a table of 50 columns × 1,000 rows, `pnpm bench` finishes and reports every measurement.

## Notes

- Browser tests use Vitest browser mode with the Playwright provider. Chromium also covers Edge, because Edge uses the same engine.
- Browser test files sit next to the component and are named `*.browser.test.tsx`.
- Headless Chromium hides scroll bars with the flag `--hide-scrollbars`. Hidden scroll bars take no space, like overlay scroll bars. Classic scroll bars need the flag removed.
- axe runs only on small tables, for example 10 columns × 20 rows. On a full-scale table it is very slow and finds nothing new.
- A test may turn off one axe rule only with a code comment that gives the reason. It never turns off all rules.
- This feature adds rule A-05 to CLAUDE.md: "The library's UI must meet WCAG 2.2 level AA. Each browser test runs an axe check, and any problem that axe finds fails the test. When a feature adds UI, its acceptance items say how that UI works with the keyboard."
- The benchmark runs on the developer's laptop, not in CI, because shared CI machines differ in speed from run to run.
- A frame is dropped when it takes longer than about 16.7ms, which is one frame at 60 frames per second. The scroll goal is no more than 5% dropped frames.
- The table has no virtual rendering yet, so the benchmark cannot run at full scale. The full-scale speed goals (500 × 100,000) become acceptance items of FEAT-005.
- CI is not part of this feature. Add it later as its own feature with `/shape`.

## Rejected approaches

- A separate Playwright Test runner: Vitest browser mode keeps one test API for unit and browser tests.
- A separate Edge run: Edge uses the same engine as Chromium, and every machine that runs tests would need Edge installed.
- CI in this feature: it is separate work.
- A benchmark with no CPU slowdown, or with a 4x slowdown: 2x is closer to a normal laptop.
