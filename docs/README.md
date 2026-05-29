# Agent Enderun — Governance and Architecture Portal

This portal is the **Central Knowledge Source** for enterprise projects developed under the Agent Enderun framework. The project's architectural decisions, standards, and governance protocols are sealed here.

Unlike ordinary projects, Agent Enderun projects are built on a structure where AI agents operate autonomously but are bound by a rigid, human-authored constitution. This documentation is the **Immutable Guide** for both AI agents (Army) and human developers.

---

### 📋 Documentation Guide

#### [1. Architecture & Governance](architecture/)
*   **[Approval & High-Risk Workflows](architecture/approval-flows.md)**: Explains how tokens are generated, audited, and how high-risk actions (e.g., database deletion, privilege escalation) are sealed.

#### [2. Frontend Standards](frontend/)
*   **[Component Patterns](frontend/component-patterns.md)**: Zero-UI-Library policy, guide on how all components are hand-crafted and type-safe using Panda CSS.

#### [3. Backend Standards](backend/)
*   **[Error Handling](backend/error-handling.md)**: Professional error management hierarchy that does not leak to the front-end and is traceable in logs.

---

## 🛰️ Phase-Based Development Life Cycle
All projects must pass the following 5 phases sequentially and completely:

1.  **PHASE_0 (Discovery):** Tech-stack (`tech-stack.md`) sealed, risk analysis performed.
2.  **PHASE_1 (Architecture & Contract):** First, types and API contracts are written. Contracts must be approved before a single line of application code is written.
3.  **PHASE_2 (Core Development):** Backend and Frontend are built in parallel. Branded Types usage is mandatory.
4.  **PHASE_3 (Integration & Test):** @quality agent takes over. 80% Test Coverage threshold must be met before proceeding to the next phase.
5.  **PHASE_4 (Optimization & Deployment):** Security scans and performance tests are completed.

> **Agent Directive:** The documents under this folder define the operational boundaries of the agents. An agent cannot deviate from a rule defined here. If a rule needs to be updated, this can only be done with @manager approval and ADR registration.

**Version:** v0.9.1  
**Status:** Active Governance
