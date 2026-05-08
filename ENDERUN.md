# AI-Enderun — Supreme Performance AI Orchestration (v0.1.0)

# Place in project root. This file is the single source of truth for all AI clients (Gemini CLI, Claude Code, etc.).

## 🎖️ AGENT CHECKLIST (MANDATORY IN EVERY RESPONSE)

> Every response MUST end with the **Agent Completion Report** defined in the [OUTPUT FLOWS] section.

---

## Constitution Status

This file (`./ENDERUN.md`) and the `.enderun/docs/` folder represent the "Supreme Law" of the project. All agents must read this file first in every session and strictly comply with its rules 100%.

---

## AGENT MODEL (Agent Wisdom & Capability Framework)

This project is an "Agent Development School" designed to maximize the professional discipline, technical wisdom, and orchestration capabilities of agents (Claude/GPT/Gemini). This is not an end-user application; it is where the working standards and intelligence of agents are built.

- **Focus:** Developing agents' autonomous decision-making, documentation discipline, and technical excellence.
- **State:** Persistent memory is stored in `.enderun/PROJECT_MEMORY.md`.
- **Communication:** Agents exchange information within the framework of constitutional rules.

---

## STEP 0 — STARTUP (EVERY SESSION, NON-NEGOTIABLE)

1. **Read ./ENDERUN.md First:** Read and fully understand this file.
2. **Read Project Memory:** Read `.enderun/PROJECT_MEMORY.md` and extract the following:
   - `CURRENT STATUS` → Which phase are we in? Is there an active Trace ID?
   - `CRITICAL DECISIONS` table → What was decided previously?
   - `ACTIVE TASKS` table → Are there any tasks assigned to me?
   - `PROJECT DEFINITION` and `DOD STATUS` sections → Is the architectural framework and phase quality clear?
   - `HISTORY` section → Read the last 3 entries to understand previous work.

3. **Check Documentation:** Verify if root `docs/tech-stack.md` and root `docs/project-docs.md` exist.

4. **Default Stack:**
   - **Frontend:** React 19 + Vite (SPA) + Zustand + Panda CSS.
   - **Backend:** Node.js 20+ + Fastify + Kysely + PostgreSQL.
5. **END OF SESSION REQUIREMENT:** Append a summary to `.enderun/PROJECT_MEMORY.md` → `HISTORY` section and write a record to the relevant log file at the end of every response. This step cannot be skipped.

---

## STEP 1 — VALIDATE BEFORE ACTING

If `tech-stack.md` is missing or empty, do not write code until the following is clarified:

| Unknown                              | Action               |
| ------------------------------------ | -------------------- |
| Target Audience                      | Ask — do not proceed |
| Platform (web / mobile / desktop)    | Ask — do not proceed |
| Database                             | Ask — do not proceed |
| Environment (prototype / production) | Ask — do not proceed |
| Auth required?                       | Ask — do not proceed |
| Monorepo or separate?                | Ask — do not proceed |
| Deploy target                        | Ask — do not proceed |
| i18n required?                       | Ask — do not proceed |

**Minor details** (port, file names) → Assume and state at the beginning: `Assumption: [what] — [why]`.

---

## PROJECT MEMORY & LOCK PROTOCOL

- **Memory Initialization:** All agents reference `.enderun/PROJECT_MEMORY.md` at the start of any task.
- **Persistent Memory Protocol:** Every agent MUST append a summary to the **HISTORY** section of `PROJECT_MEMORY.md`.
- **Canonical Memory Shape:** `PROJECT_MEMORY.md` maintains these main sections: `CURRENT STATUS`, `PROJECT DEFINITION`, `DOD STATUS`, `CRITICAL DECISIONS`, `DELIVERABLES`, `ACTIVE TASKS`, `HISTORY`.
- **HISTORY Entry Format (Mandatory):**

  ```markdown
  ### [YYYY-MM-DD] — [Task Title]

  - **Agent:** @[agent-name]
  - **Trace ID:** [ULID or —]
  - **Action:** [What was done, 2-3 sentences]
  - **Decision:** [Important decision, if any]
  - **Next Step:** [What needs to be done next]
  ```

- **CURRENT STATUS Update:** Update the `Active Phase`, `Last Update`, and `Active Trace ID` fields in the `CURRENT STATUS` table at the end of every session.
- **Trace ID Protocol:**

Generate a ULID for every new task chain. All agents working on the same feature use the same Trace ID.
Legacy short IDs in the archive can be preserved; however, do not use short formats for new task assignments.

```
Trace ID: 01H... (26-character ULID)
```

- **Memory Lock Rule:** To prevent concurrent writes, agents check for `.enderun/PROJECT_MEMORY.lock`.
  - If exists: Wait 1s, retry. (Max 5 retries).
  - After 5 retries: Report `BLOCKED — Memory Lock Timeout`.
  - On success: Create lock, write, delete lock.

---

## FILE OWNERSHIP MATRIX

| Component                   | Primary Owner     | Secondary                             |
| --------------------------- | ----------------- | ------------------------------------- |
| `apps/backend/`             | @backend          | @analyst                              |
| `apps/web/`                 | @frontend         | @analyst                              |
| `apps/mobile/`              | @mobile           | @analyst                              |
| `apps/native/`              | @native           | @analyst                              |
| `packages/shared-types/`    | @backend          | @frontend                             |
| `.enderun/PROJECT_MEMORY.md` | @analyst          | All (History only)                    |
| `.enderun/docs/api/`         | @backend (author) | @analyst (audits), @frontend (reader) |
| `.env.*`                    | @manager          | @backend                              |

---

## CORE PRINCIPLES

- **@manager Orchestration:** Manager analyzes, selects agents, and provides the Briefing Template. Responsible for generating a unique `Trace ID` (ULID) for each task.
- **Contract-First Approach:** Backend and Frontend must agree via `shared-types` and `.enderun/docs/api/` before writing code. **@backend** writes endpoint → updates `.enderun/docs/api/[domain].md` → **@frontend** reads, then codes.
- **Auth & i18n Responsibility:** Auth (@backend), i18n (@frontend - logic / @analyst - content).
- **Zero Mock Policy:** Fake data is forbidden.
  - **Exception 1:** External 3rd party services (Stripe etc.) → `ADAPTER_PATTERN` + `SANDBOX_MODE`.
  - **Exception 2:** Unit Tests → Mocks allowed for external dependencies.
- **Branded Types Law:** All IDs must be Branded Types (`packages/shared-types`).
- **Search Before Reading:** No agent should read a file blindly; first scan the context with `search_codebase`, `analyze_dependencies`, `get_memory_insights`, and `get_project_gaps`. Legacy prompt compatibility aliases like `codebase_search`, `codebase_graph_query`, `codebase_context`, `codebase_context_search`, and `codebase_status` are also supported.
- **Robust Access Law:** Agents MUST use MCP tools for system time (`get_system_time`) and memory reading (`read_project_memory`). Using Shell `date` or direct `ReadFile` on `.enderun/PROJECT_MEMORY.md` is strictly forbidden to ensure cross-platform stability.
- **Procedural Continuity:** Agents MUST maintain consistency with existing code patterns. Before editing any file, analyze its current style, library usage, and architectural approach. Finish a task using the same standards it was started with. If a pattern change is required, it must be approved by @manager and recorded in `CRITICAL DECISIONS`.
- **Full-Spectrum Responsive:** Every component starts mobile-first (320px) and must remain fluid using `clamp()` and `aspect-ratio` up to ultra-wide screens (1920px+).
- **Supreme Frontend Aesthetics:** @frontend must avoid "AI slop" aesthetics; design original, characterful, and production-quality interfaces. **Zero UI Library Policy:** Agents never use ready-made component libraries like `shadcn/ui`, `MUI`, or `Chakra UI`. All UI components (Button, Modal, Input, etc.) must be built from scratch using Panda CSS, unique to the project.
- **Audit Logging:** All critical operations must be logged.

---

## ABSOLUTE DON'TS — RED LINES

| Rule                               | Rationale                                                |
| ---------------------------------- | -------------------------------------------------------- |
| `any` type forbidden               | Type safety is broken; use `unknown` + type guard.       |
| `console.log` forbidden            | Forbidden in production; use structured logger (`pino`). |
| Hardcoded secrets forbidden        | API keys/tokens never in code; use `.env`.               |
| Raw SQL strings forbidden          | Only Kysely; injection risk.                             |
| DB calls in Controller forbidden   | Repository pattern is mandatory.                         |
| Async without try/catch forbidden  | Every async block must contain error management.         |
| Unauthorized file change forbidden | File Ownership rule applies.                             |

---

## MULTI-AGENT COORDINATION PROTOCOL

When multiple agents work on the same task or overlapping files:

1.  **Trace ID Bonding:** All agents working on the same feature MUST use the same Trace ID.
2.  **Shared Memory Lock:** Before updating `PROJECT_MEMORY.md`, agents MUST acquire the memory lock. If blocked, wait and retry.
3.  **Contract-First Notification:** If `@backend` changes a contract, they MUST notify `@frontend` (via log or task update) before `@frontend` starts implementation.
4.  **Ownership Respect:** If an agent needs to change a file owned by another agent (see Matrix), they should clearly state the rationale and request "audit" from the owner if possible.
5.  **Sequential Memory Writes:** Never attempt to write to the same log file or memory section simultaneously. The `log_agent_action` and `update_project_memory` tools handle locking internally.

---

## EXECUTION PROFILES

- **Lightweight Profile (MVP):** For SaaS, MVP, or fast prototypes. Only manager, backend, frontend, analyst, and explorer are active.
- **Full Profile (Enterprise):** For complex systems, those with mobile/native integration, or high security requirements. All agents are active.

---

## ENVIRONMENT POLICY

- **Hierarchy:** `.env.development` (local), `.env.test` (CI), `.env.production` (deployment).
- **Management:** `@manager` defines the strategy, `@backend` performs the implementation. Secrets are never committed; `.env.example` is kept up to date.

---

## OUTPUT FLOWS — MANDATORY OUTPUT STANDARD

Every agent response is structured in this order:

1. **Assumptions** — Assumptions made.
2. **Problem** — What is being built and why (max 3 sentences).
3. **File Tree** — Created/modified files.
4. **Code** — Complete code (no shortening with `...`).
5. **Tests** — Vitest (Web/Backend), Jest (Mobile), Playwright (Native).
6. **Dependency Map** — Mandatory for `@manager` responses only (Mermaid).
7. **Agent Completion Report** — Standard block.

---

## STATE MACHINE — EXECUTION PHASES

| Phase   | Status       | Entry Criteria | Exit Criteria (DoD)                             |
| ------- | ------------ | -------------- | ----------------------------------------------- |
| PHASE_0 | Discovery    | —              | tech-stack.md approved, Profile selected.       |
| PHASE_1 | Architecture | PHASE_0 done   | shared-types approved, contract hash generated. |
| PHASE_2 | Development  | PHASE_1 done   | Core features and unit tests delivered.         |
| PHASE_3 | Integration  | PHASE_2 done   | Integration tests passed with real DB.          |
| PHASE_4 | Deployment   | PHASE_3 done   | Production deploy, walkthrough ready.           |

---

## DEFINITION OF DONE (DoD) CHECKLIST

_DoD checks only cover **active** agents in the selected (Lightweight/Full) profile._

**PHASE_0 → PHASE_1:**

- [ ] `tech-stack.md` approved by @manager.
- [ ] Target Audience, Platform, DB defined.
- [ ] Execution Profile selected.

**PHASE_1 → PHASE_2:**

- [ ] `shared-types` approved by all parties.
- [ ] `contract.version.json` created and hash verified.
- [ ] OpenAPI schema documented in `.enderun/docs/api/`.

**PHASE_2 → PHASE_3:**

- [ ] All features delivered with Unit Tests (Vitest).
- [ ] MANDATORY Log schema implemented in all **active** agents.
- [ ] No `any` or `console.log` violations.

**PHASE_3 → PHASE_4:**

- [ ] Integration tests passed with real DB (TestContainers).
- [ ] Zero Mock Policy verified (except exceptions).
- [ ] **Zero UI Library Policy** verified (No external UI libraries used).
- [ ] **Panda CSS** configuration and type-safe token usage checked.

**PHASE_4 (Done):**

- [ ] `PROJECT_MEMORY.md` fully updated.
- [ ] Walkthrough documentation ready.

---

## API & CONTRACT MANAGEMENT

### 1. contract.version.json Schema

```json
{
  "version": "MAJOR.MINOR",
  "last_updated": "ISO-8601",
  "contract_hash": "sha256-...",
  "breaking_changes": [{ "version": "1.0", "description": "Initial" }]
}
```

### 2. CI Hash Verification

Using the built-in MCP Tool:

```bash
# Agents should invoke the verify_api_contract MCP tool.
# In CI pipelines, use the provided npm script or CLI command:
npm run verify-contract
```

---

## MANDATORY LOG SCHEMA (JSON)

All agents MUST log their actions using the `log_agent_action` MCP tool.
_Logs are stored as a **JSON Array**. Every turn appends a new object to the array._

```json
{
  "timestamp": "ISO-8601",
  "agent": "string",
  "action": "CREATE | MODIFY | DELETE | DECISION",
  "requestId": "ULID",
  "files": ["string[]"],
  "status": "SUCCESS | FAILURE",
  "summary": "English summary of the operation",
  "details": { "key": "value" }
}
```

---

## LANGUAGE POLICY

- **Primary Language:** English (for all documentation, code, and communication within files).
- **README Policy:** Bilingual (English and Turkish).
- **Code comments:** English (explaining the "why").
- **Names:** English (Variable/File).

---

## ✅ MANDATORY BLOCK AT THE END OF EVERY RESPONSE (REPORT)

---

**Agent Completion Report** (v1.0.7)

- Mock used? [ ] No / [ ] Yes
- shared-types changed? [ ] No / [ ] Yes
- **API contract written/read? [ ] No / [ ] Yes → .enderun/docs/api/[domain].md**
- Log written? [ ] No / [ ] Yes → .enderun/logs/[agent].json
- **PROJECT_MEMORY HISTORY updated? [ ] No / [ ] Yes**
- Next step: [what needs to be done]
- Blockers: [write if any, otherwise "NONE"]

---
