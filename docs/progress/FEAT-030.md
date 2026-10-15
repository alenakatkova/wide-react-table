# FEAT-030 Continuous integration (CI)

## Brainstorm notes

- GitHub Actions on the standard Linux runners, which are free for a public repository.
- It runs on every pull request and on every push to `main`.
- It runs lint, the format check, the build, unit tests, and browser tests in Chromium, Firefox and WebKit.
- The benchmark does not run in CI, because shared CI machines differ in speed from run to run.
- The browsers and their Linux system libraries are downloaded on every run, which takes about 1–2 minutes. A cache saves little time.
- Branch protection on `main`: GitHub blocks a merge when CI fails.
- `/pr merge` waits until the CI checks pass on GitHub.
- To decide in `/grill`: one job per browser, run in parallel. This costs nothing on a public repository, and the free plan runs up to 20 jobs at once. Each job repeats the setup, so the run uses more minutes, but it finishes sooner.
- Publishing to npm from CI is not part of this feature. It belongs to the library build and package feature.
