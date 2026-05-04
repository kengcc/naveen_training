# Repository Guidelines

## Project Structure & Module Organization
This repository is a MEAN-style monorepo for the TM R&D holiday planner app. Keep the current structure predictable:

- `frontend/` for the Angular client
- `backend/` for the Express/Node API
- `backend/src/domain/` for pure business rules and value logic
- `backend/src/application/` for orchestration and use-case services
- `backend/src/infrastructure/` for repositories, persistence adapters, and integrations
- `backend/src/bootstrap/` for wiring and runtime composition
- `backend/test/` for automated tests
- `shared/` only if shared code is introduced later and is truly cross-cutting

Keep feature code grouped by domain, such as `holiday-request`, `approval`, `leave-balance`, and `auth`. Prefer small modules and explicit boundaries over broad utility folders.

## Build, Test, and Development Commands
Use the workspace scripts in the root `package.json` and the backend package scripts for development and testing.

- `npm install` to install dependencies
- `npm run dev:backend` to start the backend in watch mode
- `npm run start:backend` to run the backend without watch mode
- `npm run dev:frontend` to start the frontend scaffold
- `npm run test --workspace backend` to run backend unit tests
- `npm run test:coverage --workspace backend` to run coverage-gated backend tests

If new tooling is added, document the exact command in both this file and the root `README.md`.

## Coding Style & Naming Conventions
Use clear, modular conventions:

- TypeScript for Angular code
- ESM JavaScript for the backend unless the project is explicitly migrated
- 2-space indentation
- `camelCase` for variables, functions, and methods
- `PascalCase` for components, services, classes, and interfaces
- `kebab-case` for file names and Angular selectors, for example `holiday-request-form.component.ts`

Prefer small, focused modules. Keep business rules out of controllers, routes, and components. Use dependency injection and repository abstractions to keep application services testable.

Design and architecture guidance:
- Keep domain functions pure when possible.
- Put orchestration in application services, not in HTTP handlers.
- Use repositories or adapters for persistence, not direct database access from routes.
- Favor composition over inheritance.
- Keep side effects at the edges of the system.

## Testing Guidelines
The backend uses Node's built-in test runner. Add tests alongside implementation and keep behavior-focused coverage:

- Unit tests for domain rules, services, and validation
- Integration tests for API routes when they are introduced
- E2E tests for core user flows, especially request creation and approval

Use descriptive test names that state behavior, such as `creates a holiday request with valid dates`.

Coverage expectations:
- Aim for 100% line and function coverage on backend business modules when practical
- Keep branch coverage as high as possible, and avoid adding unreachable branches just to satisfy tools
- When branch coverage is difficult, prefer simplifying the code path rather than overfitting tests

Test structure expectations:
- Prefer tests that exercise public behavior rather than private internals
- Use in-memory adapters or fakes for application-service tests
- Keep pure domain tests isolated from Express and MongoDB

## Commit & Pull Request Guidelines
There is no Git history in this workspace to infer a commit style. Use short, imperative commit messages, for example `Add holiday request validation`.

Pull requests should include:

- A concise summary of the change
- Linked issue or requirement reference when available
- Screenshots or screen recordings for UI changes
- Notes on validation, testing, and any migration steps

## Security & Configuration Tips
Do not commit secrets, local environment files, or database credentials. Keep environment-specific values in `.env` files and document required variables when configuration is introduced.
