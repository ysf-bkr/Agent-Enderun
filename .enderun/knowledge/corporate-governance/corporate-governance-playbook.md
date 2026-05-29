# Corporate Governance Playbook

**Version**: 1.0  
**Purpose**: This is the single master reference that ties together all corporate governance standards for Agent Enderun. It provides navigation, summaries, and the recommended order of study for agents and teams.

---

## Core Philosophy

We do not ship pre-built applications.  
We internalize strong governance patterns into the agents so they can guide any corporate project correctly from the first day.

---

## Document Hierarchy

### Foundational Laws & Standards
| Document | Focus | Must Read By |
|----------|-------|--------------|
| `branded-types-law.md` | Compile-time safety for identifiers | All agents |
| `high-risk-actions-managerapproval.md` | Protection of privileged operations | All agents |
| `domain-error-handling-standard.md` | Typed, safe error system | @backend, @analyst |
| `audit-logging-standard.md` | Tamper-evident privileged action records | @backend, @analyst, @manager |

### UI & Coordination Patterns
| Document | Focus | Must Read By |
|----------|-------|--------------|
| `high-risk-security-modal-hermes-flow.md` | Frontend high-risk action handling | @frontend, @manager |
| `frontend-high-risk-modal-guide.md` | Concrete component + hook implementation | @frontend |

### Backend Implementation
| Document | Focus | Must Read By |
|----------|-------|--------------|
| `backend-high-risk-endpoint-guide.md` | Production-grade high-risk endpoint pattern | @backend |

### Process & Scaffolding
| Document | Focus | Must Read By |
|----------|-------|--------------|
| `corporate-project-scaffolding-sop.md` | Step-by-step process for new corporate projects | @manager (primary) |
| `corporate-project-kickoff-checklist.md` | Mandatory checklist at project start | @manager + team |
| `governance-baseline-briefing-template.md` | First-day briefing text | @manager |
| `manager-first-three-briefings.md` | Ready templates for early project phases | @manager |

### Simulations (Learning & Reference)
| Document | Focus |
|----------|-------|
| `corporate-project-kickoff-simulation.md` | Full multi-session project start example |
| `high-risk-action-approval-flow-simulation.md` | End-to-end high-risk action cycle |
| `contract-drift-detection-simulation.md` | How to detect and resolve contract drift |

### Analyst & Compliance
| Document | Focus |
|----------|-------|
| `analyst-contract-integrity-guide.md` | @analyst’s verification responsibilities and processes |

---

## Recommended Reading Order (for New Projects)

1. **@manager** (before anything else)
   - `corporate-project-scaffolding-sop.md`
   - `corporate-project-kickoff-checklist.md`
   - `governance-baseline-briefing-template.md`

2. **All Agents**
   - `branded-types-law.md`
   - `high-risk-actions-managerapproval.md`

3. **Specialist Agents**
   - @backend → `backend-high-risk-endpoint-guide.md` + `domain-error-handling-standard.md`
   - @frontend → `frontend-high-risk-modal-guide.md`
   - @analyst → `analyst-contract-integrity-guide.md`

4. **Simulations** (for deeper understanding)
   - Start with `corporate-project-kickoff-simulation.md`

---

## When to Reference This Playbook

- At the start of every new corporate project
- When any high-risk feature is being planned
- During contract changes
- When @analyst detects governance or contract issues
- During project retrospectives

---

**This playbook is the single source of truth for corporate governance in Agent Enderun.**
