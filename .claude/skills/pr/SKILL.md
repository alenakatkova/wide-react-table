---
name: pr
description: Push the current branch and open or update its draft pull request. `/pr ready` also marks the pull request ready for review. `/pr merge` merges an open pull request.
argument-hint: '[ready | merge]'
disable-model-invocation: true
---

# Pull request for the current branch

The argument is "$ARGUMENTS".

- Empty: run PR-02 to PR-08, then PR-10.
- `ready`: run PR-02 to PR-08, mark the pull request ready for review, then PR-10.
- `merge`: run PR-02 to PR-07, then PR-09 and PR-10.
- Anything else: a problem.

A problem is a broken rule, a failed check or a push that needs force.

## Rules

PR-01 On a problem, stop and do not push or merge. Ask about each problem with the AskUserQuestion tool. Name the problem and the rule, and offer concrete solutions with the recommended one first. Do not fix anything before the user chooses. After the chosen fixes, start again from PR-02.

PR-02 The current branch must not be `main`. All work must be committed.

PR-03 Fetch from the remote. If the branch does not contain `origin/main`, merge `origin/main` into it. If the merge has a conflict, resolve it, then show each resolved block next to both original versions and ask the user to approve it. Commit only after approval. If the user rejects it, run `git merge --abort` and stop.

PR-04 The branch must follow every instruction in its `CLAUDE.md`. Read the file again before this check. Do not use an earlier version from memory.

PR-05 The task of a branch is what its name says. Every change in `git diff origin/main...HEAD` must belong to that task. The diff must not contain debug code or commented-out code. For a change outside the task, the solutions are to move it to its own branch from `origin/main`, or to keep it and name it in the Summary as a separate change.

PR-06 `pnpm build`, `pnpm lint`, `pnpm format:check` and `pnpm test:run` must pass on the final commit. If the PR-05 diff changes only Markdown files, run only `pnpm format:check`.

PR-07 Push. With the `merge` argument, the only commit to push is the merge from PR-03. Any other unpushed commit is a problem.

PR-08 The pull request goes from the current branch into `main`. A branch has one pull request. A new pull request is always a draft. Its title is one Conventional Commit line for the whole branch, and its description follows the template below and matches the current branch. If the pull request exists, update its title and description.

PR-09 The pull request must be open and not a draft. Merge with a merge commit, delete the branch, and switch to an updated `main`. Do not change the description.

PR-10 The final reply gives the pull request URL, its title, its state and the check results.

## Pull request description

PR-11 Summary: short bullets about what changed and why, plus one line for each separate change from PR-05. If the component tree changes, always add it like this:

```diff
 <App> (src/demo/App.tsx)
   <WideTable> (src/lib/WideTable/WideTable.tsx)
+    useColumnVisibility()
+    <ColumnToolbar> (src/lib/ColumnToolbar/ColumnToolbar.tsx)
```

Otherwise add one small visual only if bullets cannot show the change: a diff sketch, a call tree, or pseudocode.

PR-12 Evidence: each PR-06 check that ran, with its result, and the tests that cover changed behavior. Add a "Not checked" line only for changed application behavior that no check covers. Do not explain skipped checks or describe how the pull request was made.

PR-13 Risk: whether reverting the pull request fully restores the old state, and what can break, such as the public API, the layout, or only the demo.

```markdown
## Summary

<summary>

## Evidence

<evidence>

## Risk

Easy to undo: <yes or no>. Affects: <what can break>.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
