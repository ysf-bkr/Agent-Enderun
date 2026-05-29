# Architecture Patterns & Data Fetching

## 1. UI Layout & Component Structure
- **Shared UI:** All atomic components (Button, Input, etc.) must be created in `apps/web/src/components/ui/` using **Panda CSS**.
- **Layouts:** Use wrapper layouts (`Shell`, `Workspace`) in `apps/web/src/components/layout/`. Every page must utilize these layouts to maintain consistency.
- **Procedural Continuity:** Never re-create an existing component. Search the `components/ui/` directory first.

## 2. Data Fetching & API (CRUD) Patterns
- **Repository Pattern:** Backend logic must be separated into service/repository layers. No direct DB calls in controllers.
- **Contract-First:** All API endpoints must use types imported from `apps/backend/src/types/`.
- **API Layer:** Frontend must use typed fetcher functions located in `apps/web/src/api/`.
- **Validation:** Use `zod` for request validation on the backend and response validation on the frontend.
- **Audit Logging:** Every mutation (POST/PUT/PATCH/DELETE) MUST trigger an audit log service call with the current Trace ID.
