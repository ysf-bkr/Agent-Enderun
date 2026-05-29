# First 30 Days Corporate Project Management Guide (@manager)

**Purpose**: A practical playbook for @manager covering the critical first 30 days of any new corporate/enterprise project. It combines the Scaffolding SOP, checklists, and briefings into a day-by-day and week-by-week operating rhythm.

---

## Week 0 – Project Initiation (Days 1–3)

### Day 1 – Governance Baseline
- Deliver the **Governance Baseline Briefing** (use `governance-baseline-briefing-template.md`)
- Walk the user through the **Corporate Project Kickoff Checklist**
- Get explicit acknowledgment of the standards
- Record the decision in `PROJECT_MEMORY.md`

### Day 2 – Team Alignment
- Brief all active agents using `corporate-project-scaffolding-sop.md`
- Assign initial responsibilities:
  - @backend: Type foundation
  - @frontend: Type copies + modal skeleton
  - @analyst: Contract verification process
- Create the first Architecture Decision Record (ADR) for governance baseline

### Day 3 – Foundation Kickoff
- Officially start **Phase 1** (Contract Foundation)
- Set up the first Hermes channels and trace ID convention

---

## Week 1 – Foundation Layer

**Primary Focus**: Contracts before code.

**Key Activities**:
- Ensure `branded-types-law.md` and core identifiers are implemented
- `ManagerApproval` and `HighRiskActionPayload` are defined
- `contract.version.json` is initialized
- @frontend has matching type copies
- First version of `domain-error-handling-standard.md` is in place

**@manager Checkpoints** (end of Week 1):
- [ ] All Phase 1 items from Kickoff Checklist completed
- [ ] User has seen the type foundation
- [ ] No feature implementation has started yet

---

## Week 2 – High-Risk Infrastructure

**Primary Focus**: Build the protection layer before any privileged features.

**Key Activities**:
- @backend designs high-risk validation logic
- @frontend builds `HighRiskSecurityModal` + Hermes briefing hook
- Audit logging strategy is defined
- Reference: `high-risk-action-approval-flow-simulation.md`

**@manager Checkpoints** (end of Week 2):
- [ ] High-risk endpoint pattern approved
- [ ] Security modal + Hermes flow reviewed
- [ ] Audit logging approach signed off

---

## Week 3 – First Real Features (Under Strict Governance)

Only after Weeks 1–2 are complete:

- Begin implementing the first non-privileged features using proper contracts and typed errors
- First privileged feature may only start after infrastructure from Week 2 is approved
- Use `backend-high-risk-endpoint-guide.md` and `frontend-high-risk-modal-guide.md` as implementation references

---

## Week 4 – Reinforcement & Early Habits

**Focus**: Make governance second nature.

**Activities**:
- Run the first **Contract Drift** simulation exercise with the team (`contract-drift-detection-simulation.md`)
- Review the first audit logs of any privileged actions
- Conduct a mid-project governance retrospective
- Update `PROJECT_MEMORY.md` with lessons learned

---

## Ongoing Rhythm (After Day 30)

- Every new feature involving users, roles, permissions, or configuration → Re-read relevant governance files
- Every contract change → @analyst verification + Hermes notification
- Every high-risk action in production → Review the approval + audit trail
- Monthly: Light governance health check using the Kickoff Checklist as a template

---

## Anti-Patterns in the First 30 Days

- Starting feature coding before governance baseline is acknowledged
- Promising “we’ll add controls later”
- Letting @backend or @frontend implement high-risk logic without @manager approval of the pattern
- Skipping documentation of governance decisions

---

## Reference Documents (Read in Order)

1. `corporate-project-scaffolding-sop.md`
2. `corporate-project-kickoff-checklist.md`
3. `governance-baseline-briefing-template.md`
4. `manager-first-three-briefings.md`
5. `corporate-governance-playbook.md`

This 30-day guide replaces ad-hoc project starts with a disciplined, repeatable process.
