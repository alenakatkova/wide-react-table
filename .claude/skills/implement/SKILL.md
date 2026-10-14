---
name: implement
description: Build the next pull request of one planned feature or issue - code, tests, progress file and commits. Ends before /pr.
argument-hint: 'FEAT-xxx | ISSUE-xxx'
disable-model-invocation: true
---

# Implement a feature or an issue

The argument is "$ARGUMENTS".

The result is the next pull request from the plan: committed work on its own branch, tests for its acceptance items, passing checks, and an updated progress file.

## Start

IMPL-01 The argument must be one of these, otherwise say what is wrong and stop:

- the full id of a feature in `docs/features.json` with the status `refined` or `in-progress`, for example `FEAT-010`
- an open GitHub issue as `ISSUE-xxx`, whose file `docs/progress/ISSUE-xxx.md` has acceptance items

IMPL-02 Read the progress file `docs/progress/FEAT-xxx.md` or `docs/progress/ISSUE-xxx.md`. For an issue, also read its "Depends on" section (`gh issue view <number>`). Also read `docs/progress/README.md`. Stop and say why when:

- there is no plan, or "Next step" starts with "Plan again": run `/design-it`
- "Next step" starts with "Grill again before continuing": run `/grill`
- a feature in `dependsOn` or "Depends on" is not `done`, or an issue there is not closed

IMPL-03 Work on the next pull request in the plan that is not merged. Create its branch from `origin/main`, named with the id, the pull request number and a short title, for example `feat/FEAT-010-1-single-sort` or `fix/ISSUE-xxx-1-header-line`. For a feature, set its status to `in-progress` in `docs/features.json`. For an issue, replace its state label with `in-progress`.

## Work

IMPL-04 Work task by task. Before a task starts, mark it "In progress:". When it is done, check it off and update "Next step". Write decisions under "Notes", problems under "Known problems", and what was tried and dropped under "Rejected approaches". Do not repeat the git history.

IMPL-05 Do only the tasks of this pull request. A new idea goes to the user as a suggestion for `/shape`. A bug in another feature goes under "Known problems".

IMPL-06 Stop and ask the user when an acceptance item is unclear, when it is not clear how to build a task (suggest `/design-it-twice`), or when the work needs a change to the public API that the acceptance items do not name.

IMPL-07 Commit when a working state with passing tests is reached, as a Conventional Commit. A task can have several commits.

## Tests

IMPL-08 Each acceptance item has at least one test whose name starts with the feature id or the issue, for example `FEAT-010: sorts numbers by value` or `ISSUE-xxx: keeps the header line after a resize`. Layout items use browser tests, speed items use the benchmark, and everything else uses unit tests.

IMPL-09 A test checks behavior through the public API (props, the rendered page, exported functions), not internal details. Before the code for an item is written, run its test once and see it fail. A test that never failed may check nothing.

IMPL-10 Cover the unusual cases of each item: no rows, no columns, one row or column, empty and very long values, `null` and `undefined`, and the sizes in the scale goal in "Project-wide decisions" in `docs/progress/README.md`.

IMPL-11 Do not write tests that repeat the code's own calculation, test the browser or React, or compare a whole rendered page. One test checks one behavior.

IMPL-12 If an existing test of another feature, an issue, or the whole project must change, stop and tell the user which test, what changes, and why. Change it only after the user agrees.

## End

IMPL-13 Check that the public API in `src/lib/index.ts` exports what consumers need, that the demo shows the new behavior, and that new UI meets the accessibility rule in `CLAUDE.md`.

IMPL-14 Run `pnpm build`, `pnpm lint`, `pnpm format:check` and every `test:` script. They must pass.

IMPL-15 Show each known problem with a recommendation and its reason: fix now, move to a GitHub issue, or keep it for a later pull request. On the last pull request in the plan, only "fix now" and "move to a GitHub issue" are possible. The user decides for each one.

IMPL-16 When every acceptance item of a feature has a passing test, set `passes: true` in `docs/features.json`. When this is the last pull request in the plan, set the feature's status to `done` on this branch: it reaches `main` only with the merge.

IMPL-17 The final reply gives the branch, the finished tasks, the test results, `passes`, the known problems, and the next step: `/pr`.
