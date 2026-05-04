# Repository Guidelines

## Project Structure & Module Organization
This repository currently contains a single source-of-truth document: [`requirements.md`](requirements.md). It defines the holiday planner scope for a MEAN stack application. As the codebase grows, keep the structure predictable:

- `client/` for the Angular frontend
- `server/` for the Express/Node API
- `shared/` for common DTOs, validation schemas, or utilities
- `tests/` for automated tests
- `assets/` for static images or design files

Keep feature code grouped by domain, such as `holiday-requests`, `approvals`, and `auth`.

## Build, Test, and Development Commands
No build or test tooling is committed yet. When the app is scaffolded, document the exact commands in this file and in the repository root README. Typical commands will likely include:

- `npm install` to install dependencies
- `npm run dev` to start local development
- `npm test` to run automated tests
- `npm run build` to create production artifacts

## Coding Style & Naming Conventions
Use clear, modular MEAN conventions:

- TypeScript for Angular and Node code
- 2-space indentation
- `camelCase` for variables, functions, and methods
- `PascalCase` for components, services, classes, and interfaces
- `kebab-case` for file names and Angular selectors, for example `holiday-request-form.component.ts`

Prefer small, focused modules. Keep business rules out of controllers and components.

## Testing Guidelines
No testing framework is defined yet. Add tests alongside implementation:

- Unit tests for services, validation, and business rules
- Integration tests for API endpoints
- E2E tests for core user flows, especially request creation and approval

Use descriptive test names that state behavior, such as `creates a holiday request with valid dates`.

## Commit & Pull Request Guidelines
There is no Git history in this workspace to infer a commit style. Use short, imperative commit messages, for example `Add holiday request validation`.

Pull requests should include:

- A concise summary of the change
- Linked issue or requirement reference when available
- Screenshots or screen recordings for UI changes
- Notes on validation, testing, and any migration steps

## Security & Configuration Tips
Do not commit secrets, local environment files, or database credentials. Keep environment-specific values in `.env` files and document required variables when configuration is introduced.
