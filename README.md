# Wide React Table

A reusable React table component for exploring datasets with hundreds of columns.

The project investigates how to keep wide tables responsive and practical while providing a simple API for React applications.

The library ships its own UI, such as menus, popups and panels, with CSS that apps can override. It is not a headless library.

## Status

Work in progress. All features, with their priority and status, are listed in [docs/features.json](docs/features.json).

## Tech stack

React, TypeScript, Vite, Vitest, React Testing Library, ESLint and Prettier.

## Project structure

- `src/lib/` contains the library. `src/lib/index.ts` is its public API, so anything consumers use must be exported there.
- `src/demo/` is a demo app that uses the library only through that public API.

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

Run tests:

```bash
pnpm test:run
```

Create a production build:

```bash
pnpm build
```
