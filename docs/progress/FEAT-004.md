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

## Next step

PR 2: install `axe-core`.

## Tasks

### PR 1: Browser tests in Chromium, Firefox and WebKit

- [x] Install `@vitest/browser-playwright` and `playwright`.
- [x] Add the `browsers:install` script, which runs `playwright install chromium firefox webkit`, and use it in the README "Development" section. Its name must not start with `test:`, because `/pr` runs every `test:` script.
- [x] Split the Vitest config in `vite.config.ts` into the projects `unit` (jsdom, without `**/*.browser.test.{ts,tsx}`) and `browser` (browser mode with the Playwright provider, Chromium, Firefox and WebKit, only `**/*.browser.test.{ts,tsx}`, a fixed page size of 1280 × 800).
- [x] Scripts: `test` runs `vitest --project unit`, `test:run` runs `vitest run --project unit`, and the new `test:browser` runs `vitest run --project browser`.
- [x] Split `src/test/setup.ts`: the `ResizeObserver` stub goes to a setup file for the `unit` project only. The jest-dom matchers and `cleanup` stay shared.
- [x] Add the browser test types to `tsconfig.app.json`. Not needed: the browser tests import only `vitest` and Testing Library, which have their own types.
- [x] Imitate classic scroll bars with `::-webkit-scrollbar` CSS in every browser test, from a setup file for the `browser` project. Add a helper that a test calls to get overlay scroll bars: it sets `scrollbar-width: none` for the duration of the test. In Firefox a test cannot choose the scroll bar mode, so both scroll bar mode tests are skipped there. Scroll bar sizes are measured with the same function that `WideTable` uses.
- [x] Add `__screenshots__` and `.vitest-attachments` to `.gitignore`.
- [x] Browser test: `FEAT-004: reads the real size of a rendered element`.
- [x] Unit test `FEAT-004: unit tests run in jsdom` and browser test `FEAT-004: browser tests run in a real browser`.
- [x] Browser tests: `FEAT-004: classic scroll bars take space`, `FEAT-004: overlay scroll bars take no space` and `FEAT-004: overlay scroll bars end with their test`.

### PR 2: axe accessibility check

- [ ] Install `axe-core`.
- [ ] Add the helper `expectNoAccessibilityViolations(element, { disabledRule? })`. It checks the WCAG 2.0, 2.1 and 2.2 A and AA tags, and lists each violation in the failure message.
- [ ] Add rule A-05 to CLAUDE.md.
- [ ] Browser tests: `FEAT-004: axe check fails for a button with no label`, `FEAT-004: axe check passes for UI with no problems` and `FEAT-004: axe check skips the turned-off rule and still finds other problems`.

### PR 3: Test data generator

- [ ] Add a seeded random number function in `src/test/`.
- [ ] Add the generator of columns and rows for `WideTable`. Each column has one type: text, number or date. Some cells are empty.
- [ ] Unit tests: `FEAT-004: makes the requested columns and rows with text, numbers, dates and empty values`, `FEAT-004: same seed gives the same data` and `FEAT-004: different seed gives different data`.

### PR 4: Benchmark

- [ ] Add the Vitest project `bench`: Chromium only, only `**/*.bench.tsx`. The script `bench` runs `vitest run --project bench`.
- [ ] Add a browser command that slows the CPU by 2x through Chromium's DevTools connection.
- [ ] Add the helper `measure({ name, goal, run })`: 5 runs, the median as the result, a stop after 60 seconds, and a failed test when the median misses the goal.
- [ ] Add the measurements: first render time, and dropped frames during a 5-second steady scroll down and a 5-second steady scroll right. A frame counts as dropped when the time between two frames is longer than about 16.7ms, with a small allowance for timing noise.
- [ ] Add a reporter that prints the result table: name, median, goal, pass or fail, and the machine's CPU model and memory.
- [ ] Add the FEAT-004 measurements on a table of 50 × 1,000, made with the generator from PR 3.
- [ ] Browser test: `FEAT-004: CPU slowdown makes the same work take longer`.
- [ ] Unit tests: `FEAT-004: the result is the median of 5 runs`, `FEAT-004: the result table shows name, median, goal, pass or fail, CPU and memory`, `FEAT-004: a missed goal fails the measurement`, `FEAT-004: a measurement that runs too long is stopped and fails` and `FEAT-004: a measurement from a new file is found and run`.
- [ ] Run `pnpm bench` and check that every FEAT-004 measurement is reported.
- [ ] Set `passes: true` in `docs/features.json` when all tests above pass.

## Notes

- Browser tests use Vitest browser mode with the Playwright provider. Chromium also covers Edge, because Edge uses the same engine.
- Browser test files sit next to the component and are named `*.browser.test.tsx`, or `*.browser.test.ts` without JSX.
- Browser tests run on a page of 1280 × 800. Vitest's default page is 414px wide, so a wide table would make the page itself scroll, and its scroll bar would take space in Chromium and WebKit but not in Firefox.
- Playwright starts headless Chromium with `--hide-scrollbars`, and that flag also hides the CSS-styled scroll bars. The config removes it. Checked on macOS: with the flag, the classic scroll bar test fails in Chromium.
- axe runs only on small tables, for example 10 columns × 20 rows. On a full-scale table it is very slow and finds nothing new.
- A test may turn off one axe rule only with a code comment that gives the reason. It never turns off all rules.
- This feature adds rule A-05 to CLAUDE.md: "The library's UI must meet WCAG 2.2 level AA. Each browser test runs an axe check, and any problem that axe finds fails the test. When a feature adds UI, its acceptance items say how that UI works with the keyboard."
- The benchmark runs on the developer's laptop, not in CI, because shared CI machines differ in speed from run to run.
- A frame is dropped when it takes longer than about 16.7ms, which is one frame at 60 frames per second. The scroll goal is no more than 5% dropped frames.
- The table has no virtual rendering yet, so the benchmark cannot run at full scale. The full-scale speed goals (500 × 100,000) become acceptance items of FEAT-005.
- CI is not part of this feature. Add it later as its own feature with `/shape`. CI will run `pnpm test:browser`, but not `pnpm bench`.
- Browser tests must pass headless on Linux, so that a later CI can run them.
- Browser tests check sizes that come from the code, such as column widths, or compare sizes with each other. They never expect fixed text sizes, because fonts differ between macOS and Linux.
- Scroll bar mode: on macOS, headless Chromium, Firefox and WebKit all use overlay scroll bars, and no launch setting changes that. So both modes are imitated with CSS. Every browser test has classic scroll bars from `::-webkit-scrollbar` styles with a fixed width, and a test imitates overlay scroll bars with `scrollbar-width: none`. This works the same on macOS and Linux in Chromium and WebKit. Playwright's Firefox hides its scroll bars with a browser rule: `scrollbar-width` is `none` on every element, and even `scrollbar-width: auto !important` from the page does not change it. So in Firefox, scroll bars always take no space, and both scroll bar mode tests are skipped: the overlay test would pass there even with a broken helper.
- The benchmark is a Vitest project, so the 60-second limit, the error exit and new measurement files come with Vitest.

## Known problems

- The browser tests have run only on macOS. On Linux, it is not checked yet that the imitated classic scroll bars work in headless Chromium and WebKit. It is also not checked that Playwright's Firefox hides its scroll bars on Linux the same way. The first CI run (FEAT-030) will show both.

## Rejected approaches

- A separate Playwright Test runner: Vitest browser mode keeps one test API for unit and browser tests.
- A separate Edge run: Edge uses the same engine as Chromium, and every machine that runs tests would need Edge installed.
- CI in this feature: it is separate work.
- A benchmark with no CPU slowdown, or with a 4x slowdown: 2x is closer to a normal laptop.
- One browser instance per scroll bar mode, for example a second Chromium without `--hide-scrollbars`: it makes test runs longer, and the result depends more on the system.
- Real classic scroll bars from launch settings (Chromium without `--hide-scrollbars`, Firefox with `ui.useOverlayScrollbars: 0`): tried, and on macOS all browsers still had scroll bars 0px wide. Chromium and WebKit follow the system setting "Show scroll bars", and Playwright's Firefox hides its scroll bars.
- Showing Firefox scroll bars with `scrollbar-width: auto !important` together with `ui.useOverlayScrollbars: 0`: tried, and `scrollbar-width` stayed `none`.
- Changing the macOS setting "Show scroll bars" for each test browser with `defaults write`: every developer would have to do it by hand, and it may not work for headless Chromium.
- Real classic scroll bars only on Linux, with the classic tests skipped on macOS: classic scroll bars would be checked only in a CI that does not exist yet.
- A separate Node script that starts Chromium with Playwright for the benchmark: the time limit, the error exit and finding new measurement files would need to be written by hand.
