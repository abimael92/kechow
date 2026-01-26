# Kechow Client Architecture

## Structure Overview

- `src/features/` holds domain features grouped by role and capability.
- `src/pages/` contains route-level screens that compose feature components.
- `src/shared/` provides reusable UI, layout, utilities, and composables.
- `src/app/` centralizes app configuration, routing, and state setup.

## Module Boundaries

- `app` owns cross-cutting concerns: config, routing, global state, and API setup.
- `features` own domain logic and UI by role or capability.
- `pages` compose feature components into route-level screens.
- `shared` contains framework-agnostic UI, utilities, composables, and mock data.

## Alias Usage

Use standardized aliases for new work:

- `@app` for `src/app`
- `@features` for `src/features`
- `@shared` for `src/shared`
- `@assets` for `src/assets`

Backward-compatible aliases remain available (`@components`, `@layout`,
`@pages`, `@store`) but should be avoided for new code.

## Role-Based Separation

- `customer`, `owner`, and `delivery` areas live under `src/features/` and
  `src/pages/` with routes grouped by role.
- Each role has dedicated views, containers, and supporting components to
  avoid cross-role coupling.

## Feature Rules

Each feature directory should expose:

- `components/` for UI building blocks scoped to the feature
- `containers/` when orchestration or data wiring is needed
- `types.ts` to export public types
- `services.ts` to export public service APIs

Avoid moving files for alignment unless a refactor is planned; add index exports
to expose stable entry points instead.

## Shared Layer Rules

`src/shared` should only contain:

- UI components, layout primitives, and icons
- composables and utilities
- shared types
- mock data (no feature logic)

## Security Boundaries

- Route access is enforced in `src/app/router/guards.ts` using auth state and
  role metadata on routes.
- Frontend guards provide UX gating; backend APIs must still enforce
  authorization for all protected data and actions.

## API Layer

All HTTP access should go through the single entry point in `src/app/lib/axios.ts`.
Direct client usage is allowed temporarily but should be marked for migration.
