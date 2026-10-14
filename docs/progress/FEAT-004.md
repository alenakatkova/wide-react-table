# FEAT-004 Test setup for browser and speed tests

## Brainstorm notes

Layout items are tested with browser tests (Playwright), and speed items with a benchmark script. Browser tests also check the UI with axe. With this feature, CLAUDE.md gets the rule: all UI that the library renders must meet WCAG 2.2 level AA, and browser tests check each feature's UI with axe.
