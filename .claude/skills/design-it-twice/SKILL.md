---
name: design-it-twice
description: Design two different high-level solutions for one refined feature or issue, or for one of its tasks, based on the existing code. The user chooses one, and the skill records the choice and updates the tasks.
argument-hint: 'FEAT-xxx | ISSUE-xxx'
disable-model-invocation: true
---

# Design a feature or an issue twice

The argument is "$ARGUMENTS".

Use this for a feature, an issue, or one of its tasks where the way to build it is not clear. The result is a chosen design that `/design-it` and `/implement` follow.

## Start

TWICE-01 The argument must be one of these, otherwise say what is wrong and stop:

- the full id of a `refined` or `in-progress` feature in `docs/features.json`, for example `FEAT-010`
- an open GitHub issue as `ISSUE-xxx`, whose file `docs/progress/ISSUE-xxx.md` has acceptance items

TWICE-02 Read the progress file `docs/progress/FEAT-xxx.md` or `docs/progress/ISSUE-xxx.md`. Also read the "Project-wide decisions" in `docs/progress/README.md`, and the features that depend on this one in `docs/features.json`.

TWICE-03 If the file has a plan, show a numbered list in plain text: "1. The whole feature" (or issue), then each open task. The user answers with a number. The numbers are only for this answer and are not written anywhere. Without a plan, the scope is the whole feature or issue.

TWICE-04 Analyse the code that the work touches. Launch a subagent to find it, and read the parts the designs depend on: components, hooks, types and the public API in `src/lib/index.ts`.

## Designs

TWICE-05 Create two designs that differ in their main idea, not in details:

1. From the code analysis, name the design question with the biggest effect, and its two answers. Show them to the user, and change them until the user agrees.
2. Let two subagents create one design each. Each starts from one answer and does not see the other design.
3. If the two designs still share the main idea, let the second subagent try again, and tell it not to use that idea.

Create a third design only when the user asks for it.

TWICE-06 For each design, show:

- the main idea in a few sentences
- a small sketch: the component tree change, the main types, or the data flow
- how it meets each acceptance item
- the effect on the public API
- the speed and memory effect for the scale goal in "Project-wide decisions" in `docs/progress/README.md`
- what it makes easier or harder for the features that depend on this one
- the risks

TWICE-07 Compare both designs in a table and give your recommendation with the reason. The user chooses one design, or a mix.

## Result

TWICE-08 After the choice, show what will change, and ask the user to approve it. Then, in the progress file:

- write the chosen design under "Notes", and the other design under "Rejected approaches" with the reason
- without a plan: nothing more. `/design-it` uses the chosen design when it plans.
- with a plan and the whole feature or issue as the scope: add at the start of "Next step": "Plan again: the design changed."
- with one task as the scope: replace that task, inside its pull request group, by one or more new tasks

If the chosen design needs other acceptance items, refine them in this session: follow GRILL-03 to GRILL-12 from `.claude/skills/grill/SKILL.md`.

TWICE-09 Do not write code, do not change the status, and do not commit.

TWICE-10 The final reply gives the feature id or the issue, the scope, and the chosen design in one sentence.
