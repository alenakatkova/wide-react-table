# Progress

[docs/features.json](../features.json) is the index of all features: id, title, priority, status, passes, description and dependencies. `dependsOn` can name features (`FEAT-xxx`) and GitHub issues (`ISSUE-xxx`). A feature made from an issue has a `fromIssue` field with that issue, for example `"fromIssue": "ISSUE-xxx"`.

This folder has one file per feature, named by its id, and one file per refined issue, for example `ISSUE-xxx.md`. The file holds what the index does not: the brainstorm notes, the acceptance items, and the progress of the work.

A feature file never repeats the git history. Its goal is to pass on the progress and give context to the next session or programmer.

## Project-wide decisions

Decisions that apply to more than one feature.

- **Use:** a public npm library.
- **UI:** the library ships its own UI, such as menus, popups and panels, with CSS that apps can override. It is not headless.
- **Scale:** 500 columns x 100,000 rows. Initial render under 500ms, scrolling at about 60 frames per second on a normal laptop, search and filter results under 200ms.
- **Versioning:** 0.x versions until all core features are done. Breaking changes are allowed in 0.x. Then 1.0 with semantic versioning.
- **Accessibility:** the library's UI must meet WCAG 2.2 level AA. axe checks it in browser tests. Keyboard use is part of the acceptance items of each feature that adds UI.
- **Browsers:** tested in Chromium (Chrome, Edge) and WebKit (Safari). Firefox is not tested, because Playwright's Firefox hides scroll bars in a way that page CSS cannot change. The README says "Tested in Chrome, Edge and Safari. Firefox is not tested."

## Feature file template

The same template is used for an issue's file, `ISSUE-xxx.md`. An issue has no brainstorm notes, so its file starts at "Acceptance".

Leave out the sections that do not apply yet. An `idea` has only "Brainstorm notes". From `refined` on, "Acceptance" replaces them. "Tasks" comes from the plan, grouped by pull request.

```markdown
# FEAT-xxx Title

## Brainstorm notes

What was decided in brainstorming, before the feature is refined.

## Acceptance

- Statements that one automated test each can check. The test name starts with the feature id.

## Next step

What to do next. A new session reads this first to continue the work.

## Tasks

### PR 1: What this pull request delivers

- [x] A finished task
- [ ] **In progress:** a task that has started but is not finished

### PR 2: What this pull request delivers

- [ ] A task that has not started

## Notes

Decisions that are not acceptance items, for example which tool to use.

## Known problems

Problems found during the work. Before the feature is done, each one is fixed or moved to a GitHub issue.

## Rejected approaches

Approaches that were tried or considered and then not continued, each with the reason.
```
