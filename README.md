# TM R&D Holiday Planner

Holiday planner application for TM R&D built on the MEAN stack:
- MongoDB
- Express.js
- Angular
- Node.js

## What This Repo Contains
- [requirements.md](/Users/kengcc/codes/naveen_training/requirements.md) - product scope and functional requirements
- [roadmap.md](/Users/kengcc/codes/naveen_training/roadmap.md) - delivery plan grouped into `Now`, `Next`, and `Later`
- [plan.md](/Users/kengcc/codes/naveen_training/plan.md) - implementation plan with phase-by-phase execution details
- `backend/` - Express + Node.js API scaffold with MongoDB models
- `frontend/` - Angular application scaffold and feature placeholders

## Current Status
The repository is scaffolded and ready for implementation. The current focus is:
1. Authentication and access control
2. Holiday request creation and tracking
3. Manager approval workflow
4. Leave balance updates and team visibility

## Project Structure
```text
.
├── backend/
├── frontend/
├── plan.md
├── roadmap.md
├── requirements.md
└── README.md
```

## Backend Scaffold
The backend is organized around:
- API bootstrap and health check
- MongoDB connection handling
- Core domain models
- Route shells for auth, holidays, and admin functions

## Frontend Scaffold
The frontend includes placeholders for:
- App shell
- Core models and services
- Feature areas for login, dashboard, requests, calendar, and admin reporting

## Suggested Next Step
Install dependencies and implement the first vertical slice:
1. Authentication
2. Holiday request creation
3. Manager approval

## Notes
- The current frontend is a scaffold, not a fully generated Angular CLI project yet.
- The backend model layer is ready for feature implementation but does not yet include business logic.
