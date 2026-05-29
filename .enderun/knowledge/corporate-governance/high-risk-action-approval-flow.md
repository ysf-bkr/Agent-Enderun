# High-Risk Action Approval Protocol

This protocol defines the non-negotiable process for executing high-risk operations (e.g., database schema changes, production environment configuration, user permission management, bulk data deletion) within the Agent Enderun framework.

## 1. Scope Definition
Any action that meets the following criteria is classified as "High-Risk":
- Modifies production database schema.
- Changes system-wide security policies or IAM permissions.
- Triggers destructive data operations (bulk delete, purge).
- Modifies production-level configuration files (e.g., `.env.prod`).

## 2. Mandatory Approval Flow

All high-risk actions MUST follow the "Three-Key" principle:

1. **Initiation:** The requesting specialist agent MUST brief `@manager` using the `send_agent_message` Hermes protocol, explicitly stating the intent and risk.
2. **Analysis:** `@manager` logs the intent to `.enderun/logs/manager.json` and updates `PROJECT_MEMORY.md` with a new Trace ID status: `PENDING_APPROVAL`.
3. **Quality/Security Gate:** `@manager` delegates the task to `@quality` via Hermes with a `SECURITY_AND_IMPACT_AUDIT` category.
   - `@quality` MUST run `analyze_procedural_continuity` and `security_audit_scan`.
   - `@quality` MUST issue a formal `APPROVAL` or `REJECTION` Hermes message back to `@manager`.
4. **Execution:** ONLY upon receiving an `APPROVAL` Hermes message, `@manager` is authorized to execute the action via internal tools.

## 3. Tool Enforcement (MCP)
- Specialists must NOT have direct MCP tool permissions for high-risk actions.
- These tools MUST be wrapped in a decorator that forces the request through the `@manager` approval flow.

## 4. Audit Trail (Non-Negotiable)
- All steps must be recorded in `.enderun/logs/governance.json`.
- Missing audit trails for any high-risk action constitute a "Critical Rule Violation" and trigger an automatic system-wide lock.
