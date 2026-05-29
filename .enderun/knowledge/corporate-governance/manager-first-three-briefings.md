# @manager – First Three Critical Briefings (Templates)

This document provides ready-to-adapt briefing content that @manager should deliver in the early stages of any corporate/enterprise project.

---

## Briefing 1: Governance Baseline (Day 0 / Project Kickoff)

**Audience:** User + all active agents

**Key Message:**

Before we write a single line of feature code, we must lock in the governance foundation.

We will follow these non-negotiable standards:
- Branded Types for every identifier
- High-risk actions protected by explicit `managerApproval` + Hermes flow
- Contract-first development
- Proper audit logging for all privileged operations
- Typed Domain Errors instead of generic exceptions

These rules exist to protect the project from technical debt, security holes, and audit failures at scale.

I will personally enforce these standards in every briefing and delegation. If we encounter pressure to “skip governance for speed”, we will slow down instead.

Do you accept these terms as the operating rules for this project?

---

## Briefing 2: Contract & Type Foundation (After User Accepts Governance)

**Audience:** @backend + @frontend + @analyst

**Key Message:**

We will now establish the single source of truth for all types.

1. Create `apps/backend/src/types` with:
   - Branded type utility
   - Core identifiers (UserID, RoleID, ApprovalID, etc.)
   - `ManagerApproval` and `HighRiskActionPayload`
   - Initial domain entities and API contracts

2. Initialize `contract.version.json`.

3. @frontend will immediately create matching type copies.

4. No routes, no components, and no database work may begin until this foundation is approved by me.

@analyst will be responsible for detecting any future contract drift.

---

## Briefing 3: High-Risk Infrastructure (Before Any Privileged Feature)

**Audience:** @backend + @frontend

**Key Message:**

If this project will contain user/role management, configuration changes, or any privileged operations, we must build the governance infrastructure **before** implementing those features.

Required deliverables:

**@backend:**
- High-risk endpoint validation logic that rejects requests missing `isHighRiskAdminAction` + valid `managerApproval`.
- Audit logging integration for every privileged action (see audit-logging-standard.md).

**@frontend:**
- Reusable `HighRiskSecurityModal` component.
- Hermes briefing flow that collects a reason and only then dispatches the approved request.

Only after these two layers are in place and tested may we begin implementing actual privileged user stories.

---

**Usage for @manager:**
- Copy and adapt these briefings at the appropriate moments.
- Always reference the exact knowledge files in `.agents/knowledge/corporate-governance/`.
- Document the user’s and agents’ acknowledgments in `PROJECT_MEMORY.md`.
