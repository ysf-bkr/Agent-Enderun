# PROJECT MEMORY — AI-Enderun

This file is the Single Source of Truth (SSOT) and the persistent memory of the project.

## CURRENT STATUS

| Active Phase | Profile | Last Update | Active Trace ID | Blockers |
| :----------- | :------ | :---------- | :-------------- | :------- |
| PHASE_0      | Lightweight | 2026-05-08 | 01KR44729Z08BQQ4FCDAVNC148 | NONE |

## PROJECT DEFINITION

| Field | Value |
| :--- | :--- |
| Project Name | AI-Enderun |
| Platform | Agent skill sandbox / orchestration framework |
| Frontend | React 19 + Vite + Zustand + Panda CSS |
| Backend | Node.js 20+ + Fastify |
| DB | PostgreSQL |
| Auth | Not yet defined |
| Deploy | Not yet defined |

## DOD STATUS

| Phase | Status | Note |
| :--- | :--- | :--- |
| PHASE_0 | IN_PROGRESS | Tool contracts and memory structure being aligned |
| PHASE_1 | PENDING | After `contract.version.json` and first official contracts |
| PHASE_2 | PENDING | Feature development has not started |
| PHASE_3 | PENDING | Integration work has not started |
| PHASE_4 | PENDING | Handover phase has not been reached |

## CRITICAL DECISIONS

| Date | Decision | Rationale | Agent |
| :--- | :--- | :--- | :--- |
| 2026-05-07 | Standalone Architecture | Maximum flexibility and independence | @manager |
| 2026-05-07 | Contract-First Discipline | Scalable development with zero errors | @manager |
| 2026-05-07 | Canonical MCP Tooling | Aligning agent capabilities while maintaining tool names in a single dictionary | @analyst |
| 2026-05-08 | Panda CSS Transition | Switching from Tailwind to Panda CSS for architectural discipline and type safety | @manager |
| 2026-05-08 | Zero UI Library Policy | Banning ready-made libraries for originality and full control | @manager |
| 2026-05-08 | ULID Standard | Switching from UUID to ULID for database performance and sortability (Standard: 26-char ULID) | @manager |
| 2026-05-08 | English Translation | Moving all documentation and rules to English for international standards (Bilingual READMEs) | @manager |
| 2026-05-08 | Documentation Decoupling | Reserved root `docs/` for user project requirements and `.enderun/docs/` for framework rules | @manager |
| 2026-05-08 | Smart Init System | Automated adapter configuration (Gemini symlinks, Claude MCP guidance) in CLI | @manager |
| 2026-05-08 | Continuity Principle | Mandating agents to follow existing code patterns and memory-driven decisions | @manager |

## DELIVERABLES

| Module | Status | Agent | Date |
| :--- | :--- | :--- | :--- |
| Root and package README layout | Completed | @analyst | 2026-05-07 |
| Agent SOP core library | Completed | @manager | 2026-05-07 |

## ACTIVE TASKS

| Trace ID | Task | Agent | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| 01KR44729Z08BQQ4FCDAVNC148 | Documentation Overhaul & Agent Evangelism | @manager | P1 | COMPLETED |
| 01KR444BM94P5W3ERVJ3YJ9T01 | Agent Report Version Synchronization (v0.0.6) | @manager | P1 | COMPLETED |
| 01KR442W6MP3GXHF7TD32GJG1V | Agent SOP Hardening & Continuity Alignment | @manager | P1 | COMPLETED |

## HISTORY (Persistent Memory)

### 2026-05-08 — Documentation Overhaul & Agent Evangelism

- **Agent:** @manager
- **Trace ID:** 01KR44729Z08BQQ4FCDAVNC148
- **Action:** Extensively updated `README.md` and `CHANGELOG.md`. Detailed all 7 agent roles (@manager, @analyst, @backend, @frontend, @explorer, @mobile, @native) and explained the new decoupled documentation model (root `docs/` vs `.enderun/docs/`).
- **Decision:** Positioned root `README.md` as a professional gateway that clearly defines agent responsibilities and framework discipline.
- **Next Step:** Ready for release or user requirement input.

### 2026-05-08 — Agent Report Version Synchronization (v0.0.6)

- **Agent:** @manager
- **Trace ID:** 01KR444BM94P5W3ERVJ3YJ9T01
- **Action:** Synchronized all "Agent Completion Report" versions across all 7 agent files to `v0.0.6` to match the core framework version.
- **Decision:** Unified versioning across all documentation to prevent confusion and maintain strict version control discipline.
- **Next Step:** Proceed with the project structure as a unified v0.0.6 system.

### 2026-05-08 — Agent SOP Hardening & Full Project Recall

- **Agent:** @manager
- **Trace ID:** 01KR442W6MP3GXHF7TD32GJG1V
- **Action:** Conducted a comprehensive update of all 7 agent SOP files in `.enderun/agents/`. Infused each agent with the "Procedural Continuity" principle and "Memory-First" discipline. Removed legacy pathing and standardized all agents to v0.0.6.
- **Decision:** All agents now operate with full awareness of the project's historical decisions and structural standards, ensuring they "finish how they started."
- **Next Step:** Ready for the first user requirement analysis under the hardened framework.

### 2026-05-08 — Framework Continuity & Memory Hardening

- **Agent:** @manager
- **Trace ID:** 01KR43YRNEDBR6RPEYJT99CD6F
- **Action:** Established the "Procedural Continuity" principle in `ENDERUN.md`. Hardened the project memory by updating `CRITICAL DECISIONS` with recent architectural shifts (Doc Decoupling, Smart Init). Cleaned up legacy tasks in `ACTIVE TASKS` to align with v0.0.6 reality.
- **Decision:** Mandated that all future agents must strictly follow established patterns and reference memory before any action to ensure architectural integrity.
- **Next Step:** Maintain stability and proceed with project building blocks under the new continuity rules.

### 2026-05-08 — Smart Init & Post-Install Hooks

- **Agent:** @manager
- **Trace ID:** 01KR43VSG0GHNTM8C13RRDVSBX
- **Action:** Refactored `bin/cli.js` to include "Smart Init" features. Added post-install hooks for Gemini (automatic symlink creation to `.enderun/agents`) and Claude (automated MCP configuration command output).
- **Decision:** Enhanced user experience by automating repetitive configuration steps during framework initialization.
- **Next Step:** Maintain CLI features and monitor user feedback on the smart setup process.

### 2026-05-08 — User Document Restoration & Role Definition

- **Agent:** @manager
- **Trace ID:** 01KR43P710SSZVMCV8GP5CEJVW
- **Action:** Restored `project-docs.md` to root `docs/` as per user requirement. Formally defined root `docs/` as the primary "User Requirement Center" where agents must check every file during the build process. Maintained technical framework docs in `.enderun/docs/`. Updated `package.json` to include both directories.
- **Decision:** Clearly separated "User/Business Requirements" (root `docs/`) from "Framework/Technical Constitution" (`.enderun/docs/`).
- **Next Step:** Agents are now instructed to treat root `docs/` as the source of truth for project features and building blocks.

### 2026-05-08 — Documentation Decoupling & Cleanup

- **Agent:** @manager
- **Trace ID:** 01KR43KF3G70GW3VZTK9E1953S
- **Action:** Decoupled framework documentation from user project instructions. Moved all framework-related docs from root `docs/` to `.enderun/docs/`. Cleaned up redundant files and emptied root `docs/` to serve as the user instruction entry point. Updated `package.json` to reflect new paths.
- **Decision:** Reserved root `docs/` exclusively for user requirements and story files, ensuring a clear separation between framework logic and project-specific building blocks.
- **Next Step:** User can now place project requirement files (e.g., `tt.md`) in root `docs/` for agent consumption.

### 2026-05-08 — Structural Alignment & Trace ID Correction

- **Agent:** @manager
- **Trace ID:** 01KR43EZD3BWKX08KHQ6EV7DHC
- **Action:** Converted legacy UUID Trace IDs in ACTIVE TASKS to ULID standard. Created missing `.enderun/docs/` directory structure, including `tech-stack.md`, `project-docs.md`, and `api/` folder.
- **Decision:** Strictly enforced ULID standard and structural completeness of the framework.
- **Next Step:** Ready for PHASE_1 or further framework configuration.

### 2026-05-08 — Comprehensive Documentation & CLI Polish (v0.0.6)

- **Agent:** @manager
- **Trace ID:** 01J... (New ULID)
- **Action:** Conducted a full audit of all framework capabilities. Rewrote `README.md` to include detailed instructions for all adapters (`GEMINI`, `CLAUDE`, `CURSOR`, `CODEX`) and the `init` command. Refactored `bin/cli.js` to correctly handle adapter-specific initialization and core file scaffolding. Fixed cross-file references to `ENDERUN.md` and `GEMINI.md`.
- **Decision:** Unified the terminology and ensured all installation paths are clear for npm users.
- **Next Step:** Ready for final npm distribution.

### 2026-05-08 — NPM Readiness & Documentation Overhaul (v0.0.6)

- **Agent:** @manager
- **Trace ID:** 01J... (New ULID)
- **Action:** Conducted a comprehensive audit of all `package.json` and `README.md` files. Updated metadata (license, keywords, descriptions) for npm publication. Rewrote all READMEs in a professional, bilingual format. Fixed file references in root `package.json` to include new `ENDERUN.md` and exclude source code where appropriate.
- **Decision:** Standardized all package metadata to v0.0.6 and MIT license. Established a professional external-facing identity for the framework.
- **Next Step:** Perform a final test publish or dry-run.

### 2026-05-08 — Agnostic Framework Transition (.enderun)

- **Agent:** @manager
- **Trace ID:** 01J... (New ULID)
- **Action:** Renamed the core framework folder from `.gemini` to `.enderun` to create an LLM-agnostic environment. Updated all global references in code, adapters, and tools. Verified that CLI and MCP tools correctly reference the new path.
- **Decision:** Adopted `.enderun` as the standard folder name to eliminate perceived bias toward any single AI provider and ensure full compatibility with Cursor and Claude.
- **Next Step:** Update any remaining external documentation or CI/CD scripts.

### 2026-05-08 — Advanced Framework Tuning (v0.0.6)

- **Agent:** @manager
- **Trace ID:** 01J... (New ULID)
- **Action:** Upgraded `security_audit_scan` to use AST-based analysis (ts-morph) for precise `any` and `console.log` detection. Improved `verify_api_contract` with actionable fix suggestions. Added "Multi-Agent Coordination Protocol" to `ENDERUN.md` to regulate shared resource usage.
- **Decision:** Shifted critical security checks from Regex to AST for higher reliability and zero false positives.
- **Next Step:** Maintain framework stability and observe agent coordination.

### 2026-05-08 — Framework & Adapter Alignment (v0.0.6)

- **Agent:** @manager
- **Trace ID:** 01J... (New ULID)
- **Action:** Fixed all language inconsistencies across the framework and adapter layers. Translated remaining Turkish section names to English in `framework-mcp`, `cli.js`, `GEMINI.md`, `CURSOR.md`, `CLAUDE.md`, and `CODEX.md`. Corrected case-sensitive file references (`ENDERUN.md`, `GEMINI.md`). Updated `BRAIN_DASHBOARD.md` to English standards.
- **Decision:** Standardized all internal logic and documentation to English while maintaining bilingual READMEs.
- **Next Step:** Continue auditing framework tools for edge cases.

### 2026-05-08 — Project-Wide Standard Unification (v0.0.6)

- **Agent:** @analyst
- **Trace ID:** e81839b7-9dee-44d9-9301-ac4a9febe9b5
- **Action:** Created `ENDERUN.md`, updated `CURSOR.md`, `CLAUDE.md`, and `CODEX.md` with v0.0.6 standards and full MCP tools. Refined `log_agent_action` standard in Agent SOPs and improved gap detection logic in `framework-mcp`. Fixed contract hash mismatch.
- **Decision:** Standardized all adapter layers to ensure consistent agent behavior across different IDE clients.
- **Next Step:** Proceed with PHASE_1 architecture alignment.

### 2026-05-08 — English Transition

- **Agent:** @manager
- **Trace ID:** 01J... (New ULID)
- **Action:** Completely translated the Constitution (ENDERUN.md), Memory (PROJECT_MEMORY.md), and all Agent SOPs to English. Standardized the documentation language.
- **Decision:** All project files will be in English, while README files will remain bilingual (EN/TR) for better accessibility.
- **Next Step:** Update all README files to the bilingual structure.

### 2026-05-08 — Release Preparation and v0.0.5

- **Agent:** @manager
- **Trace ID:** 760c3982-2a03-4a4a-8f5c-d5f79502e34a
- **Action:** Cleaned logs, updated all package versions to `v0.0.5`. Established a stable release state after architectural changes (Panda CSS & Zero UI Library).
- **Decision:** Decided to clean logs and bump version before release.
- **Next Step:** Perform git push and npm publishing operations.

### 2026-05-08 — Panda CSS and Original Design Transition

- **Agent:** @manager
- **Trace ID:** 760c3982-2a03-4a4a-8f5c-d5f79502e34a
- **Action:** Migrated the project's design system from Tailwind to Panda CSS. Adopted the "Zero UI Library Policy". Updated `ENDERUN.md`, `tech-stack.md`, and `frontend.md`.
- **Decision:** Adopted the Panda CSS + Custom UI Component (No Library) approach to maximize architectural discipline and originality.
- **Next Step:** Setup Panda CSS and create the config file in `apps/web`.

### 2026-05-08 — ULID Standard Transition

- **Agent:** @manager
- **Trace ID:** 01J... (New ULID)
- **Action:** Migrated from UUID to ULID across the project. Added a lightweight ULID generator to `shared-types` and `cli.js`. Updated all constitutional documents to the new standard.
- **Decision:** Adopted the ULID standard for its database indexing performance and chronological sortability advantages.
- **Next Step:** Replace existing UUIDs with ULIDs over time or maintain a hybrid structure.

### 2026-05-08 — Memory and Capability Audit

- **Agent:** @analyst
- **Trace ID:** 760c3982-2a03-4a4a-8f5c-d5f79502e34a
- **Action:** Tested agents' memory system and historical recall capabilities. Reviewed `PROJECT_MEMORY.md` and log structures. Confirmed memory consistency and recall of previous v0.0.4 release preparations.
- **Decision:** Existing memory system (SSOT) is sufficient, but JSON logging continuity should be monitored.
- **Next Step:** Continue technical development based on user guidance.

### 2026-05-07 — Missing Source Files and v0.0.4 Release

- **Agent:** @manager
- **Trace ID:** 18969447-95fb-4a8f-b0af-18336c3f1931
- **Action:** Included `src` folders in release files to resolve `ERR_MODULE_NOT_FOUND` during `pnpm dev`. Bumped all packages to v0.0.4.
- **Decision:** Decided to include `src` folders in the package due to the need for source access in development mode.
- **Next Step:** Git push and npm publish.

### 2026-05-07 — README and Documentation Update

- **Agent:** @analyst
- **Trace ID:** —
- **Action:** Detailed and updated all README files (root, framework-mcp, shared-types, api) in line with the project's "Enderun" identity and agent capabilities.
- **Next Step:** Prepare initial API documents as part of PHASE_1 preparations.
