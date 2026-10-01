---
name: pr
description: Push the current branch and open or update its draft pull request. `/pr ready` also marks the pull request ready for review. `/pr merge` merges an open pull request.
argument-hint: '[ready | merge]'
disable-model-invocation: true
---

# Pull request for the current branch

## Rules

PR-01 The argument is "$ARGUMENTS".

- Empty: push, then create or update the draft pull request.
- `ready`: the same as empty, then mark the pull request ready for review.
- `merge`: only merge, as PR-07 describes.
- Anything else: a problem under PR-08.

PR-02 The task of a branch is what its name says. All work must be committed, and every change in `git diff main...HEAD` must belong to that task. The diff must not contain debug code or commented-out code. For a change outside the task, the solutions are to move it to its own branch from `main`, or to keep it and name it in the Summary as a separate change.

PR-03 The branch must follow every instruction in its `CLAUDE.md`. Read the file again before this check. Do not use an earlier version from memory.

PR-04 `pnpm build`, `pnpm lint`, `pnpm format:check` and `pnpm test:run` must pass on the final commit. If the diff changes only Markdown files, run only `pnpm format:check`.

PR-05 The pull request goes from the current branch into `main`, so the current branch must not be `main`. A branch has one pull request. A new pull request is always a draft.

PR-06 The title is one Conventional Commit line for the whole branch. The description follows the template below and matches the current branch. If the pull request exists, update both.

PR-07 Merge only a pull request that is open and not a draft, when the PR-04 checks pass and the local branch matches the remote branch. Use a merge commit, delete the branch, and switch to an updated `main`. Do not change the description. If the branch does not contain the latest remote `main`, first merge `main` into it, run the PR-04 checks and push. For a merge conflict, follow PR-13.

PR-08 If a rule is broken, a check fails, or a push needs force, stop and do not push or merge. Ask about each problem with the AskUserQuestion tool. Name the problem and the rule, and offer concrete solutions with the recommended one first. Do not fix anything before the user chooses. After the chosen fixes, start again from PR-01.

PR-09 The final reply gives the pull request URL, its title, its state and the check results.

PR-10 Summary: 2–4 short bullets about what changed and why, plus one line for each separate change from PR-02. If the component tree changes, always add it like this:

```diff
 <App> (src/demo/App.tsx)
   <WideTable> (src/lib/WideTable/WideTable.tsx)
+    useColumnVisibility()
+    <ColumnToolbar> (src/lib/ColumnToolbar/ColumnToolbar.tsx)
```

Otherwise add one small visual only if bullets cannot show the change: a diff sketch, a call tree, or pseudocode.

PR-11 Evidence: each PR-04 check that ran, with its result, and the tests that cover changed behavior. Add a "Not checked" line only for changed application behavior that no check covers. Do not explain skipped checks or describe how the pull request was made.

PR-12 Risk: whether reverting the pull request fully restores the old state, and what can break, such as the public API, the layout, or only the demo.

PR-13 If merging `main` causes a conflict, resolve it, then show each resolved block next to both original versions and ask the user to approve it. Commit only after approval. If the user rejects it, run `git merge --abort` and stop.

## Body template

```markdown
## Summary

<PR-10>

## Evidence

<PR-11>

## Risk

Easy to undo: <yes or no>. Affects: <what can break>.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
