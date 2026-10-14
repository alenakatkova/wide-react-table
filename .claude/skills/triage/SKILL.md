---
name: triage
description: Check new GitHub issues, choose the next work for features and issues, and check docs/features.json for problems. Changes labels, comments and the plan only after the user approves.
argument-hint: '[ISSUE-xxx]'
disable-model-invocation: true
---

# Triage

The argument is "$ARGUMENTS".

Without an argument, run all three parts. With an issue as `ISSUE-xxx`, run only the inbox part for that issue.

## Inbox

TRIAGE-01 Find the issues to check: open issues with the label `needs-triage` or with no state label, and issues with `needs-info` that have a new comment from the reporter since the last triage comment.

TRIAGE-02 For each issue, read it with all comments. Check if it repeats another issue, or a feature that is planned, `done` or `dropped` in `docs/features.json`. For a bug, try to reproduce it in the demo or with a temporary test that is not committed.

TRIAGE-03 For each issue, recommend:

- the category: `bug` or `enhancement`
- the priority: `priority: core`, `priority: later` or `priority: future`
- the state: `ready-to-refine`, `needs-info` (with the questions for the reporter), or `wontfix` (with the reason)
- if it is too big for an issue: a note to run `/grill ISSUE-xxx`, which can turn it into a feature

The user approves or changes each recommendation.

TRIAGE-04 After approval, set the labels. An issue has exactly one state label, so replace the old one. Then add a comment with the result and what was found, for example the reproduction. Close a `wontfix` issue.

## Next work

TRIAGE-05 List the features, and the issues with the label `ready-to-refine`, `refined` or `in-progress`, that can start: every feature in their `dependsOn` or "Depends on" is `done`, and every issue there is closed. Order the features in `docs/features.json` like this: `core` first, then `later`, then `future`. Inside a priority, a feature comes after the features in its `dependsOn`. If this does not decide the order, follow the order of the list. Order the issues by their priority label. For each item, name the next skill:

- `/grill`: an `idea` feature, a `ready-to-refine` issue, or a "Grill again" note in "Next step"
- `/design-it`: refined, but no plan in its progress file yet, or a "Plan again" note in "Next step"
- `/implement`: a plan exists, and it has pull requests that are not merged yet

TRIAGE-06 Show the first five items with the reason for their place, and recommend one. Ask if a priority should change, or if a feature should be dropped. Change priorities in `docs/features.json` or as labels only after the user approves. A feature is dropped only when the user decides it: set its status to `dropped`, and write the reason under "Notes" in its progress file (create it from the template in `docs/progress/README.md` if it does not exist).

## Health

TRIAGE-07 Check `docs/features.json`, `docs/progress/` and the "Depends on" section of open issues: every id in `dependsOn` and "Depends on" exists, there are no dependency loops between features and issues, every `refined` or later feature has acceptance items in its file, and every `done` feature has no known problems left. A `done` feature with `passes: false` has a broken test: recommend to set its status back to `in-progress` and to add a task in its file to fix the test. Show each problem with a fix. Make a fix only after the user approves.

## End

TRIAGE-08 Do not change code. The only exception is a temporary test for TRIAGE-02, which is deleted before the end. Before the first file change in TRIAGE-06 or TRIAGE-07: if there are uncommitted changes, say so and stop. Fetch from the remote and create a branch from `origin/main` named with today's date, for example `docs/triage-2026-10-14`. If a branch or a pull request in any state has used the name (`gh pr list --state all --head <name>`), add `-2`, `-3` and so on. Commit the changes with the message `docs: triage <date>`. Labels and comments on GitHub need no branch.

TRIAGE-09 The final reply gives the branch if one was created, the checked issues with their new labels, the recommended next item with its skill, and the problems found.
