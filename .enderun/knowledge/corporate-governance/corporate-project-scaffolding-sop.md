# Corporate Enterprise Project Scaffolding SOP (for @manager)

**Version:** 1.1  
**Purpose**: This is the mandatory standard process that @manager must follow when a user initiates a new project with corporate, enterprise, or regulated characteristics.

**Core Philosophy**:  
Agent Enderun does **not** ship pre-built reference applications inside `apps/`.  
Our value is in internalizing governance standards into the agents so that we can **guide the user** to build correctly, step by step, from the very first file.

---

## Phase 0 – Discovery & Governance Baseline (Non-Negotiable First Step)

Before any code is written or any feature is discussed in detail:

1. **Load Corporate Governance Knowledge** (mandatory reads):
   - `branded-types-law.md`
   - `high-risk-actions-managerapproval.md`
   - `high-risk-security-modal-hermes-flow.md`
   - `audit-logging-standard.md`
   - `governance-baseline-briefing-template.md`
   - `audit-logging-standard.md` (when created)

2. **Assess Project Context**:
   - Does the project involve multiple users, roles, permissions, or privileged operations?
   - Is there any requirement for audit trails, compliance, or high-risk administrative actions?
   - Default assumption: Treat every new project as enterprise-grade unless the user explicitly states it is a simple internal prototype with no privileged actions.

3. **Establish the Governance Contract** (before any technical discussion):
   - Clearly communicate that the project will follow Agent Enderun corporate standards.
   - Introduce the non-negotiable pillars:
     - Branded Types for all domain identifiers
     - High-risk actions protected exclusively by `managerApproval` + Hermes coordination
     - Contract-first development (types before implementation)
     - Comprehensive audit logging for privileged operations
   - Obtain explicit user acknowledgment.

4. **Document the Baseline Decision** in `docs/architecture/decisions/`.

**Rule**: No feature work, no architecture discussion, and no delegation may begin until Phase 0 is complete and acknowledged.

---

## Phase 1 – Foundation Layer (Contracts Before Any Implementation)

1. **Create the Type System First** (`apps/backend/src/types`):
   - `brand.ts` – Generic `Brand<T, Name>` utility
   - `identifiers.ts` – `UserID`, `RoleID`, `ApprovalID`, `TraceID`, etc.
   - `approval.ts` – `ManagerApproval` and `HighRiskActionPayload`
   - `errors.ts` – DomainError base + concrete errors (including `HighRiskActionRequiresApprovalError`)
   - `user.ts` / `role.ts` – Core domain entities
   - `api-contracts.ts` – Initial request/response shapes for the first feature

2. **Initialize Contract Versioning**:
   - Create `apps/backend/contract.version.json` with proper MAJOR.MINOR version and hash.

3. **Brief Supporting Agents**:
   - Brief `@analyst` to establish contract integrity verification process.
   - Brief `@frontend` to create parallel type copies and the base Security Modal component.

**Strict Rule**: No backend route, no React component, and no database schema may be implemented until the relevant contracts are defined and approved by @manager.

---

## Phase 2 – High-Risk Governance Infrastructure (Before Any Privileged Feature)

If the project will contain user/role management, configuration changes, or any privileged operations:

1. Design and document the complete `managerApproval` validation flow with `@backend`.
2. Design and implement the Security Modal + Hermes briefing user flow with `@frontend`.
3. Ensure both specialist agents have explicit instructions in their briefings referencing the corporate governance knowledge files.
4. Verify that `@backend` will reject any high-risk request lacking the proper payload, and that `@frontend` will never bypass the modal.

Only after these two infrastructure layers exist may actual feature development for privileged areas begin.

---

## Phase 3 – Feature Development Under Strict Governance

When delegating any work to `@backend` or `@frontend`:

The briefing message **must** include:
- Exact path to the contract types for this feature.
- Classification of whether the feature contains high-risk actions.
- Explicit references to the relevant files in `.enderun/knowledge/corporate-governance/`.
- Requirement to notify @manager before implementing any high-risk path.
- Mandate to produce ADR documentation for any new governance decisions.

After delivery:
- Require `@analyst` to perform contract alignment verification.
- Require documentation of the implementation in the project’s decision records.

---

## Phase 4 – Continuous Enforcement & Education

- At the start of every session, re-read the corporate governance knowledge files.
- Any proposal to “add governance later” or bypass standards must be treated as a process violation and rejected.
- @manager is responsible for continuously educating the user and the specialist agents on the standards throughout the lifetime of the project.

---

**This SOP is the primary mechanism by which Agent Enderun scales enterprise discipline without shipping example code.**
