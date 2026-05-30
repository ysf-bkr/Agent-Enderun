# 🏛️ AGENT ENDERUN — ARMY COMMAND DASHBOARD
> v0.9.4 | State Machine Active | Memory Graph: Online

---

## 🤖 Agent Status

| Agent | State | CurrentTask | BlockedBy | HealthScore | LastAction |
| :--- | :--- | :--- | :--- | :--- | :--- |
| @manager | ACTIVE | Readiness Status | — | 10/10 | v0.9.1 Promotion |
| @quality | IDLE | — | — | 9.7/10 | Governance Audit |
| @database | IDLE | — | — | 9.5/10 | — |
| @backend | IDLE | — | — | 9.2/10 | — |
| @frontend | IDLE | — | — | 9.0/10 | — |
| @devops | IDLE | — | — | 9.0/10 | — |
| @explorer | IDLE | — | — | 9.4/10 | — |
| @git | IDLE | — | — | 9.1/10 | — |
| @mobile | IDLE | — | — | 8.8/10 | — |
| @native | IDLE | — | — | 8.9/10 | — |

---

## 📈 Intelligence Metrics

| Metric | Value |
| :--- | :--- |
| **Framework Version** | v0.9.4 |
| **System Health** | 🟢 GREEN |
| **Major Governance Audit** | COMPLETED |
| **Active Tasks** | 1 |
| **Number of Blockers** | 0 |
| **Active Agent Count** | 10 |
| **Queue Size** | 0 |

---

## 🔗 Hermes Channel Map

```
@manager  → @backend, @frontend, @explorer, @git, @database, @devops, @quality, @mobile, @native
@quality  → @manager, @backend, @frontend, @git, @devops
@devops   → @manager, @git, @quality
@backend  → @manager, @quality
@frontend → @manager
@git      → @manager
@explorer → @manager
@database → @manager
@mobile   → @manager
@native   → @manager
```

---

## 🗂️ State Transition Rules (State Machine)

`IDLE → BRIEFED → EXECUTING → DONE → IDLE`

Details: `.enderun/agents/schema/agent-lifecycle-schema.json`
