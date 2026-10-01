---
name: pr
description: Push the current branch and open or update its draft pull request. `/pr ready` also marks the pull request ready for review. `/pr merge` merges an open pull request.
argument-hint: '[ready | merge]'
disable-model-invocation: true
---

# Pull request for the current branch

## Rules

P-01 The argument is "$ARGUMENTS".

- Empty: push, then create or update the draft pull request.
- `ready`: the same as empty, then mark the pull request ready for review.
- `merge`: only merge, as P-07 describes.
- Anything else: stop and ask.

P-02 The task of a branch is what its name says. All work must be committed, and every change in `git diff main...HEAD` must belong to that task. The diff must not contain debug code or commented-out code. For a change outside the task, the solutions are to move it to its own branch from `main`, or to keep it and name it in the Summary as a separate change.

P-03 The branch must follow every instruction in `CLAUDE.md`.

P-04 `pnpm build`, `pnpm lint`, `pnpm format:check` and `pnpm test:run` must pass on the final commit.

P-05 The pull request goes from the current branch into `main`, so the current branch must not be `main`. Its title is one Conventional Commit line that describes the whole branch.

P-06 A branch has one pull request. A new pull request is always a draft. If the pull request exists, update its title and description to match the current branch.

P-07 Merge only a pull request that is open and not a draft, and only when the P-04 checks pass. Use a merge commit, delete the branch, and switch to an updated `main`. Do not push or change the description.

P-08 If a rule is broken or a check fails, stop and do not push or merge. Ask about each problem with the AskUserQuestion tool. Name the problem and the rule, and offer concrete solutions with the recommended one first. Do not fix anything before the user chooses. After the chosen fixes, start again from P-01.

P-09 The final reply gives the pull request URL, its title, its state and the check results.

P-10 Pull request descriptions must accurately reflect the changes in the branch and follow the body template provided below.

P-11 Summary in the body: write short bullets about what changed and why. Add one small visual only if bullets cannot show the change clearly. Use a diff sketch, a component or call tree, or pseudocode.

P-12 Evidence in the body: include the results of the P-04 checks and any other relevant evidence that supports the changes made in the branch. Say clearly what was not checked.

P-13 Risk in the body: clearly state how easy it is to undo the changes and what parts of the system could be affected, such as the public API, the layout, or only the demo.

## Body template

```markdown
## Summary

<2–4 bullets>

## Evidence

<the checks that ran and their results>

## Risk

Easy to undo: <yes or no>. Affects: <what can break>.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
