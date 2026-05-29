# Context Boundaries & Constitution Caching Standard

> **Trace ID:** 01HGT8J5E2N0W0W0W0W0W0W0W4  
> **Status:** ACTIVE  
> **Applicability:** All Agent Enderun Framework Components and Subagents

---

## 🏛️ 1. Overview & Core Philosophy

In large-scale enterprise projects, keeping the AI's context window clean and lightweight is critical. Overloading the context with unnecessary files (like bulk package lockfiles, build artifacts, or duplicated rule documents) wastes tokens, slows down execution, and dilutes the AI's attention.

This standard establishes:
1. **The Constitution Caching Rule:** Reading `.enderun/ENDERUN.md` is strictly optimized.
2. **File & Folder Read Boundaries:** Defines allowed vs. ignored paths to protect context integrity.
3. **Search-Before-Reading Discipline:** Mandatory search heuristics.

---

## 🔒 2. The Constitution Caching Rule (Initial Read Only)

To prevent severe token-bloat and redundant file I/O operations, the supreme constitution (`.enderun/ENDERUN.md`) must be loaded efficiently:

- **The Initial Read Mandate:** The AI agent must read `{{FRAMEWORK_DIR}}/ENDERUN.md` **exactly once** at the very beginning of the session (during initial bootstrap/startup). This loads all rules into the active system/warm context.
- **The Read Prohibition:** For all subsequent turns, tasks, and file modifications in that session, the AI agent **is strictly prohibited from calling `read_file` on `ENDERUN.md` again**.
- **Memory Graph Cache:** The CLI/MCP runtime maintains a session flag (`CONSTITUTION_LOADED: true`) in `{{FRAMEWORK_DIR}}/memory-graph/` to signal that the rules are already active in the warm prompt, rendering repeated reads unnecessary.

---

## 🚫 3. Path-Based Read Boundaries

To prevent token waste, agents must strictly ignore the following directories and files during read/analysis operations. Here, `{{FRAMEWORK_DIR}}` is dynamically resolved at runtime to whichever folder the framework is initialized in (e.g., `.enderun`, `.gemini`, `.claude`, or `.agent`).

### ❌ Ignored Paths (Strictly Prohibited for AI Read)
* **`node_modules/`** — Massive dependency tree. Absolutely out of bounds.
* **`dist/`, `build/`, `out/`** — Transpiled/compiled production bundles.
* **`.git/`** — Version control internal database files.
* **`package-lock.json`** — Extremely large lockfile (can easily exceed 150KB+). Reading this is forbidden unless explicitly diagnosing a deep dependency lock drift.
* **`.DS_Store`, `.vscode/`, `.idea/`** — OS and IDE-specific metadata.
* **`{{FRAMEWORK_DIR}}/logs/`** — Historical execution logs (except the active agent's own log file during write-updates).

### 🟢 Allowed Paths (Active Context Space)
* **`{{BACKEND_DIR}}/src/`** and **`{{FRONTEND_DIR}}/src/`** — Active user code.
* **`{{DOCS_DIR}}/`** — Project architecture, guides, and requirements.
* **`package.json`** — Workspace configurations and script references.
* **`panda.config.ts`, `tsconfig.json`, `eslint.config.js`** — Design and compiler options.
* **`{{FRAMEWORK_DIR}}/STATUS.md` & `{{FRAMEWORK_DIR}}/PROJECT_MEMORY.md`** — Live status and SSOT.
* **`{{FRAMEWORK_DIR}}/agents/{active_agent}.md`** — The active agent instruction prompt.

---

## 🕵️ 4. Search-Before-Reading Protocol

To ensure minimal and clean context usage:
- **Rule:** Never open or read a file blindly.
- **Heuristic:** Use `search_codebase` or `grep_search` to identify exact matches, line numbers, or specific functions first.
- **Action:** Read *only* the specific lines or narrow ranges of target files instead of reading large, full-length files by default.
