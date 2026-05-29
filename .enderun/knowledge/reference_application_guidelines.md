# Reference Application Guidelines

**Version:** 1.0  
**Owner:** @manager  
**Last Updated:** 23 May 2026

## Purpose

This document defines the official process and standards for creating a **Reference Application** (also called "showcase" or "demo app") inside the `apps/` directory.

The goal of a reference application is to **prove** that Agent Enderun’s governance, patterns, and tools actually work in a real project — not just on paper.

## When to Create a Reference Application

@manager should initiate a reference application in the following situations:

- The Risk Tracking Dashboard shows **"Lack of Reference Application"** as a top-priority open risk.
- The team needs to validate that new governance rules (especially Corporate CRUD Governance and Hermes) work end-to-end.
- A new major capability (e.g., advanced Hermes flows, complex admin patterns) needs to be demonstrated before being trusted in client projects.
- During Phase 1 or early Phase 2 when moving from theory to practice.

## Mandatory Requirements (Non-Negotiable)

Any reference application **must** demonstrate the following:

1. **Contract-First Development**
   - All types defined first in `apps/backend/src/types/`
   - `contract.version.json` maintained and verified

2. **Branded Types**
   - All IDs must be branded (e.g., `UserID`, `OrderID`)

3. **Normal CRUD + One High-Risk Administrative Action**
   - At least one standard domain entity with full CRUD
   - At least one high-risk admin operation (e.g., role change, bulk delete, system config) that strictly follows the `managerApproval` + audit pattern

4. **Hermes Protocol Usage**
   - At least one real inter-agent message flow (e.g., @backend → @analyst or @manager → @backend)
   - Proper use of `send_agent_message` + `update_agent_message_status`

5. **Corporate Governance Compliance**
   - All high-risk actions must go through @manager briefing and approval
   - Full audit logging with Trace ID, previousState/newState, and actor

6. **Framework Boundary Respect**
   - All code lives strictly inside `apps/`
   - No modifications to `framework-mcp/`, `.enderun/agents/`, or root framework files

7. **Professional Standards**
   - Error handling with DomainError hierarchy
   - Structured logging with Trace ID
   - Proper validation and rate limiting on sensitive endpoints

## Recommended Minimal Scope (Example)

A good starting reference application can be a **User Management** system with:

- Backend: Users (normal CRUD) + Admin role change (high-risk)
- Frontend: User list + detail + role change form (using official frontend blueprints)
- One Hermes message from backend to @analyst after role change

This scope is small enough to build quickly but rich enough to prove the most critical governance rules.

## Agent Responsibilities

- **@manager**: Owns the decision to start, creates the briefing, ensures governance compliance, updates Risk Tracking Dashboard and PROJECT_MEMORY.
- **@backend**: Implements backend with correct patterns and Hermes integration.
- **@frontend**: Uses official frontend blueprints and high-risk admin action patterns.
- **@analyst**: Reviews governance compliance and helps close the risk item.
- **@explorer**: Can be used for dependency analysis if the reference app grows.

## Rules

- Never create a reference application without an explicit @manager briefing.
- The reference app is **temporary and educational** — it is not a product.
- After the reference application successfully closes the "Lack of Reference Application" risk, it may be archived or replaced with a cleaner example.
- All work must be logged in HISTORY and the Risk Tracking Dashboard must be updated.

## Updating Risk Status

When a reference application is completed and accepted:

1. Update the Risk Tracking Dashboard in both `docs/roadmap.md` and `PROJECT_MEMORY.md`
2. Mark "Lack of Reference Application" as **Closed**
3. Record the achievement in the HISTORY section of PROJECT_MEMORY.md
4. Optionally create a short "Reference Application Walkthrough" under `docs/`

---

**This guideline is now part of the official agent knowledge base.** All agents must follow it when the creation of a reference application is discussed.
