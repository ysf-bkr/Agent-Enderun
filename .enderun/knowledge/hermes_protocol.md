# 📡 Hermes Messaging Protocol

The Hermes protocol defines the standardized way for Agent Enderun specialized agents to communicate, delegate tasks, and share state updates.

---

## 🏗️ Message Structure

Every message sent via `send_agent_message` must follow this conceptual structure (enforced by the MCP tool):

```json
{
  "timestamp": "ISO-8601",
  "from": "@agent_name",
  "to": "@agent_name",
  "category": "ACTION | DELEGATION | INFO | ALERT",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "traceId": "ULID",
  "content": "Message content",
  "status": "PENDING | READ | ACKNOWLEDGED | COMPLETED"
}
```

---

## 📂 Message Categories

| Category | Usage | Expectation |
| :--- | :--- | :--- |
| **ACTION** | Requesting a specific action (e.g., "Run security scan"). | Must be acknowledged and logged in `STATUS.md`. |
| **DELEGATION** | Handing off a sub-task (e.g., "@backend, create the schema"). | Becomes the primary task for the recipient. |
| **INFO** | Sharing architectural decisions or updates. | No direct action required, but must be read. |
| **ALERT** | Critical blockers or security violations. | Immediate attention required by `@manager`. |

---

## 🚦 Priority Levels

- **URGENT:** Must be handled in the current turn.
- **HIGH:** Top of the queue for the next turn.
- **MEDIUM:** Standard task priority (Default).
- **LOW:** Non-critical background updates.

---

## 🔄 Lifecycle Protocol

1.  **Dispatch:** Agent calls `send_agent_message`. Message is saved in `{{FRAMEWORK_DIR}}/messages/recipient.json`.
2.  **Notification:** The recipient agent checks their inbox during their turn via `read_agent_messages`.
3.  **Acknowledgment:** For `ACTION` or `DELEGATION`, the recipient should send an `INFO` message back once started or completed.
4.  **Logging:** All critical communications must be summarized in the agent's log file (`{{FRAMEWORK_DIR}}/logs/agent.json`).

---

## 🛡️ Hermes Safety Rules

- **No circular delegation:** Agent A cannot delegate X to Agent B if B delegated Y (a dependency of X) to A.
- **Trace ID Integrity:** Every message MUST include a valid `traceId` from `PROJECT_MEMORY.md`.
- **Atomic Content:** One message per specific intent. Avoid monolithic "do everything" messages.
