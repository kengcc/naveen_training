# Holiday Planner App Requirements

## Scope
Build a holiday planner application for TM R&D using the MEAN stack:
- MongoDB for data storage
- Express.js for backend APIs
- Angular for the web client
- Node.js for server-side runtime

## Product Goals
1. Allow users to plan, request, and track holidays in one place.
2. Provide visibility into holiday balances, approvals, and team availability.
3. Support a simple, responsive web experience for employees and managers.

## Functional Requirements
1. User authentication and authorization
   - Users must be able to sign in securely.
   - The system must support role-based access such as employee, manager, and admin.

2. Holiday request management
   - Employees must be able to create holiday requests.
   - Users must be able to view, edit, and cancel pending requests.
   - Each request must include dates, duration, reason, and status.

3. Approval workflow
   - Managers must be able to approve or reject holiday requests.
   - The system must keep a history of approval actions.
   - Users must be notified when request status changes.

4. Holiday balance tracking
   - The system must track annual leave balances for each user.
   - Users must be able to view available, used, and pending leave.
   - Balances must be updated when requests are approved or cancelled.

5. Team calendar visibility
   - Users must be able to view team holiday calendars.
   - The system must show overlapping absences and unavailable periods.

6. Search and filtering
   - Users must be able to search holiday requests by name, status, date, or team.
   - Managers must be able to filter requests needing action.

7. Reporting and audit
   - Admins must be able to view summary reports for holiday usage.
   - The system must record key changes for audit purposes.

## MEAN Stack Requirements
1. MongoDB
   - Store users, holiday requests, approvals, leave balances, and audit logs.
   - Use appropriate indexes for common filters such as user, status, and date range.

2. Express.js
   - Provide RESTful API endpoints for authentication, requests, approvals, and reporting.
   - Validate all incoming request data.
   - Return clear error responses for client-side handling.

3. Angular
   - Build a responsive single-page application.
   - Use components, services, and routing to separate concerns.
   - Provide forms for request submission and dashboards for status tracking.

4. Node.js
   - Serve the backend application and business logic.
   - Handle asynchronous operations such as database access and notifications.

## Non-Functional Requirements
1. Security
   - Passwords must be stored securely.
   - Access to sensitive data must be restricted by role.

2. Performance
   - Common pages should load quickly under normal usage.
   - API responses should remain consistent and efficient.

3. Reliability
   - The system should avoid data loss during request updates.
   - Leave balance updates must be transactional where needed.

4. Usability
   - The UI should be easy to understand for employees and managers.
   - The app should work well on desktop and tablet screens.

5. Maintainability
   - The codebase should follow a modular MEAN architecture.
   - Business rules should be isolated from UI logic.

## Suggested Core Entities
- User
- Role
- HolidayRequest
- LeaveBalance
- ApprovalHistory
- Notification
- AuditLog

