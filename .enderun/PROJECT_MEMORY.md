# PROJECT MEMORY — Agent Enderun

This file is the Single Source of Truth (SSOT) and the persistent memory of the project.

## CURRENT STATUS

| Active Phase | Profile | Last Update | Active Trace ID | Blockers |
| :----------- | :------ | :---------- | :-------------- | :------- |
| PHASE_0      | Lightweight | 2026-05-16 | 01KR6EJA6GG3RPS849097KS37Q | NONE |

## PROJECT DEFINITION

- **Name:** Agent Enderun
- **Version:** v0.5.2
| Field | Value |
| :--- | :--- |
| Project Name | agent-enderun |
| Platform | Not defined |
| Frontend | React 19 + Vite + Panda CSS |
| Backend | Node.js 20+ + Fastify |
| DB | PostgreSQL |

## DOD STATUS

| Phase | Status | Note |
| :--- | :--- | :--- |
| PHASE_0 | IN_PROGRESS | Initializing project structure |
| PHASE_1 | PENDING | |
| PHASE_2 | PENDING | |
| PHASE_3 | PENDING | |
| PHASE_4 | PENDING | |

## CRITICAL DECISIONS

| Date | Decision | Rationale | Agent |
| :--- | :--- | :--- | :--- |
| 2026-05-12 | Framework Unified to v0.4.5 | Inclusion of missing adapter files and installation fix | @manager |
| 2026-05-09 | Project Initialized | Framework setup via CLI | @manager |

## DELIVERABLES

| Module | Status | Agent | Date |
| :--- | :--- | :--- | :--- |

## ACTIVE TASKS

| Trace ID | Task | Agent | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| 01KRRZRSDGFG38RRDPQCSBXE3D | Phase 1: shared-types kontratlarını ve branded types yapısını genişlet | @backend | P1 | IN_PROGRESS |
| 01KRC3WPMGXW2G3A4B0FVABKX0 | Modular Refactoring and Documentation Overhaul | @analyst | P0 | COMPLETE |
| 01KR6EJA6GG3RPS849097KS37Q | Framework setup and architecture alignment | @manager | P1 | IN_PROGRESS |

## HISTORY (Persistent Memory)

### 2026-05-16 — Framework Path Placeholder Fix (v0.5.2)

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Fixed critical bug where all agent files (`manager.md`, `analyst.md`, `backend.md`, `frontend.md`, `native.md`, `mobile.md`) contained hardcoded `.enderun/` paths. Replaced with `{{FRAMEWORK_DIR}}/` placeholder. Updated `bin/cli.js` `copyDir` and `initCommand` with fallback `.enderun/` → `frameworkDir` replace at all three content-processing points. Now `init gemini` correctly produces `.gemini/docs/api/`, `init claude` produces `.claude/docs/api/`, etc. Verified: 0 hardcoded references remain, 18/18 health checks pass, 12/12 tests pass.

### 2026-05-16 — Zero-Config & Auto-Wiring Milestone (v0.5.2)

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Bumped version to v0.5.2. Achieved full automation for framework onboarding. Implemented Auto-Wiring for Gemini (auto-patching `gemini-extension.json`), automated MCP build during `init`, and refined directory logic for user-facing documentation. This release marks the transition to a truly "plug-and-play" enterprise framework.

### 2026-05-16 — Dizin Yapısı Düzenlemesi (Düzeltildi)

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Root `docs/` was incorrectly deleted (confused with `.enderun/docs/`). Restored with `docs/README.md` explaining its purpose: agent-written project documentation during PHASE_2. Added `docs/` to `package.json` files array and `cli.js` DIRS_TO_CREATE. Distinction clarified: `/docs` = user project docs (agent-generated), `/.enderun/docs/` = framework config (tech-stack, security, privacy). Updated `STATUS.md` to mark `@mobile`/`@native` as INACTIVE (Full Profile only).

### 2026-05-16 — Proje Gözlem & Durum İncelemesi (Düzeltildi)

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Full project review conducted. PHASE_0 in progress. Confirmed design intent: (1) `apps/` is intentionally empty — this is a framework package, not an app project; (2) `{{ADAPTER}}`/`{{FRAMEWORK_DIR}}` in ENDERUN.md are template variables resolved by `init` command at install time (gemini→.gemini, claude→.claude, cursor→.cursor, codex→.enderun). Fixed `codex.md` source file inconsistency where `{{FRAMEWORK_DIR}}` was not hardcoded like other adapters.

### 2026-05-15 — The Academy Upgrade & v0.5.1 Release

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Major framework upgrade (v0.5.1). Implemented Hermes Messaging Protocol and Obsidian-style LLM Wiki with YAML metadata. Consolidated constitution into root `ENDERUN.md` and removed legacy `jest.config.js`. Enhanced MCP server with new intelligence tools for knowledge graphs and system health.

### 2026-05-15 — Hermes + Obsidian + LLM Wiki & Discovery

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Major upgrade to framework intelligence. Implemented Hermes Messaging Protocol for inter-agent orchestration and Obsidian-style structured Wiki for knowledge management. Unified versioning across all packages to v0.5.0.

### 2026-05-12 — The Installation Fix & v0.4.5 Release
+
+- **Agent:** @manager
+- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
+- **Action:** Bumped version to v0.4.5. Fixed a critical issue where adapter files (gemini.md, cursor.md, claude.md, codex.md) were excluded from the npm package. Verified the fix via local and npx-simulated tests. Cleaned up logs and temporary test files.
+
+### 2026-05-12 — The Unified Milestone & v0.4.4 Release

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Full framework synchronization to v0.4.4. Unified versioning across all core packages, specialist agents, and the supreme law. Consolidated history for a clean production debut.

### 2026-05-12 — Pure Start & v0.4.1 Release

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Reset git history for a clean production start. Bumped version to v0.4.1. This release represents the stable, production-ready "Autonomous Agent Academy" architecture.

### 2026-05-12 — The Evolution Milestone & v0.4.0 Release

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Major version bump to v0.4.0. Completed the transition from basic governance to an "Autonomous Agent Academy" architecture. Key features: AST-based compliance auditing, Autonomous Conflict Resolution Protocol, and Senior-level Resilience patterns. Unified the adapter entry points for all AI assistants. Verified zero-drift between code and constitution.

### 2026-05-12 — Capability Leap & v0.3.5 Release

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Upgraded framework to v0.3.5. Implemented AST-based compliance auditing, Autonomous Conflict Resolution, and Senior Resilience patterns. Unified inter-agent communication and mandated shared UI component protocols. Verified monorepo version synchronization.

### 2026-05-12 — Critical Fix & v0.3.4 Release

- **Agent:** @manager
- **Trace ID:** 01KRES6JRXE82FZPWVR1SSMB4W
- **Action:** Fixed a critical bug in the `init` command that caused the deletion of `packages/shared-types` and `.enderun` user data during updates. Enhanced metadata across all monorepo packages by explicitly defining README paths and synchronizing repository/homepage links to fix NPM registry display issues. Bumped version to v0.3.4 across all packages and verified build integrity.

### 2026-05-11 — Modular Architecture & Documentation Overhaul

- **Agent:** @analyst
- **Trace ID:** 01KRC3WPMGXW2G3A4B0FVABKX0
- **Action:** Refactored the monolithic MCP server (2100+ lines) into a modular structure with dedicated tool categories (codebase, framework, security, memory, contract, academy, messages, git, database, knowledge, repository). Updated root and package READMEs to provide enterprise-grade documentation. Verified build integrity and contract synchronization. Prepared codebase for npm publication.

### 2026-05-11 — Adapter-Specific Onboarding Enabled

- **Agent:** @manager
- **Trace ID:** 01KRC3WPMGXW2G3A4B0FVABKX0
- **Action:** Refined 'init' command to support specialized setups for Gemini, Claude, Cursor, and Codex. Added automatic .cursorrules sync for Cursor and MCP instructions for Claude Code. Ensured cross-host compatibility via universal symlinks.

### 2026-05-09 — Framework Initialization

- **Agent:** @manager
- **Trace ID:** 01KR6EJA6GG3RPS849097KS37Q
- **Action:** Initialized Agent Enderun framework and project structure.
