# Project Scaffold Guidelines

**Version:** 1.0  
**Owner:** @manager  
**Last Updated:** 23 May 2026

## Purpose

This document defines the official process and standards for **creating a project scaffold** (initial folder and file structure) inside the `apps/` directory.

The goal is to move from "empty `apps/` folder" to a **minimal but meaningful project structure** that demonstrates Agent Enderun’s core principles in practice.

## When to Create a Project Scaffold

@manager should initiate a project scaffold in the following cases:

- The Risk Tracking Dashboard shows **"Lack of Reference Application"** as a top-priority open risk.
- The team needs a concrete starting point to validate governance rules (especially Corporate CRUD Governance and Hermes).
- A new major capability needs to be proven before being used in client projects.
- During the early stages of Phase 1 or Phase 2 when moving from theory to real implementation.

## Minimum Required Structure (Mandatory)

Any project scaffold created with Agent Enderun **must** include at least the following:

### Backend Structure (`apps/backend/`)
- `src/types/` → Branded types, models, API types
- `src/controllers/`
- `src/services/`
- `src/repositories/`
- `src/routes/`
- `src/errors/` → DomainError hierarchy
- `src/utils/`
- `package.json`, `tsconfig.json`

### Frontend Structure (`apps/web/`)
- `src/types/`
- `src/hooks/` → useListPage, useDetailPage, useFormPage, admin action hooks
- `src/components/ui/` → Shared components
- `src/pages/`
- `src/utils/`
- `package.json`, `tsconfig.json`, `vite.config.ts`

### Mandatory Principles to Demonstrate
1. **Contract-First** — Types defined first in `src/types/`
2. **Branded Types** — All IDs must be branded (e.g. `UserID`)
3. **Normal CRUD** — At least one entity with full create/read/update/delete
4. **One High-Risk Administrative Action** — Example: user role change with `managerApproval` + full audit
5. **Hermes Protocol Usage** — At least one real inter-agent message flow
6. **Audit Logging** — Every mutation must produce before/after state with Trace ID

## @manager Responsibilities

- Decide when a project scaffold is needed based on the Risk Tracking Dashboard.
- Create a formal briefing that defines the scope of the scaffold.
- Ensure the structure follows the guidelines in this document.
- Assign clear responsibilities to @backend and @frontend.
- After the scaffold is created, run an **Authority Audit** to verify compliance.
- Update the Risk Tracking Dashboard and `PROJECT_MEMORY.md` when the scaffold is accepted.

## Agent Responsibilities During Scaffolding

| Agent     | Responsibility |
|-----------|----------------|
| **@manager** | Owns the process, creates briefing, ensures governance |
| **@backend** | Creates backend structure + at least 1 normal CRUD + 1 high-risk admin endpoint |
| **@frontend** | Creates frontend structure using official blueprints + high-risk admin UI pattern |
| **@analyst** | Reviews the scaffold for governance compliance |
| **@explorer** | Can be used for dependency analysis if the structure grows |

## Rules

- Never create a project scaffold without an explicit @manager briefing.
- The scaffold must respect the **Framework vs User Project Boundary** (only work inside `apps/`).
- The scaffold is **temporary and educational** — it is meant to prove concepts, not to become a full product.
- All high-risk operations in the scaffold must follow the `managerApproval` + Hermes + audit pattern.
- After successful completion, update the Risk Tracking Dashboard to reflect progress on "Lack of Reference Application".

## Success Criteria

A project scaffold is considered successful when:

- The minimum folder structure (backend + web) is created.
- At least one normal CRUD flow and one high-risk admin operation exist.
- Hermes is used in at least one real message flow.
- The structure follows Contract-First + Branded Types.
- An Authority Audit has been performed and recorded.

## Related Documents

- `.enderun/knowledge/reference_application_guidelines.md`
- `.enderun/knowledge/frontend_professionalization_guidelines.md`
- `.enderun/knowledge/hermes_live_test_guidelines.md`
- `.enderun/knowledge/manager_authority_audit_enforcement.md`
- `docs/roadmap.md` → Risk Tracking Dashboard

---

**This guideline is now part of the official agent knowledge base.** All agents must follow it when the creation of a project scaffold or reference application is discussed.
