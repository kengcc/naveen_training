# Holiday Planner Roadmap

Roadmap for the TM R&D holiday planner app, organized into `Now`, `Next`, and `Later` delivery phases.

## Now

### Epic 1: Project Foundation
Build the MEAN stack foundation, shared conventions, and runtime plumbing.

Acceptance Criteria:
- The repository contains separate backend and frontend application structures.
- The backend can start as a Node.js + Express service.
- MongoDB connection handling is in place.
- Environment configuration is documented and separated from source code.
- Core entities are defined for users, holiday requests, leave balances, approvals, notifications, and audit logs.
- A health check endpoint is available for basic service verification.

### Epic 2: Authentication and Access Control
Implement secure sign-in and role-based access for employee, manager, and admin users.

Acceptance Criteria:
- Users can authenticate securely.
- User roles are enforced on protected routes.
- Unauthorized access is rejected with clear error responses.
- Password handling follows secure storage practices.
- The frontend has a login entry point and basic authenticated session flow.

### Epic 3: Holiday Request Lifecycle
Deliver the core request flow for employees to create and manage holiday requests.

Acceptance Criteria:
- Employees can create a holiday request with start date, end date, reason, and status.
- Users can view their own pending and past requests.
- Users can edit or cancel requests that are still eligible for change.
- Request validation prevents invalid date ranges and incomplete submissions.
- The frontend provides a request form and request list view.

## Next

### Epic 4: Approval Workflow and Notifications
Enable manager review, approval history, and request status notifications.

Acceptance Criteria:
- Managers can view requests requiring action.
- Managers can approve or reject holiday requests.
- Approval decisions are recorded in an approval history.
- Request status changes are visible to the requester.
- Notifications are created when request status changes.

### Epic 5: Leave Balance Tracking
Track entitlement, usage, and pending leave balance for each employee.

Acceptance Criteria:
- Each user has a leave balance record.
- Available, used, and pending leave values are visible to the user.
- Approving a request updates leave usage correctly.
- Cancelling or rejecting a request adjusts pending or used balance as appropriate.
- Balance updates remain consistent with request status changes.

### Epic 6: Team Calendar and Search
Add visibility into team absences and support discovery of holiday requests.

Acceptance Criteria:
- Users can view team holiday availability in a calendar-oriented view.
- Overlapping absences are visible.
- Holiday requests can be searched by user, status, date range, or team.
- Managers can filter requests needing action.
- The frontend supports calendar and search/filter interactions.

## Later

### Epic 7: Reporting and Audit
Provide admin reporting and auditability for holiday usage and system changes.

Acceptance Criteria:
- Admin users can view summary reports for holiday usage.
- Key actions are written to an audit log.
- Reports can be filtered by date range, team, or status.
- Audit data includes the actor, action, entity type, and timestamp.

### Epic 8: Quality, Scale, and UX Improvements
Strengthen reliability, usability, and maintainability for production use.

Acceptance Criteria:
- The application handles common usage efficiently.
- API validation and error handling are consistent across endpoints.
- Leave balance updates are protected against inconsistent writes.
- The UI is responsive on desktop and tablet screens.
- The codebase remains modular and maintainable as features grow.

## Delivery Notes
- `Now` focuses on the smallest useful product: foundation, login, and request creation.
- `Next` adds workflow depth: approvals, balances, and calendar discovery.
- `Later` covers operational maturity: reporting, auditing, and hardening.

