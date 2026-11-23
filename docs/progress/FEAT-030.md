# FEAT-030 Continuous integration (CI)

## Brainstorm notes

- GitHub Actions on the standard Linux runners, which are free for a public repository.
- It runs on every pull request and on every push to `main`.
- It runs lint, the format check, the build, unit tests, and browser tests in Chromium and WebKit.
- The benchmark does not run in CI, because shared CI machines differ in speed from run to run.
- The browsers and their Linux system libraries are downloaded on every run, which takes about 1–2 minutes. A cache saves little time.
- Branch protection on `main`: GitHub blocks a merge when CI fails.
- `/pr merge` waits until the CI checks pass on GitHub.
- To decide in `/grill`: one job per browser, run in parallel. This costs nothing on a public repository, and the free plan runs up to 20 jobs at once. Each job repeats the setup, so the run uses more minutes, but it finishes sooner.
- Publishing to npm from CI is not part of this feature. It belongs to the library build and package feature.
- From FEAT-004: the browser tests have run only on macOS. On Linux, it is not checked yet that the imitated classic scroll bars work in headless Chromium and WebKit. The first CI run shows it. If a test fails there, this feature fixes it before CI blocks merges. ISSUE-15 is a related check of the cell widths.
