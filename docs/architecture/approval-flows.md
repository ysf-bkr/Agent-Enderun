# Enterprise Approval Flows & Governance Protocol (v0.8.5)

This protocol defines the strict governance model for high-risk operations and cross-agent approval flows within the Agent Enderun framework. It ensures that no critical mutations or sensitive actions are executed by AI specialists without formal orchestration and explicit authorization.

---

## 🔒 1. High-Risk Action Catalog

Specialist agents (@backend, @frontend, @devops, etc.) are strictly prohibited from performing any of the following administrative operations autonomously. If requested, they must halt work, shift to `WAITING` status, and escalate to `@manager` via the **Hermes Protocol**.

| Category | High-Risk Operations | Designated Controller |
| :--- | :--- | :--- |
| **Data Management** | Bulk delete/purge, data migration, PII export, schema modifications. | `@manager` |
| **System Security** | Security credentials modification, CSP rule changes, private keys rotation. | `@security` & `@manager` |
| **Infrastructure** | Production deployment triggers, container orchestration changes, ENV vars rotation. | `@devops` & `@manager` |
| **Contract Stability**| Breaking API modifications, major type updates inside `src/types/`. | `@backend` & `@manager` |

---

## 💬 2. Hermes approval Flow (`managerApproval`)

When a specialist agent encounters a high-risk operation, it must execute the following message queue protocol.

### Step 1: Lock the Hermes Inbox
To prevent race conditions, the agent must check for `{{FRAMEWORK_DIR}}/messages/.lock`. If the lock is active, the agent retries (up to 3 times, waiting 500ms between attempts). If no lock exists, it creates `.lock` to claim the channel.

### Step 2: Write Approval Request File
The requesting agent writes a structured JSON file inside `{{FRAMEWORK_DIR}}/queue/pending/` or `{{FRAMEWORK_DIR}}/messages/` with the unique `Trace ID` (ULID) and a `managerApproval` request flag:

```json
{
  "traceId": "01JM5S8A0F2B4C6D8E0G2H4J6K",
  "from": "@backend",
  "to": "@manager",
  "category": "ALERT",
  "priority": "HIGH",
  "action": "RUN_DATABASE_MIGRATION",
  "payload": {
    "migrationFile": "20260527_add_tenant_rls_policy.sql",
    "rationale": "Enables multi-tenant Row Level Security (RLS) on PostgreSQL."
  },
  "timestamp": "2026-05-27T20:45:00Z"
}
```

### Step 3: Shift Agent State
The requesting agent updates its state inside `.enderun/STATUS.md` to `WAITING` and appends `BLOCKED_BY_APPROVAL` to its action log.

### Step 4: Human-in-the-Loop Signing
In production workspaces, the `@manager` compiles the war-room report and requests the human architect (CTO) to sign off on the transaction. The human developer signs the transaction by executing:
```bash
npx agent-enderun approve 01JM5S8A0F2B4C6D8E0G2H4J6K
```
Or by writing a signed token to the message queue.

---

## 🚦 3. Conflict Resolution & Rollback

1.  **Approval Rejection:** If the transaction is rejected, `@manager` issues a `REJECTED` signal. The specialist agent rolls back any staged changes and returns to `IDLE` state.
2.  **Stale Lock Recovery:** If a Hermes inbox `.lock` remains for more than 1.5 seconds, the active agent assumes a **stale lock** (LLM timeout), deletes the lock, and logs the incident to `@manager`.
