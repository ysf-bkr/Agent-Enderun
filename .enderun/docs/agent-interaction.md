# Agent Interaction & Coordination

## Roles & Responsibility Matrix
| Component | Primary Owner | Secondary |
|---|---|---|
| `apps/backend/` | @backend | @analyst |
| `apps/web/` | @frontend | @analyst |
| `packages/shared-types/` | @backend | @frontend |
| `.enderun/PROJECT_MEMORY.md` | @analyst | All (History only) |

## Communication Protocol
1. **Trace ID:** `@manager` generates a unique task identifier for every work chain.
2. **Shared Types:** Backend and frontend must agree on the contract before implementation starts.
3. **Project Docs:** Scope and project-facing requirements are tracked in [project-docs.md](./project-docs.md).
4. **Project Memory:** `.enderun/PROJECT_MEMORY.md` is read at session start and updated after substantial work.

## State Machine
- **PHASE_0 (Discovery):** Clarify requirements and scope.
- **PHASE_1 (Architecture):** Define contracts and technical boundaries.
- **PHASE_2 (Development):** Implement approved features.
- **PHASE_3 (Integration):** Verify integration quality and compatibility.
- **PHASE_4 (Deployment):** Final delivery and release preparation.
