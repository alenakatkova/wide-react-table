---
name: pr
description: Push the current branch and open or update its draft pull request. `/pr ready` also marks the pull request ready for review. `/pr merge` merges an open pull request, and for a documents-only change it also creates the pull request first.
argument-hint: '[ready | merge]'
disable-model-invocation: true
---

# Pull request for the current branch

The argument is "$ARGUMENTS".

- Empty: run PR-02 to PR-08, then PR-14 and PR-10.
- `ready`: run PR-02 to PR-08, mark the pull request ready for review, then PR-14 and PR-10.
- `merge`, for a documents-only change: run PR-02 to PR-08, then PR-09 and PR-10, so the pull request can be created and merged in one step.
- `merge`, for any other change: run PR-02 to PR-07, then PR-09 and PR-10. The pull request must already exist, and every commit except the merge from PR-03 must already be pushed. Otherwise it is a problem, and the solution is to run `/pr` first, so that the change gets its code review.
- Anything else: a problem.

A problem is a broken rule, a failed check or a push that needs force.

A change is documents-only when every file in the PR-05 diff is in `docs/` or `.claude/`, or is a Markdown file.

## Rules

PR-01 On a problem, stop and do not push or merge. Ask about each problem with the AskUserQuestion tool. Name the problem and the rule, and offer concrete solutions with the recommended one first. Do not fix anything before the user chooses. After the chosen fixes, start again from PR-02.

PR-02 The current branch must not be `main`. All work must be committed.

PR-03 Fetch from the remote. If the branch does not contain `origin/main`, merge `origin/main` into it. If the merge has a conflict, resolve it, then show each resolved block next to both original versions and ask the user to approve it. Commit only after approval. If the user rejects it, run `git merge --abort` and stop.

PR-04 The branch must follow every instruction in its `CLAUDE.md`. Read the file again before this check. Do not use an earlier version from memory. Also check that every comment the diff adds or changes is true for the code next to it. Fix a wrong comment right away in its own commit, without asking.

PR-05 The task of a branch is what its name says. Every change in `git diff origin/main...HEAD` must belong to that task. The diff must not contain debug code or commented-out code. For a change outside the task, the solutions are to move it to its own branch from `origin/main`, or to keep it and name it in the Summary as a separate change.

PR-06 `pnpm build`, `pnpm lint`, `pnpm format:check` and every package.json script whose name starts with `test:` must pass on the final commit. For a documents-only change, run only `pnpm format:check`. When a test fails, name the feature or issue it belongs to from the start of its name, for example `FEAT-010:` or `ISSUE-xxx:`. Besides fixing it, offer this solution: keep the failing test, and for a feature set `passes: false` in `docs/features.json`. For a closed issue, reopen it, replace its state label with `in-progress`, and add the failing test under "Known problems" in `docs/progress/ISSUE-xxx.md`.

PR-07 Push. With the `merge` argument, the only commit to push is the merge from PR-03, and any other unpushed commit is a problem. A documents-only change is the exception: all its commits are pushed.

PR-08 The pull request goes from the current branch into `main`. A branch has one pull request. A new pull request is always a draft. Its title is one Conventional Commit line for the whole branch, and its description follows the template below and matches the current branch. If the pull request exists, update its title and description. Never rename the branch of an open pull request: GitHub then closes the pull request, and it cannot be reopened.

PR-09 The pull request must be open. If it is a draft, mark it ready for review. Merge with a merge commit, delete the branch, and switch to an updated `main`. Do not change the description.

PR-10 The final reply gives the pull request URL, its title, its state, the check results and the code review findings.

## Pull request description

PR-11 Summary: short bullets about what changed and why, plus one line for each separate change from PR-05. For the last pull request of an issue's plan, or of a feature with `fromIssue`, add "Closes #xxx" with the issue number. If the component tree changes, always add it like this:

```diff
 <App> (src/demo/App.tsx)
   <WideTable> (src/lib/WideTable/WideTable.tsx)
+    useColumnVisibility()
+    <ColumnToolbar> (src/lib/ColumnToolbar/ColumnToolbar.tsx)
```

Otherwise add one small visual only if bullets cannot show the change: a diff sketch, a call tree, or pseudocode.

PR-12 Evidence: each PR-06 check that ran, with its result, and the tests that cover changed behavior. List each feature whose `status` or `passes` value changed, with its id and the new values. Add a "Not checked" line only for changed application behavior that no check covers. Do not explain skipped checks or describe how the pull request was made.

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

## Code review

PR-14 Run the `/code-review` skill at level `medium` on the pull request. Skip it for a documents-only change. Show its findings. Do not post them to the pull request and do not fix them: the user decides what to fix. Before showing the findings, read the open GitHub issues (`gh issue list`), and show the findings that an open issue fully or partly covers in a separate list, with the issue number. Check each finding that claims a fact you can check, for example by running code, and say what you found. Leave out findings that need no change after your check. Show findings that repeat or reverse a decision made earlier for the same pull request in another separate list, each with a short history: what was discussed before, and what was decided.
