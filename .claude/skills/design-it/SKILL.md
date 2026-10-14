---
name: design-it
description: Plan how to build one refined feature or issue. Reads the code, splits the work into pull requests and tasks, and plans the tests. Writes the approved plan to the progress file.
argument-hint: 'FEAT-xxx | ISSUE-xxx'
disable-model-invocation: true
---

# Plan a feature or an issue

The argument is "$ARGUMENTS".

The result is an approved plan in the progress file: the pull requests, their tasks, and the tests. `/implement` follows this plan.

## Start

DESIGN-01 The argument must be one of these, otherwise say what is wrong and stop:

- the full id of a feature in `docs/features.json` with the status `refined` or `in-progress`, for example `FEAT-010`
- an open GitHub issue as `ISSUE-xxx`, whose file `docs/progress/ISSUE-xxx.md` has acceptance items

DESIGN-02 Read the progress file `docs/progress/FEAT-xxx.md` or `docs/progress/ISSUE-xxx.md`. Also read `docs/progress/README.md`. If a plan exists and "Next step" does not start with "Plan again", say so and stop.

DESIGN-03 Launch a subagent to find the code and the existing tests that the work touches, and read them. Follow a design chosen with `/design-it-twice` under "Notes".

## Plan

DESIGN-04 Split the work into pull requests. Each pull request gives a usable and tested result. Small tasks go together, and a task too big for one pull request is split. For a re-plan, only the pull requests that are not merged change.

DESIGN-05 For each pull request, show what it delivers, its tasks, the acceptance items it covers, and the tests: which kind for which item (unit test, browser test or benchmark). Then show the existing tests that may need to change, the risks, and the open points.

DESIGN-06 If a part can be built in two really different ways, design it twice in this session: follow TWICE-04 to TWICE-07 from `.claude/skills/design-it-twice/SKILL.md` for that part. Then continue the plan with the chosen design.

DESIGN-07 Change the plan until the user approves it.

## Result

DESIGN-08 After approval, write the pull requests and their tasks to the progress file, as in the template in `docs/progress/README.md`, and the first task under "Next step", without a "Plan again" note. Write a design chosen in DESIGN-06 under "Notes", and the other design under "Rejected approaches" with the reason.

DESIGN-09 Do not write code, do not change the status, and do not commit.

DESIGN-10 The final reply gives the feature id or the issue, the pull requests with their tasks, and the next step: `/implement`.
