# Workflow

How work moves from an idea to merged code, and which skill to run when. Each skill is started by the user with its slash command.

## The flow

```
/shape ─▶ /triage ─▶ /grill ─▶ /design-it ─▶ /implement ─▶ /pr ─▶ /pr merge
                                               │  ▲
                                               ▼  │
                                         /design-it-twice
                                 (when the way to build a task is not clear)
```

`/design-it-twice` is a side step. `/implement` suggests it when a task is not clear, and its result goes back into the plan. You can also run it before `/design-it`, when the way to build the whole feature is not clear. `/design-it` does not need it: for an unclear part of the plan, it creates two designs itself, with the same steps.

`/implement` builds one pull request at a time. For a plan with several pull requests, repeat `/implement` → `/pr` → `/pr merge` for each one.

## When to run each skill

### `/shape`

- **When:** an idea comes up, in a running session or in an empty one. You decide when the discussion is done.
- **Result:** new `idea` features in `docs/features.json`, and new GitHub issues.

### `/triage`

- **When:** at the start of a work day, or when new issues come in.
- **Result:** checked issues with labels, the next item to work on with its skill, and problems in the plan.

### `/grill FEAT-xxx` or `/grill ISSUE-xxx`

- **When:** before planning a feature or issue, or when "Next step" says "Grill again".
- **Result:** a branch such as `docs/FEAT-xxx-grill`, with acceptance items in the progress file. An issue also gets a short "Refined" comment on GitHub.

### `/design-it FEAT-xxx` or `/design-it ISSUE-xxx`

- **When:** after `/grill`, or when "Next step" says "Plan again".
- **Result:** pull requests and their tasks in the progress file.

### `/design-it-twice FEAT-xxx` or `/design-it-twice ISSUE-xxx`

- **When:** the way to build the whole feature, or one task, is not clear.
- **Result:** a chosen design under "Notes", and the other one under "Rejected approaches".

### `/implement FEAT-xxx` or `/implement ISSUE-xxx`

- **When:** a plan exists.
- **Result:** the next pull request: code, tests and commits on its own branch.

### `/pr`, `/pr ready` and `/pr merge`

- **`/pr`:** after `/implement`, or after any change on a branch. It pushes the branch, creates or updates a draft pull request, and runs a code review.
- **`/pr ready`:** the same, and it marks the pull request ready for review.
- **`/pr merge`:** when the pull request can go into `main`. It merges with a merge commit and deletes the branch.

## Priorities

The same priorities are used for features in `docs/features.json` and for issues, as the labels `priority: core`, `priority: later` and `priority: future`.

| Priority | Meaning                                  |
| -------- | ---------------------------------------- |
| `core`   | Needed for 1.0                           |
| `later`  | Wanted, low priority. Can come after 1.0 |
| `future` | Optional. Only if a real need appears    |

## Feature statuses

| Status        | Meaning                     | Set by              |
| ------------- | --------------------------- | ------------------- |
| `idea`        | Brainstormed                | `/shape`            |
| `refined`     | Acceptance items are agreed | `/grill`            |
| `in-progress` | Work has started            | `/implement`        |
| `done`        | Merged                      | `/implement`        |
| `dropped`     | Decided not to build        | `/grill`, `/triage` |

- An `idea` has a description, a priority and dependencies, and may have brainstorm notes in its progress file. When it becomes `refined`, the acceptance items replace the brainstorm notes.
- `/implement` sets `done` on the branch of the last pull request, so the status reaches `main` with the merge.
- A `dropped` feature stays in the list, so it is not suggested again. `/grill` and `/triage` set `dropped` only when you decide it, and write the reason under "Notes" in its progress file.

`passes: true` means that every acceptance item has a passing test. `/implement` sets it. When later work breaks a test and you decide to merge anyway, `/pr` sets `passes: false` for that feature. `/triage` then finds the `done` feature with `passes: false`, and recommends setting it back to `in-progress` with a task to fix the test.

## Issue labels

An issue has exactly one state label. Each skill replaces the state label before it:

| State label        | Meaning                         | Set by                    |
| ------------------ | ------------------------------- | ------------------------- |
| `needs-triage`     | New, not checked yet            | Issue templates, `/shape` |
| `ready-to-refine`  | Checked and accepted            | `/triage`                 |
| `refined`          | Acceptance items are agreed     | `/grill`                  |
| `in-progress`      | Work has started                | `/implement`, `/pr`       |
| `needs-info`       | Waiting for the reporter        | `/triage`, `/grill`       |
| `moved-to-feature` | The work continues in a feature | `/grill`                  |
| `wontfix`          | Will not be done, and closed    | `/triage`                 |

`/pr` sets `in-progress` again when it reopens a closed issue because its test broke.

The other labels:

| Label         | Meaning                       | Set by                               |
| ------------- | ----------------------------- | ------------------------------------ |
| `bug`         | Category: something is broken | Issue templates, `/shape`, `/triage` |
| `enhancement` | Category: a small change      | Issue templates, `/shape`, `/triage` |
| `priority: …` | See "Priorities"              | `/shape`, `/triage`                  |

An issue that is really a new feature is moved by `/grill`: the new feature gets a `fromIssue` field, and the issue gets a comment "Moved to FEAT-xxx". The last pull request of an issue's plan, or of a feature with `fromIssue`, says "Closes #xxx", so the merge closes the issue.

**Issue ids:** in skills, files, `dependsOn` and test names, an issue is written `ISSUE-xxx`, where `xxx` is its number on GitHub. Only "Closes #xxx" in a pull request uses the GitHub form, because GitHub needs it to close the issue.

**Dependencies:** a feature lists them in `dependsOn` in `docs/features.json`, and an issue in the "Depends on" section of its body. Both can name features and issues. A feature there is finished when it is `done`, and an issue when it is closed.

## Notes in "Next step"

Some skills leave a note at the start of "Next step" in a progress file. The next skill to run depends on it:

- "Grill again before continuing: ..." is left by `/shape` when new work changes a feature. Run `/grill`.
- "Plan again: ..." is left by `/grill` or `/design-it-twice` when acceptance items or the design changed. Run `/design-it`.

`/implement` stops when it finds either note.

## Tests

Each acceptance item has at least one test whose name starts with the feature or issue id, for example `FEAT-010: sorts numbers by value` or `ISSUE-xxx: keeps the header line after a resize`. Layout items use browser tests, speed items use the benchmark, and everything else uses unit tests.

## Files

- `docs/features.json`: the index of all features.
- `docs/progress/README.md`: project-wide decisions, and the template for progress files.
- `docs/progress/FEAT-xxx.md` and `docs/progress/ISSUE-xxx.md`: one file per feature or refined issue, with brainstorm notes, acceptance items, the plan and the progress.
- `.github/ISSUE_TEMPLATE/`: the bug and change templates for new issues.
- `.claude/skills/`: the skills.
