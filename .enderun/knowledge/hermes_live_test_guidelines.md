# Hermes Live Test Guidelines

**Version:** 1.0  
**Owner:** @manager  
**Last Updated:** 23 May 2026

## Purpose

This document defines the official **Hermes Live Test Program** to close the risk item **"Hermes 'On Paper'"** in the Risk Tracking Dashboard.

Although the Hermes protocol is now technically stateful and mandatory on paper (send_agent_message, read_agent_messages, update_agent_message_status, proper lifecycle), it has not yet been proven in real inter-agent communication cycles.

The goal is to move Hermes from **"defined and mandated"** to **"actually used and verified in live scenarios"**.

## Current Risk Status (23 May 2026)

- **Risk Name:** Hermes “On Paper”
- **Previous Progress:** %70 (protocol made stateful + mandatory in all agents)
- **Current Gap:** No real, end-to-end live message flows have been executed and verified between agents in a working context.
- **Risk Severity:** Orta (but blocking full autonomous orchestration claim)

## Minimum Required Live Test Scenarios

To consider the Hermes protocol "live and proven", the following scenarios **must** be successfully executed and documented:

### 1. Basic Delegation Flow (Manager → Specialist)
- @manager sends a DELEGATION message to @backend (or @frontend) with a clear task.
- Recipient agent reads the message via `read_agent_messages`.
- Recipient performs the work.
- Recipient calls `update_agent_message_status` to mark it as `ACKNOWLEDGED` then `COMPLETED`.
- @manager verifies the status update.

### 2. High-Risk Administrative Action Coordination
- A high-risk admin action (e.g., user role change) is triggered.
- @manager sends a Hermes message containing `managerApproval` object to the relevant agent (@backend or @frontend).
- The receiving agent only proceeds after confirming the message and approval.
- After execution, the agent sends a completion message back to @manager (or @analyst) with audit summary.
- Full lifecycle is used: PENDING → READ → ACKNOWLEDGED → COMPLETED.

### 3. Conflict Resolution / Negotiation Flow
- @analyst rejects a task from @frontend or @backend.
- @manager intercepts and initiates negotiation using `send_agent_message` (category: ACTION or DELEGATION).
- The implementing agent justifies the deviation.
- @analyst responds via Hermes.
- If resolved, status is updated to COMPLETED. If not, escalation to user is triggered after max 3 rejections.

### 4. Cross-Agent Information Sharing (Explorer / Analyst → Others)
- @explorer finishes a research task and proactively sends findings (especially high-risk areas) to @manager and/or @backend via Hermes.
- Recipients acknowledge receipt and act on the information (e.g., update plans or create growth tasks).

## Acceptance Criteria (Risk Closure)

The "Hermes On Paper" risk can be closed only when **all** of the following are true:

- At least the 4 scenarios above have been executed in a real context (preferably inside the reference application).
- Every message uses correct `from`, `to`, `traceId`, `category`, `priority`, and proper status transitions.
- `update_agent_message_status` is called by the recipient after action.
- All flows are logged in HISTORY and visible in PROJECT_MEMORY.md.
- @manager can demonstrate during a session that Hermes is actively used instead of direct text instructions.
- The pattern is documented with real message examples in the knowledge base.

## @manager Responsibilities

@manager is the owner of the Hermes Live Test Program and must:

- Plan and orchestrate the live test scenarios (especially during reference application development).
- Ensure every briefing that involves inter-agent work includes Hermes usage instructions.
- Verify that agents are actually calling `send_agent_message` and `update_agent_message_status` instead of bypassing the protocol.
- Record successful live flows in the Risk Tracking Dashboard and HISTORY.
- Treat repeated Hermes bypass as a serious process violation.

## Recommended Execution Order

1. Implement the 4 core scenarios during the creation of the reference application.
2. Use the reference app as the first real proving ground.
3. Document at least one complete example of each scenario with actual message content.
4. Once all scenarios pass, update the Risk Tracking Dashboard to "Closed".

## Related Documents

- `.enderun/knowledge/hermes_protocol.md` (original protocol definition)
- `.enderun/agents/manager.md` → Hermes Communication Mandate section
- `.enderun/knowledge/frontend_professionalization_guidelines.md`
- `.enderun/knowledge/reference_application_guidelines.md`
- `docs/roadmap.md` → Risk Tracking Dashboard
- `PROJECT_MEMORY.md` → STRATEGIC ROADMAP

---

**This guideline is now part of the official agent knowledge base.** All agents must treat Hermes live testing as a mandatory step before claiming full autonomous orchestration capability.
