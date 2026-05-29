# Corporate Project Kickoff Checklist

**Owner:** @manager  
**Audience:** Human user + all specialist agents

This checklist must be completed (and documented in `PROJECT_MEMORY.md`) at the very beginning of any corporate or enterprise-grade project.

---

## Phase 0 – Governance Alignment

- [ ] @manager has read all files in `.enderun/knowledge/corporate-governance/`
- [ ] User has been given the Governance Baseline Briefing
- [ ] User has explicitly acknowledged the corporate standards
- [ ] Decision recorded in `PROJECT_MEMORY.md` under "Critical Decisions"

## Phase 1 – Project Structure & Contracts

- [ ] `apps/backend/src/types` folder structure created
- [ ] Branded Types utility + core identifiers defined
- [ ] `ManagerApproval` and `HighRiskActionPayload` interfaces defined
- [ ] `contract.version.json` initialized
- [ ] @frontend has created matching type copies in `apps/web/src/types`
- [ ] @analyst has been briefed on contract integrity responsibility

## Phase 2 – High-Risk Governance Infrastructure (if privileged operations expected)

- [ ] High-risk validation logic designed for @backend
- [ ] Security Modal + Hermes briefing flow designed for @frontend
- [ ] Audit logging strategy defined (see audit-logging-standard.md)
- [ ] Domain Error hierarchy created (including `HighRiskActionRequiresApprovalError`)
- [ ] Both @backend and @frontend agents have received explicit briefings referencing the knowledge files

## Phase 3 – Tooling & Process

- [ ] @analyst has confirmed contract drift detection process
- [ ] Documentation ownership rule explained (all architecture decisions go to `docs/architecture/decisions/`)
- [ ] First ADR (Architecture Decision Record) created for governance baseline
- [ ] @manager has updated `PROJECT_MEMORY.md` with initial trace and active tasks

## Phase 4 – Team Alignment

- [ ] All active agents have loaded the latest versions of:
  - `branded-types-law.md`
  - `high-risk-actions-managerapproval.md`
  - `high-risk-security-modal-hermes-flow.md`
  - `audit-logging-standard.md`
  - `domain-error-handling-standard.md`
- [ ] @manager has confirmed that no specialist agent may begin implementation work until the above items are complete

---

**@manager Note**:  
Do not proceed to feature development until this checklist is fully completed and acknowledged by the user. Shortcuts at this stage create expensive technical debt later.

Mark items as done in `PROJECT_MEMORY.md` under a dedicated "Kickoff Checklist" section.
