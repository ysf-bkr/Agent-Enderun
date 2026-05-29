# Manager Authority Audit & Enforcement Guidelines

**Version:** 1.0  
**Owner:** @manager  
**Last Updated:** 23 May 2026

## Purpose

This document establishes a formal **Manager Authority Audit & Enforcement System** to ensure that @manager maintains unbreakable centralized control over all specialist agents in kurumsal (enterprise) projects.

Even though strong rules exist in individual agent files, without a systematic audit and enforcement mechanism, control can degrade over time. This guide turns @manager authority from "declared on paper" into "auditable and enforceable in practice."

## Why This Is Necessary

From the agent control audit (23 May 2026):

- @backend, @frontend, @analyst, and @explorer have partial governance rules, but enforcement is inconsistent.
- @git, @mobile, and @native have almost no @manager control defined.
- Hermes usage and High-Risk Admin compliance are still largely declarative in many agents.
- Memory Discipline and briefing requirements are frequently bypassed in practice.

Without regular auditing and clear enforcement, the "Single Point of Authority" and "Zero Tolerance" principles lose effectiveness.

## Core Principles

1. **@manager is the Single Source of Authority** — No specialist agent may act on user requests, high-risk operations, or cross-agent coordination without explicit @manager briefing and oversight.
2. **Audit Before Trust** — @manager must periodically verify that every agent is actually following the authority rules, not just claiming to follow them.
3. **Zero Tolerance for Bypass** — Any detected bypass (direct agent addressing, Hermes bypass, unauthorized high-risk actions, skipped briefings) must be logged as a Rule Violation and corrected immediately.
4. **Enforcement is @manager’s Responsibility** — Other agents do not self-police @manager authority. Only @manager can audit and enforce.

## Manager Authority Audit Checklist (Mandatory Every 1–2 Weeks)

@manager must run this audit regularly and record results in `PROJECT_MEMORY.md` under a dedicated section.

### 1. Entry Point Control
- [ ] Did every user message in the last period first go through @manager?
- [ ] Were there any cases where a specialist agent responded directly without briefing?
- [ ] Were direct calls to @backend / @frontend / @analyst etc. immediately intercepted?

### 2. Hermes Protocol Compliance
- [ ] Are all inter-agent communications using `send_agent_message` + proper `from`/`to`/`traceId`?
- [ ] Are recipients consistently calling `update_agent_message_status` after acting?
- [ ] Are there any cases of agents giving instructions to each other without Hermes?

### 3. High-Risk Administrative Actions
- [ ] Were all high-risk operations (user/permission management, purge, system config, RBAC, etc.) preceded by explicit @manager briefing and `managerApproval`?
- [ ] Was the full audit trail (previousState + newState + Trace ID + actor) written?

### 4. Memory & Logging Discipline
- [ ] Did every agent call both `update_project_memory` and `log_agent_action` at the end of their sessions?
- [ ] Did @manager perform the Memory Audit responsibility for other agents?

### 5. Briefing Quality & Enforcement
- [ ] Did every task distributed by @manager include clear risk assessment, continuity requirements, and success criteria?
- [ ] Were growth tasks assigned to agents showing repeated weaknesses?

### 6. Agent-Specific Control Gaps
- [ ] @backend: High-risk endpoints and Hermes usage verified?
- [ ] @frontend: High-risk admin UI patterns + Hermes integration verified?
- [ ] @analyst: QA gate enforcement and escalation to @manager verified?
- [ ] @explorer: Proactive risk reporting via Hermes verified?
- [ ] @git: High-risk commits only with @manager approval?
- [ ] @mobile / @native: Any work done without @manager briefing?

## Enforcement Mechanisms

When a violation is detected, @manager must apply the following in order:

1. **Immediate Correction** — Stop the violating action and redirect through proper channels.
2. **Violation Logging** — Record in `PROJECT_MEMORY.md` HISTORY as:
   - “Rule Violation - [Type]” (e.g., “Hermes Bypass”, “Unauthorized High-Risk Action”, “Direct Agent Response”)
3. **Agent Coaching** — Assign a targeted growth task to the violating agent.
4. **Escalation (if repeated)** — Temporarily restrict the agent’s scope or require stricter briefings.
5. **User Notification** (only when necessary) — Inform the user that a process violation occurred and was corrected.

## Integration with Risk Tracking Dashboard

This authority system directly supports the closure of multiple risks:

- Lack of Reference Application
- @frontend Weakness
- Hermes “On Paper”
- Lack of Real-world Usage

Every time a reference application or major task is executed, @manager must run an Authority Audit and record findings.

## Recommended Cadence

- **Light Audit**: Every session (quick mental check + log if violation seen)
- **Full Authority Audit**: At least once per week or at the end of every major phase/task
- **Deep Audit**: Before closing any risk item in the Risk Tracking Dashboard

## Related Documents

- `.enderun/agents/manager.md` → Mandatory @manager Behavioral Rules for Enterprise Projects + Hermes Communication Mandate
- `.enderun/knowledge/hermes_live_test_guidelines.md`
- `.enderun/knowledge/frontend_professionalization_guidelines.md`
- `.enderun/knowledge/reference_application_guidelines.md`
- `docs/roadmap.md` → Risk Tracking Dashboard
- `PROJECT_MEMORY.md` → STRATEGIC ROADMAP + HISTORY

---

**This guideline is now part of the official agent knowledge base.** @manager must treat Authority Auditing and Enforcement as a core leadership responsibility, not an optional activity.
