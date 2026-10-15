# Wide React Table

A reusable React table component for exploring datasets with hundreds of columns.

The project investigates how to keep wide tables responsive and practical while providing a simple API for React applications.

The library ships its own UI, such as menus, popups and panels, with CSS that apps can override. It is not a headless library.

## Status

Work in progress. All features, with their priority and status, are listed in [docs/features.json](docs/features.json).

## Browsers

Tested in Chrome, Edge and Safari. Firefox is not tested.

## Tech stack

React, TypeScript, Vite, Vitest (with browser mode and Playwright), React Testing Library, ESLint and Prettier.

## Project structure

- `src/lib/` contains the library. `src/lib/index.ts` is its public API, so anything consumers use must be exported there.
- `src/demo/` is a demo app that uses the library only through that public API.

## Workflow

Work on this project goes through Claude Code skills, from an idea to merged code. [docs/WORKFLOW.md](docs/WORKFLOW.md) describes the order of the skills and when to run them.

## Development

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Run linting:

```bash
pnpm lint
```

Check formatting:

```bash
pnpm format:check
```

Run unit tests:

```bash
pnpm test:run
```

Install the browsers for browser tests (Chromium and WebKit), once and after each Playwright update:

```bash
pnpm browsers:install
```

Run browser tests:

```bash
pnpm test:browser
```

Create a production build:

```bash
pnpm build
```
